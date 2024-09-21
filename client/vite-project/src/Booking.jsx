import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Booking() {
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [noFlightsMessage, setNoFlightsMessage] = useState('');
  const navigate = useNavigate();

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
  };

  const searchFlights = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/flights', {
        params: { 
          startPoint, 
          destination, 
          flightDate: formatDate(flightDate) 
        },
      });

      if (response.data.length === 0) {
        setNoFlightsMessage('No flights available during this time');
      } else {
        setNoFlightsMessage(''); // Clear message if flights are found
      }
      console.log(response.data); 
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights', error);
      alert('Failed to fetch flights');
    }
  };

  const bookFlight = (flightId) => {
    // Redirect to seat booking page with flightId as a query parameter
    navigate(`/seat-booking?flightId=${flightId}`);
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

      {noFlightsMessage && <p>{noFlightsMessage}</p>} {/* Display the "no flights" message */}
      
      {flights.length > 0 && (
        <div>
          <h2>Available Flights</h2>
          <ul>
            {flights.map((flight) => (
              <li key={flight.id}>
                Flight {flight.flightNumber} from {flight.startPoint} to {flight.destination} on {flight.flightDate}
                <button onClick={() => bookFlight(flight.id)}>Book</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Booking;
