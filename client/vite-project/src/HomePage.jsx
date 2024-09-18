import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage({ isLoggedIn }) {
  return (
    <div className="homepage-container">
      <h1>Welcome to the HomePage</h1>
      {isLoggedIn ? (
        <Link to="/booking">
          <button>Go to Booking Page</button>
        </Link>
      ) : (
        <p>Please log in to proceed to booking.</p>
      )}
    </div>
  );
}

export default HomePage;
