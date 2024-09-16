import React, { useState } from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import Login from './Login';
import Booking from './Booking';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // To track login state

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link>
        {!isLoggedIn && <Link to="/login" style={{ float: 'right' }}>Login</Link>}
      </nav>

      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {isLoggedIn ? (
          <Route path="/booking" element={<Booking />} />
        ) : (
          <Route path="/booking" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
