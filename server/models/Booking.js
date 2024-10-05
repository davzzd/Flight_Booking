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
    seatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {  // Foreign key reference to User model's username
        model: 'Users', // Note the correct model name here
        key: 'username',
      },
    },
    gateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Association with the User model
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: "username",
      targetKey: "username",  // Match 'username' with the User model's primary key
    });
  };

  return Booking;
};


  

/*
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
      seatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {  // This should match the type of 'username' from 'Users' table
        type: DataTypes.STRING, // Match the username data type
        allowNull: false,
      },
      gateNumber: {
        type: DataTypes.STRING, // Assuming gate number is a string (e.g., 'K18')
        allowNull: false,
      },
    });
  
    // Define the foreign key relationship with Users (assuming username is the primary key)
    Booking.associate = (models) => {
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "username", // Referencing 'username' as the foreign key
      });
    };
  
    return Booking;
  };
  */
  