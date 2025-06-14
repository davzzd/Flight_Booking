import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookingHistory.css';
import TicketPre from './component/ticketpre';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [liveBookings, setLiveBookings] = useState([]);
  const [expiredBookings, setExpiredBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('live');
  const [fullscreenTicket, setFullscreenTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 100);
    }, 4000);
    const fetchBookingHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/bookings/booking-history/${username}`);
        const allBookings = response.data;
        setBookings(allBookings);

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

  if (loading) {
    return <div className={`preloader-container ${fadeOut ? 'fade-out' : ''}`}><TicketPre /></div>;
  }

  const handleTicketClick = (ticket) => {
    setFullscreenTicket(ticket);
  };

  const handleCloseFullscreen = () => {
    setFullscreenTicket(null);
  };

  return (
    <>
      {fullscreenTicket && (
        <div
          className="fullscreen-overlay"
          onClick={handleCloseFullscreen}
        ></div>
      )}

      <div className={`booking-history ${fullscreenTicket ? 'blur-background' : ''}`}>
        <h2 className="bookingTitle">Booking History for {username}</h2>

        <p>Total Tickets: {bookings.length}</p>

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
                  onClick={() => handleTicketClick(booking)}
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

                      <div className="barcode"></div>
                    </div>

                    {fullscreenTicket && fullscreenTicket.id === booking.id && (
                      <span
                        className="ticket-close-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseFullscreen();
                        }}
                      >
                        &times;
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
                  onClick={() => handleTicketClick(booking)}
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

                      <div className="barcode"></div>
                    </div>
                    </div>
                        <p className="expmes">Expired</p>
                        <div className="expiry">

                    {fullscreenTicket && fullscreenTicket.id === booking.id && (
                      <span
                        className="ticket-close-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseFullscreen();
                        }}
                      >
                        &times;
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
