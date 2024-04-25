import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import { jwtToken } from '../components/Signals';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import SeeInvites from './SeeInvites';
import ProfilePicUpdate from '../components/ProfilePicUpdate';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [imageid, setImageId] = useState('');
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [openPasswordPopup, setOpenPasswordPopup] = useState(false);
  const [openPhotoPopup, setOpenPhotoPopup] = useState(false);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [anchorEl, setAnchorEl] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  useEffect(() => {
    // Fetch user data after 5 seconds
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/users/personal', {
                headers: {
                    Authorization: `Bearer ${jwtToken.value}`
                }
            });
            setUsername(response.data.username);
            setImageId(response.data.imageid);
            setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
            console.error('Error fetching username and imageid:', error);
            setLoading(false); // Set loading to false even if there's an error
        }
    };

    fetchData(); // Call the fetchData function

    // Clean-up function
    return () => {
        // You can add clean-up code here if needed
    };
}, []); // Empty dependency array to run only once on component mount

  

  useEffect(() => {
    console.log('Image ID:', imageid);
    console.log('Image Source:', `../img/avatar/${imageid}.png`);
  }, [imageid]);

  // Render loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDeleteUser = async () => {
    if (deleteConfirmed) {
      try {
        const jwtToken = sessionStorage.getItem('token');
        if (!jwtToken) {
          console.error('JWT token not found');
          return;
        }
        const headers = {headers: {'Content-Type': 'application/json','Authorization': `Bearer ${jwtToken}`}};
        const deleteResponse = await axios.delete(`/users/delete`, headers);
          if (deleteResponse.status === 200) {
            console.log('User deleted successfully');
            sessionStorage.removeItem('token');
            window.location.reload();
          } else {
            console.error('Failed to send delete request');
          }
      } catch (error) {
        console.error('Error sending delete request:', error);
      }
    } else {
      setDeleteConfirmed(true);
    }
  };

  const id = openPasswordPopup ? 'password-popup' : undefined;

  const togglePasswordPopup = (event) => {
    setAnchorEl(event.currentTarget); // Set anchorEl to the clicked button
    setOpenPasswordPopup(!openPasswordPopup); // Toggle the password popup
  };

  const togglePhotoPopup = () => {
    setOpenPhotoPopup(!openPhotoPopup); // Toggle the photo popup
  };

  const handleClosePopup = () => {
    setOpenPhotoPopup(false); // Close the photo popup
  };

  const imageSrc = `../img/avatar/${imageid}.png`;
  console.log('Image Source:', imageSrc);

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
        setPasswordChangeError('Please fill in all fields');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        setPasswordChangeError("New passwords don't match");
        return;
    }

    axios.post('/password/change-password', {
        username: username,
        oldPassword: oldPassword,
        newPassword: newPassword,
    })
    .then(response => {
        alert('Password changed successfully');
        // Optionally, you can reset the form fields here
    })
    .catch(error => {
        console.error('Error changing password:', error);
        setPasswordChangeError('Password change failed');
    });
};


  return (
    <div className='profile-container'>
      <div className='profile-info'>
        <div className='profile-pic'>
        {imageid && (
          <img
            className='profile-photo'
            src={require(`../img/avatar/${imageid}.png`)}
            alt="topimg"
          />
        )}

          <div className='profile-add' onClick={togglePhotoPopup}> {/* Move the onClick handler here */}
            <label htmlFor='profile-input'>
              <i className="photo-add fa-solid fa-plus"></i>
            </label>
          </div>
        </div>

        <div className='profile-text'>
          <p>Käyttäjätunnus: {username}</p>
          <p>Kuvaus?</p>
          <Button aria-describedby={id} type="button" onClick={togglePasswordPopup} className='change-password'>
            Vaihda salasana
          </Button>

          <BasePopup id={id} open={openPasswordPopup} anchor={anchorEl} onClose={handleClosePopup}>
                    <div className='vaihdasalasana'>
                        <PopupBody>
                            <form className='change-password-form'>
                                <label>Vanha salasana</label>
                                <input type='password' value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                                <label>Uusi salasana</label>
                                <input type='password' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                <label>Uusi salasana uudestaan</label>
                                <input type='password' value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                                <button onClick={handleChangePassword}>Vaihda salasana</button>
                                {passwordChangeError && <p>{passwordChangeError}</p>}
                            </form>
                        </PopupBody>
                    </div>
                </BasePopup>
          
        </div>
      </div>
      <div className='profile-favorite'>
        favorite
      </div>
      <div className='profile-group'>
        group
      </div>
      <div className='profile-invites'>
        <SeeInvites /> { }
      </div>
      <div className='delete-user'>
        <button onClick={handleDeleteUser}>
          {deleteConfirmed ? "Confirm Delete" : "Delete User"}
        </button>
      </div>
      {openPhotoPopup && <ProfilePicUpdate closePhotoPopup={handleClosePopup} setImageId={setImageId} username={username} />}

    </div>
  );
}

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const blue = {
  200: '#99CCFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0066CC',
};

const PopupBody = styled('div')(
  ({ theme }) => `
  width: max-content;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  box-shadow: ${theme.palette.mode === 'dark'
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
    };
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  z-index: 1;
  position: absolute;
  bottom: calc(0); // Position the popup below the button
  left: 50%;
  transform: translateX(-50%);
`,
);

const Button = styled('button')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: ${blue[500]};
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: 1px solid ${blue[500]};
  box-shadow: 0 2px 1px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(45, 45, 60, 0.2)'
    }, inset 0 1.5px 1px ${blue[400]}, inset 0 -2px 1px ${blue[600]};

  &:hover {
    background-color: ${blue[600]};
  }

  &:active {
    background-color: ${blue[700]};
    box-shadow: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
    outline: none;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
    &:hover {
      background-color: ${blue[500]};
    }
  }
`,
);
