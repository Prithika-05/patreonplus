const { Op } = require("sequelize");
const TokenBlacklist =
  require("./tokenBlacklist.model");

const blacklistToken = async (
  jti,
  expiresAt
) => {
  return await TokenBlacklist.create({
    jti,
    expiresAt,
  });
};

const isBlacklisted = async (
  jti
) => {
  const token =
    await TokenBlacklist.findOne({
      where: {
        jti,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

  return !!token;
};

module.exports = {
  blacklistToken,
  isBlacklisted,
};