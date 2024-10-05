import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SeatBooking.css';

const socket = io('http://localhost:3001');
window.socket = socket;

function SeatBooking() {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [username, setUsername] = useState(null);
  const [searchParams] = useSearchParams();
  const flightId = searchParams.get('flightId');
  const navigate = useNavigate();

  // Fetch the username from localStorage and set it
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
  console.log("Stored Username:", storedUsername);  // Add this line for debugging
  if (storedUsername) {
    setUsername(storedUsername);
  } else {
    alert('User is not logged in. Please log in to continue.');
    navigate('/login');
  }

    // Fetch available seats for the flight
    const fetchSeats = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/seats/${flightId}`);
        setSeats(response.data);
      } catch (error) {
        console.error('Error fetching seat data', error);
      }
    };

    fetchSeats();

    // Listen for real-time seat updates via Socket.io
    socket.on('seatUpdate', (updatedSeats) => {
      setSeats(updatedSeats);
    });

    return () => {
      socket.off('seatUpdate');
    };
  }, [flightId, navigate]);

  // Handle seat selection
  const handleSeatSelect = (seat) => {
    if (seat.isBooked) return;
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  // Proceed to booking the selected seats
  const handleNext = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat before proceeding.');
      return;
    }
    console.log("Username being passed:", username);  // Add this line for debugging
    try {
      await axios.post('http://localhost:3001/api/seats/book', {
        seatIds: selectedSeats,
        flightId: flightId,
        username: username,  // Ensure the username is passed here
      });
      navigate(`/payment?seatIds=${selectedSeats.join(',')}&flightId=${flightId}`);
    } catch (error) {
      console.error('Error booking seats:', error);
      alert('Failed to book seats. Please try again.');
    }
  };

  return (
    <div className="seat-booking-container">
      <h1 className='heading'>Select a seat</h1>
      <div className="seat-map">
        {seats.length > 0 ? (
          seats.map((seat) => (
            <button
              key={seat.id}
              className={`seat ${seat.isBooked ? 'booked' : ''} ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
              onClick={() => handleSeatSelect(seat)}
              disabled={seat.isBooked}
            >
              {seat.seatNumber}  {/* Make sure you're using seat.seatNumber */}
            </button>
          ))
        ) : (
          <p>Loading seats...</p>
        )}
      </div>

      <button className="next-button" onClick={handleNext}>
        Next
      </button>
    </div>
  );
}

export default SeatBooking;


/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client'; // Import Socket.io client
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SeatBooking.css';

// Initialize socket connection (make sure the URL matches your backend)
const socket = io('http://localhost:3001');

// Attach socket to the window object for debugging
window.socket = socket;

function SeatBooking() {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]); // Store multiple selected seats
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

    // Listen for real-time seat updates from Socket.io
    socket.on('seatUpdate', (updatedSeats) => {
      console.log('Real-time seat update:', updatedSeats);
      setSeats(updatedSeats); // Update seat state with real-time data
    });

    return () => {
      socket.off('seatUpdate'); // Clean up on component unmount
    };
  }, [flightId]);

  // Handle seat selection and deselection
  const handleSeatSelect = (seat) => {
    if (seat.isBooked) return; // Ignore if the seat is booked

    if (selectedSeats.includes(seat.id)) {
      // Deselect the seat
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      // Select the seat
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  // Handle moving to payment after booking seats
  const handleNext = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat before proceeding.');
      return;
    }

    try {
      // Book the selected seats
      await axios.post('http://localhost:3001/api/seats/book', {
        seatIds: selectedSeats,
        flightId: flightId, // Ensure flightId is sent
      });

      // Navigate to the payment page after booking the seats
      navigate(`/payment?seatIds=${selectedSeats.join(',')}&flightId=${flightId}`);
    } catch (error) {
      console.error('Error booking seats:', error);
      alert('Failed to book seats. Please try again.');
    }
  };

  return (
    <div className="seat-booking-container">
      <h1 className='heading'>Select a seat</h1>
      <div className="seat-map">
        {seats.length > 0 ? (
          seats.map((seat) => (
            <button
              key={seat.id}
              className={`seat ${seat.isBooked ? 'booked' : ''} ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
              onClick={() => handleSeatSelect(seat)}
              disabled={seat.isBooked}
            >
              {seat.seatNumber}
            </button>
          ))
        ) : (
          <p>No seats available</p>
        )}
      </div>
      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default SeatBooking;
*/
