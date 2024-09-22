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

    // Listen for real-time seat updates from Socket.io
    socket.on('seatUpdate', (updatedSeats) => {
        console.log('Real-time seat update:', updatedSeats);
      setSeats(updatedSeats); // Update seat state with real-time data
    });

    return () => {
      socket.off('seatUpdate'); // Clean up on component unmount
    };
  }, [flightId]);

  const handleSeatSelect = (seat) => {
    if (!seat.isBooked) {
      setSelectedSeat(seat);
    }
  };

 // Merged handleBookSeat and handleNext function
 const handleNext = async () => {
    if (!selectedSeat) {
      alert('Please select a seat before proceeding.');
      return;
    }

    try {
      // Book the selected seat
      await axios.post('http://localhost:3001/api/seats/book', {
        seatId: selectedSeat.id,
        flightId: flightId, // Ensure flightId is sent
      });

      // Navigate to the payment page after booking the seat
      navigate(`/payment?seatId=${selectedSeat.id}`);
    } catch (error) {
      console.error('Error booking seat:', error);
      alert('Failed to book seat. Please try again.');
    }
  };

  return (
    <div className="seat-booking-container">
      <h1>Select a seat</h1>
      <div className="seat-map">
        {seats.length > 0 ? (
          seats.map((seat) => (
            <button
              key={seat.id}
              className={`seat ${seat.isBooked ? 'booked' : ''} ${selectedSeat?.id === seat.id ? 'selected' : ''}`}
              onClick={() => handleSeatSelect(seat)}
              disabled={seat.isBooked}
            >
              {seat.seatNumber} ({seat.seatClass})
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


/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client'; // Import Socket.io client
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SeatBooking.css';

const socket = io('http://localhost:3001'); // Connect to Socket.io backend

function SeatBooking() {
    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [searchParams] = useSearchParams();
    const flightId = searchParams.get('flightId'); // Extract flightId from URL
    const navigate = useNavigate();

    console.log(flightId); // Ensure flightId is being passed correctly

    useEffect(() => {
        const fetchSeats = async () => {
            if (!flightId) {
                console.error('No flightId found in URL');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3001/api/seats/${flightId}`);
                console.log('Seats fetched:', response.data); // Log the seat data
                setSeats(response.data);
            } catch (error) {
                console.error('Error fetching seat data', error);
            }
        };

        fetchSeats();

    // Listen for seat updates from Socket.io
    socket.on('seatUpdate', (updatedSeats) => {
        console.log('Real-time seat update:', updatedSeats);
        setSeats(updatedSeats);  // Update seats with real-time data
      });
    // Cleanup when the component unmounts
    return () => {
      socket.off('seatUpdate');
    };
  }, [flightId]);

    const handleSeatSelect = (seat) => {
        if (!seat.isBooked) {
            setSelectedSeat(seat);
        }
    };

    const handleNext = () => {
        if (selectedSeat) {
            navigate(`/payment?seatId=${selectedSeat.id}`);
        } else {
            alert('Please select a seat before proceeding.');
        }
    };

    return (
        <div className="seat-booking-container">
            <h1>Select a seat</h1>
            <div className="seat-map">
                {seats.length > 0 ? (
                    seats.map((seat) => (
                        <button
                            key={seat.id}
                            className={`seat ${seat.isBooked ? 'booked' : ''} ${selectedSeat?.id === seat.id ? 'selected' : ''}`}
                            onClick={() => handleSeatSelect(seat)}
                            disabled={seat.isBooked}
                        >
                            {seat.seatNumber} ({seat.seatClass})
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