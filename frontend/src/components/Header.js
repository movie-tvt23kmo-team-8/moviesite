import React from 'react'
import './header.css'

export default function Header() {
  return (
    <div className='header'>
      <img className='headerImg' src={require('../img/logo.png')} alt="topimg" />
    <div className='headerTitles'>
        <span className='headerTitleSm'>Filmi</span>
        <span className='headerTitleLg'>Verkko</span>
    </div>
    
</div>
  )
}
