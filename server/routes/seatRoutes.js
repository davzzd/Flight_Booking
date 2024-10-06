// routes/seatRoutes.js
const express = require('express');
const { Seat, Booking, BookingSeats, sequelize } = require('../models');
const router = express.Router();

module.exports = (io) => {
  // Fetch seats by flightId
  router.get('/:flightId', async (req, res) => {
    const { flightId } = req.params;
    try {
      const seats = await Seat.findAll({ where: { flightId } });
      if (!seats || seats.length === 0) {
        return res.status(404).json({ error: 'No seats found for this flight' });
      }
  
      res.json(seats);
    } catch (error) {
      console.error('Error fetching seats:', error);
      res.status(500).json({ error: 'Failed to fetch seats' });
    }
  });

  // Book seats and handle username correctly
  router.post('/book', async (req, res) => {
    const { seatIds, username, flightId } = req.body;
  
    try {
      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }
  
      // Normalize the username
      const normalizedUsername = username.toLowerCase();
  
      // Find the seats to book
      const seats = await Seat.findAll({ where: { id: seatIds } });
  
      // Check if any seat is already booked
      const alreadyBookedSeats = seats.filter(seat => seat.isBooked);
      if (alreadyBookedSeats.length > 0) {
        return res.status(400).json({
          error: 'Some seats are already booked',
          bookedSeats: alreadyBookedSeats.map(seat => seat.id),
        });
      }
  
      // Start a transaction to ensure all or nothing is saved
      const t = await sequelize.transaction();
  
      try {
        // Book the selected seats and create bookings
        const booking = await Booking.create({
          username: normalizedUsername,
          flightId,
          gateNumber: generateRandomGateNumber(), // Random gate number
        }, { transaction: t });
  
        // Create entries in BookingSeats table for each seat
        for (let seat of seats) {
          seat.isBooked = true;
          await seat.save({ transaction: t });
  
          // Insert into BookingSeats
          await BookingSeats.create({
            bookingId: booking.id,  // Reference booking ID
            seatId: seat.id,        // Reference seat ID
          }, { transaction: t });
        }
  
        // Commit the transaction
        await t.commit();
  
        // Emit real-time seat updates to all connected clients
        const updatedSeats = await Seat.findAll({ where: { flightId } });
        io.emit('seatUpdate', updatedSeats);
  
        res.json({ success: 'Seats booked successfully', seatIds });
      } catch (err) {
        // Rollback the transaction in case of error
        await t.rollback();
        throw err;
      }
  
    } catch (error) {
      console.error('Error booking seats:', error.message);
      res.status(500).json({ error: 'Failed to book seats', details: error.message });
    }
  });
  
  // Helper function to generate random gate number
  function generateRandomGateNumber() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26)) + (Math.floor(Math.random() * 90) + 10);
  }
  

  return router;
};

/*
 // Book a seat and notify all clients
router.post('/book', async (req, res) => {
    const { seatId, flightId } = req.body; // Ensure flightId is passed for real-time updates
    const io = req.app.get('socketio'); // Access Socket.io from app
  
    try {
      const seat = await Seat.findByPk(seatId);
      if (!seat) {
        return res.status(404).json({ error: 'Seat not found' });
      }
      // If seat is already booked, return error
      if (seat.isBooked) {
        return res.status(400).json({ error: 'Seat already booked' });
      }
  
      // Mark the seat as booked
      seat.isBooked = true;
      await seat.save();
  
      // Fetch updated seats for the flight
      const updatedSeats = await Seat.findAll({ where: { flightId } });
  
      // Emit real-time update to all connected clients
      io.emit('seatUpdate', updatedSeats);
  

      res.json({ success: 'Seat booked successfully' });
    } catch (error) {
      console.error('Error booking seat:', error);
      res.status(500).json({ error: 'Failed to book seat' });
    }
  });
*/
/*
// routes/seatRoutes.js
const express = require('express');
const { Seat } = require('../models');
const router = express.Router();
const { Server } = require('socket.io');

// Fetch seats for a flight
router.get('/:flightId', async (req, res) => {
    const { flightId } = req.params;
    console.log(`Fetching seats for flight: ${flightId}`); // Log flightId to confirm it is passed

    try {
        const seats = await Seat.findAll({
            where: { flightId }
        });

        if (seats.length === 0) {
            return res.status(404).json({ error: 'No seats found for this flight' });
        }

        res.json(seats);
    } catch (error) {
        console.error('Error fetching seats:', error);
        res.status(500).json({ error: 'Failed to fetch seats' });
    }
});

// Book a seat (same as before)
router.post('/book', async (req, res) => {
    const { seatId } = req.body;
    try {
        const seat = await Seat.findByPk(seatId);
        if (seat.isBooked) {
            return res.status(400).json({ error: 'Seat already booked' });
        }
        seat.isBooked = true;
        await seat.save();

        // Fetch updated seats and emit seatUpdate event
      const updatedSeats = await Seat.findAll({ where: { flightId } });
      io.emit('seatUpdate', updatedSeats);  // Emit real-time update

        res.json({ success: 'Seat booked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to book seat' });
    }
});

module.exports = router;
*/
