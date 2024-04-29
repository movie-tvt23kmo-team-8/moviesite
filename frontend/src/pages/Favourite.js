import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import './favourite.css'

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
  const [sharekey, setSharekey] = useState("");

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const jwtToken = sessionStorage.getItem('token');
        if (!jwtToken) {
          console.error('JWT token not found');
          return;
        }

        const response = await axios.get(`http://localhost:3001/favourite/getFavourites`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        const favoritesData = response.data.favourites;
        const sharekey1 = response.data.sharekey;
        setSharekey(sharekey1);
        if (favoritesData && favoritesData.length > 0) {
          const favouritesWithPosters = await Promise.all(favoritesData.map(async (favourites) => {
            try {
              const tmdbResponse = await axios.get(`http://localhost:3001/tmdb/poster?id=${favourites.mdbdata}&type=${favourites.type}`);
              const tmdbData = tmdbResponse.data;
              if (tmdbData && tmdbData.poster_path) {
                let linkType = null;
                let title = null;
                if (favourites.type === "movie") {
                  linkType = "movie";
                  //console.log(favourites.type, linkType);
                  title = tmdbData.title;
                } else {
                  linkType = "tv";
                  title = tmdbData.name;
                  //console.log(favourites.type, linkType);
                }
                return {
                  ...favourites,
                  posterUrl: tmdbData.poster_path,
                  title: title,
                  details: tmdbData.overview,
                  link: `https://www.themoviedb.org/${linkType}/${tmdbData.id}`
                };
              } else {
                //console.log("lisätään ilman imdb tietoja")
                return favourites
              }

            } catch (error) {
              console.error('Failed to fetch poster from TMDB', error);
              return favourites;
            }
          }));
          setFavourites(favouritesWithPosters);
        } else {
          //console.log('No favorites data found');
        }
      } catch (error) {
        console.error('Failed to fetch favorites data from the backend', error);
      }
    };
    fetchFavourites();


  }, [idAccount]);

  const handleAddFavourite = async (mdbData, mediaType) => {
    try {
      const jwtToken = sessionStorage.getItem('token');
      if (!jwtToken) {
        console.error('JWT token not found');
        return;
      }

      const response = await axios.post('/favourite/addFavourite', {
        idaccount: idAccount,
        mdbdata: mdbData,
        type: mediaType,
      }, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        }
      });
      setButtonPopup(false);
    } catch (error) {
      console.error('Error adding favourite:', error);
    }
  };

  return (

    <div className='favourite-container'>
      <h1>Suosikit</h1>
      <div className='favourite-sharing'>
        <p>Voit jakaa suosikkisi linkillä:</p>
        <a className='favourite-link' href={`http://localhost:3000/sharedfavourites?sharekey=${sharekey}`} target="_blank">{`http://localhost:3000/sharedfavourites?sharekey=${sharekey}`}</a>
      </div>
      <div className='favourites-container'>
        <section className='allFavourites'>
          <div className='favourite-card'>
            {Array.isArray(favourites) && favourites.map((favourite, mediaItem, index) => (
              <Link
                key={mediaItem.id}
                className={`favourite-card-item favourite-${index}`}
                to={`${favourite.link}`}>
                <a href={favourite.link} target="_blank">{favourite.posterUrl && <img className="favourite-picture" src={`https://image.tmdb.org/t/p/original${favourite.posterUrl}`} alt="Movie Poster" />}</a>
                <h3 className='favourite-title'>{favourite.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}