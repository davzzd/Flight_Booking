const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io'); 
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const flightRoutes = require('./routes/flightRoutes');
const seatRoutes = require('./routes/SeatRoutes'); // Import seatRoutes function
const app = express();
const axios = require('axios');
const bookingRoutes = require('./routes/bookingRoutes');

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend address
    methods: ['GET', 'POST'],
  },
});

// Make Socket.io available in all routes
app.set('socketio', io);

app.use(cors());
app.use(express.json());

// Register routes
app.use('/api', userRoutes); 
app.use('/api', flightRoutes); 
app.use('/api/seats', seatRoutes(io)); // Pass io to seatRoutes
app.use('/api/bookings', bookingRoutes);

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('seatBooked', (seatId) => {
    io.emit('seatUpdated', seatId); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

db.sequelize.sync().then(async () => {
  server.listen(3001, async () => { // Use server.listen instead of app.listen
    console.log("Server is running on port 3001");

    // Check if there are any flights in the database
    const flightCount = await db.Flight.count();
    if (flightCount === 0) {
      console.log("No flights found, generating random flights...");
      await axios.post('http://localhost:3001/api/generateRandomFlights', { numFlights: 10 });
      console.log("Random flights created.");
    }
  });
});


/*
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io'); // Import Socket.io
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const flightRoutes = require('./routes/flightRoutes');
const seatRoutes = require('./routes/seatRoutes');
const app = express();
const axios = require('axios');
// Create the HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend address
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Register routes
app.use('/api', userRoutes); // If needed, add /api prefix for clarity
app.use('/api', flightRoutes); // '/api/flights' is already correct here
app.use('/api/seats', seatRoutes); // '/api/seats' for fetching seats



// Handle Socket.io connections
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a seat is booked, emit the seat booking event to all clients
  socket.on('seatBooked', (seatId) => {
    io.emit('seatUpdated', seatId); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


db.sequelize.sync().then(async () => {
  app.listen(3001, async () => {
    console.log("Server is running on port 3001");

    // Check if there are any flights in the database
    const flightCount = await db.Flight.count();
    if (flightCount === 0) {
      console.log("No flights found, generating random flights...");
      // Generate 10 random flights on startup
      await axios.post('http://localhost:3001/api/generateRandomFlights', { numFlights: 10 });
      console.log("Random flights created.");
    }
  });
});
*/