const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const User = require("../users/user.model");

const Tier = sequelize.define(
  "Tier",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 },
    },

    unlockDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
  },
  {
    tableName: "tiers",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["creatorId", "level"],
      },
    ],
  },
);

Tier.belongsTo(User, { foreignKey: "creatorId", as: "creator" });
User.hasMany(Tier, { foreignKey: "creatorId", as: "tiers" });

module.exports = Tier;
