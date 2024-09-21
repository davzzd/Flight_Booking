// routes/seatRoutes.js
const express = require('express');
const { Seat } = require('../models');
const router = express.Router();

// Fetch seats for a flight
router.get('/:flightId', async (req, res) => {
  try {
    const seats = await Seat.findAll({
      where: { flightId: req.params.flightId }
    });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seats' });
  }
});

// Book a seat
router.post('/book', async (req, res) => {
  const { seatId } = req.body;
  try {
    const seat = await Seat.findByPk(seatId);
    if (seat.isBooked) {
      return res.status(400).json({ error: 'Seat already booked' });
    }
    seat.isBooked = true;
    await seat.save();
    res.json({ success: 'Seat booked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book seat' });
  }
});

module.exports = router;
