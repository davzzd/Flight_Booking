import React from 'react';
import { useLocation } from 'react-router-dom';

function Payment() {
  const location = useLocation();
  const seatId = new URLSearchParams(location.search).get('seatId');
  const flightId = new URLSearchParams(location.search).get('flightId');

  const confirmBooking = () => {
    // Send seat and flight booking data to backend
    console.log('Payment successful! Confirm booking.');
    // Redirect or show booking confirmation
  };

  return (
    <div className="payment-container">
      <h2>Confirm Payment</h2>
      <p>Flight ID: {flightId}</p>
      <p>Seat ID: {seatId}</p>
      <button onClick={confirmBooking}>Confirm and Pay</button>
    </div>
  );
}

export default Payment;
