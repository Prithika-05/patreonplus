const ContentLike = require("./contentLike.model");
const Content = require("../contents/content.model");
const AppError = require("../../utils/AppError");

const toggleLike = async (contentId, userId) => {
  // Check if the content exists
  const content = await Content.findByPk(contentId);

  if (!content) {
    throw new AppError("Content not found", 404);
  }

  // Check if the user has already liked it
  const existingLike = await ContentLike.findOne({
    where: {
      contentId,
      userId,
    },
  });

  let liked = false;

  if (existingLike) {
    // Unlike
    await existingLike.destroy();
    liked = false;
  } else {
    // Like
    await ContentLike.create({
      contentId,
      userId,
    });
    liked = true;
  }

  const likesCount = await ContentLike.count({
    where: {
      contentId,
    },
  });

  return {
    liked,
    likesCount,
  };
};

const getLikesCount = async (contentId) => {
  return await ContentLike.count({
    where: {
      contentId,
    },
  });
};

const hasUserLiked = async (contentId, userId) => {
  const like = await ContentLike.findOne({
    where: {
      contentId,
      userId,
    },
  });

  return !!like;
};

module.exports = {
  toggleLike,
  getLikesCount,
  hasUserLiked,
};