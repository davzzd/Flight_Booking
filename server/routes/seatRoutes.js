const express = require('express');
const { Seat } = require('../models');
const router = express.Router();

module.exports = (io) => {
  // Fetch seats for a flight
  router.get('/:flightId', async (req, res) => {
    const { flightId } = req.params;
    console.log(`Fetching seats for flight: ${flightId}`);

    try {
      const seats = await Seat.findAll({ where: { flightId } });

      if (seats.length === 0) {
        return res.status(404).json({ error: 'No seats found for this flight' });
      }

      res.json(seats);
    } catch (error) {
      console.error('Error fetching seats:', error);
      res.status(500).json({ error: 'Failed to fetch seats' });
    }
  });

  // Book multiple seats
  router.post('/book', async (req, res) => {
    const { seatIds } = req.body; // Expect an array of seatIds
    console.log('Seat IDs from request body:', seatIds);

    try {
      const seats = await Seat.findAll({ where: { id: seatIds } }); // Find seats by their IDs

      // Check if any seat is already booked
      const alreadyBookedSeats = seats.filter(seat => seat.isBooked);
      if (alreadyBookedSeats.length > 0) {
        return res.status(400).json({
          error: 'Some seats are already booked',
          bookedSeats: alreadyBookedSeats.map(seat => seat.id),
        });
      }

      // Mark all selected seats as booked
      for (let seat of seats) {
        seat.isBooked = true;
        await seat.save();
      }
      console.log('Seats booked successfully:', seatIds);

      // Emit the updated seat data for real-time updates
      const updatedSeats = await Seat.findAll({ where: { flightId: seats[0].flightId } });
      const ioInstance = req.app.get('socketio'); // Get Socket.io instance from the app
      if (ioInstance) {
        ioInstance.emit('seatUpdate', updatedSeats); // Broadcast real-time seat updates
      } else {
        console.error('Socket.io instance is not available.');
      }

      res.json({ success: 'Seats booked successfully', seatIds });
    } catch (error) {
      console.error('Error booking seats:', error);
      res.status(500).json({ error: 'Failed to book seats', details: error.message });
    }
  });

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
