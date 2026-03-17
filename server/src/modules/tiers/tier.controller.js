const tierService = require("./tier.service");

const createTier = async (req, res) => {

  try {

    const tier = await tierService.createTier(req.body, req.user.id);

    res.status(201).json({
      message: "Tier created successfully",
      tier
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};

const getTiers = async (req, res) => {

  const tiers = await tierService.getAllTiers();

  res.json(tiers);

};

const getTier = async (req, res) => {

  const tier = await tierService.getTierById(req.params.id);

  res.json(tier);

};

const updateTier = async (req, res) => {

  try {

    const tier = await tierService.updateTier(req.params.id, req.body);

    res.json(tier);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};

const deleteTier = async (req, res) => {

  try {

    await tierService.deleteTier(req.params.id);

    res.json({
      message: "Tier deleted"
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};

module.exports = {
  createTier,
  getTiers,
  getTier,
  updateTier,
  deleteTier
};