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
      where: { jti },
    });

  return !!token;
};

module.exports = {
  blacklistToken,
  isBlacklisted,
};