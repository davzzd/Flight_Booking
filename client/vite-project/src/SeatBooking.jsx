import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SeatBooking.css';

function SeatBooking() {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [searchParams] = useSearchParams();
  const flightId = searchParams.get('flightId');
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleSeatSelection = (seatId) => {
    setSelectedSeat(seatId);
  };

  const handleNext = async () => {
    if (!selectedSeat) {
      alert('Please select a seat');
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/seats/book', { seatId: selectedSeat });
      navigate('/payment'); // Navigate to payment page
    } catch (error) {
      alert('Error booking seat');
    }
  };

  return (
    <div>
      <h1>Select a Seat</h1>
      <div className="seat-grid">
        {seats.map((seat) => (
          <button
            key={seat.id}
            className={`seat ${seat.isBooked ? 'booked' : ''}`}
            disabled={seat.isBooked}
            onClick={() => handleSeatSelection(seat.id)}
          >
            {seat.seatNumber} ({seat.seatClass})
          </button>
        ))}
      </div>
      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default SeatBooking;
