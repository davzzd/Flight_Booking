import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Booking.css';  // Import the new CSS file
import '@fortawesome/fontawesome-free/css/all.min.css';

function Booking() {
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [startPointSuggestions, setStartPointSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [noFlightsMessage, setNoFlightsMessage] = useState('');
  const navigate = useNavigate();

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
  };

  // Fetch start point suggestions
  useEffect(() => {
    const fetchStartPoints = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/flight-startpoints');
        setStartPointSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching start point suggestions', error);
      }
    };
    fetchStartPoints();
  }, []);

  // Fetch destination suggestions
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/flight-destinations');
        setDestinationSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching destination suggestions', error);
      }
    };
    fetchDestinations();
  }, []);

  const searchFlights = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/flights', {
        params: { 
          startPoint, 
          destination, 
          flightDate: flightDate ? formatDate(flightDate) : '' 
        },
      });

      if (response.data.length === 0) {
        setNoFlightsMessage('No flights available matching the criteria');
      } else {
        setNoFlightsMessage('');
      }

      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights', error);
      alert('Failed to fetch flights');
    }
  };

  const bookFlight = (flightId) => {
    navigate(`/seat-booking?flightId=${flightId}`);
  };

  return (
    <div className="booking-container">
      <h1>Search for Flights</h1>
      <div className="search-bar">
        <div className="input-container">
          <input
            type="text"
            placeholder="Start Point"
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
            list="startPointSuggestions"
            className="dropdown-input"
          />
          <i className="fas fa-plane"></i> {/* Flight icon */}
          <datalist id="startPointSuggestions">
            {startPointSuggestions.map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            list="destinationSuggestions"
            className="dropdown-input"
          />
          <i className="fas fa-plane"></i> {/* Flight icon */}
          <datalist id="destinationSuggestions">
            {destinationSuggestions.map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
        </div>

        <div className="input-container">
          <input
            type="date"
            value={flightDate}
            onChange={(e) => setFlightDate(e.target.value)}
          />
        </div>

        <button className='search-button' onClick={searchFlights}>Search Flights</button>
      </div>

      {noFlightsMessage && <p>{noFlightsMessage}</p>}

      {flights.length > 0 && (
        <div>
          <h2>Available Flights</h2>
          <ul>
            {flights.map((flight) => (
              <li key={flight.id}>
                Flight {flight.flightNumber} from {flight.startPoint} to {flight.destination} on {flight.flightDate}
                <button className="book-button" onClick={() => bookFlight(flight.id)}>Book</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Booking;