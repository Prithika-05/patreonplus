const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Content = require("../contents/content.model");
const User = require("../users/user.model");

const ContentView = sequelize.define(
  "ContentView",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    contentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    viewerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    viewedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    watchDuration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    source: {
      type: DataTypes.ENUM(
        "feed",
        "search",
        "direct",
        "notification"
      ),
      allowNull: false,
      defaultValue: "feed",
    },
  },
  {
    tableName: "content_views",

    indexes: [
      {
        fields: ["contentId"],
      },
      {
        fields: ["viewerId"],
      },
      {
        fields: ["creatorId"],
      },
      {
        fields: ["viewedAt"],
      },
      {
        fields: ["contentId", "viewerId"],
      },
    ],
  }
);

/*
|--------------------------------------------------------------------------
| Associations
|--------------------------------------------------------------------------
*/

// ContentView.belongsTo(Content, {
//   foreignKey: "contentId",
//   as: "content",
// });

ContentView.belongsTo(User, {
  foreignKey: "viewerId",
  as: "viewer",
});

ContentView.belongsTo(User, {
  foreignKey: "creatorId",
  as: "creator",
});

module.exports = ContentView;