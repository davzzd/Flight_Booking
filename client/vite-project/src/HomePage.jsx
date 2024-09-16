import React from 'react';
import { Link } from 'react-router-dom';

function HomePage({ isLoggedIn }) {
  return (
    <div>
      <h1>Welcome to the Booking App</h1>
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
