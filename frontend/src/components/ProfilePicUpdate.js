import React from 'react';
import './popupwindow.css';
import './profilepicupdate.css';


const ProfilePicUpdate = ({ closePhotoPopup }) => {
    
    return (
        <div className="popup-overlay">
            <div className="popup-window">
                <div className="profile-content">
                    <div className='profile-img-container'>
                        <img className='profile-img' src={require('../img/avatar/1.png')}  />
                        <img className='profile-img' src={require('../img/avatar/2.png')} />
                        <img className='profile-img' src={require('../img/avatar/3.png')}  />
                        <img className='profile-img' src={require('../img/avatar/4.png')}  />
                        <img className='profile-img' src={require('../img/avatar/1.png')} />
                    </div>
                    <button className='popupbutton' onClick={closePhotoPopup}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePicUpdate;
