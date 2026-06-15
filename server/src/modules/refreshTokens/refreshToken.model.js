// server/src/modules/refreshTokens/refreshToken.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
    type: DataTypes.UUID, 
    allowNull: false,
  },
});

module.exports = RefreshToken;
