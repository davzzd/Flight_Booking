const express = require("express");
const cors = require("cors");
const app = express();

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
