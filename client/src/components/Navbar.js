// client/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const token = localStorage.getItem('token');
  return (
    <nav style={{
      display: 'flex', gap: '1rem', padding: '1rem', background: '#282c34', color: '#fff'
    }}>
      <Link to="/" style={{ color: '#61dafb', fontWeight: 'bold' }}>MovieApp</Link>
      <Link to="/search" style={{ color: '#fff' }}>Search</Link>
      {token ? (
        <>
          <Link to="/profile" style={{ color: '#fff' }}>Profile</Link>
          <button onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
            Log Out
          </button>
        </>
      ) : (
        <Link to="/login" style={{ color: '#fff' }}>Log In</Link>
      )}
    </nav>
  );
};

export default Navbar;
