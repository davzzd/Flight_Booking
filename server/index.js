const express = require('express');
const cors = require('cors');
const db = require('./models');
const userRoutes = require('./routes/userRoutes'); // Import the routes
const flightRoutes = require('./routes/flightRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Use the routes
app.use('/api', userRoutes);
app.use('/api', flightRoutes);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
});

/*
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt"); // For password hashing
const db = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

// Register a new user
app.post("/api/register", async (req, res) => {
  const { username, password, firstName, lastName, country } = req.body;

  try {
    // Check if user already exists
    const existingUser = await db.User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await db.User.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      country,
    });
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);  // Log the actual error
    res.status(500).json({ message: "Server error, please try again", error: error.message });
  }
});

// Login user
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Sync DB and start server
db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
});
*/