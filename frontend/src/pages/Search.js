import React, { useState } from 'react';
import axios from 'axios';
import './search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [year, setYear] = useState('');
  const [language, setLanguage] = useState('');
  const [genre, setGenre] = useState('');
  const [points, setPoints] = useState('');
 
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
 

  const selailuHaku = async () => {
    console.log("selailuhaku alkaa  year, language, genre, points", year, language, genre, points )
    try {
      const response = await axios.get(`http://localhost:3001/tmdb/movies?year=${year}&language=${language}&genre=${genre}&points=${points}`
      );
      console.log('Response:', response);
      setResults(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

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

      <form onSubmit={selailuHaku}>
      <h3>Selaile elokuvia tai sarjoja kriteerien perusteella</h3>
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
            <button type="button" onClick={selailuHaku}>Haje</button>
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