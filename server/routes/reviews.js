const express = require('express');
const Review = require('../models/Review');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Post a review for a movie
router.post('/:movieId', verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { movieId } = req.params;

    if (!rating) return res.status(400).json({ message: 'Rating is required' });

    const review = new Review({
      userId: req.user.userId,
      movieId,
      rating,
      comment
    });
    await review.save();
    res.status(201).json({ message: 'Review added', review });
  } catch (err) {
    console.error('Error posting review:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all reviews for a movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate('userId', 'name');
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
