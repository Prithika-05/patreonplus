const RefreshToken =
 require("./refreshToken.model");

const createRefreshToken =
 async (token, expiresAt, userId) => {

   return await RefreshToken.create({
     token,
     expiresAt,
     userId,
   });
 };

const findRefreshToken =
 async (token) => {

   return await RefreshToken.findOne({
     where: { token },
   });
 };

const deleteRefreshToken =
 async (token) => {

   return await RefreshToken.destroy({
     where: { token },
   });
 };

module.exports = {
 createRefreshToken,
 findRefreshToken,
 deleteRefreshToken,
};