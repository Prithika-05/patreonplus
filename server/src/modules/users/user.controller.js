const userService = require("./user.service");
const asyncHandler = require("../../utils/asyncHandler");

const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const users = await userService.searchUsers(query);

  return res.status(200).json({
    success: true,
    data: users,
  });
});

const getPublicProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const profile = await userService.getPublicProfile(username);

  return res.status(200).json({
    success: true,
    data: profile,
  });
});

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getMyProfile(req.user.id);

  return res.status(200).json({
    success: true,
    data: profile,
  });
});


module.exports = {
  searchUsers,
  getPublicProfile,
  getMyProfile,
};