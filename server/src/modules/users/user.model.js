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
      allowNull: false
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
      allowNull: false
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

module.exports = User;