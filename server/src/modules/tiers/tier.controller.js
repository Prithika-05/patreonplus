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

const getAllTiers = async (req, res) => {
  const tiers = await tierService.getAllTiers(req.user.id);

  res.json(tiers);
};

const getTierById = async (req, res) => {
  const tier = await tierService.getTierById(req.params.id, req.user.id);

  res.json(tier);
};

const updateTier = async (req, res) => {
  try {
    const tier = await tierService.updateTier(
      req.params.id,
      req.body,
      req.user.id,
    );
    res.json({
      message: "Tier updated",
      tier,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteTier = async (req, res) => {
  try {
    await tierService.deleteTier(req.params.id, req.user.id);
    res.json({
      message: "Tier deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const reorderTiers = async (req, res) => {
  try {
    const tiers = await tierService.reorderTiers(req.body, req.user.id);

    res.json({
      message: "Tiers reordered successfully",
      tiers,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTier,
  getAllTiers,
  getTierById,
  updateTier,
  deleteTier,
  reorderTiers,
};