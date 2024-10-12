import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookingHistory.css';
import TicketPre from './component/ticketpre';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [liveBookings, setLiveBookings] = useState([]);
  const [expiredBookings, setExpiredBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('live'); // Track active tab
  const [fullscreenTicket, setFullscreenTicket] = useState(null); // Track which ticket is in fullscreen
  const [loading, setLoading] = useState(true); // Loading state for preloader
  const [fadeOut, setFadeOut] = useState(false); // To control the fade-out effect
  const username = localStorage.getItem('username'); // Retrieve username from localStorage

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeOut(true); // Start fade-out after 3 seconds
      setTimeout(() => setLoading(false), 100); // Hide preloader after fade-out
    }, 4000); // 3 seconds timeout for loading the preloader
    const fetchBookingHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/bookings/booking-history/${username}`);
        const allBookings = response.data;
        setBookings(allBookings);

        // Separate into live and expired bookings based on current date
        const currentDate = new Date();
        const live = allBookings.filter(booking => new Date(booking.date) >= currentDate);
        const expired = allBookings.filter(booking => new Date(booking.date) < currentDate);

        setLiveBookings(live);
        setExpiredBookings(expired);
      } catch (error) {
        console.error('Error fetching booking history:', error);
      }
    };
    fetchBookingHistory();
    return () => clearTimeout(timeout);
  }, [username]);

  // Show the preloader with fade-out effect
  if (loading) {
    return <div className={`preloader-container ${fadeOut ? 'fade-out' : ''}`}><TicketPre /></div>;
  }
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
        <h2 className="bookingTitle">Booking History for {username}</h2>

        {/* Display total number of bookings */}
        <p>Total Tickets: {bookings.length}</p>

        {/* Tabs for live and expired bookings */}
        <div className="tabs">
          <button 
            className={activeTab === 'live' ? 'tab active' : 'tab'} 
            onClick={() => setActiveTab('live')}>
            Live Tickets ({liveBookings.length})
          </button>
          <button 
            className={activeTab === 'expired' ? 'tab active' : 'tab'} 
            onClick={() => setActiveTab('expired')}>
            Expired Tickets ({expiredBookings.length})
          </button>
        </div>

        {activeTab === 'live' && (
          <>
            {liveBookings.length === 0 ? (
              <p>No live bookings found.</p>
            ) : (
              liveBookings.map((booking) => (
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
          </>
        )}

        {activeTab === 'expired' && (
          <>
            {expiredBookings.length === 0 ? (
              <p>No expired bookings found.</p>
            ) : (
              expiredBookings.map((booking) => (
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
{/* 
                      </div>
                        <p className="expmes">Expired</p>
                      <div className="expiry"> */}

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
                    {/* div for expiry */}
                    </div>
                        <p className="expmes">Expired</p>
                        <div className="expiry">

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
          </>
        )}
      </div>
    </>
  );
}

export default BookingHistory;
