import React, { useState } from "react";
import axios from "axios";
import styles from './Login.module.css';
import { useNavigate } from "react-router-dom";  // Use navigate for redirection

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login and register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");  // New state for first name
  const [lastName, setLastName] = useState("");    // New state for last name
  const [country, setCountry] = useState("");      // New state for country

  const navigate = useNavigate();  // Use navigate for routing

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
     // alert(res.data.message);

      if (res.status === 200) {
        onLogin();  // Update the login state in App component
        navigate("/booking");  // Redirect to booking page after successful login
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed, please check your credentials.");
    }
  };

  return (
    <div className={styles.Register}>
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
        <button className={styles.submit} type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <button className={styles.reg} onClick={toggleLoginRegister}>
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default Login;


