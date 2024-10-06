import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const seatIds = new URLSearchParams(location.search).get('seatIds')?.split(',') || []; // Get multiple seat IDs from the URL
  const flightId = new URLSearchParams(location.search).get('flightId');
  const [loading, setLoading] = useState(false); // State to manage loading
  const [paymentSuccess, setPaymentSuccess] = useState(false); // State to manage payment success message
  const [countdown, setCountdown] = useState(7); // Countdown timer state

  useEffect(() => {
    let countdownInterval;

    if (paymentSuccess) {
      // Start countdown when payment is successful
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(countdownInterval);
            navigate('/booking-history'); // Redirect to Booking History page
            return 0; // Stop countdown
          }
          return prevCountdown - 1; // Decrease countdown
        });
      }, 1000); // Update countdown every second
    }

    return () => clearInterval(countdownInterval); // Cleanup interval on unmount
  }, [paymentSuccess, navigate]);

  const confirmBooking = () => {
    // Set loading to true
    setLoading(true);
    
    // Simulate a delay for payment processing (3 seconds)
    setTimeout(() => {
      // After processing, show "Payment Successful" message
      setLoading(false); // Stop loading
      setPaymentSuccess(true); // Show payment success message
    }, 3000); // Simulate a 3-second delay for payment processing
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

      {/* Button and loading state */}
      {!paymentSuccess ? (
        <button onClick={confirmBooking} disabled={loading}>
          {loading ? 'Processing...' : 'Confirm and Pay'}
        </button>
      ) : (
        <div>
          <p>Payment Successful!</p>  {/* Show this message after payment success */}
          <p>Redirecting to bookings page in {countdown}...</p> {/* Countdown message */}
        </div>
      )}

      {loading && <p>Loading...</p>} {/* Show loading message if loading */}
    </div>
  );
}

export default Payment;

