const Subscription = require("./subscription.model");
const Tier = require("../tiers/tier.model");
const AppError = require("../../utils/AppError");

const subscribe = async (userId, tierId) => {
  const tier = await Tier.findByPk(tierId);

  if (!tier) {
  throw new AppError(
      "Tier not found",
      404
    );
  }

  const creatorId = tier.creatorId;

  if (creatorId === userId) {
    throw new AppError(
      "You cannot subscribe to your own tier",
      400
    );
  }

  let subscription = await Subscription.findOne({
    where: {
      subscriberId: userId,
      creatorId,
    },
  });

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + tier.unlockDuration);

  if (subscription) {
    subscription.tierId = tierId;
    subscription.startDate = now;
    subscription.endDate = endDate;
    subscription.status = "active";

    await subscription.save();
    return subscription;
  }

  subscription = await Subscription.create({
    subscriberId: userId,
    creatorId,
    tierId,
    startDate: now,
    endDate,
  });

  return subscription;
};

const getMySubscriptions = async (userId) => {
  return await Subscription.findAll({
    where: { subscriberId: userId },
    include: [
      { model: Tier, as: "tier" },
      { model: require("../users/user.model"), as: "creator" },
    ],
  });
};

const cancelSubscription = async (id, userId) => {
  const subscription = await Subscription.findByPk(id);

  if (!subscription) {
    throw new AppError(
      "Subscription not found",
      404
    );
  }

  if (subscription.subscriberId !== userId) {
      throw new AppError(
      "Unauthorized",
      403
    );
  }

  subscription.status = "cancelled";
  await subscription.save();

  return subscription;
};

module.exports = {
  subscribe,
  getMySubscriptions,
  cancelSubscription,
};
 