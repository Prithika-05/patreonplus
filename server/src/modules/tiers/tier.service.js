const Tier = require("./tier.model");
const AppError = require("../../utils/AppError");
const sequelize = require("../../config/database");


const createTier = async (data, creatorId) => {
  const existingTier =
    await Tier.findOne({
      where: {
        creatorId,
        name: data.name,
      },
    });

  if (existingTier) {
    throw new AppError(
      "Tier name already exists",
      409
    );
  }

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

const getTierById = async (
    id,
    creatorId
  ) => {
    const tier = await Tier.findOne({
      where: {
        id,
        creatorId,
      },
    });

    if (!tier) {
      throw new AppError(
        "Tier not found",
        404
      );
    }

    return tier;
};

const updateTier = async (id, data, creatorId) => {
  const tier = await Tier.findByPk(id);

  if (!tier) {
  throw new AppError(
    "Tier not found",
    404
  );
  }

  if (tier.creatorId !== creatorId) {
    throw new AppError(
      "Unauthorized",
      403
    );
  }

  await tier.update(data);

  return tier;
};

const deleteTier = async (id, creatorId) => {
  const tier = await Tier.findByPk(id);

  if (!tier) {
  throw new AppError(
    "Tier not found",
    404
  );
  }

  if (tier.creatorId !== creatorId) {
    throw new AppError(
      "Unauthorized",
      403
    );
  }

  await tier.destroy();

  return true;
};

const reorderTiers = async (
  tiers,
  creatorId
) => {

  const transaction =
    await sequelize.transaction();

  try {

    for (const t of tiers) {

      const tier =
        await Tier.findByPk(
          t.id,
          { transaction }
        );

      if (!tier) {
        throw new AppError(
          "Tier not found",
          404
        );
      }

      if (
        tier.creatorId !== creatorId
      ) {
        throw new AppError(
          "Unauthorized",
          403
        );
      }

      await tier.update(
        { level: t.level },
        { transaction }
      );
    }

    await transaction.commit();

  } catch (error) {

    await transaction.rollback();

    throw error;
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