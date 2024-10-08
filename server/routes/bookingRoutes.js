// routes/bookingRoutes.js
const express = require('express');
const { Booking, Flight, Seat, BookingSeats,User } = require('../models');
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
        { model: Seat, as: 'Seats' },
        { model: Flight, as: 'Flight' },
        { model: User, as: 'User' },  // Include user details
      ],
    });

    const bookingHistory = bookings.map((booking) => ({
      id: booking.id,
      flightId: booking.Flight.flightNumber,
      gateNumber: booking.gateNumber,
      seats: booking.Seats.map(seat => seat.seatNumber),
      flightFrom: booking.Flight.startPoint,
      flightTo: booking.Flight.destination,
      date: booking.Flight.flightDate,  // Fix the date field
      fullName: `${booking.User.firstName} ${booking.User.lastName}`,  // Concatenate first and last names
      boardingTime: generateRandomBoardingTime(),
    }));

    res.json(bookingHistory);
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({ error: 'Failed to fetch booking history' });
  }
});


function generateRandomBoardingTime() {
  const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}



module.exports = router;
