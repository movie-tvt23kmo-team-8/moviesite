import React from 'react'
import './profile.css'

export default function Profile() {
  return (
    <div className='profile-container'>
      <div className='profile-info'> 
        <div className='profile-pic'>
        kuva
        </div>
        <div className='profile-text'>
        <p>Käyttäjätunnus:</p>
        <p>Salasana:</p>
        <button>Vaihda Salasana</button>
        </div>
      </div>
      <div className='profile-favorite'>
        favorite
      </div>
      <div className='profile-group'>
        group
      </div>

    </div>
  )
}
