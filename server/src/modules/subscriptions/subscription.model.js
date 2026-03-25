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
      primaryKey: true
    },

    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    status: {
      type: DataTypes.ENUM("active", "cancelled"),
      defaultValue: "active"
    }
  },
  {
    tableName: "subscriptions",
    timestamps: true
  }
);

Subscription.belongsTo(User, {
  foreignKey: "subscriberId",
  as: "subscriber"
});

Subscription.belongsTo(Tier, {
  foreignKey: "tierId",
  as: "tier"
});

module.exports = Subscription;