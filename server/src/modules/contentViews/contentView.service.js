const { Op, fn, col, literal } = require("sequelize");

const ContentView = require("./contentView.model");
const Content = require("../contents/content.model");
const User = require("../users/user.model");
const Tier = require("../tiers/tier.model");


const recordView = async ({
  contentId,
  viewerId,
  creatorId,
  watchDuration = 0,
  completed = false,
  source = "feed",
}) => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const existingView = await ContentView.findOne({
    where: {
      contentId,
      viewerId,
      viewedAt: {
        [Op.gte]: fiveMinutesAgo,
      },
    },
  });

  if (existingView) {
    return existingView;
  }

  let resolvedCreatorId = creatorId;
  if (!resolvedCreatorId) {
    const targetContent = await Content.findByPk(contentId, { attributes: ["creatorId"] });
    if (targetContent) {
      resolvedCreatorId = targetContent.creatorId;
    }
  }

  return await ContentView.create({
    contentId,
    viewerId,
    creatorId: resolvedCreatorId,
    watchDuration,
    completed,
    source,
  });
};


const getContentViews = async (contentId) => {
  const totalViews = await ContentView.count({
    where: { contentId },
  });

  const uniqueViews = await ContentView.count({
    where: { contentId },
    distinct: true,
    col: "viewerId",
  });

  return {
    totalViews,
    uniqueViews,
  };
};


const getCreatorEngagement = async (creatorId) => {
  const [totalViews, uniqueViewers, completedViews, averageWatchTime] = await Promise.all([
    ContentView.count({
      where: { creatorId },
    }),
    ContentView.count({
      where: { creatorId },
      distinct: true,
      col: "viewerId",
    }),
    ContentView.count({
      where: { creatorId, completed: true },
    }),
    ContentView.findOne({
      where: { creatorId },
      attributes: [[fn("AVG", col("watchDuration")), "averageWatchTime"]],
      raw: true,
    }),
  ]);

  const completionRate =
    totalViews > 0 ? Number(((completedViews / totalViews) * 100).toFixed(2)) : 0;

  return {
    totalViews,
    uniqueViewers,
    completedViews,
    completionRate,
    averageWatchTime: Number(averageWatchTime?.averageWatchTime || 0),
  };
};

const getTopContent = async (
  creatorId,
  limit = 10
) => {
  const contentViews = await ContentView.findAll({
    where: {
      creatorId,
    },

    attributes: [
      "contentId",
      [fn("COUNT", col("id")), "views"],
    ],

    group: ["contentId"],

    order: [
      [fn("COUNT", col("id")), "DESC"],
    ],

    limit,

    raw: true,
  });

  const contentIds = contentViews.map(
    (item) => item.contentId
  );

  const contents = await Content.findAll({
    where: {
      id: contentIds,
    },

    include: [
      {
        model: Tier,
        as: "tier",
        attributes: ["id", "name"],
      },
    ],
  });

  const contentMap = {};

  contents.forEach((content) => {
    contentMap[content.id] = content;
  });

  return contentViews.map((item) => {
    const content =
      contentMap[item.contentId];

    return {
      id: item.contentId,

      title:
        content?.title ||
        "Untitled Content",

      views: Number(item.views || 0),

      tierName:
        content?.tier?.name ||
        "Free Tier",

      createdAt:
        content?.createdAt || null,
    };
  });
};
  


/**
 * Content-specific engagement
 */
const getContentEngagement = async (contentId) => {
  const [totalViews, uniqueViewers, completedViews, averageWatchTime] = await Promise.all([
    ContentView.count({
      where: { contentId },
    }),
    ContentView.count({
      where: { contentId },
      distinct: true,
      col: "viewerId",
    }),
    ContentView.count({
      where: { contentId, completed: true },
    }),
    ContentView.findOne({
      where: { contentId },
      attributes: [[fn("AVG", col("watchDuration")), "averageWatchTime"]],
      raw: true,
    }),
  ]);

  return {
    totalViews,
    uniqueViewers,
    completedViews,
    completionRate: totalViews > 0 ? Number(((completedViews / totalViews) * 100).toFixed(2)) : 0,
    averageWatchTime: Number(averageWatchTime?.averageWatchTime || 0),
  };
};

console.log("SERVICE FILE LOADED");

console.log({
  recordView: typeof recordView,
  getContentViews: typeof getContentViews,
  getCreatorEngagement: typeof getCreatorEngagement,
  getTopContent: typeof getTopContent,
  getContentEngagement: typeof getContentEngagement,
});

module.exports = {
  recordView,
  getContentViews,
  getCreatorEngagement,
  getTopContent,
  getContentEngagement,
};
