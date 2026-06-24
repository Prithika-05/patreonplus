const { Op, fn, col } = require("sequelize");
const Tier = require("../tiers/tier.model");
const Content = require("../contents/content.model");
const Subscription = require("../subscriptions/subscription.model");

/**
 * Fetches overview metrics, revenue breakdown, AND audience churn for the creator dashboard
 * @param {string|number} creatorId 
 */
const getOverview = async (creatorId) => {
  const [
    totalSubscribers, 
    cancelledSubscribers, 
    totalContent, 
    tiers, 
    tierCounts
  ] = await Promise.all([
    Subscription.count({ where: { creatorId, status: "active" } }),
    Subscription.count({ where: { creatorId, status: "cancelled" } }), // Added for churn calculation
    Content.count({ where: { creatorId } }),
    Tier.findAll({ where: { creatorId } }),
    Subscription.findAll({
      where: { creatorId, status: "active" },
      attributes: ["tierId", [fn("COUNT", col("id")), "count"]],
      group: ["tierId"],
      raw: true,
    }),
  ]);

  const countMap = tierCounts.reduce((acc, curr) => {
    acc[curr.tierId] = parseInt(curr.count, 10);
    return acc;
  }, {});

  let monthlyRevenue = 0;
  const revenueByTier = tiers.map((tier) => {
    const subscriberCount = countMap[tier.id] || 0;
    const revenue = subscriberCount * tier.price;
    monthlyRevenue += revenue;

    return {
      tierId: tier.id,
      tierName: tier.name,
      subscriberCount,
      revenue,
    };
  });

  let churnRate = 0;
  if (totalSubscribers > 0) {
    churnRate = parseFloat(((cancelledSubscribers / totalSubscribers) * 100).toFixed(2));
  }

  return {
    totalSubscribers,
    totalContent,
    monthlyRevenue,
    revenueByTier,
    churnSummary: {
      activeSubscribers: totalSubscribers,
      cancelledSubscribers,
      churnRate,
    },
  };
};



/**
 * Fetches the 10 most recent active subscribers with formatted details
 * @param {string|number} creatorId 
 */
const getRecentSubscribers = async (creatorId) => {
  const recentSubs = await Subscription.findAll({
    where: {
      creatorId,
      status: "active",
    },
    include: [
      {
        model: User,
        as: "subscriber",
        attributes: ["username"], 
      },
      {
        model: Tier,
        as: "tier",
        attributes: ["name"],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: 10,
  });

  return recentSubs.map((sub) => ({
    username: sub.subscriber?.username || "Unknown",
    tier: sub.tier?.name || "Custom/Deleted Tier",
    subscribedAt: sub.createdAt.toISOString().split("T")[0], // Formats to YYYY-MM-DD
  }));
};

/**
 * Fetches subscriber growth trends over the last 6 months
 * @param {string|number} creatorId 
 */
const getSubscriberGrowth = async (creatorId) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1); // Start from the beginning of that month

  const subscriptions = await Subscription.findAll({
    where: {
      creatorId,
      createdAt: { [Op.gte]: somePastDate },
    },
    attributes: ["status", "createdAt"],
    order: [["createdAt", "ASC"]],
  });

  let runningTotal = await Subscription.count({
    where: {
      creatorId,
      status: "active",
      createdAt: { [Op.lt]: sixMonthsAgo },
    },
  });

  const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = [];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    chartData.push({
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
      month: monthsArr[d.getMonth()],
      subscribers: 0,
    });
  }

  return chartData.map((bucket) => {
    const monthChanges = subscriptions.filter((sub) => {
      const subDate = new Date(sub.createdAt);
      return subDate.getMonth() === bucket.monthIndex && subDate.getFullYear() === bucket.year;
    });

    monthChanges.forEach((sub) => {
      if (sub.status === "active") runningTotal += 1;
      if (sub.status === "cancelled") runningTotal -= 1; 
    });

    return {
      month: bucket.month,
      subscribers: Math.max(0, runningTotal), 
    };
  });
};
/**
 * Fetches monthly revenue history over the last 6 months
 * @param {string|number} creatorId 
 */
const getRevenueHistory = async (creatorId) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1); // Set to start of the oldest month

  const activeSubscriptions = await Subscription.findAll({
    where: {
      creatorId,
      status: "active",
      createdAt: { [Op.gte]: sixMonthsAgo },
    },
    include: [
      {
        model: Tier,
        as: "tier",
        attributes: ["price"],
      },
    ],
  });

  const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueChart = [];

  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() - i);
    
    revenueChart.push({
      year: targetDate.getFullYear(),
      monthIndex: targetDate.getMonth(),
      month: shortMonths[targetDate.getMonth()],
      revenue: 0,
    });
  }

  revenueChart.forEach((bucket) => {
    const monthlySubs = activeSubscriptions.filter((sub) => {
      const subDate = new Date(sub.createdAt);
      return subDate.getMonth() === bucket.monthIndex && subDate.getFullYear() === bucket.year;
    });

    bucket.revenue = monthlySubs.reduce((sum, sub) => {
      return sum + (sub.tier?.price || 0);
    }, 0);
  });

  return revenueChart.map((bucket) => ({
    month: bucket.month,
    revenue: bucket.revenue,
  }));
};

const getChurnRate = async (creatorId) => {
  const [activeSubscribers, cancelledSubscribers] = await Promise.all([
    Subscription.count({
      where: { creatorId, status: "active" },
    }),
    Subscription.count({
      where: { creatorId, status: "cancelled" }, // Ensure status matches your database schema
    }),
  ]);

  let churnRate = 0;
  if (activeSubscribers > 0) {
    const calculatedRate = (cancelledSubscribers / activeSubscribers) * 100;
    churnRate = parseFloat(calculatedRate.toFixed(2)); // Truncate to clean double-decimal float
  }

  return {
    activeSubscribers,
    cancelledSubscribers,
    churnRate,
  };
};

/**
 * Fetches breakdown of subscriber counts and revenue performance by tier
 * @param {string|number} creatorId 
 */
const getTierPerformance = async (creatorId) => {
  // 1. Fetch all tiers owned by the creator and active subscription counts in parallel
  const [tiers, tierCounts] = await Promise.all([
    Tier.findAll({ where: { creatorId } }),
    Subscription.findAll({
      where: { creatorId, status: "active" },
      attributes: ["tierId", [fn("COUNT", col("id")), "count"]],
      group: ["tierId"],
      raw: true,
    }),
  ]);

  const countMap = tierCounts.reduce((acc, curr) => {
    acc[curr.tierId] = parseInt(curr.count, 10);
    return acc;
  }, {});

  return tiers
    .map((tier) => {
      const subscribers = countMap[tier.id] || 0;
      return {
        tierName: tier.name,
        subscribers,
        revenue: subscribers * tier.price,
      };
    })
    .sort((a, b) => b.revenue - a.revenue); 
};

module.exports = {
  getOverview,
  getRecentSubscribers,
  getSubscriberGrowth,
  getRevenueHistory,
  getChurnRate,
  getTierPerformance, 
};