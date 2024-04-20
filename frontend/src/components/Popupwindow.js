import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './popupwindow.css'; 
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import AddToFavoritesIcon from './AddFavouriteIcon';

const Popupwindow = ({ mediaItem, onClose }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:3001/review/getReview?mdbdata=${mediaItem.id}`);
                if (response.ok) {
                    const reviewsData = await response.json();
                    setReviews(reviewsData);
                } else {
                    console.error('Failed to fetch reviews');
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, [mediaItem.id]);

    // Function to format the date
    const formatDate = (dateString) => {
        if (dateString) {
            const [year, month, day] = dateString.split('-');
            return `${day}.${month}.${year}`;
        }
        return ''; // Return empty string if dateString is undefined
    };

    const handleAddToFavorites = () => {
        console.log('Added to favorites');
    };

    return (
        <div className="popup-overlay"> {/* Container to cover the entire page */}
            <div className="popup-window">
                <div className="popup-content">
                    <div className='popup-img-container'>
                        <img className='popup-img' src={`https://image.tmdb.org/t/p/w400/${mediaItem.poster_path}`} alt={mediaItem.title} />
                        <div>
                            <button className='popupbutton' onClick={onClose}>Close</button>
                            <AddToFavoritesIcon mdbdata={mediaItem} onAddToFavorites={handleAddToFavorites} />
                            <i className="popupIcon-group fa-solid fa-users-rectangle"></i>
                        </div>
                    </div>
                    <div className='popup-detail'>
                        <h1 className='movietitle'>{mediaItem.title}</h1>
                        {mediaItem.original_name && <h1 className='seriesTitle'>{mediaItem.original_name}</h1>}
                        <p className='mediadetail'>{mediaItem.overview}</p>
                        <div className='mediadetail'>
                            <label>Release date: </label>
                            <label>  {formatDate(mediaItem.release_date)}</label> {/* Format release date */}
                            {mediaItem.first_air_date && <label>  {formatDate(mediaItem.first_air_date)}</label>} {/* Format first air date if it exists */}
                        </div>
                        <div className="popup-reviews-section">
                            <h2 className='popup-reviewtitle'>Arvostelut</h2>
                            <ul className='popup-review'>
                                {reviews.map((review, index) => (
                                    <li className='popup-reviewinfo' key={index}>
                                        {review.review}
                                        <Box className='popup-reviewstar'>
                                            <BasicRating value={review.star}></BasicRating>
                                            <strong className='popup-reviewer'>{review.username} </strong>
                                        </Box>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <Box>
                        <BasicRating value={mediaItem.vote_average / 2} />
                    </Box>
                </div>
            </div>
        </div>
    );
};

const BasicRating = ({ value }) => {
    return (
        <div className='rating'>
            <Box
                sx={{
                    '& > legend': { mt: 2 },
                    '& .MuiRating-icon': {
                        fontSize: '1vw',
                    },
                }}
            >
                <Rating className="read-only" value={value} readOnly />
            </Box>
        </div>
    );
};

export default Popupwindow;
