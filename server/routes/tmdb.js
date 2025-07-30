const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Search movies using TMDB API
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ message: 'Missing search query' });
    }

    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: { api_key: process.env.TMDB_API_KEY, query }
    });

    res.status(200).json(response.data.results);
  } catch (err) {
    console.error('❌ TMDB search error:', err.message);
    res.status(500).json({ message: 'Error fetching movies', error: err.message });
  }
});

// Fetch detailed data for a specific movie
router.get('/details/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
      params: { api_key: process.env.TMDB_API_KEY }
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.error('❌ TMDB movie details error:', err.message);
    res.status(500).json({ message: 'Error fetching movie details', error: err.message });
  }
});

module.exports = router;

