// models/Seat.js
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
          defaultValue: false, // Initially, seats are not booked
      },
      seatClass: {
          type: DataTypes.ENUM('economy', 'business', 'first'),
          allowNull: false,
      },
  });

  // Associate Seat with Flight
  Seat.associate = function(models) {
      Seat.belongsTo(models.Flight, { foreignKey: 'flightId' });
  };

  return Seat;
};

