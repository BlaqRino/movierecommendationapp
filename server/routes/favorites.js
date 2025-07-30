const express = require('express');
const Favorite = require('../models/Favorite');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Save a movie to favorites (Protected)
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { movieId, title, poster } = req.body;

    const favorite = new Favorite({
      userId: req.user.userId,
      movieId,
      title,
      poster
    });

    await favorite.save();
    res.status(201).json({ message: 'Movie added to favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get all favorites for logged-in user
router.get('/my', verifyToken, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.userId });
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
