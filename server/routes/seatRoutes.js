// routes/seatRoutes.js
const express = require('express');
const { Seat } = require('../models');
const router = express.Router();

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
        res.json({ success: 'Seat booked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to book seat' });
    }
});

module.exports = router;

