// client/src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setError('Please log in.');

    axios.get('http://localhost:5000/api/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setData(res.data))
    .catch(err => {
      console.error('Profile fetch error:', err.response?.data?.message || err.message);
      setError('Could not load profile.');
    });
  }, []);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading profile…</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>User Profile</h2>
      <p><strong>Name / ID:</strong> {data.user._id}</p>
      <p><strong>Email:</strong> {data.user.email}</p>

      <hr />

      <h3>Your Watchlists</h3>
      {data.watchlists.length === 0 ? <p>No watchlists</p> :
        data.watchlists.map(wl => (
          <div key={wl._id} style={{ marginBottom: '1rem' }}>
            <strong>{wl.name}</strong> ({wl.movies.length} movies)
          </div>
        ))
      }

      <h3>Your Favorites</h3>
      {data.favorites.length === 0 ? <p>No favorites added</p> :
        data.favorites.map(fav => (
          <div key={fav._id}>
            {fav.title}
          </div>
        ))
      }

      <h3>Your Reviews</h3>
      {data.reviews.length === 0 ? <p>No reviews yet</p> :
        data.reviews.map(rev => (
          <div key={rev._id} style={{ marginBottom: '1rem' }}>
            <strong>Movie ID:</strong> {rev.movieId} — Rating: {rev.rating}
            <p>{rev.comment}</p>
          </div>
        ))
      }
    </div>
  );
};

export default Profile;

