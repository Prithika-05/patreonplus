const Subscription = require("./subscription.model");
const Tier = require("../tiers/tier.model");

const subscribe = async (userId, tierId) => {
  const tier = await Tier.findByPk(tierId);

  if (!tier) {
    throw new Error("Tier not found");
  }

  const creatorId = tier.creatorId;

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
    throw new Error("Subscription not found");
  }

  if (subscription.subscriberId !== userId) {
    throw new Error("Unauthorized");
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
 