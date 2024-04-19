import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './popupwindow.css'; // Import the CSS file for styling
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

const Popupwindow = ({ mediaItem, onClose, onAddToFavourites}) => {
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

    return (
        <div className="popup-overlay"> {/* Container to cover the entire page */}
            <div className="popup-window">
                <div className="popup-content">
                    <img src={`https://image.tmdb.org/t/p/w400/${mediaItem.poster_path}`} alt={mediaItem.title} />
                    <div className='popup-detail'>
                        <h1 className='movietitle'>{mediaItem.title}</h1>
                        {mediaItem.original_name && <h1 className='seriesTitle'>{mediaItem.original_name}</h1>}
                        <p className='mediadetail'>{mediaItem.overview}</p>
                        <div className='mediadetail'>
                        <label>Release date: </label> 
                        <label>  {formatDate(mediaItem.release_date)}</label> {/* Format release date */}
                        {mediaItem.first_air_date && <label>  {formatDate(mediaItem.first_air_date)}</label>} {/* Format first air date if it exists */}
                        </div>
                        <div className="reviews-section">
                        <h2>Reviews</h2>
                        <ul>
                            {reviews.map((review, index) => (
                                <li key={index}>
                                    <strong>{review.username}: </strong>
                                    {review.review}
                                </li>
                            ))}
                        </ul>
                    </div>
                    </div>
                    <Box>
                        <BasicRating value={mediaItem.vote_average / 2} />
                    </Box>
                </div>
                <button className='popupbutton' onClick={onClose}>Close</button>
                <i className="popupIcon-heart fa-solid fa-heart-circle-plus"></i>
                <i className="popupIcon-group fa-solid fa-users-rectangle"></i>
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
