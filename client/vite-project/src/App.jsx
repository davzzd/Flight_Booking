import React, { useState } from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './Login';
import Booking from './Booking';
import './App.css';
import HomePage from './HomePage';
import SeatBooking from './SeatBooking'; // New seat booking component
import Payment from './Payment'; // New payment component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // To track login state

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <header className="navbar">
        <nav>
          <Link to="/">Home</Link>
          {!isLoggedIn && <Link to="/login" className="login-link" style={{ float: 'right' }}>Login</Link>}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {isLoggedIn ? (
          <>
            <Route path="/booking" element={<Booking />} />
            <Route path="/seat-booking" element={<SeatBooking />} /> {/* Seat booking page */}
            <Route path="/payment" element={<Payment />} /> {/* Payment and confirm order page */}
          </>
        ) : (
          <Route path="/booking" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
