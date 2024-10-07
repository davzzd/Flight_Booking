import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookingHistory.css';


function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const username = localStorage.getItem('username'); // Retrieve username from localStorage
  const [fullscreenTicket, setFullscreenTicket] = useState(null); // Track which ticket is in fullscreen

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

  // Function to open a ticket in fullscreen
  const handleTicketClick = (ticket) => {
    setFullscreenTicket(ticket);
  };

  // Function to close the fullscreen ticket
  const handleCloseFullscreen = () => {
    setFullscreenTicket(null);
  };

  return (
    <>
      {fullscreenTicket && (
        <div
          className="fullscreen-overlay"
          onClick={handleCloseFullscreen} // Close the ticket when clicking outside it
        ></div>
      )}

      <div className={`booking-history ${fullscreenTicket ? 'blur-background' : ''}`}>
        <h2 className="bookingTitle">Your Booking History</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className={`ticket ${fullscreenTicket && fullscreenTicket.id === booking.id ? 'ticket-fullscreen' : ''}`}
              onClick={() => handleTicketClick(booking)} // Click to enlarge the ticket
            >
              <div className="ticket-section">
                <div className="ticket-left">
                  <div className="flex-row">
                    <p className="label">Name of passenger:</p>
                    <p>{booking.fullName}</p>
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
                    <p className="label2">Boarding Time:</p>
                    <p className="tag2">{booking.boardingTime || 'N/A'}</p>
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
                    <p className="label2">Gate:</p>
                    <p className="tag2">{booking.gateNumber || 'N/A'}</p>
                  </div>

                  <div className="barcode"></div> {/* Barcode Placeholder */}
                </div>

                {fullscreenTicket && fullscreenTicket.id === booking.id && (
                  <span
                    className="ticket-close-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Stop click from closing the ticket
                      handleCloseFullscreen();
                    }}
                  >
                    &times; {/* Close button */}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
  
}

export default BookingHistory;
