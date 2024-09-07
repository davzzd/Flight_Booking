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

/*
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure username is unique
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return User;
};
*/




/*module.exports = (sequelize, DataTypes) => {
    
    const User = sequelize.define('User', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        username: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false
        }
      }, {
        tableName: 'users',
        timestamps: false
      });
      
    return User
}
*/