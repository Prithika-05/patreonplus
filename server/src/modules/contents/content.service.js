const Content = require("./content.model");
const Tier = require("../tiers/tier.model");
const User = require("../users/user.model");

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

module.exports = {
  createContent,
  getAllContents,
  getContentById,
  deleteContent,
  updateContent,
};