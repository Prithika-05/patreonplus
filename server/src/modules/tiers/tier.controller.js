const tierService = require("./tier.service");
const asyncHandler = require("../../utils/asyncHandler");

const createTier = asyncHandler(async (req, res) => {
  const tier = await tierService.createTier(req.body, req.user.id);

  return res.status(201).json({
    success: true,
    message: "Tier created successfully",
    data: tier,
  });
});

const getAllTiers = asyncHandler(async (req, res) => {
  const tiers = await tierService.getAllTiers(req.user.id);

  return res.status(200).json({
    success: true,
    data: tiers,
  });
});

const getTierById = asyncHandler(async (req, res) => {
  const tier = await tierService.getTierById(req.params.id, req.user.id);

  return res.status(200).json({
    success: true,
    data: tier,
  });
});

const updateTier = asyncHandler(async (req, res) => {
  const tier = await tierService.updateTier(
    req.params.id,
    req.body,
    req.user.id
  );

  return res.status(200).json({
    success: true,
    message: "Tier updated successfully",
    data: tier,
  });
});

const deleteTier = asyncHandler(async (req, res) => {
  await tierService.deleteTier(req.params.id, req.user.id);

  return res.status(200).json({
    success: true,
    message: "Tier deleted successfully",
  });
});

const reorderTiers = asyncHandler(async (req, res) => {
  const tiers = await tierService.reorderTiers(req.body, req.user.id);

  return res.status(200).json({
    success: true,
    message: "Tiers reordered successfully",
    data: tiers,
  });
});

module.exports = {
  createTier,
  getAllTiers,
  getTierById,
  updateTier,
  deleteTier,
  reorderTiers,
};
