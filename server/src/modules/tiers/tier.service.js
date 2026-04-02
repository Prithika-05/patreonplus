const Tier = require("./tier.model");

const createTier = async (data, creatorId) => {
  const lastTier = await Tier.findOne({
    where: { creatorId },
    order: [["level", "DESC"]],
  });

  const nextLevel = lastTier ? lastTier.level + 1 : 1;

  const tier = await Tier.create({
    ...data,
    creatorId,
    level: nextLevel,
  });

  return tier;
};

const getAllTiers = async (creatorId) => {
  return await Tier.findAll({
    where: { creatorId },
    order: [["level", "ASC"]],
  });
};

const getTierById = async (id, creatorId) => {
  return await Tier.findOne({
    where: {
      id,
      creatorId,
    },
  });
};

const updateTier = async (id, data, creatorId) => {
  const tier = await Tier.findByPk(id);

  if (!tier) throw new Error("Tier not found");

  if (tier.creatorId !== creatorId) {
    throw new Error("Unauthorized");
  }

  await tier.update(data);

  return tier;
};

const deleteTier = async (id, creatorId) => {
  const tier = await Tier.findByPk(id);

  if (!tier) throw new Error("Tier not found");

  if (tier.creatorId !== creatorId) {
    throw new Error("Unauthorized");
  }

  await tier.destroy();

  return true;
};
const reorderTiers = async (tiers, creatorId) => {
  for (const t of tiers) {
    const tier = await Tier.findByPk(t.id);

    if (!tier) throw new Error("Tier not found");

    if (tier.creatorId !== creatorId) {
      throw new Error("Unauthorized");
    }

    await tier.update({ level: t.level });
  }

  return await Tier.findAll({
    where: { creatorId },
    order: [["level", "ASC"]],
  });
};
module.exports = {
  createTier,
  getAllTiers,
  getTierById,
  updateTier,
  deleteTier,
  reorderTiers,
};