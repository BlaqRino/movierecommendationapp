const express = require('express');
const User = require('../models/User');
const Favorite = require('../models/Favorite');
const Watchlist = require('../models/Watchlist');
const Review = require('../models/Review');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// GET profile data: user info, favorites, watchlists, reviews
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    const favorites = await Favorite.find({ userId: req.user.userId });
    const watchlists = await Watchlist.find({ userId: req.user.userId });
    const reviews = await Review.find({ userId: req.user.userId });
    res.json({ user, favorites, watchlists, reviews });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
