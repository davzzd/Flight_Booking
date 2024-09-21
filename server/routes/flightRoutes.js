// routes/flightRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const { Flight, Seat } = require('../models');

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

// Create a new flight and generate seats
router.post('/', async (req, res) => {
    try {
      const newFlight = await Flight.create(req.body);
  
      // Generate seats (example: 100 economy, 20 business, 10 first class)
      const seats = [];
      for (let i = 1; i <= 100; i++) {
        seats.push({ seatNumber: `E${i}`, seatClass: 'economy', flightId: newFlight.id });
      }
      for (let i = 1; i <= 20; i++) {
        seats.push({ seatNumber: `B${i}`, seatClass: 'business', flightId: newFlight.id });
      }
      for (let i = 1; i <= 10; i++) {
        seats.push({ seatNumber: `F${i}`, seatClass: 'first', flightId: newFlight.id });
      }
  
      await Seat.bulkCreate(seats); // Bulk create all seats
      res.json(newFlight);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create flight' });
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
