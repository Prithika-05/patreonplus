const Subscription = require("./subscription.model");
const Tier = require("../tiers/tier.model");

const createSubscription = async (tierId, subscriberId) => {

  const tier = await Tier.findByPk(tierId);

  if (!tier) {
    throw new Error("Tier not found");
  }

  const subscription = await Subscription.create({
    tierId,
    subscriberId
  });

  return subscription;
};

const getUserSubscriptions = async (subscriberId) => {

  return await Subscription.findAll({
    where: { subscriberId }
  });

};

const getAllSubscriptions = async () => {

  return await Subscription.findAll();

};

module.exports = {
  createSubscription,
  getUserSubscriptions,
  getAllSubscriptions
};