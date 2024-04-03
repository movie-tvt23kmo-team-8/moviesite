import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import './popularseriespanel.css';

const PopularSeriesPanel = () => {
    const [popularSeries, setPopularSeries] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchPopularSeries = async () => {
            try {
                const response = await axios.get('http://localhost:3001/tmdb/popular-series');
                setPopularSeries(response.data);
            } catch (error) {
                console.error('Error fetching popular series:', error);
            }
        };

        fetchPopularSeries();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isHovered) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % popularSeries.length);
            }
        }, 3000); // Adjust the interval as needed (in milliseconds)

        return () => clearInterval(interval);
    }, [popularSeries, isHovered]);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const itemsPerPage = Math.floor(window.innerWidth / 200); // Adjust 200 as needed for your series container width

    const getSeriesIndex = (index) => {
        const length = popularSeries.length;
        if (length === 0) return null;
        return index % length;
    };

    return (
        <div className='containerseries' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="poster-gallery">
                {[...Array(itemsPerPage).keys()].map((offset) => {
                    const seriesIndex = getSeriesIndex(currentIndex + offset);
                    if (seriesIndex !== null) {
                        const series = popularSeries[seriesIndex];

                        return (
                            <div key={series.id} className="series-container">
                                <div className="series-poster-container">
                                    <img className="series-poster" src={`https://image.tmdb.org/t/p/w500/${series.poster_path}`} alt={series.title} />
                                    <Box>
                                        <BasicRating value={series.vote_average / 2} />
                                    </Box>
                                    <div className="series-description">
                                        <h3 className="series-name">{series.original_name}</h3>
                                        <p className='series-overview'>{series.overview}</p>
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

export default PopularSeriesPanel;
