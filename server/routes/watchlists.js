const express = require('express');
const Watchlist = require('../models/Watchlist');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Create a new watchlist
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Watchlist name is required' });
    }

    const newList = new Watchlist({
      userId: req.user.userId,
      name,
      movies: []
    });

    await newList.save();
    res.status(201).json({ message: 'Watchlist created', watchlist: newList });
  } catch (err) {
    console.error('❌ Error creating watchlist:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Add a movie to an existing watchlist
router.post('/:id/add', verifyToken, async (req, res) => {
  try {
    const { movieId, title, poster } = req.body;
    const watchlistId = req.params.id;

    if (!movieId || !title) {
      return res.status(400).json({ message: 'movieId and title are required' });
    }

    const watchlist = await Watchlist.findOne({
      _id: watchlistId,
      userId: req.user.userId
    });

    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    watchlist.movies.push({ movieId, title, poster });
    await watchlist.save();

    res.status(200).json({ message: 'Movie added to watchlist', watchlist });
  } catch (err) {
    console.error('❌ Error adding movie to watchlist:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Get all watchlists for the user
router.get('/my', verifyToken, async (req, res) => {
  try {
    const lists = await Watchlist.find({ userId: req.user.userId });
    res.status(200).json(lists);
  } catch (err) {
    console.error('❌ Error fetching watchlists:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

