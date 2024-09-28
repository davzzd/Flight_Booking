import React from 'react';
import { useLocation } from 'react-router-dom';
import './Payment.css';

function Payment() {
  const location = useLocation();
  const seatIds = new URLSearchParams(location.search).get('seatIds')?.split(',') || []; // Get multiple seat IDs from the URL
  const flightId = new URLSearchParams(location.search).get('flightId');

  const confirmBooking = () => {
    // Send seat and flight booking data to backend for confirmation
    console.log('Payment successful! Confirm booking for seats:', seatIds);

    // Here, you would likely make a request to your backend to confirm the booking:
    // axios.post('http://localhost:3001/api/payment', { seatIds, flightId })
    // .then(response => {
    //   // Handle success (e.g., redirect or show confirmation message)
    // })
    // .catch(error => {
    //   // Handle error
    // });
  };

  return (
    <div className="payment-container">
      <h2>Confirm Payment</h2>
      <p>Flight ID: {flightId}</p>
      <p>Seats Selected:</p>
      <ul className='ul'>
        {seatIds.map((seatId) => (
          <li key={seatId}>Seat ID: {seatId}</li>
        ))}
      </ul>
      <button onClick={confirmBooking}>Confirm and Pay</button>
    </div>
  );
}

export default Payment;
