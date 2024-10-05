const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models');

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, firstName, lastName, country } = req.body;

  try {
    const existingUser = await db.User.findOne({ where: { username: username.toLowerCase() } }); // normalize to lowercase
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.create({
      username: username.toLowerCase(), // store in lowercase
      password: hashedPassword,
      firstName,
      lastName,
      country,
    });
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error, please try again", error: error.message });
  }
});


//Login Handling
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Normalize username to lowercase
    const user = await db.User.findOne({ where: { username: username.toLowerCase() } });
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Log success for debugging
    console.log(`User ${user.username} logged in successfully`);

    // Return the username to be stored in localStorage
    res.status(200).json({ message: "Login successful", username: user.username });
  } catch (error) {
    console.error("Login server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



module.exports = router;