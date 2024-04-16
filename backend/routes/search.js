
const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

router.get('/', async (req, res) => {
    try {
        const { query } = req.query;
        const apiKey = process.env.TMDB_API_KEY;

        // osoitteet sekä elokuville että sarjoille
        const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
        const seriesUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${query}`;

        // pyynnöt molemmille 
        const [movieResponse, seriesResponse] = await Promise.all([
            axios.get(movieUrl),
            axios.get(seriesUrl)
        ]);

        // Yhdistetään molempien vastaukset
        const combinedResults = {
            movies: movieResponse.data.results,
            series: seriesResponse.data.results
        };

        res.json(combinedResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
