import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import { jwtToken } from '../components/Signals';
import Avatar from '@mui/material/Avatar';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import Password from '../components/Password';
import SeeInvites from './SeeInvites'; // Import the SeeInvites component

export default function Profile() {
  const [username, setUsername] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState(require('../img/logo.png'));
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/users/personal', {
      headers: {
        Authorization: `Bearer ${jwtToken.value}`
      }
    })
      .then(response => {
        setUsername(response.data.username);
      })
      .catch(error => {
        console.error('Error fetching username:', error);
      });
  }, []);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setAvatarSrc(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };


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

  const id = open ? 'password-popup' : undefined;

  return (
    <div className='profile-container'>
      <div className='profile-info'>
        <div className='profile-pic'>
          <Avatar className='profile-photo' alt="profilephoto" src={avatarSrc} sx={{ width: 200, height: 200 }} />
          <div className='profile-add'>
            <label htmlFor='profile-input'>
              <i className="photo-add fa-solid fa-plus"></i>
            </label>
            <input type='file' id='profile-input' style={{ display: "none" }} onChange={handleFileInputChange}/>
          </div>
        </div>

        <div className='profile-text'>
          <p>Käyttäjätunnus: {username}</p>
          <p>Kuvaus?</p>
          <Button aria-describedby={id} type="button" onClick={handleClick} className='change-password'>
            Vaihda salasana
          </Button>
          <BasePopup id={id} open={open} anchor={anchorEl}>
            <PopupBody>
              <form className='change-password-form' >
                <label>Vanha salasana</label>
                <Password
                  placeholder="Salasana"
                />
                <label>Uusi salasana</label>
                <Password
                  placeholder="Uusi salasana"
                />
                <label>Uusi salasana uudestaan</label>
                <Password
                  placeholder="Uusi salasana"
                />
              </form>
            </PopupBody>
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
        <SeeInvites /> {}
      </div>
      <div className='delete-user'>
        <button onClick={handleDeleteUser}>
          {deleteConfirmed ? "Confirm Delete" : "Delete User"}
        </button>
      </div>
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
