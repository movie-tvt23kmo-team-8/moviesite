import React, { useState, useEffect } from 'react';
import './search.css';

const API_KEY = '8bd78d32c965d3e69a13bfe5cc093ae0';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [year, setYear] = useState('');
  const [language, setLanguage] = useState('');
  const [genre, setGenre] = useState('');
  const [points, setPoints] = useState('');
  const [movieOrTv, setMovieOrTv] = useState('');

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };
  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };
  const handlePointsChange = (event) => {
    setPoints(event.target.value);
  };
  const handleMovieOrTvChange = (event) => {
    setMovieOrTv(event.target.value);
  };

  const selailuHaku = async () => {
    console.log("selailuhaku alkaa  year, language, genre, points, movieOrTv", year, language, genre, points, movieOrTv )
    try {
      const response = await fetch(`http://localhost:3001/tmdb/movies?year=${year}&language=${language}&genre=${genre}&points=${points}&movieOrTv=${movieOrTv}`
      );
      const data = await response.json();
      console.log(data.results);
      setResults(data.results);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?&language=fi-FI&api_key=${API_KEY}&query=${searchTerm}&include_adult=false`
      );
      const data = await response.json();
      console.log(data.results);
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
        <div id="nimihaku">
          <h3>Etsi elokuvia ja sarjoja hakusanalla</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <input
              type="text"
              placeholder="Etsi elokuvia ja sarjoja hakusanalla"
              value={searchTerm}
              onChange={handleChange}
            />
            <button type="submit">Etsi</button>
          </form>
        </div>
      </div>
      <div className="search-container">
        <div id="selailu">
          <form onSubmit={(e) => { e.preventDefault(); selailuHaku(); }}>
            <h3>Selaile elokuvia tai sarjoja kriteerien perusteella</h3>
            <p>Selaillaanko sarjoja vaiko lehvoja?</p>
            <label for="Elokuvat">Elokuvat</label>
            <input type='radio' 
            name="movieOrTv" 
            value="movie" 
            checked={movieOrTv === 'movie'}
            onChange={handleMovieOrTvChange}
            />
            <label for="Sarjat">Sarjat</label>
            <input type='radio' 
            name="movieOrTv" 
            value="tv"
            checked={movieOrTv === 'tv'}
            onChange={handleMovieOrTvChange}
            />


            <p>Miltä vuosikymmeneltä haetaan?</p>
            <select name="year" id="year" value={year} onChange={handleYearChange}>
              <option value="">Valitse vuosikymmen</option>
              <option value="1">-1960</option>
              <option value="1960">1960</option>
              <option value="1970">1970</option>
              <option value="1980">1980</option>
              <option value="1990">1990</option>
              <option value="2000">2000</option>
              <option value="2010">2010</option>
              <option value="2020">2020</option>
              <option value="9">Mikä tahansa</option>
            </select>

            <p>Kotimainen vai ulkomainen?</p>
            <label for="Kotimainen">Kotimainen</label>
            <input type='radio' name="kieli" value="fi" 
            checked={language === 'fi'}
            onChange={handleLanguageChange}
            />
            <label for="Ulkomainen">Ulkomainen</label>
            <input type='radio' name="kieli" value=""
            checked={language === ''}
            onChange={handleLanguageChange}
            />

            <p>Genre?</p>
            <select name="genre" id="genre" onChange={handleGenreChange}>
            <option value="">Valitse genre</option>
              <option value="28">Action</option>
              <option value="12">Adventure</option>
              <option value="16">Animation</option>
              <option value="35">Comedy</option>
              <option value="80">Crime</option>
              <option value="99">Documentary</option>
              <option value="18">Drama</option>
              <option value="10751">Family</option>
              <option value="14">Fantasy</option>
              <option value="36">History</option>
              <option value="27">Horror</option>
              <option value="10402">Music</option>
              <option value="9648">Mystery</option>
              <option value="10749">Romance</option>
              <option value="878">Science Fiction</option>
              <option value="10770">TV Movie</option>
              <option value="53">Thriller</option>
              <option value="10752">War</option>
              <option value="37">Western</option>
            </select>

            <p>Arvosana</p>
            <label for="poor">Huono (0-3)</label>
            <input type="radio" name="points" value="0"
            checked={points === '0'}
            onChange={handlePointsChange}
            />
            <label for="OK">OK (4-7)</label>
            <input type="radio" name="points" value="1"
            checked={points === '1'}
            onChange={handlePointsChange}
            />
            <label for="Hyvä">Hyvä (8-10)</label>
            <input type="radio" name="points" value="2"
            checked={points === '2'}
            onChange={handlePointsChange}
            />
            <label for="all">Mikä tahansa</label>
            <input type="radio" name="points" value="3"
            checked={points === '3'}
            onChange={handlePointsChange}
            />
            <button type="submit">Haje</button>
          </form>
        </div>
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
        `https://api.themoviedb.org/3/${mediaType}/${data.id}?api_key=${API_KEY}&language=fi-FI`
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