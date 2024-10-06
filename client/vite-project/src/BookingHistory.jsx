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
        <div className="ticket-section">
          <div className="ticket-left">
            <div className="flex-row">
              <p className="label">Name of passenger:</p>
              <p>{username}</p>
            </div>

            <div className="flex-row">
              <p className="label">From:</p>
              <p>{booking.flightFrom}</p>
            </div>

            <div className="flex-row">
              <p className="label">To:</p>
              <p>{booking.flightTo}</p>
            </div>

            <div className="flex-row">
              <p className="label">Date:</p>
              <p>{new Date(booking.date).toLocaleDateString()}</p>
            </div>

            <div className="flex-row">
              <p className="label">Boarding Time:</p>
              <p>{booking.boardingTime || 'N/A'}</p>
            </div>
          </div>

          <div className="ticket-right">
            <div className="flex-row">
              <p className="label">Flight No:</p>
              <p>{booking.flightId}</p>
            </div>

            <div className="flex-row">
              <p className="label">Seats:</p>
              <p>{booking.seats.join(', ') || 'N/A'}</p>
            </div>

            <div className="flex-row">
              <p className="label">Gate:</p>
              <p>{booking.gateNumber || 'N/A'}</p>
            </div>

            <div className="barcode"></div> {/* Barcode Placeholder */}
          </div>
        </div>
      </div>
    ))
  )}
</div>


  );
}

export default BookingHistory;
