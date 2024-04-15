import React from 'react'
import './home.css'
import Header from '../components/Header'
import PopularMoviesPanel from '../components/PopularMoviesPanel'
import PopularSeriesPanel from '../components/PopularSeriesPanel'


export default function Home() {
  return (
    <div className='home-container'>
      <div className='trailer-back'>
        <header>
      <Header />
    </header>
      </div>
    
      <div className='home'>
        <h3>Movies</h3>
       <PopularMoviesPanel /> 
       <h3>Series</h3> 
       <PopularSeriesPanel />
      </div>    

    </div>
  )
}
