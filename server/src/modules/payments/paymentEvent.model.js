// server/src/modules/payments/paymentEvent.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const PaymentEvent = sequelize.define(
  "PaymentEvent",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    stripeEventId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "stripe_event_id",
    },
  },
  {
    tableName: "payment_events",
    timestamps: true,
  }
);

module.exports = PaymentEvent;
