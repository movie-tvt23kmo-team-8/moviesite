import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './topbar.css'
import { Link } from 'react-router-dom'
import { jwtToken } from '../components/Signals';
import { seeInvites } from '../context/seeInvites';

export default function TopBar() {
  const [username, setUsername] = useState('');
  const [imageid, setImageId] = useState('');
  const [loading, setLoading] = useState(true); // State to track loading status
  const [inviteCount, setInviteCount] = useState(0);

  const user = jwtToken.value.length !== 0;

  useEffect(() => {
    // Fetch user data after 5 seconds
    const fetchData = setTimeout(() => {
      axios.get('http://localhost:3001/users/personal', {
        headers: {
          Authorization: `Bearer ${jwtToken.value}`
        }
      })
        .then(response => {
          setUsername(response.data.username);
          setImageId(response.data.imageid);
          setLoading(false); // Set loading to false after data is fetched
        })
        .catch(error => {
          console.error('Error fetching username and imageid:', error);
          setLoading(false); // Set loading to false even if there's an error
        });
    }, 10);

    // Clear the timer when component unmounts
    return () => clearTimeout(fetchData);
  }, []);

  useEffect(() => {
    seeInvites(setInviteCount).catch(error => {
      console.error('Error fetching invites:', error);
    });
    //console.log('Image ID:', imageid);
    //console.log('Image Source:', `../img/avatar/${imageid}.png`);
  }, [imageid]);

  // Render loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='top'>
      <div className='topLeft'>
        <a href="/"><img className='topLeftImg' src={require('../img/logo_nimi.png')} alt="topimg" /></a>


      </div>
      <div className='topCenter'>
        <ul className='topList'>
          <li className='topListItem'>
            <Link to="/search" className='link'>HAKU</Link>
          </li>
          <li className='topListItem'>
            <Link to="/shows" className='link'>NÄYTÖKSET</Link>
          </li>
          <li className='topListItem'>
            <Link to="/group" className='link'>RYHMÄT</Link>
          </li>
          <li className='topListItem'>
            <Link to="/favourite" className='link'>SUOSIKIT</Link>
          </li>
          <li className='topListItem'>
            <Link to="/reviews" className='link'>ARVOSTELUT</Link>
          </li>
        </ul>
      </div>
      <div className='topRight'>
        {
          user ?
            (
              <>
                <ul className='topLogout'><li className='topLogoutItem'>
                <Link to="/profile">
                  <div className="topRightImgContainer">
                   {imageid && (
                 <img
                    className='topRightImg'
                       src={require(`../img/avatar/${imageid}.png`)}
                       alt="topimg"
                   />
                  )}
                {inviteCount > 0 && <div className="redBall">{inviteCount}</div>}
                  </div>
                </Link>
                </li><li className='topLogoutItem'>
                    <Link className='link logout' to="/logout">Kirjaudu ulos</Link>
                  </li></ul>
              </>
            ) : (
              <>
                <ul className='topRightList'>
                  <li className='topListItem'>
                    <Link className='link right' to="/login">KIRJAUDU</Link>
                  </li>
                  <li className='topListItem'>
                    <Link className='link right' to="/register">REKISTERÖIDY</Link>

                  </li>
                </ul>
              </>
            )}

      </div>
    </div>
  )
}
