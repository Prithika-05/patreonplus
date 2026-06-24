const asyncHandler = require("../../utils/asyncHandler");
const analyticsService = require("./analytics.service");

const getOverview = asyncHandler(async (req, res) => {
  const data = await analyticsService.getOverview(req.user.id);
  return res.status(200).json({
    success: true,
    data,
  });
});

const getRecentSubscribers = asyncHandler(async (req, res) => {
  const data = await analyticsService.getRecentSubscribers(req.user.id);
  return res.status(200).json({
    success: true,
    data,
  });
});

const getSubscriberGrowth = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSubscriberGrowth(req.user.id);
  return res.status(200).json({
    success: true,
    data,
  });
});

const getRevenueHistory = asyncHandler(async (req, res) => {
  const data = await analyticsService.getRevenueHistory(req.user.id);
  return res.status(200).json({
    success: true,
    data,
  });
});

const getChurnRate = asyncHandler(async (req, res) => {
  const data = await analyticsService.getChurnRate(req.user.id);
  return res.status(200).json({
    success: true,
    data,
  });
});

const getTierPerformance = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTierPerformance(req.user.id);
  return res.status(200).json({
    success: true,
    data,
  });
});

module.exports = {
  getOverview,
  getRecentSubscribers,
  getSubscriberGrowth,
  getRevenueHistory,
  getChurnRate,
  getTierPerformance, // Export the controller method
};
