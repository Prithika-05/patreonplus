const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 50]
      }
    },
    
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 20],
        is: /^[a-zA-Z0-9_]+$/
      }
    },
    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },

    role: {
      type: DataTypes.ENUM("creator", "subscriber"),
      allowNull: false
    },

    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "users",
    timestamps: true
  }
);

User.associate = (models) => {
  User.hasMany(models.Subscription, {
    foreignKey: "subscriberId",
    as: "subscriberSubscriptions",
  });

  User.hasMany(models.Subscription, {
    foreignKey: "creatorId",
    as: "creatorSubscriptions",
  });
};

module.exports = User;