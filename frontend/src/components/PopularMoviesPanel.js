import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './popularmoviepanel.css';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

const PopularMoviesPanel = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                const response = await axios.get('http://localhost:3001/tmdb/popular-movie');
                setPopularMovies(response.data);
            } catch (error) {
                console.error('Error fetching popular movies:', error);
            }
        };

        fetchPopularMovies();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isHovered) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % popularMovies.length);
            }
        }, 3000); // Adjust the interval as needed (in milliseconds)

        return () => clearInterval(interval);
    }, [popularMovies, isHovered]);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const itemsPerPage = Math.floor(window.innerWidth / 200); // Adjust 200 as needed for your movie container width

    const getMovieIndex = (index) => {
        const length = popularMovies.length;
        if (length === 0) return null;
        return index % length;
    };

    return (
        <div className='containermovie' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="poster-gallery">
                {[...Array(itemsPerPage).keys()].map((offset) => {
                    const movieIndex = getMovieIndex(currentIndex + offset);
                    if (movieIndex !== null) {
                        const movie = popularMovies[movieIndex];

                        return (
                            <div key={movie.id} className="movie-container">
                                <div className="movie-poster-container">
                                    <img className="movie-poster" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                                    <Box>
                                        <BasicRating value={movie.vote_average / 2} />
                                    </Box>
                                    <div className="movie-description">
                                        <h3 className="movie-name">{movie.title}</h3>
                                        <p className='movie-overview'>{movie.overview}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

// BasicRating component for displaying star rating
const BasicRating = ({ value }) => {
    return (
        <Box
            sx={{
                '& > legend': { mt: 2 },
            }}
        >
            <Rating name="read-only" value={value} readOnly /> {/* Assuming vote_average is out of 10, and Rating component requires a value out of 5 */}
        </Box>
    );
};

export default PopularMoviesPanel;
