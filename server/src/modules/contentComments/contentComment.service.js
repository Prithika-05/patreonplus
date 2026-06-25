const ContentComment = require("./contentComment.model");
const Content = require("../contents/content.model");
const User = require("../users/user.model");
const AppError = require("../../utils/AppError");

const addComment = async (contentId, userId, comment) => {
  const content = await Content.findByPk(contentId);

  if (!content) {
    throw new AppError("Content not found", 404);
  }

  const newComment = await ContentComment.create({
    contentId,
    userId,
    comment,
  });

  return await ContentComment.findByPk(newComment.id, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "username", "profileImage"],
      },
    ],
  });
};

const getComments = async (contentId) => {
  const content = await Content.findByPk(contentId);

  if (!content) {
    throw new AppError("Content not found", 404);
  }

  return await ContentComment.findAll({
    where: {
      contentId,
    },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "username", "profileImage"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const updateComment = async (commentId, userId, comment) => {
  const existingComment = await ContentComment.findByPk(commentId);

  if (!existingComment) {
    throw new AppError("Comment not found", 404);
  }

  if (existingComment.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  await existingComment.update({
    comment,
  });

  return existingComment;
};

const deleteComment = async (commentId, userId) => {
  const existingComment = await ContentComment.findByPk(commentId);

  if (!existingComment) {
    throw new AppError("Comment not found", 404);
  }

  if (existingComment.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  await existingComment.destroy();

  return true;
};

const getCommentsCount = async (contentId) => {
  return await ContentComment.count({
    where: {
      contentId,
    },
  });
};

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  getCommentsCount,
};