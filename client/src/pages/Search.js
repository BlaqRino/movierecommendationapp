// client/src/pages/Search.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    try {
      const res = await axios.get(
        `https://movierecommendationapp-jnga.onrender.com/api/movies/search?query=${encodeURIComponent(query)}`
      );
      setResults(res.data);
    } catch (err) {
      console.error('Search error:', err.message);
    }
  };

  return (
    <div className="search-page container">
      <h2>🔍 Movie Search</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {results.length > 0 && (
        <div className="grid-cards">
          {results.map((movie) => (
            <div
              key={movie.id}
              className="card"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />
              )}
              <h3>{movie.title}</h3>
              <p>{movie.overview.substring(0, 100)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;


