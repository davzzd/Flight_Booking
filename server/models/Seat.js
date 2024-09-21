// models/Seat.js
module.exports = (sequelize, DataTypes) => {
  const Seat = sequelize.define('Seat', {
    seatNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seatClass: {
      type: DataTypes.ENUM('economy', 'business', 'first'),
      allowNull: false,
    },
    isBooked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Seat.associate = (models) => {
    Seat.belongsTo(models.Flight, {
      foreignKey: 'flightId',
      onDelete: 'CASCADE',
    });
  };

  return Seat;
};
