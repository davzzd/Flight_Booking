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

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    console.log("Stored Username:", storedUsername);
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      alert('User is not logged in. Please log in to continue.');
      navigate('/login');
    }

    const fetchSeats = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/seats/${flightId}`);
        setSeats(response.data);
      } catch (error) {
        console.error('Error fetching seat data', error);
      }
    };

    fetchSeats();

    socket.on('seatUpdate', (updatedSeats) => {
      setSeats(updatedSeats);
    });

    return () => {
      socket.off('seatUpdate');
    };
  }, [flightId, navigate]);

  const handleSeatSelect = (seat) => {
    if (seat.isBooked) return;
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const handleNext = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat before proceeding.');
      return;
    }
    console.log("Username being passed:", username);
    try {
      await axios.post('http://localhost:3001/api/seats/book', {
        seatIds: selectedSeats,
        flightId: flightId,
        username: username,
      });
      navigate(`/payment?seatIds=${selectedSeats.join(',')}&flightId=${flightId}`);
    } catch (error) {
      console.error('Error booking seats:', error);
      alert('Failed to book seats. Please try again.');
    }
  };

  const groupedSeats = seats.reduce((groups, seat) => {
    const seatClass = seat.seatClass;
    groups[seatClass] = groups[seatClass] || [];
    groups[seatClass].push(seat);
    return groups;
  }, {});

  return (
    <div className="seat-booking-container">
      <h1 className='heading'>Select a seat</h1>

      {Object.keys(groupedSeats).map(classType => (
        <div key={classType} className={`seat-category ${classType}`}>
          <h2>{classType.charAt(0).toUpperCase() + classType.slice(1)} Class</h2>
          <div className="seat-map">
            {groupedSeats[classType].length > 0 ? (
              groupedSeats[classType].map((seat) => (
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
              <p>No available seats in this class.</p>
            )}
          </div>
        </div>
      ))}

      <button className="next-button" onClick={handleNext}>
        Next
      </button>
    </div>
  );
}

export default SeatBooking;



