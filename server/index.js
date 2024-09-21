const express = require('express');
const cors = require('cors');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const flightRoutes = require('./routes/flightRoutes');
const seatRoutes = require('./routes/seatRoutes');
const app = express();
const axios = require('axios');


app.use(cors());
app.use(express.json());

// Register routes
app.use('/api', userRoutes); // If needed, add /api prefix for clarity
app.use('/api', flightRoutes); // '/api/flights' is already correct here
app.use('/api', seatRoutes); // '/api/seats' for fetching seats

db.sequelize.sync().then(async () => {
  app.listen(3001, async () => {
    console.log("Server is running on port 3001");

    // Check if there are any flights in the database
    const flightCount = await db.Flight.count();
    if (flightCount === 0) {
      console.log("No flights found, generating random flights...");
      // Generate 10 random flights on startup
      await axios.post('http://localhost:3001/api/generateRandomFlights', { numFlights: 10 });
      console.log("Random flights created.");
    }
  });
});
