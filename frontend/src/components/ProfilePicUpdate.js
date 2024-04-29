import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './popupwindow.css';
import './profilepicupdate.css';

const ProfilePicUpdate = ({ closePhotoPopup, setImageId, username }) => {
    const [idaccount, setIdAccount] = useState(null);

    useEffect(() => {
        const getUserID = async () => {
            try {
                const jwtToken = sessionStorage.getItem('token');
                if (!jwtToken) {
                    console.error('JWT token not found');
                    return;
                }
                //console.log('JWT token found:', jwtToken);

                const response = await axios.get('http://localhost:3001/users/getUserID', {
                    params: {
                        username: username // Use the username prop here
                    },
                    headers: {
                        Authorization: `Bearer ${jwtToken}` // Include JWT token in request headers
                    }
                });
                //console.log('Get UserID response:', response);

                if (response.status === 200) {
                    setIdAccount(response.data.idaccount);
                } else {
                    console.error('Error fetching user ID:', response);
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
                // Handle error in a user-friendly way, e.g., show a notification
            }
        };

        getUserID();
    }, [username]); // Add username as a dependency

    // Inside handleImageClick function
    const handleImageClick = async (imageId) => {
        //console.log('Handle image click initiated');
        try {
            const jwtToken = sessionStorage.getItem('token');
            if (!jwtToken) {
                console.error('JWT token not found');
                return;
            }
            //console.log('JWT token found:', jwtToken);

            // Check if idaccount is available
            if (!idaccount) {
                console.error('idaccount not found');
                return;
            }

            const response = await axios.put('http://localhost:3001/users/updatePic', { imageId, idaccount }, {
                headers: {
                    Authorization: `Bearer ${jwtToken}` // Include JWT token in request headers
                }
            });
            //console.log('Update pic request sent:', response);

            if (response.status === 200) {
                //console.log('Update successful:', response);
                if (setImageId && typeof setImageId === 'function') {
                    setImageId(imageId);
                } else {
                    console.error('setImageId is not a function or not provided as a prop.');
                }
                closePhotoPopup();
            } else {
                console.error('Error updating profile picture:', response);
            }
        } catch (error) {
            console.error('Error updating profile picture:', error);
            // Handle error in a user-friendly way, e.g., show a notification
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-window">
                <div className="profile-content">
                    <div className='profile-img-container'>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(imageId => (
                            <img
                                key={imageId}
                                className='profile-img'
                                src={require(`../img/avatar/${imageId}.png`)}
                                alt={`Avatar ${imageId}`}
                                onClick={() => handleImageClick(imageId)}
                            />
                        ))}
                    </div>
                    <button className='popupbutton' onClick={closePhotoPopup}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePicUpdate;
