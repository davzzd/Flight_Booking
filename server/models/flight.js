// models/flight.js
module.exports = (sequelize, DataTypes) => {
    const Flight = sequelize.define("Flight", {
        flightNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startPoint: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        destination: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        flightDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    });

    // Associate Flight with Seats
    Flight.associate = function(models) {
        Flight.hasMany(models.Seat, { foreignKey: 'flightId', as: 'seats' });
    };

    return Flight;
};

  