module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure username is unique
      validate: {
        notEmpty: true, // Username must not be empty
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Password must not be empty
      },
    },
  });

  return User;
};
