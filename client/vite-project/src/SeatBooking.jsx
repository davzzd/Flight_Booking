import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function SeatBooking() {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seats, setSeats] = useState([]); // Seat availability data from backend
  const navigate = useNavigate();
  const location = useLocation();
  const flightId = new URLSearchParams(location.search).get('flightId'); // Get flight ID from query

  useEffect(() => {
    // Fetch seat availability for the flight
    const fetchSeats = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/seats/${flightId}`);
        setSeats(response.data);
      } catch (error) {
        console.error('Error fetching seat data', error);
      }
    };

    fetchSeats();
  }, [flightId]);

  const handleSeatSelection = (seat) => {
    setSelectedSeat(seat);
  };

  const proceedToPayment = () => {
    if (selectedSeat) {
      navigate(`/payment?seatId=${selectedSeat.id}&flightId=${flightId}`);
    } else {
      alert('Please select a seat before proceeding.');
    }
  };

  return (
    <div className="seat-booking-container">
      <h2>Select a Seat</h2>
      <div className="seats-grid">
        {seats.map((seat) => (
          <button
            key={seat.id}
            className={`seat ${seat.isAvailable ? 'available' : 'unavailable'}`}
            onClick={() => seat.isAvailable && handleSeatSelection(seat)}
            disabled={!seat.isAvailable}
          >
            {seat.seatNumber} ({seat.classType})
          </button>
        ))}
      </div>
      <button onClick={proceedToPayment} disabled={!selectedSeat}>Next</button>
    </div>
  );
}

export default SeatBooking;
