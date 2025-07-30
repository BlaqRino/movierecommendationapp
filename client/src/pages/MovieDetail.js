// client/src/pages/MovieDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [watchlists, setWatchlists] = useState([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState('');

  useEffect(() => {
    axios.get(`https:movierecommendationapp-jnga.onrender.com/api/movies/details/${id}`)
      .then(res => setMovie(res.data))
      .catch(err => {
        console.error('Details fetch failed:', err.message);
        setError('Failed to load movie details.');
      });

    const token = localStorage.getItem('token');
    if (token) {
      axios.get('https://movierecommendationapp-jnga.onrender.com/api/watchlists/my', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setWatchlists(res.data);
        if (res.data.length) setSelectedWatchlist(res.data[0]._id);
      }).catch(console.error);
    }
    axios.get(`https://movierecommendationapp-jnga.onrender.com/api/reviews/movie/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error('Reviews fetch error:', err.message));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in to post a review');

    try {
      await axios.post(
        `https://movierecommendationapp-jnga.onrender.com/api/reviews/${id}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Review added!');
      setReviews(prev => [
        ...prev,
        { userId: { name: 'You' }, rating, comment, createdAt: new Date().toISOString() }
      ]);
      setComment('');
      setRating(5);
    } catch (err) {
      console.error('Post review failed:', err.response?.data?.message || err.message);
      alert('Failed to add review');
    }
  };

  const handleAddToWatchlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in');
    if (!selectedWatchlist) return alert('Select a watchlist first');

    try {
      await axios.post(
        `https://movierecommendationapp-jnga.onrender.com/api/watchlists/${selectedWatchlist}/add`,
        {
          movieId: movie.id.toString(),
          title: movie.title,
          poster: movie.poster_path
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Added to watchlist!');
    } catch (err) {
      console.error('Add to watchlist failed:', err.response?.data?.message || err.message);
      alert('Failed to add to watchlist');
    }
  };

  if (error) return <div>{error}</div>;
  if (!movie) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{movie.title}</h2>
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          style={{ borderRadius: '8px', marginBottom: '1rem' }}
        />
      )}
      <p><strong>Overview:</strong> {movie.overview}</p>

      <div style={{ margin: '1rem 0' }}>
        <label htmlFor="watchlistSelect">Save to watchlist:</label>
        <select
          id="watchlistSelect"
          value={selectedWatchlist}
          onChange={(e) => setSelectedWatchlist(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        >
          <option value="">Choose...</option>
          {watchlists.map((wl) => (
            <option key={wl._id} value={wl._id}>{wl.name}</option>
          ))}
        </select>
        <button
          onClick={handleAddToWatchlist}
          disabled={!selectedWatchlist}
          style={{ marginLeft: '0.5rem' }}
        >
          ➕ Add
        </button>
      </div>

      <hr />

      <h3>Leave a Review</h3>
      <form onSubmit={submitReview} style={{ marginBottom: '2rem' }}>
        <label>
          Rating:
          <select value={rating} onChange={e => setRating(Number(e.target.value))}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <br />
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Write your comment..."
          rows="3"
          required
          style={{ width: '100%', marginTop: '0.5rem' }}
        />
        <br />
        <button type="submit" style={{ marginTop: '0.5rem' }}>
          Submit Review
        </button>
      </form>

      <h3>User Reviews</h3>
      {reviews.length === 0 ? <p>No reviews yet.</p> :
        reviews.map((r, idx) => (
          <div key={idx} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
            <strong>{r.userId.name}</strong> — Rating: {r.rating}
            <p>{r.comment}</p>
          </div>
        ))
      }
    </div>
  );
};

export default MovieDetail;




