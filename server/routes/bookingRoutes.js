// routes/bookingRoutes.js
const express = require('express');
const { Booking, Flight, Seat } = require('../models');
const router = express.Router();

// Get all bookings for a logged-in user by username (previously userId)
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;  // Change from userId to username
  try {
    const bookings = await Booking.findAll({
      where: { username },  // Use username instead of userId
      include: [Flight, Seat],  // Include related flight and seat data
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.get('/booking-history/:username', async (req, res) => {
  const { username } = req.params;  // Change from userId to username
  try {
    const bookings = await Booking.findAll({ where: { username } });  // Use username
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
