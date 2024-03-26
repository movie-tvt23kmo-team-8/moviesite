import React from 'react'
import './topbar.css'

export default function TopBar() {
  return (
    <div className='top'>
      <div className='topLeft'>
      <img className='topLeftImg' src={require('../img/logo.png')} alt="topimg" />
      </div>
      <div className='topCenter'>
        <ul className='topList'>
          <li className='topListItem'>
            ELOKUVAT
          </li>
          <li className='topListItem'>
            SARJAT
          </li>
          <li className='topListItem'>
            NÄYTÖKSET
          </li>
          <li className='topListItem'>
            RYHMÄT
          </li>
          <li className='topListItem'>
           SUOSIKIT
          </li>
        </ul>
      </div>
      <div className='topRight'>
   
        <i className="topSearchIcon fa-solid fa-magnifying-glass"></i>
        <img className='topLeftImg' src={require('../img/logo.png')} alt="topimg" />
        <p className='topRightPara'>KIRJAUDU ULOS</p>
      </div>
    </div>
  )
}
