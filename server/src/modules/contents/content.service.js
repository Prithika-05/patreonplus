const Content = require("./content.model");
const { Op } = require("sequelize");
const Subscription = require("../subscriptions/subscription.model");
const Tier = require("../tiers/tier.model");

const createContent = async (data, creatorId) => {
  if (!data.tierId) {
    throw new Error("tierId is required");
  }

  const tier = await Tier.findByPk(data.tierId);

  if (!tier) {
    throw new Error("Invalid tier");
  }

  if (tier.creatorId !== creatorId) {
    throw new Error("You cannot use this tier");
  }

  return await Content.create({
    title: data.title,
    description: data.description,
    fileUrl: data.fileUrl,
    tierId: data.tierId,
    creatorId,
  });
};

const updateContent = async (id, data, creatorId) => {
  const content = await Content.findByPk(id);

  if (!data.tierId) {
    throw new Error("tierId is required");
  }

  const tier = await Tier.findByPk(data.tierId);

  if (!tier) {
    throw new Error("Invalid tier");
  }

  if (tier.creatorId !== creatorId) {
    throw new Error("You cannot use this tier");
  }

  await content.update(data);
  return content;
};
const getAllContents = async (creatorId) => {
  return await Content.findAll({
    where: { creatorId },
  });
};

const getContentById = async (id, userId) => {
  if (!userId) {
    throw new Error("User ID is required to access content");
  }

  const content = await Content.findOne({
    where: {
      id,
      creatorId: userId,
    },
  });

  if (!content) {
    throw new Error("Content not found");
  }

  if (content.creatorId !== userId) {
    throw new Error("Unauthorized to access this content");
  }

  return content;
};
const deleteContent = async (id, userId) => {
  const content = await Content.findByPk(id);

  if (!content) {
    throw new Error("Content not found");
  }

  if (content.creatorId !== userId) {
    throw new Error("Unauthorized to delete this content");
  }

  await content.destroy();
  return true;
};

const getSubscriberFeed = async (userId) => {
  const now = new Date();

  const subscriptions = await Subscription.findAll({
    where: {
      subscriberId: userId,
      status: "active",
      endDate: { [Op.gte]: now },
    },
    include: [{ model: Tier, as: "tier" }],
  });

  if (subscriptions.length === 0) {
    return [];
  }
  
  const contentPromises = subscriptions.map(async (sub) => {
    const creatorId = sub.creatorId;
    const subscribedLevel = sub.tier.level;

    const accessibleTiers = await Tier.findAll({
      where: {
        creatorId,
        level: { [Op.lte]: subscribedLevel },
      },
      attributes: ["id"],
    });

    const tierIds = accessibleTiers.map((t) => t.id);

    return await Content.findAll({
      where: {
        creatorId,
        tierId: { [Op.in]: tierIds },
      },
      include: [
        { model: Tier, as: "tier" },
        { model: require("../users/user.model"), as: "creator" },
      ],
      order: [["createdAt", "DESC"]],
    });
  });

  const results = await Promise.all(contentPromises);
  let feed = results.flat();

  feed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return feed;
};

module.exports = {
  createContent,
  getAllContents,
  getContentById,
  deleteContent,
  updateContent,
  getSubscriberFeed,
};