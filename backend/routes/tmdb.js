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

router.get('/movies', async (req, res) => {
  console.log("selailuhaku backendissä alkaa");
  try {
    console.log("selailuhaku backendissä tryn sisällä");
    const apiKey = process.env.TMDB_API_KEY;
    const year = parseInt(req.query.year);
    const endYear = year + 10;
    if (year==1){
      year= 1850;
      endYear=1959;
    }
    if (year==9){
      year= 1850;
      endYear=2024;
    }
    const language = req.query.language;
    const genre = req.query.genre;
    const movieOrTv = req.query.movieOrTv;
    const points = req.query.points;  
    console.log("backend  year, language, genre, points, movieOrTv", year, language, genre, points, movieOrTv )
    console.log("points:", points);
    let pointsStart = 0;
    let pointEnd = 10;
    console.log("selailuhaku backendissä ennen switch lausetta");
    switch (points) {
      case "0":
        console.log("case all");
        pointsStart = 0;
        pointEnd = 10;
        break;
      case "1":
        console.log("case huono");
        pointsStart = 0;
        pointEnd = 3;
        break;
      case "2":
        console.log("case ok");
        pointsStart = 4;
        pointEnd = 7;
        break;
      case "3":
        console.log("case hyvä");
        pointsStart = 8;
        pointEnd = 10;
        break;
      default:
        console.log("case default");
        return;
    }
    console.log("haku lähetetään")
    const response1 = await axios.get(`https://api.themoviedb.org/3/discover/${movieOrTv}?api_key=${apiKey}&include_adult=false&page=1&include_video=false&language=fi-FI&include_image_language=fi,en&page=1&sort_by=popularity.desc&primary_release_date.gte=${year}-01-01&primary_release_date.lte=${endYear}-12-31&with_original_language=${language}&with_genres=${genre}&vote_average.gte=${pointsStart}&vote_average.lte=${pointEnd}`);
    const haku = response1.data;
    res.json(haku);
    console.log("haku onnistui")
    console.log(haku)
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    res.status(500).json({ error: 'Error fetching from TMDB2' });
  }
});

module.exports = router;