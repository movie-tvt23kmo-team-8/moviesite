import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './popupwindow.css';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import AddToFavoritesIcon from './AddFavouriteIcon';
import { Select, MenuItem } from '@mui/material';

const Popupwindow = ({ mediaItem, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [ratingValue, setRatingValue] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track user's login status
    const [userGroups, setUserGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');

    const handleGroupChange = (event) => {
        setSelectedGroup(event.target.value);
    };

    useEffect(() => {
        // Check if JWT token exists in sessionStorage
        const jwtToken = sessionStorage.getItem('token');
        setIsLoggedIn(!!jwtToken); // Update isLoggedIn state based on token existence

        const getUserGroups = async () => {
            const data = await fetchUserGroups();
            if (data) {
                setUserGroups(data.groups);
                console.log("haettiin ryhmät");
                console.log(data.groups);
            }
        };
        getUserGroups();
    }, []);

    // Function to fetch reviews
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

    const fetchUserGroups = async () => {
        try {
            const jwtToken = sessionStorage.getItem('token');
            if (!jwtToken) {
                console.error('JWT token not found');
                return;
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            };
            const response = await fetch(`http://localhost:3001/users/userGroups`, {
                method: 'GET',
                headers: headers
            });
            if (!response.ok) {
                console.error('Failed to fetch user groups');
                return null;
            }
            const data = await response.json();
            console.log(data)
            return data;

        } catch (err) {
            console.error('Error:', err.message); // Log error
        }
    }

    useEffect(() => {
        fetchReviews();
    }, [mediaItem.id]);


    // Function to handle review submission
    const submitReview = async () => {
        let type = null
        if(!mediaItem.first_air_date){
            type = "movie";
        }else {
            type= "series";
        }
        console.log( selectedGroup, mediaItem.id, type);
        try {
            const jwtToken = sessionStorage.getItem('token');
            if (!jwtToken) {
                console.error('JWT token not found');
                return;
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            };
            await axios.post('http://localhost:3001/review/addReview', {
                star: ratingValue,
                review: reviewText,
                mdbdata: mediaItem.id
            }, {
                headers: headers // Pass JWT token in headers
            });
            // Refresh reviews after submission
            fetchReviews();
            // Clear review text and rating value after submission
            setReviewText('');
            setRatingValue(0);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const add2GroupChoices = async () => {
        let type = null
        if(!mediaItem.first_air_date){
            type = "movie";
        }else {
            type= "series";
        }
        console.log( selectedGroup, mediaItem.id, type);
        try {
            await axios.post('group/addToWatchlist', {
                idgroup: selectedGroup,
                data: mediaItem.id,
                mediaType: type
            });
        } catch (error) {
            console.error('Error when trying to add2group:', error);
        }
    };

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
        <div className="popup-overlay">
            <div className="popup-window">
                <div className="popup-content">
                    <div className='popup-img-container'>
                        <img className='popup-img' src={`https://image.tmdb.org/t/p/w400/${mediaItem.poster_path}`} alt={mediaItem.title} />
                        <div>
                            <button className='popupbutton' onClick={onClose}>Close</button>
                            <AddToFavoritesIcon mdbdata={mediaItem} onAddToFavorites={handleAddToFavorites} />
                            <i className="popupIcon-group fa-solid fa-users-rectangle"></i>
                            <Select value={selectedGroup} onChange={handleGroupChange}>
                                <option value="">Valitse ryhmä</option>
                                {userGroups.map((group, index) => (
                                    <MenuItem key={index} value={group.groupname}></MenuItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className='popup-detail'>
                        <h1 className='movietitle'>{mediaItem.title}</h1>
                        {mediaItem.original_name && <h1 className='seriesTitle'>{mediaItem.original_name}</h1>}
                        <p className='mediadetail'>{mediaItem.overview}</p>
                        <div className='mediadetail'>
                            <label>Release date: </label>
                            <label>  {formatDate(mediaItem.release_date)}</label>
                            {mediaItem.first_air_date && <label>  {formatDate(mediaItem.first_air_date)}</label>}
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
                        {isLoggedIn && (
                            <div className='write-Review'>
                                <h3>Anna arvostelu</h3>
                                <textarea
                                    placeholder='Kirjoita arvostelu'
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    className='writeInput writeText'
                                />
                                <Box>
                                    <ControlledRating value={ratingValue} onChange={setRatingValue} />
                                </Box>
                                <button onClick={submitReview}>Submit Review</button>
                            </div>
                        )}
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

const ControlledRating = ({ value, onChange }) => {
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
                <Rating
                    name="simple-controlled"
                    value={value}
                    onChange={(event, newValue) => {
                        onChange(newValue);
                    }}
                />
            </Box>
        </div>
    );
};

export default Popupwindow;
