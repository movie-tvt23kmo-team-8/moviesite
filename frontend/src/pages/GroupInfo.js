import React, { useEffect, useState } from 'react';
import './groupinfo.css';
import { useParams } from 'react-router-dom';
import { jwtToken } from '../components/Signals';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function GroupInfo() {
    const { idgroup } = useParams();
    const [ group, setGroup ] = useState(null);
    const [data, setData] = useState([]);

    const fetchGroupInfo = async () => {
        if (!idgroup) {
            console.error('idgroup is missing.');
            return;
        }
        
        try {
            const response = await axios.get(`http://localhost:3001/group/allGroups`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
            console.log('group name: ',response.data.groupname)
            setGroup(response.data.groupname);
        } catch (error) {
            console.error('Error fetching group info:', error);
        }
    };

    const fetchGroupMovies = async () => {
        try{
            const response = await axios.get(`http://localhost:3001/group/getFromWatchlist?idgroup=${idgroup}`)
                
            
            console.log('Movies response:', response);
            const groupMovies = response.data;
            if (groupMovies && groupMovies.length > 0) {
            const favouritesWithPosters = await Promise.all(groupMovies.map(async (choices) => {
                try {
                  const tmdbResponse = await axios.get(`http://localhost:3001/tmdb/poster?id=${choices.data}&type=${choices.type}`);
                  const tmdbData = tmdbResponse.data;
                  if (tmdbData && tmdbData.poster_path) {
                    let linkType = null;
                    let title = null;
                    if (choices.type === "movie") {
                      linkType = "movie";  
                      title = tmdbData.title;
                    } else {
                      linkType = "tv";
                      title = tmdbData.name;
                    }
                    return {
                      ...choices,
                      posterUrl: tmdbData.poster_path,
                      title: title,
                      details: tmdbData.overview,
                      link: `https://www.themoviedb.org/${linkType}/${tmdbData.id}`
                    };
                  } else {
                    console.log("lisätään ilman imdb tietoja")
                    return choices
                  }
    
                } catch (error) {
                  console.error('Failed to fetch poster from TMDB', error);
                  return choices;
                }
              }));
            setData(favouritesWithPosters);
            } else {
                console.log('No favorites data found');
              }
        } catch (error) {
            console.error('Error fetching group info:', error);
        }
    }

    useEffect(() => {
        fetchGroupInfo();
        fetchGroupMovies();
    }, [idgroup]);

    return (
        <div className='groupinfo-container'>
                <div className='group-movies'>
                    <h1 className='group-name'>{group}</h1>
                    <br></br>
                    <h3>Movies in the Group:</h3>
                    <div className='group-favourite'>
                    {Array.isArray(data) && data.length > 0 ? (
                        data.map((choices, index) => (
                            <Link
                                key={index}
                                className={`group-card-item group-${index}`}
                                to={choices.link}
                                target="_blank">
                                {choices.posterUrl && <img className="movie-picture" src={`https://image.tmdb.org/t/p/original${choices.posterUrl}`} alt="Movie Poster" />}
                                <h3 className='movie-title'>{choices.title}</h3>
                            </Link>
                        ))
                    ) : (
                        <p>No movies found in the group.</p>
                    )}
                </div>
                </div>
        </div>
    );
}
