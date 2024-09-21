import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SeatBooking.css';

function SeatBooking() {
    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [searchParams] = useSearchParams();
    const flightId = searchParams.get('flightId'); // Extract flightId from URL
    const navigate = useNavigate();

    console.log(flightId); // Ensure flightId is being passed correctly

    useEffect(() => {
        const fetchSeats = async () => {
            if (!flightId) {
                console.error('No flightId found in URL');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3001/api/seats/${flightId}`);
                console.log('Seats fetched:', response.data); // Log the seat data
                setSeats(response.data);
            } catch (error) {
                console.error('Error fetching seat data', error);
            }
        };

        fetchSeats();
    }, [flightId]);

    const handleSeatSelect = (seat) => {
        if (!seat.isBooked) {
            setSelectedSeat(seat);
        }
    };

    const handleNext = () => {
        if (selectedSeat) {
            navigate(`/payment?seatId=${selectedSeat.id}`);
        } else {
            alert('Please select a seat before proceeding.');
        }
    };

    return (
        <div className="seat-booking-container">
            <h1>Select a seat</h1>
            <div className="seat-map">
                {seats.length > 0 ? (
                    seats.map((seat) => (
                        <button
                            key={seat.id}
                            className={`seat ${seat.isBooked ? 'booked' : ''} ${selectedSeat?.id === seat.id ? 'selected' : ''}`}
                            onClick={() => handleSeatSelect(seat)}
                            disabled={seat.isBooked}
                        >
                            {seat.seatNumber} ({seat.seatClass})
                        </button>
                    ))
                ) : (
                    <p>No seats available</p>
                )}
            </div>
            <button onClick={handleNext}>Next</button>
        </div>
    );
}

export default SeatBooking;
