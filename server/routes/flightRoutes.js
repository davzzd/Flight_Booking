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

// In routes/flightRoutes.js (or wherever your routes are defined)
router.get('/seats/:flightId', async (req, res) => {
    const flightId = req.params.flightId;
    try {
      const seats = await Seat.findAll({ where: { flightId } });
      res.json(seats);
    } catch (error) {
      console.error('Error fetching seats:', error);
      res.status(500).json({ message: 'Error fetching seats' });
    }
  });

  router.post('/flights/:flightId/seats/book', async (req, res) => {
    const { seatNumber, user } = req.body;
    const flightId = req.params.flightId;
    
    try {
      const seat = await db.Seat.findOne({ where: { flightId, seatNumber } });
  
      if (seat && !seat.isBooked) {
        await seat.update({ isBooked: true, bookedBy: user });
        res.json({ success: true, message: 'Seat booked successfully' });
      } else {
        res.status(400).json({ success: false, message: 'Seat is already booked' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error booking seat');
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
