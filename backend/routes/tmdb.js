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

router.get('/hakusana', async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const searchTerm = req.params.keyword;
    const response = await axios.get(`https://api.themoviedb.org/3/search/multi?&language=fi-FI&api_key=${apiKey}&query=${searchTerm}&include_adult=false`);
    const vastaukset = response.data.results;
    const totalResult = response.total_results;
    res.json(vastaukset);
    /*if (totalResult > 0) {
        res.json(vastaukset);
    } else {
      res.json({error: 'No results'})
    }*/
  } catch (error) {
    console.error('Error fetching with keyword from TMDB:', error);
    res.status(500).json({ error: 'Error fetching with keyword from TMDB' });
  }
});

router.get('/kriteerit/movies', async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const releaseYearStart = req.params.releaseYearStart;
    const releaseYearEnd = req.params.releaseYearEnd;
    const minRating = req.params.minRating;
    const maxRating = req.params.maxRating;
    const spokenLanguage = req.params.spokenLanguage;

    const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fi-FI&include_image_language=fi,en&page=1&sort_by=popularity.desc&primary_release_date.gte=${releaseYearStart}-01-01&primary_release_date.lte=${releaseYearEnd}-12-31&with_original_language=${spokenLanguage}&with_genres=${genreU}&vote_average.gte=${minRating}&vote_average.lte=${maxRating}&api_key=${apiKey}`);
    const vastaukset = response.data.results;
    res.json(vastaukset);
  } catch (error) {
    console.error('Error fetching movies from TMDB:', error);
    res.status(500).json({ error: 'Error fetching movies from TMDB' });
  }

});

router.get('/kriteerit/series', async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const releaseYearStart = req.params.releaseYearStart;
    const releaseYearEnd = req.params.releaseYearEnd;
    const minRating = req.params.minRating;
    const maxRating = req.params.maxRating;
    const spokenLanguage = req.params.spokenLanguage;

    const response = await axios.get(`https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=fi-FI&include_image_language=fi,en&page=1&sort_by=popularity.desc&primary_release_date.gte=${releaseYearStart}-01-01&primary_release_date.lte=${releaseYearEnd}-12-31&with_original_language=${spokenLanguage}&with_genres=${genreU}&vote_average.gte=${minRating}&vote_average.lte=${maxRating}&api_key=${apiKey}`);
    //https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=fi-FI&include_image_language=fi,en&page=1&sort_by=popularity.desc&primary_release_date.gte=' + releaseYearStart + '-01-01&primary_release_date.lte=' + releaseYearEnd + '-12-31&with_original_language=' + spokenLanguage + '&with_genres=' + genreU + '&vote_average.gte=' + minRating + '&vote_average.lte=' + maxRating
    const vastaukset = response.data.results;
    res.json(vastaukset);
  } catch (error) {
    console.error('Error fetching TV series from TMDB:', error);
    res.status(500).json({ error: 'Error fetching TV series from TMDB' });
  }
});

module.exports = router;