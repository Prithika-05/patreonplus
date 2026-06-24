const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

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

    checkoutSessionId: {
      type: DataTypes.STRING,
      allowNull: true, 
      field: 'checkout_session_id' 
    },

    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    stripeSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true,
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

Subscription.belongsTo(sequelize.models.User || 'User', {
  foreignKey: "subscriberId",
  as: "subscriber",
});

Subscription.belongsTo(sequelize.models.User || 'User', {
  foreignKey: "creatorId",
  as: "creator",
});

Subscription.belongsTo(sequelize.models.Tier || 'Tier', {
  foreignKey: "tierId",
  as: "tier",
});

module.exports = Subscription;
