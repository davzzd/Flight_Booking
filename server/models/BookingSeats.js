module.exports = (sequelize, DataTypes) => {
    const BookingSeats = sequelize.define('BookingSeats', {
      bookingId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Bookings',
          key: 'id',
        },
      },
      seatId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Seats',
          key: 'id',
        },
      },
    });
  
    return BookingSeats;
  };
  