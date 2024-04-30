import React from 'react'
import './home.css'
import PopularMoviesPanel from '../components/PopularMoviesPanel'
import PopularSeriesPanel from '../components/PopularSeriesPanel'
import CinemaTrailer from '../components/MovieTrailer';


export default function Home() {
  return (
    <div className='home-container'>
      <div className='trailer-back'>
        <CinemaTrailer />
      </div>

      <div className='home'>
        <h3 className='home-header'>Suosituimmat elokuvat</h3>
        <PopularMoviesPanel />
        <h3 className='home-header'>Suosituimmat sarjat</h3>
        <PopularSeriesPanel />
      </div>
    </div>
  )
}
