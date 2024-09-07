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

            const response = await axios.post('http://localhost:3001/api/register', {
                username,
                password,
            });
            console.log('Response:', response.data);
            alert('User created successfully');
          

            // If using Fetch, uncomment the following block and comment out the Axios block
            /*
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            console.log('Response:', data);
            alert('User created successfully');
            */
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
