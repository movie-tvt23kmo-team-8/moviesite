import React from 'react';
import './popupwindow.css'; // Import the CSS file for styling
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

const Popupwindow = ({ mediaItem, onClose, finnkinoData }) => {
    return (
        <div className="popup-overlay"> {/* Container to cover the entire page */}
            <div className="popup-window">
                <div className="popup-content">
                    <img src={`https://image.tmdb.org/t/p/w400/${mediaItem.poster_path}`} alt={mediaItem.title} />
                    <div className='popup-detail'>
                        <h1 className='movietitle'>{mediaItem.title}</h1>
                        {mediaItem.original_name && <h1 className='seriesTitle'>{mediaItem.original_name}</h1>}
                        <p className='mediadetail'>{mediaItem.overview}</p>
                        <p className='mediadetail'>Release date: {mediaItem.release_date}</p>
                    </div>
                    <Box>
                        <BasicRating value={mediaItem.vote_average / 2} />
                    </Box>
                    {finnkinoData && finnkinoData.getElementsByTagName('EventMediumImagePortrait')[0]?.textContent && (
                        <img src={finnkinoData.getElementsByTagName('EventMediumImagePortrait')[0].textContent} alt={mediaItem.title} />
                    )}
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
