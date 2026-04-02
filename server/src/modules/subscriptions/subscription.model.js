const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const User = require("../users/user.model");
const Tier = require("../tiers/tier.model");

const Subscription = sequelize.define(
  "Subscription",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("active", "cancelled", "expired"),
      defaultValue: "active",
    },
  },
  {
    tableName: "subscriptions",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["subscriberId", "creatorId"],
      },
    ],
  },
);

Subscription.belongsTo(User, {
  foreignKey: "subscriberId",
  as: "subscriber",
});

Subscription.belongsTo(User, {
  foreignKey: "creatorId",
  as: "creator",
});

Subscription.belongsTo(Tier, {
  foreignKey: "tierId",
  as: "tier",
});

module.exports = Subscription;
