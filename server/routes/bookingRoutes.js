// routes/bookingRoutes.js
const express = require('express');
const { Booking, Flight, Seat, BookingSeats } = require('../models');
const router = express.Router();

// Get all bookings for a logged-in user by username
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const bookings = await Booking.findAll({
      where: { username },
      include: [Flight, Seat],  // Include related flight and seat data
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking history for a logged-in user by username
router.get('/booking-history/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const bookings = await Booking.findAll({
      where: { username },
      include: [
        {
          model: Seat,  // Fetch Seat data through BookingSeats association
          attributes: ['seatNumber', 'seatClass', 'isBooked'],
          through: {
            model: BookingSeats,
            attributes: []  // No need to fetch extra fields from the junction table
          }
        },
        {
          model: Flight,  // Fetch Flight data
          attributes: ['id', 'flightNumber'],
        },
      ]
    });

    if (bookings.length === 0) {
      return res.status(404).json({ error: 'No bookings found for this user' });
    }
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({ error: 'Failed to fetch booking history' });
  }
});



module.exports = router;
