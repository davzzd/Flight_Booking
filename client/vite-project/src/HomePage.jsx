import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage({ isLoggedIn }) {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    navigate('/booking');
  };

  return (
    <div className="homepage-container">
      <h1>Welcome to Flight Booking</h1>
      <p>Book your flights conveniently</p>

      {isLoggedIn ? (
        <button onClick={handleBookingClick}>Book Now</button>
      ) : (
        <p>Please log in to book your flights</p>
      )}
    </div>
  );
}

export default HomePage;

/*
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
*/