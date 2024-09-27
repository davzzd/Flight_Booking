const express = require('express');
const { Seat } = require('../models');
const router = express.Router();

// Define a function to take io and return a router
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

  router.post('/book', async (req, res) => {
    const { seatId } = req.body; // Make sure seatId is being passed correctly
    console.log('Seat ID from request body:', seatId);

    try {
      const seat = await Seat.findByPk(seatId); // Find the seat by its ID
      if (!seat) {
        return res.status(404).json({ error: 'Seat not found' });
      }
      
      if (seat.isBooked) {
        return res.status(400).json({ error: 'Seat already booked' });
      }
  
      // Mark the seat as booked
      seat.isBooked = true;
      await seat.save();
      console.log('Seat booked successfully:', seatId);
  
      // Emit the updated seat data for real-time updates
      const updatedSeats = await Seat.findAll({ where: { flightId: seat.flightId } });
      const ioInstance = req.app.get('socketio'); // Get Socket.io instance from the app
      if (ioInstance) {
        ioInstance.emit('seatUpdate', updatedSeats); // Broadcast real-time seat updates
      } else {
        console.error('Socket.io instance is not available.');
      }
  
      res.json({ success: 'Seat booked successfully' });
    } catch (error) {
      console.error('Error booking seat:', error);
      res.status(500).json({ error: 'Failed to book seat', details: error.message });
    }
  });
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
  return router;
};


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
