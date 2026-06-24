const Content = require("./content.model");
const { Op } = require("sequelize");
const Subscription = require("../subscriptions/subscription.model");
const Tier = require("../tiers/tier.model");
const AppError = require("../../utils/AppError");
const uploadService = require("../uploads/upload.service"); 

const createContent = async (data, creatorId) => {
  if (!data.tierId) {
    throw new AppError("Tier ID is required", 400);
  }

  const tier = await Tier.findByPk(data.tierId);
  if (!tier) {
    throw new AppError("Invalid tier", 404);
  }

  if (tier.creatorId !== creatorId) {
    throw new AppError("You cannot use this tier", 403);
  }

  const existingContent = await Content.findOne({
    where: {
      creatorId,
      title: data.title,
    },
  });

  if (existingContent) {
    throw new AppError("Content with this title already exists", 409);
  }

  const content = await Content.create({
    title: data.title,
    description: data.description,
    fileKey: data.fileKey, // Stores clean relative path string keys from S3
    tierId: data.tierId,
    creatorId,
  });

  const secureUrl = await uploadService.getSecureUrl(content.fileKey);
  return {
    ...content.toJSON(),
    fileUrl: secureUrl,
  };
};

const updateContent = async (id, data, creatorId) => {
  const content = await Content.findByPk(id);
  if (!content) {
    throw new AppError("Content not found", 404);
  }

  if (content.creatorId !== creatorId) {
    throw new AppError("Unauthorized", 403);
  }

  if (!data.tierId) {
    throw new AppError("Tier ID is required", 400);
  }

  const tier = await Tier.findByPk(data.tierId);
  if (!tier) {
    throw new AppError("Invalid tier", 404);
  }

  if (tier.creatorId !== creatorId) {
    throw new AppError("You cannot use this tier", 403);
  }

  await content.update(data);
  
  const secureUrl = await uploadService.getSecureUrl(content.fileKey);
  return {
    ...content.toJSON(),
    fileUrl: secureUrl,
  };
};

const getAllContents = async (creatorId) => {
  const contents = await Content.findAll({
    where: { creatorId },
    order: [["createdAt", "DESC"]],
  });

  return await Promise.all(
    contents.map(async (item) => {
      const secureUrl = await uploadService.getSecureUrl(item.fileKey);
      return {
        ...item.toJSON(),
        fileUrl: secureUrl,
      };
    })
  );
};

const getContentById = async (id, userId) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const content = await Content.findByPk(id);
  if (!content) {
    throw new AppError("Content not found", 404);
  }

  const formatStep8Response = async (contentInstance) => {
    const secureUrl = await uploadService.getSecureUrl(contentInstance.fileKey);
    return {
      ...contentInstance.toJSON(),
      fileUrl: secureUrl,
    };
  };

  if (content.creatorId === userId) {
    return await formatStep8Response(content);
  }

  const now = new Date();
  const activeSub = await Subscription.findOne({
    where: {
      subscriberId: userId,
      creatorId: content.creatorId,
      status: "active",
      endDate: { [Op.gte]: now },
    },
    include: [{ model: Tier, as: "tier" }],
  });

  if (!activeSub) {
    throw new AppError("You must subscribe to view this content", 403);
  }

  const targetTier = await Tier.findByPk(content.tierId);
  if (targetTier.level > activeSub.tier.level) {
    throw new AppError("Upgrade your tier level to view this content", 403);
  }

  return await formatStep8Response(content);
};

const deleteContent = async (id, userId) => {
  const content = await Content.findByPk(id);
  if (!content) {
    throw new AppError("Content not found", 404);
  }

  if (content.creatorId !== userId) {
    throw new AppError("Unauthorized", 403);
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
    });
  });

  const results = await Promise.all(contentPromises);
  let feed = results.flat();

  feed = await Promise.all(
    feed.map(async (item) => {
      const secureUrl = await uploadService.getSecureUrl(item.fileKey);
      return {
        ...item.toJSON(),
        fileUrl: secureUrl,
      };
    })
  );

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
