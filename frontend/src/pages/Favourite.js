import React from 'react'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './favourite.css'

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

function Popup(props) {
  return (props.trigger) ? (
    <div className='popup'>
      <div className='popup-inner'>
        <button className='close-btn' onClick={() => props.setTrigger(false)}>close</button>
        {props.children}
      </div>
    </div>
  ) : "";
}

export default function Favourite() {
  const [favourites, setFavourites] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [idAccount, setIdAccount] = useState('')
  const [mdbData, setMdbData] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${searchTerm}&include_adult=false`
      );
      const data = await response.json();
      console.log('Search results:', data.results);
      setResults(data.results || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const jwtToken = sessionStorage.getItem('token'); 
        if (!jwtToken) {
          console.error('JWT token or account ID not found');
          return;
        }

        const response = await fetch(`http://localhost:3001/favourite/getFavourites?accountId=${idAccount}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      })
        if (!response.ok) {
          throw new Error('Failed to fetch favourites from the database');
        }
        const data = await response.json();
        setFavourites(data);
        
        const favouritesWithPosters = await Promise.all(data.map(async (favourite) => {
          try {
            const tmdbResponse = await axios.get(`http://localhost:3001/tmdb/poster?id=${favourite.mdbdata}`);

            if (tmdbResponse.data && tmdbResponse.data.poster_path) {
              return {
                ...favourite,
                posterUrl: tmdbResponse.data.poster_path,
                title: tmdbResponse.data.title,
                details: tmdbResponse.data.overview,
                link: 'https://www.themoviedb.org/movie/' + tmdbResponse.data.id
              };
            } else {
              return {
                ...favourite,
                title: tmdbResponse.data.title,
                details: tmdbResponse.data.overview
              };
            }
          } catch (error) {
            console.error('Failed to fetch poster from TMDB', error);
            return { ...favourite };
          }
        }));

        setFavourites(favouritesWithPosters);
      } catch (error) {
        console.error('Failed to fetch reviews from database', error);
      }

    };
    
    fetchFavourites();
  }, [idAccount]);

  const handleAddFavourite = async (mdbData) => {
    try {
      const jwtToken = sessionStorage.getItem('token'); 
      if (!jwtToken) {
        console.error('JWT token not found');
        return;
      }
  
      const responseAdd = await fetch('http://localhost:3001/favourite/addFavourite', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ idaccount: idAccount, mdbdata: mdbData })
      });
  
      if (!responseAdd.ok) {
        throw new Error('Failed to add favourite');
      }
  
      setButtonPopup(false);
    } catch (error) {
      console.error('Error adding favourite:', error);
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  

  
  
  return (
    <div className='favourite-container'>
      <h1>Favourites</h1>
      <div className='favourites-container'>
        <section className='allFavourites'>
          <div className='favourite-card'>
            {favourites.map((favourite, mediaItem, index) => (
              <Link
                key={mediaItem.id}
                className={`favourite-card-item favourite-${index}`}
                to={`/details/${favourite.id}`}>
                <a href={favourite.link}target="_blank">{favourite.posterUrl && <img className="favourite-picture" src={`https://image.tmdb.org/t/p/original${favourite.posterUrl}`} alt="Movie Poster" />}</a>
                <h3 className='favourite-title'>{favourite.title}</h3>
              </Link>
            ))}
          </div>
        </section>
        <section className='addFavourite'>
          <button className='addFavouriteButton' onClick={() => setButtonPopup(true)}>Add favourites</button>
          <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
            <h3>Add your favourites</h3>
            <br />
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <input
                type="text"
                placeholder="Search for movies and TV shows"
                value={searchTerm}
                onChange={handleChange}
              />
              <div className="-container">
                {results && results.length > 0 && (
                  results.slice(0, 5).map((result, index) => (
                    <div className="result" key={`${result.id}-${index}`}>
                      {result.poster_path ? (
                        <img src={`https://image.tmdb.org/t/p/w92${result.poster_path}`} alt={result.title || result.name} />
                      ) : (
                        <p>No poster available</p>
                      )}
                      <p>{result.title || result.name}</p>
                      <button className='addfavourite-button' onClick={() => handleAddFavourite(result.id, result.media_type)}>Add to favorites</button>
                    </div>
                  ))
                )}
              </div>
            </form>
          </Popup>
        </section>
      </div>
    </div>
  );
}