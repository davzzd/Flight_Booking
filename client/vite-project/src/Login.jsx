import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login and register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");  // New state for first name
  const [lastName, setLastName] = useState("");    // New state for last name
  const [country, setCountry] = useState("");      // New state for country

  // Toggle between Login and Register
  const toggleLoginRegister = () => {
    setIsLogin(!isLogin);
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/register", {
        username,
        password,
        firstName,
        lastName,
        country,
      });
      alert(res.data.message);  // Display success or error message from the server
    } catch (error) {
      if (error.response && error.response.data.message) {
        // Show specific error message returned by the backend
        alert(error.response.data.message);
      } else {
        alert("Registration failed, please try again.");
      }
    }
  };
  

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/login", {
        username,
        password,
      });
      alert(res.data.message);
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed, please check your credentials.");
    }
  };

  return (
    <div className="Register">
      <h1>{isLogin ? "Login" : "Register"}</h1>
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </>
        )}
        <button className="submit" type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      <button className="reg" onClick={toggleLoginRegister}>
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default Login;



/*
import React, { useState } from 'react';
// If using Axios, uncomment the next line
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // If using Axios, uncomment the following block and comment out the Fetch block
            const response = await axios.post('http://localhost:3000/api/register', {
                username,
                password,
            });
            console.log('Response:', response.data);
            alert('User created successfully');     
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (

        <form onSubmit={handleLogin} className='Login'>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
*/
