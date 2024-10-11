import React from 'react';
import './ticketpre.css';
import Lottie from 'lottie-react';
import animationData from './ticket-animation.json';

const TicketPre = () => {
  return (
    <div className='preloader'><Lottie animationData={animationData} /></div>
  )
}

export default TicketPre;
