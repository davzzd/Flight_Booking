import React, { useState } from "react";
import axios from "axios";
import styles from './Login.module.css';
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const toggleLoginRegister = () => {
    setIsLogin(!isLogin);
    setMessage("");
    if (isLogin) {
      setUsername("");
      setPassword("");
    } else {
      setFirstName("");
      setLastName("");
      setCountry("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3001/api/register", {
        username,
        password,
        firstName,
        lastName,
        country,
      });
      setMessage(res.data.message);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Registration failed, please try again.");
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3001/api/login", {
        username: username.toLowerCase(),
        password,
      });

      if (res.status === 200) {
        const { username } = res.data;
        console.log("Login successful, username:", username);
        localStorage.setItem("username", username.toLowerCase());
        onLogin();
        navigate("/booking");
      }
    } catch (error) {
      setLoading(false);
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

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Login;

