module.exports = (sequelize, DataTypes) => {
    const Seat = sequelize.define('Seat', {
      flightId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Flights', key: 'id' }
      },
      seatNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      classType: {
        type: DataTypes.ENUM('economy', 'business', 'first'),
        allowNull: false
      },
      isBooked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      bookedBy: {
        type: DataTypes.STRING,
        allowNull: true, // store username of the person who booked
      }
    });
  
    Seat.associate = function(models) {
      Seat.belongsTo(models.Flight, { foreignKey: 'flightId' });
    };
  
    return Seat;
  };
