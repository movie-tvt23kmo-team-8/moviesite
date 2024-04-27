import { useEffect, useState } from 'react';
import './sharedfavourites.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Sharedfavourites() {
    const [favourites, setFavourites] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const sharekey = urlParams.get('sharekey');
                //console.log("kokeillaan hakea suosikkeja sharekey: ", sharekey);
                const response = await axios.get(`http://localhost:3001/sharedfavourites?sharekey=${sharekey}`);
                const favoritesData = response.data.favourites;
                setUsername(response.data.username)
                /*console.log('respone username: ', response.data.username)
                console.log('type of respone username: ', typeof response.data.username)
                console.log('respone username length:', response.data.username.length);
                console.log("username: ", username);
                console.log('favouritesData: ', favoritesData)
                console.log('type of favouritedata: ', typeof favoritesData)
                console.log('favoritesData length:', favoritesData.length);*/
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
    }, []);




    return (
        <div className='shared-favourite-container'>
            {favourites.length > 0 ? (
                <div className='favourites-container'>
                    <p>Käyttäjän {username} suosikit:</p>
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
            ) : (<p>Käyttäjällä {username} ei ole suosikkeja</p>)}
        </div>
    );
}