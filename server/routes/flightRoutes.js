// routes/flightRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../models');

// Get all flights based on search criteria
router.get('/flights', async (req, res) => {
  const { startPoint, destination, flightDate } = req.query;

  try {
    const flights = await db.Flight.findAll({
      where: {
        startPoint,
        destination,
        flightDate,
      },
    });
    res.json(flights);
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).json({ message: "Error fetching flights" });
  }
});

/*
// Create a new flight (for admin or testing purposes)
router.post('/flights', async (req, res) => {
  const { flightNumber, startPoint, destination, flightDate, availableSeats, price } = req.body;

  try {
    const newFlight = await db.Flight.create({
      flightNumber,
      startPoint,
      destination,
      flightDate,
      availableSeats,
      price,
    });
    res.status(201).json(newFlight);
  } catch (error) {
    console.error("Error creating flight:", error);
    res.status(500).json({ message: "Error creating flight" });
  }
});
*/
module.exports = router;
