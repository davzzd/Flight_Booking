import React, { useState } from 'react';
import axios from 'axios';

function Booking() {
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [flights, setFlights] = useState([]);

  const searchFlights = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/flights', {
        params: { startPoint, destination, flightDate },
      });
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights', error);
      alert('Failed to fetch flights');
    }
  };

  return (
    <div className="booking-container">
      <h1>Search for Flights</h1>
      <div>
        <input
          type="text"
          placeholder="Start Point"
          value={startPoint}
          onChange={(e) => setStartPoint(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <input
          type="date"
          value={flightDate}
          onChange={(e) => setFlightDate(e.target.value)}
        />
        <button onClick={searchFlights}>Search Flights</button>
      </div>

      {flights.length > 0 && (
        <div>
          <h2>Available Flights</h2>
          <ul>
            {flights.map((flight) => (
              <li key={flight.id}>
                Flight {flight.flightNumber} from {flight.startPoint} to {flight.destination} on {flight.flightDate}
                <button>Book</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Booking;