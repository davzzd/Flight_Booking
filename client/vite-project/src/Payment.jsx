import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const seatIds = new URLSearchParams(location.search).get('seatIds')?.split(',') || [];
  const flightId = new URLSearchParams(location.search).get('flightId');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    let countdownInterval;

    if (paymentSuccess) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(countdownInterval);
            navigate('/booking-history');
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [paymentSuccess, navigate]);

  const confirmBooking = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setPaymentSuccess(true);
    }, 3000);
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

      {!paymentSuccess ? (
        <button onClick={confirmBooking} disabled={loading}>
          {loading ? 'Processing...' : 'Confirm and Pay'}
        </button>
      ) : (
        <div>
          <p>Payment Successful!</p>
          <p>Redirecting to bookings page in {countdown}...</p>
        </div>
      )}

      {loading && <p>Loading...</p>}
    </div>
  );
}

export default Payment;

