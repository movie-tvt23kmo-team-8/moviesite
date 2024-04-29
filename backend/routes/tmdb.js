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
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const year = parseInt(req.query.year);
    const endYear = year + 9;
    if (year == 1) {
      year = 1850;
      endYear = 1959;
    }
    if (year == 9) {
      year = 1850;
      endYear = 2024;
    }
    const language = req.query.language;
    const genre = req.query.genre;
    const points = req.query.points;
    let pointsStart = 0;
    let pointEnd = 10;
    switch (points) {
      case "0":
        pointsStart = 0;
        pointEnd = 3;
        break;
      case "1":
        pointsStart = 4;
        pointEnd = 7;
        break;
      case "2":
        pointsStart = 8;
        pointEnd = 10;
        break;
      case "3":
        pointsStart = 0;
        pointEnd = 10;
        break;
      default:
        //console.log("case default");
        return;
    }

    //osoitteet elokuville ja sarjoille:
    const movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&page=1&include_video=false&language=fi-FI&include_image_language=fi,en&page=1&sort_by=popularity.desc&primary_release_date.gte=${year}-01-01&primary_release_date.lte=${endYear}-12-31&with_original_language=${language}&with_genres=${genre}&vote_average.gte=${pointsStart}&vote_average.lte=${pointEnd}`;
    const seriesUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&include_adult=false&page=1&include_video=false&language=fi-FI&include_image_language=fi,en&page=1&sort_by=popularity.desc&first_air_date.gte=${year}-01-01&first_air_date.lte=${endYear}-12-31&with_original_language=${language}&with_genres=${genre}&vote_average.gte=${pointsStart}&vote_average.lte=${pointEnd}`;

    //pyynnöt molemmille
    const [movieResponse, seriesResponse] = await Promise.all([
      axios.get(movieUrl),
      axios.get(seriesUrl)
    ]);

    //yhdistetään molempien vastaukset
    const combinedResults = {
      movies: movieResponse.data.results,
      series: seriesResponse.data.results
    };

    res.json(combinedResults);
    //console.log("haku onnistui")
    //console.log(combinedResults);
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    res.status(500).json({ error: 'Error fetching from TMDB2' });
  }
});

router.get('/poster', async (req, res) => {
  //console.log("posterin fetchin sisällä backarissa");
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const ID = parseInt(req.query.id);
    const type = req.query.type;
    //console.log(type, ID);
    if (type == "movie") {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${ID}?api_key=${apiKey}&language=fi-FI`);
      const result = response.data;
      res.json(result);
    } else {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${ID}?api_key=${apiKey}&language=fi-FI`);
      const result = response.data;
      res.json(result);
    }
    //const result = response.data;
    //console.log(movie.id)
    //res.json(result);
  } catch (error) {
    console.error('Error fetching with id from TMDB:', error);
    res.status(500).json({ error: 'Error fetching with id from TMDB' });
  }
});

module.exports = router;