import React, { useState } from 'react';
import './addfavouriteicon.css';

const AddToFavoritesIcon = ({ mdbdata, onAddToFavorites }) => {
    const [addedToFavorites, setAddedToFavorites] = useState(false);

    const handleAddToFavorites = async () => {
        if (addedToFavorites) {
            return; // Exit early if already added to favorites
        }
        let type = null
        if (!mdbdata.first_air_date) {
            type = "movie";
        } else {
            type = "series";
        }
        //console.log( mdbdata.id, type);
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
            const response = await fetch('http://localhost:3001/favourite/addFavourite', {
                method: 'POST',
                headers,
                body: JSON.stringify({ mdbdata: mdbdata.id, type: type })
            });
            if (response.ok) {
                //console.log('Added to favorites');
                setAddedToFavorites(true); // Update state to indicate added to favorites
                onAddToFavorites(); // Trigger a callback to update UI or state
            } else {
                console.error('Error adding to favorites');
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    return (
        <i className="addfavouriteicon fa-solid fa-heart-circle-plus" onClick={handleAddToFavorites}></i>
    );
};

export default AddToFavoritesIcon;
