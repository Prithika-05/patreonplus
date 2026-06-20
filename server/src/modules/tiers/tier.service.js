const Tier = require("./tier.model");
const AppError = require("../../utils/AppError");
const sequelize = require("../../config/database");
// IMPORT STRIPE CLIENT:
const { stripe } = require("../payments/stripe.service");

const createTier = async (data, creatorId) => {
  const existingTier = await Tier.findOne({
    where: {
      creatorId,
      name: data.name,
    },
  });

  if (existingTier) {
    throw new AppError("Tier name already exists", 409);
  }

  const lastTier = await Tier.findOne({
    where: { creatorId },
    order: [["level", "DESC"]],
  });

  const nextLevel = lastTier ? lastTier.level + 1 : 1;

  // 1. STRIPE INTEGRATION: Create Product and Price on Stripe first
  let stripePriceId = null;
  try {
    const stripeProduct = await stripe.products.create({
      name: data.name,
      description: data.description || `Access to ${data.name}`,
      metadata: {
        creatorId: creatorId.toString(),
      },
    });

    // Convert internal FLOAT price to cents/pence integer for Stripe (e.g., 10.50 -> 1050)
    const priceInCents = Math.round(data.price * 100);

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: priceInCents,
      currency: "usd", // Change this to your preferred default currency (e.g., "eur", "gbp")
      recurring: {
        interval: "month", // Creates a recurring monthly subscription
      },
    });

    stripePriceId = stripePrice.id;
  } catch (stripeError) {
    console.error("Stripe Product/Price Creation Failed:", stripeError);
    throw new AppError(`Failed to sync tier with payment processor: ${stripeError.message}`, 502);
  }

  // 2. DATABASE SAVE: Save locally along with the new Stripe Price ID
  const tier = await Tier.create({
    ...data,
    creatorId,
    level: nextLevel,
    stripePriceId, // Injected token
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
  const tier = await Tier.findOne({
    where: {
      id,
      creatorId,
    },
  });

  if (!tier) {
    throw new AppError("Tier not found", 404);
  }

  return tier;
};

// NOTE: Updates or deletes to prices in Stripe require specialized logic.
// For now, these operate locally on your database metadata.
const updateTier = async (id, data, creatorId) => {
  const tier = await Tier.findByPk(id);

  if (!tier) {
    throw new AppError("Tier not found", 404);
  }

  if (tier.creatorId !== creatorId) {
    throw new AppError("Unauthorized", 403);
  }

  if (data.price) {
  throw new AppError(
    "Tier pricing cannot be edited after creation",
    400
  );
  }
  await tier.update(data);
  return tier;
};

const deleteTier = async (id, creatorId) => {
  const tier = await Tier.findByPk(id);

  if (!tier) {
    throw new AppError("Tier not found", 404);
  }

  if (tier.creatorId !== creatorId) {
    throw new AppError("Unauthorized", 403);
  }

  await tier.destroy();
  return true;
};

const reorderTiers = async (tiers, creatorId) => {
  const transaction = await sequelize.transaction();

  try {
    for (const t of tiers) {
      const tier = await Tier.findByPk(t.id, { transaction });

      if (!tier) {
        throw new AppError("Tier not found", 404);
      }

      if (tier.creatorId !== creatorId) {
        throw new AppError("Unauthorized", 403);
      }

      await tier.update({ level: t.level }, { transaction });
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
