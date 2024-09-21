const express = require('express');
const cors = require('cors');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const flightRoutes = require('./routes/flightRoutes');
const seatRoutes = require('./routes/seatRoutes');
const app = express();

app.use(cors());
app.use(express.json());

// Register routes
app.use('/api', userRoutes); // If needed, add /api prefix for clarity
app.use('/api', flightRoutes); // '/api/flights' is already correct here
app.use('/api', seatRoutes); // '/api/seats' for fetching seats

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server is running on port 3001");
    });
});
