import React, { useContext } from 'react'
import './topbar.css'
import { Link } from 'react-router-dom'
import { jwtToken } from '../components/Signals';
import { useUser } from '../context/useUser';

export default function TopBar() {
  const user = jwtToken.value.length !== 0;
  return (
    <div className='top'>
      <div className='topLeft'>
        <div className='websitename'>
          <p>Filmi</p>
          <p>verkko</p>
        </div>
        <a href="/"><img className='topLeftImg' src={require('../img/logo.png')} alt="topimg" /></a>


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
                  <Link to="/profile"><img className='topRightImg' src={require('../img/logo.png')} alt="topimg" /></Link>
                    </li><li className='topLogoutItem'>
                  <Link className='link logout' to="/logout">KIRJAUDU ULOS</Link>
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
