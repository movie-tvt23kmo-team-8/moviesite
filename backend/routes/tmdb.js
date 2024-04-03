require('dotenv').config();
const axios = require('axios');
const router = require('express').Router();

router.get('/popular-movie', async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY; 
    const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
    const popularMovies = response.data.results;
    res.json(popularMovies);
  } catch (error) {
    console.error('Error fetching popular movies from TMDB:', error);
    res.status(500).json({ error: 'Error fetching popular movies from TMDB' });
  }
});

router.get('/popular-series', async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const response = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`);
    const popularSeries = response.data.results;
    res.json(popularSeries);
  } catch (error) {
    console.error('Error fetching popular TV series from TMDB:', error);
    res.status(500).json({ error: 'Error fetching popular TV series from TMDB' });
  }
});

module.exports = router;