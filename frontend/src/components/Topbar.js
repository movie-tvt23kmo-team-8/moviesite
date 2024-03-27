import React from 'react'
import './topbar.css'
import { Link } from 'react-router-dom'
import { useUser } from '../context/useUser'

export default function TopBar() {
  //  const {user} = useUser()
  const user = true
  return (
    <div className='top'>
      <div className='topLeft'>
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
          <li className='topListItem'>
            <Link to="/register" className='link'>REKISTERÖIDY</Link>
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
                  <Link className='link logout' to="/logout">LOGOUT</Link>
                </li></ul>
              </>
            ) : (
              <>
                <ul className='topRightList'>
                  <li className='topListItem'>
                    <Link className='link right' to="/login">LOGIN</Link>
                  </li>
                  <li className='topListItem'>
                    <Link className='link right' to="/register">REGISTER</Link>
                  </li>
                </ul>
              </>
            )}

      </div>
    </div>
  )
}
