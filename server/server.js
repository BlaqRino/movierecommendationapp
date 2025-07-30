const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
const authRoutes = require('./routes/auth');
const favoriteRoutes = require('./routes/favorites');
const watchlistRoutes = require('./routes/watchlists');
const tmdbRoutes = require('./routes/tmdb');
const reviewRoutes = require('./routes/reviews');
const profileRoutes = require('./routes/profile');

// TMDB route will be added soon

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/watchlists', watchlistRoutes);
app.use('/api/movies', tmdbRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/profile', profileRoutes);

// 🔍 Test base route
app.get('/', (req, res) => {
  res.send('🎬 Movie Recommendation API is running');
});

// 🔌 MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});



