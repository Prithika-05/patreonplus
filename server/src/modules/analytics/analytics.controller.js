const asyncHandler = require("../../utils/asyncHandler");
const analyticsService = require("./analytics.service");

const getOverview = asyncHandler(async (req, res) => {
  const data = await analyticsService.getOverview(req.user.id);

  return res.status(200).json({
    success: true,
    data,
  });
});

module.exports = {
  getOverview,
};
