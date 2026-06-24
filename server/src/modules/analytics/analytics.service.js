const { Op, fn, col } = require("sequelize");

const Tier = require("../tiers/tier.model");
const Content = require("../contents/content.model");
const Subscription = require("../subscriptions/subscription.model");
const User = require("../users/user.model");

/**
 * Dashboard overview
 */
const getOverview = async (creatorId) => {
  const [
    totalSubscribers,
    cancelledSubscribers,
    totalContent,
    tiers,
    tierCounts,
  ] = await Promise.all([
    Subscription.count({
      where: {
        creatorId,
        status: "active",
      },
    }),

    Subscription.count({
      where: {
        creatorId,
        status: "cancelled",
      },
    }),

    Content.count({
      where: {
        creatorId,
      },
    }),

    Tier.findAll({
      where: {
        creatorId,
      },
    }),

    Subscription.findAll({
      where: {
        creatorId,
        status: "active",
      },
      attributes: [
        "tierId",
        [fn("COUNT", col("id")), "count"],
      ],
      group: ["tierId"],
      raw: true,
    }),
  ]);

  const countMap = tierCounts.reduce((acc, curr) => {
    acc[curr.tierId] = Number(curr.count);
    return acc;
  }, {});

  let monthlyRevenue = 0;

  const revenueByTier = tiers.map((tier) => {
    const subscriberCount =
      countMap[tier.id] || 0;

    const revenue =
      subscriberCount * tier.price;

    monthlyRevenue += revenue;

    return {
      tierId: tier.id,
      tierName: tier.name,
      subscriberCount,
      revenue,
    };
  });

  const churnRate =
    totalSubscribers > 0
      ? Number(
          (
            (cancelledSubscribers /
              totalSubscribers) *
            100
          ).toFixed(2)
        )
      : 0;

  return {
    totalSubscribers,
    totalContent,
    monthlyRevenue,

    revenueByTier,

    churnSummary: {
      activeSubscribers:
        totalSubscribers,
      cancelledSubscribers,
      churnRate,
    },
  };
};

/**
 * Recent subscribers
 */
const getRecentSubscribers = async (
  creatorId
) => {
  const subscriptions =
    await Subscription.findAll({
      where: {
        creatorId,
        status: "active",
      },

      include: [
        {
          model: User,
          as: "subscriber",
          attributes: [
            "id",
            "username",
            "name",
          ],
        },
        {
          model: Tier,
          as: "tier",
          attributes: [
            "id",
            "name",
          ],
        },
      ],

      order: [
        ["createdAt", "DESC"],
      ],

      limit: 10,
    });

  return subscriptions.map(
    (subscription) => ({
      id: subscription.id,

      username:
        subscription.subscriber
          ?.username ||
        "Unknown User",

      name:
        subscription.subscriber
          ?.name ||
        "Unknown User",

      tier:
        subscription.tier?.name ||
        "Unknown Tier",

      subscribedAt:
        subscription.createdAt,
    })
  );
};

/**
 * Subscriber growth
 * Last 6 months
 */
const getSubscriberGrowth = async (
  creatorId
) => {
  const sixMonthsAgo =
    new Date();

  sixMonthsAgo.setMonth(
    sixMonthsAgo.getMonth() - 5
  );

  sixMonthsAgo.setDate(1);

  const subscriptions =
    await Subscription.findAll({
      where: {
        creatorId,
        createdAt: {
          [Op.gte]:
            sixMonthsAgo,
        },
      },

      attributes: [
        "status",
        "createdAt",
      ],

      order: [
        ["createdAt", "ASC"],
      ],
    });

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = [];

  for (
    let i = 5;
    i >= 0;
    i--
  ) {
    const date =
      new Date();

    date.setMonth(
      date.getMonth() - i
    );

    chartData.push({
      year:
        date.getFullYear(),
      monthIndex:
        date.getMonth(),
      month:
        monthLabels[
          date.getMonth()
        ],
      subscribers: 0,
    });
  }

  for (const bucket of chartData) {
    bucket.subscribers =
      subscriptions.filter(
        (subscription) => {
          const date =
            new Date(
              subscription.createdAt
            );

          return (
            date.getMonth() ===
              bucket.monthIndex &&
            date.getFullYear() ===
              bucket.year &&
            subscription.status ===
              "active"
          );
        }
      ).length;
  }

  return chartData.map(
    ({
      month,
      subscribers,
    }) => ({
      month,
      subscribers,
    })
  );
};

/**
 * Revenue history
 * Last 6 months
 */
const getRevenueHistory =
  async (creatorId) => {
    const sixMonthsAgo =
      new Date();

    sixMonthsAgo.setMonth(
      sixMonthsAgo.getMonth() - 5
    );

    sixMonthsAgo.setDate(1);

    const subscriptions =
      await Subscription.findAll({
        where: {
          creatorId,
          status: "active",
          createdAt: {
            [Op.gte]:
              sixMonthsAgo,
          },
        },

        include: [
          {
            model: Tier,
            as: "tier",
            attributes: [
              "price",
            ],
          },
        ],
      });

    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = [];

    for (
      let i = 5;
      i >= 0;
      i--
    ) {
      const date =
        new Date();

      date.setMonth(
        date.getMonth() - i
      );

      chartData.push({
        year:
          date.getFullYear(),
        monthIndex:
          date.getMonth(),
        month:
          monthLabels[
            date.getMonth()
          ],
        revenue: 0,
      });
    }

    chartData.forEach(
      (bucket) => {
        const revenue =
          subscriptions
            .filter(
              (
                subscription
              ) => {
                const date =
                  new Date(
                    subscription.createdAt
                  );

                return (
                  date.getMonth() ===
                    bucket.monthIndex &&
                  date.getFullYear() ===
                    bucket.year
                );
              }
            )
            .reduce(
              (
                total,
                subscription
              ) =>
                total +
                Number(
                  subscription
                    .tier
                    ?.price || 0
                ),
              0
            );

        bucket.revenue =
          revenue;
      }
    );

    return chartData.map(
      ({
        month,
        revenue,
      }) => ({
        month,
        revenue,
      })
    );
  };

/**
 * Churn analytics
 */
const getChurnRate = async (
  creatorId
) => {
  const [
    activeSubscribers,
    cancelledSubscribers,
  ] = await Promise.all([
    Subscription.count({
      where: {
        creatorId,
        status: "active",
      },
    }),

    Subscription.count({
      where: {
        creatorId,
        status: "cancelled",
      },
    }),
  ]);

  const churnRate =
    activeSubscribers > 0
      ? Number(
          (
            (cancelledSubscribers /
              activeSubscribers) *
            100
          ).toFixed(2)
        )
      : 0;

  return {
    activeSubscribers,
    cancelledSubscribers,
    churnRate,
  };
};

/**
 * Tier performance
 */
const getTierPerformance =
  async (creatorId) => {
    const [
      tiers,
      tierCounts,
    ] =
      await Promise.all([
        Tier.findAll({
          where: {
            creatorId,
          },
        }),

        Subscription.findAll({
          where: {
            creatorId,
            status: "active",
          },

          attributes: [
            "tierId",
            [
              fn(
                "COUNT",
                col("id")
              ),
              "count",
            ],
          ],

          group: [
            "tierId",
          ],

          raw: true,
        }),
      ]);

    const countMap =
      tierCounts.reduce(
        (
          acc,
          curr
        ) => {
          acc[curr.tierId] =
            Number(
              curr.count
            );

          return acc;
        },
        {}
      );

    return tiers
      .map((tier) => {
        const subscribers =
          countMap[
            tier.id
          ] || 0;

        return {
          tierId:
            tier.id,

          tierName:
            tier.name,

          subscribers,

          revenue:
            subscribers *
            tier.price,
        };
      })
      .sort(
        (a, b) =>
          b.revenue -
          a.revenue
      );
  };

module.exports = {
  getOverview,
  getRecentSubscribers,
  getSubscriberGrowth,
  getRevenueHistory,
  getChurnRate,
  getTierPerformance,
};