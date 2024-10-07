import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage({ isLoggedIn }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Planning to travel?</h1>
      <h1 className='smalltitle'>Welcome to DavFLightss!</h1>

      <div className="countries-container">
        {/* Example of country cards - Add more for each country */}
        <div className="country-card">
          <img src="https://www.zicasso.com/static/370fce7837485d67f8f860b2d52b95e4/304cc/370fce7837485d67f8f860b2d52b95e4.jpg" alt="Country 1" className="country-image" />
          <div className="hover-text">
            {isLoggedIn ? (
              <button className='butto' onClick={() => navigate('/booking')}>Book Now</button>
            ) : (
              <>
                <p>Please log in to continue</p>
                <button className='butto' onClick={handleLoginClick}>Log In</button>
              </>
            )}
          </div>
        </div>

        <div className="country-card">
          <img src="https://i0.wp.com/www.theglitteringunknown.com/wp-content/uploads/2017/01/Sunset-from-top-of-Arc-close-up-The-Glittering-Unknown.jpg" alt="Country 2" className="country-image" />
          <div className="hover-text">
            {isLoggedIn ? (
              <button className='butto' onClick={() => navigate('/booking')}>Book Now</button>
            ) : (
              <>
                <p>Please log in to continue</p>
                <button className='butto' onClick={handleLoginClick}>Log In</button>
              </>
            )}
          </div>
        </div>
        {/* Add more country cards here */}
        <div className="country-card">
          <img src="https://i.pinimg.com/originals/5f/53/55/5f5355fb465dcf5b8fbdba0ab094e6e0.jpg" alt="Country 3" className="country-image" />
          <div className="hover-text">
            {isLoggedIn ? (
              <button className='butto' onClick={() => navigate('/booking')}>Book Now</button>
            ) : (
              <>
                <p>Please log in to continue</p>
                <button className='butto' onClick={handleLoginClick}>Log In</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
