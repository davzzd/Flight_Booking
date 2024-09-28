// routes/flightRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const { Flight, Seat } = require('../models');
const { Op } = require('sequelize'); // Import Sequelize operators for flexible queries
const randomCountries = [
    "USA", "Canada", "Mexico", "Brazil", "UK", "Germany", "France", "India", "China", "Japan", "Australia"
];

const getRandomDate = () => {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 30); // Generate flights within the next 30 days
    today.setDate(today.getDate() + randomDays);
    return today.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
};

// Fetch all distinct start points for recommendations
router.get('/flight-startpoints', async (req, res) => {
    try {
      const startPoints = await Flight.findAll({
        attributes: [[db.Sequelize.fn('DISTINCT', db.Sequelize.col('startPoint')), 'startPoint']],
      });
      res.json(startPoints.map(flight => flight.startPoint)); // Return only distinct start points
    } catch (error) {
      console.error('Error fetching start points:', error);
      res.status(500).json({ message: 'Failed to fetch start points' });
    }
  });
  
  // Fetch all distinct destinations for recommendations
  router.get('/flight-destinations', async (req, res) => {
    try {
      const destinations = await Flight.findAll({
        attributes: [[db.Sequelize.fn('DISTINCT', db.Sequelize.col('destination')), 'destination']],
      });
      res.json(destinations.map(flight => flight.destination)); // Return only distinct destinations
    } catch (error) {
      console.error('Error fetching destinations:', error);
      res.status(500).json({ message: 'Failed to fetch destinations' });
    }
  });
  
  // Get flights based on flexible search criteria
  router.get('/flights', async (req, res) => {
    const { startPoint, destination, flightDate } = req.query;
  
    try {
      const whereClause = {}; // Empty clause to be populated based on input
  
      if (startPoint) {
        whereClause.startPoint = { [Op.like]: `%${startPoint}%` }; // Search by startPoint
      }
      if (destination) {
        whereClause.destination = { [Op.like]: `%${destination}%` }; // Search by destination
      }
      if (flightDate) {
        whereClause.flightDate = flightDate; // Exact match for date
      }
  
      const flights = await Flight.findAll({
        where: whereClause,
      });
  
      if (flights.length === 0) {
        return res.status(404).json({ message: 'No flights found' });
      }
  
      res.json(flights);
    } catch (error) {
      console.error('Error fetching flights:', error);
      res.status(500).json({ message: 'Error fetching flights' });
    }
  });

/*
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
*/

// Generate a random flight and populate the database
router.post('/generateRandomFlights', async (req, res) => {
    const { numFlights } = req.body;  // How many random flights to generate
    try {
        for (let i = 0; i < numFlights; i++) {
            const startPoint = randomCountries[Math.floor(Math.random() * randomCountries.length)];
            let destination;
            do {
                destination = randomCountries[Math.floor(Math.random() * randomCountries.length)];
            } while (destination === startPoint);  // Ensure start and destination are not the same
            
            const flightDate = getRandomDate();
            const flightNumber = `FL-${Math.floor(Math.random() * 9000) + 1000}`; // Random flight number FL-XXXX
            
            // Create a new flight
            const newFlight = await Flight.create({
                flightNumber,
                startPoint,
                destination,
                flightDate
            });
  
            // Generate seats (example: 50 economy, 20 business, 10 first class)
            const seats = [];
            for (let i = 1; i <= 50; i++) {
                seats.push({ seatNumber: `E${i}`, seatClass: 'economy', flightId: newFlight.id });
            }
            for (let i = 1; i <= 20; i++) {
                seats.push({ seatNumber: `B${i}`, seatClass: 'business', flightId: newFlight.id });
            }
            for (let i = 1; i <= 10; i++) {
                seats.push({ seatNumber: `F${i}`, seatClass: 'first', flightId: newFlight.id });
            }
  
            await Seat.bulkCreate(seats); // Bulk create all seats
        }

        res.status(201).json({ message: `${numFlights} random flights created successfully` });
    } catch (error) {
        console.error("Error generating random flights:", error);
        res.status(500).json({ message: "Error generating random flights" });
    }
});

module.exports = router;
