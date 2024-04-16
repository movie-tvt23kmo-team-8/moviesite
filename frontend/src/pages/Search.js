import React, { useState } from 'react';
import axios from 'axios';
import './search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`search/?query=${query}`);
      console.log('Response:', response.data);
      setResults(response.data);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('Error fetching search results');
      setResults([]);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={handleChange} />
        <button type="submit">Etsi</button>
      </form>
      {error && <p>{error}</p>}
      <div className="results">
        {results.movies && results.movies.map((item) => (
          <div key={item.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
              alt={item.title}
              title={item.overview}
            />
          </div>
        ))}
        {results.series && results.series.map((item) => (
          <div key={item.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
              alt={item.name}
              title={item.overview}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;