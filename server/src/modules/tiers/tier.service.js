const Tier = require("./tier.model");

const createTier = async (data, creatorId) => {

  const tier = await Tier.create({
    ...data,
    creatorId
  });

  return tier;
};

const getAllTiers = async () => {
  return await Tier.findAll();
};

const getTierById = async (id) => {
  return await Tier.findByPk(id);
};

const updateTier = async (id, data) => {

  const tier = await Tier.findByPk(id);

  if (!tier) {
    throw new Error("Tier not found");
  }

  await tier.update(data);

  return tier;
};

const deleteTier = async (id) => {

  const tier = await Tier.findByPk(id);

  if (!tier) {
    throw new Error("Tier not found");
  }

  await tier.destroy();

  return true;
};

module.exports = {
  createTier,
  getAllTiers,
  getTierById,
  updateTier,
  deleteTier
};