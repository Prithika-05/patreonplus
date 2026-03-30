const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const User = require("../users/user.model");
const Tier = require("../tiers/tier.model");

const Content = sequelize.define(
  "Content",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "content",
    timestamps: true
  }
);

Content.belongsTo(User, {
  foreignKey: "creatorId",
  as: "creator"
});


Content.belongsTo(Tier, {
  foreignKey: "tierId",
  as: "tier"
});

module.exports = Content;