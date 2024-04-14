import React, { useState, useEffect } from 'react';
import './search.css';

const API_KEY = '';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${searchTerm}&include_adult=false`
      );
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const getPosterUrl = async (mediaId, mediaType) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${mediaId}/images?api_key=${API_KEY}`
      );
      const data = await response.json();
      return `https://image.tmdb.org/t/p/w200${data.posters[0]?.file_path}`;
    } catch (error) {
      console.error('Error fetching poster:', error);
      return null;
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <div className="search-container">
        <h1>Etsi elokuvia ja sarjoja</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <input
            type="text"
            placeholder="Etsi elokuvia ja sarjoja"
            value={searchTerm}
            onChange={handleChange}
          />
          <button type="submit">Etsi</button>
        </form>
      </div>
      <div className="results-container">
        {results.length > 0 &&
          results.slice(0, 5).map((result) => (
            <Result key={result.id} data={result} getPosterUrl={getPosterUrl} />
          ))}
        {results.length > 5 && (
          <div className="results-overflow">
            {results.slice(5).map((result) => (
              <Result key={result.id} data={result} getPosterUrl={getPosterUrl} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Result({ data, getPosterUrl }) {
  const [posterUrl, setPosterUrl] = useState(null);
  const [description, setDescription] = useState('');
  const mediaType = data.media_type;
  const title = data.title || data.name;

  useEffect(() => {
    const fetchPosterUrl = async () => {
      try {
        const url = await getPosterUrl(data.id, mediaType);
        setPosterUrl(url);
      } catch (error) {
        console.error(`Error fetching poster for ${title}:`, error);
      }
    };

    fetchPosterUrl();
  }, [data, mediaType, getPosterUrl, title]);

  const handleMouseEnter = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${data.id}?api_key=${API_KEY}`
      );
      const result = await response.json();
      setDescription(result.overview);
    } catch (error) {
      console.error('Error fetching description:', error);
    }
  };

  const handleMouseLeave = () => {
    setDescription('');
  };

  return (
    <div className="result" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="result-content">
        <img src={posterUrl} alt={title} />
        {description && (
          <div className="description-box">
            <p>{description}</p>
          </div>
        )}
      </div>
      <div className="info">
        <h3>{title}</h3>
      </div>
    </div>
  );
}