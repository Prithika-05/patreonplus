const { Op } = require("sequelize");
const Tier = require("../tiers/tier.model");
const Content = require("../contents/content.model");
const Subscription = require("../subscriptions/subscription.model");

/**
 * Fetches overview metrics and revenue breakdown by tier for the creator dashboard
 * @param {string|number} creatorId 
 */
const getOverview = async (creatorId) => {
  // 1. Count active subscribers
  const totalSubscribers = await Subscription.count({
    where: {
      creatorId,
      status: "active",
    },
  });

  // 2. Count total content published
  const totalContent = await Content.count({
    where: {
      creatorId,
    },
  });

  // 3. Fetch active subscriptions with tier data for overall revenue calculation
  const subscriptions = await Subscription.findAll({
    where: {
      creatorId,
      status: "active",
    },
    include: [
      {
        model: Tier,
        as: "tier",
      },
    ],
  });

  // 4. Calculate proper monthly revenue from actual active subscribers
  const monthlyRevenue = subscriptions.reduce(
    (sum, sub) => sum + (sub.tier?.price || 0),
    0
  );

  // 5. Fetch all tiers created by this specific user
  const tiers = await Tier.findAll({
    where: { creatorId },
  });

  // 6. Calculate a breakdown of subscriber counts and revenue for each tier
  const revenueByTier = await Promise.all(
    tiers.map(async (tier) => {
      const subscriberCount = await Subscription.count({
        where: {
          tierId: tier.id,
          status: "active",
        },
      });

      return {
        tierId: tier.id,
        tierName: tier.name,
        subscriberCount,
        revenue: subscriberCount * tier.price,
      };
    })
  );

  // 7. Return the compiled V1 dashboard data structure
  return {
    totalSubscribers,
    totalContent,
    monthlyRevenue,
    revenueByTier,
  };
};

module.exports = {
  getOverview,
};
