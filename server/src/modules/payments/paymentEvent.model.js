const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database"); 

const PaymentEvent =
 sequelize.define(
  "PaymentEvent",
  {
    stripeEventId: {
      type: DataTypes.STRING,
      unique: true,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    payload: {
      type: DataTypes.JSONB,
    },
  }
 );