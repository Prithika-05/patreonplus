const User = require("./user.model");
const Tier = require("../tiers/tier.model");

const { Op, literal } = require("sequelize");

const AppError = require("../../utils/AppError");

const searchUsers = async (query) => {
  const isEmptyQuery = !query || query.trim() === "";

  const whereClause = {
    role: "creator",
  };

  if (!isEmptyQuery) {
    whereClause.username = {
      [Op.like]: `%${query.trim()}%`,
    };
  }

  const creators = await User.findAll({
    where: whereClause,

    attributes: [
      "id",
      "name",
      "username",
      "role",
      "bio",
      "profileImage",
      "createdAt",
      [
        literal(`(
          SELECT COUNT(*)
          FROM subscriptions
          WHERE subscriptions."creatorId" = "User"."id"
          AND subscriptions.status = 'active'
        )`),
        "subscriberCount",
      ],
    ],

    order: [
      [literal('"subscriberCount"'), "DESC"],
      ["createdAt", "DESC"],
    ],

    limit: isEmptyQuery ? 5 : undefined,

    raw: true,
  });

  return creators.map((creator) => ({
    ...creator,
    subscriberCount: Number(creator.subscriberCount),
  }));
};

const getPublicProfile = async (username) => {
  const user = await User.findOne({
    where: {
      username,
    },
    attributes: [
      "id",
      "name",
      "username",
      "bio",
      "profileImage",
      "role",
    ],
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  let tiers = [];

  if (user.role === "creator") {
    tiers = await Tier.findAll({
      where: {
        creatorId: user.id,
      },
      order: [["level", "ASC"]],
    });
  }

  return {
    user,
    tiers,
  };
};

const getMyProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: [
      "id",
      "name",
      "username",
      "email",
      "role",
      "bio",
      "profileImage",
      "createdAt",
    ],
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

module.exports = {
  searchUsers,
  getPublicProfile,
  getMyProfile,
};