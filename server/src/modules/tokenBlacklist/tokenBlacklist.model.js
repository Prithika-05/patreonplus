const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const TokenBlacklist = sequelize.define(
  "TokenBlacklist",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    jti: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "token_blacklist",
    timestamps: true,
  }
);

module.exports = TokenBlacklist;