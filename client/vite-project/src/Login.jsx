import React, { useState } from "react";
import axios from "axios";
import styles from './Login.module.css';
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login and register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");  // New state for first name
  const [lastName, setLastName] = useState("");    // New state for last name
  const [country, setCountry] = useState("");      // New state for country
  const [loading, setLoading] = useState(false);   // State for loading spinner
  const [message, setMessage] = useState("");       // State for messages

  const navigate = useNavigate();  // Use navigate for routing

  // Toggle between Login and Register
  const toggleLoginRegister = () => {
    setIsLogin(!isLogin);
    setMessage(""); // Clear messages when toggling
    // Clear input fields when toggling
    if (isLogin) {
      setUsername("");
      setPassword("");
    } else {
      setFirstName("");
      setLastName("");
      setCountry("");
    }
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setMessage("");   // Clear previous messages

    try {
      const res = await axios.post("http://localhost:3001/api/register", {
        username,
        password,
        firstName,
        lastName,
        country,
      });
      setMessage(res.data.message); // Show message from the server
      setTimeout(() => {
        setLoading(false); // Stop loading after 3 seconds
      }, 1000);
    } catch (error) {
      setLoading(false); // Stop loading
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Registration failed, please try again.");
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setMessage("");   // Clear previous messages

    try {
      const res = await axios.post("http://localhost:3001/api/login", {
        username: username.toLowerCase(), // ensure username is normalized
        password,
      });

      if (res.status === 200) {
        const { username } = res.data;

        // Log username to confirm it's being received properly
        console.log("Login successful, username:", username);

        localStorage.setItem("username", username.toLowerCase()); // store in lowercase
        onLogin();
        navigate("/booking"); // Navigate to booking page
      }
    } catch (error) {
      setLoading(false); // Stop loading
      console.error("Login error:", error);
      setMessage("Login failed, please check your credentials.");
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
        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? <div className={styles.loader}></div> : (isLogin ? "Login" : "Register")}
        </button>
      </form>
      <button className={styles.reg} onClick={toggleLoginRegister}>
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </button>

      {/* Message Display Area */}
      {message && <p className={styles.message}>{message}</p>} {/* Show messages here */}
    </div>
  );
};

export default Login;

