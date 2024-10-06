module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("Booking", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    flightId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {  
        model: 'Users',
        key: 'username',
      },
    },
    gateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Associations
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: "username",
      targetKey: "username",  
    });
    
    Booking.belongsToMany(models.Seat, { 
      through: 'BookingSeats', // Junction table for many-to-many relationship
      foreignKey: 'bookingId',
      otherKey: 'seatId',
    });

    Booking.belongsTo(models.Flight, {
      foreignKey: "flightId",
    });
  };

  return Booking;
};


  

