import React, { useState } from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './Login';
import Booking from './Booking';
import './App.css';
import HomePage from './HomePage';
import SeatBooking from './SeatBooking'; // New seat booking component
import Payment from './Payment'; // New payment component
import BookingHistory from './BookingHistory'; // Import the Booking History component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // To track login state
  const [username, setUsername] = useState(null); // Track logged-in user's username

  const handleLogin = (username) => {
  //  localStorage.setItem('username', username); // Store the username in local storage
    setUsername(username); // Set the username state
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      
      <header className="navbar">
        <nav>
          <Link to="/">Home</Link>
          {isLoggedIn ? (
            <>
              <Link to="/booking-history" style={{ float: 'right' }}>Booking History</Link>
              <Link to="/booking" style={{ float: 'right' }}>Booking</Link>
            </>
          ) : (
            <Link to="/login" className="login-link" style={{ float: 'right' }}>Login</Link>
          )}
        </nav>
      </header>
      <header><Link to="/" className='logo'>DavFlights</Link></header>

      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {isLoggedIn ? (
          <>
            <Route path="/booking" element={<Booking />} />
            <Route path="/seat-booking" element={<SeatBooking username={username} />} /> {/* Pass username */}
            <Route path="/payment" element={<Payment />} />
            <Route path="/booking-history" element={<BookingHistory username={username} />} /> {/* Pass username */}
          </>
        ) : (
          <Route path="/booking" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;

