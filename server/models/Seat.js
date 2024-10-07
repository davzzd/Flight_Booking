module.exports = (sequelize, DataTypes) => {
    const Seat = sequelize.define('Seat', {
      seatNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      flightId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isBooked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seatClass: {
        type: DataTypes.ENUM('economy', 'business', 'first'),
        allowNull: false,
      },
    });
  
    // Associations
    Seat.associate = function(models) {
      Seat.belongsTo(models.Flight, { foreignKey: 'flightId' });
  
      Seat.belongsToMany(models.Booking, {
        through: 'BookingSeats', // Junction table for many-to-many relationship
        foreignKey: 'seatId',
        otherKey: 'bookingId',
      });
    };
  
    return Seat;
  };
  
