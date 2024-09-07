const express = require("express");
const cors = require("cors");
const app = express();

app.listen(3001, () => {
    console.log("server is running on port 3001");
});

const db = require("./models");

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

// Route to handle creating new users (registration)
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
      const existingUser = await db.User.findOne({ where: { username } });

      if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
      }

      const newUser = await db.User.create({ username, password });
      return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
      console.error('Error occurred:', error.message);  // Log the error message
      console.error('Stack trace:', error.stack);  // Log the full stack trace
      return res.status(500).json({ message: 'Server error', error: error.message });
  }

});


// Route to handle user login (optional, based on your needs)
/*
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username and password
        const user = await db.User.findOne({ where: { username, password } });

        if (user) {
            return res.json({ message: 'Login successful', user });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
});
*/
// Sync the database and start the server
db.sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch(err => {
    console.error("Failed to sync database: ", err);
});




// Route to handle user login (optional, based on your needs)
/*
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username and password
        const user = await db.User.findOne({ where: { username, password } });

        if (user) {
            return res.json({ message: 'Login successful', user });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
});
*/
// Sync the database and start the server
db.sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch(err => {
    console.error("Failed to sync database: ", err);
});


/*
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const dbConfig = require('./config/config.json'); // Adjust the path to your config.json
const User = require('./models/users'); // Adjust the path to your User model

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Sequelize using the configuration from config.json
const sequelize = new Sequelize(dbConfig.development);

// Test DB connection and log detailed error if it fails
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(); // Stop the server if the database connection fails
  });

// Sync models and create tables
sequelize.sync()
  .then(() => console.log('Tables have been created.'))
  .catch(err => console.error('Error syncing tables:', err));

// Routes
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ where: { username } });
      
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
      } else {
        // Create a new user
        const newUser = await User.create({ username, password });
        res.status(201).json({ message: 'User created successfully', user: newUser });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
*/