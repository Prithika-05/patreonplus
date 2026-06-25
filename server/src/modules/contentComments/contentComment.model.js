const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const User = require("../users/user.model");
const Content = require("../contents/content.model");

const ContentComment = sequelize.define(
  "ContentComment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 1000],
      },
    },
  },
  {
    tableName: "content_comments",
    timestamps: true,
  }
);

ContentComment.belongsTo(Content, {
  foreignKey: "contentId",
  as: "content",
  onDelete: "CASCADE",
});

ContentComment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});

Content.hasMany(ContentComment, {
  foreignKey: "contentId",
  as: "comments",
  onDelete: "CASCADE",
});

User.hasMany(ContentComment, {
  foreignKey: "userId",
  as: "userComments",
  onDelete: "CASCADE",
});

module.exports = ContentComment;