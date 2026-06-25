const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const User = require("../users/user.model");
const Content = require("../contents/content.model");

const ContentLike = sequelize.define(
  "ContentLike",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  {
    tableName: "content_likes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["contentId", "userId"],
      },
    ],
  }
);

ContentLike.belongsTo(Content, {
  foreignKey: "contentId",
  as: "content",
  onDelete: "CASCADE",
});

ContentLike.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});

Content.hasMany(ContentLike, {
  foreignKey: "contentId",
  as: "likes",
  onDelete: "CASCADE",
});

User.hasMany(ContentLike, {
  foreignKey: "userId",
  as: "likedContents",
  onDelete: "CASCADE",
});

module.exports = ContentLike;