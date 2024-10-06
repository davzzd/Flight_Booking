import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookingHistory.css';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const username = localStorage.getItem('username'); // Retrieve username from localStorage

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/bookings/booking-history/${username}`);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching booking history:', error);
      }
    };
    fetchBookingHistory();
  }, [username]);

  return (
    <div className="booking-history">
      <h2>Your Booking History</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="ticket">
            <div className="ticket-details">
              <p>Flight ID: {booking.flightId}</p>
              <p>Seats: {booking.Seats.map(seat => seat.seatNumber).join(', ') || 'N/A'}</p> {/* Display seat numbers */}
              <p>Gate: {booking.gateNumber || 'N/A'}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
  
}

export default BookingHistory;
