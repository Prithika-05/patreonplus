const asyncHandler = require("../../utils/asyncHandler");
const contentCommentService = require("./contentComment.service");

const addComment = asyncHandler(async (req, res) => {
  const { id: contentId } = req.params;
  const { comment } = req.body;
  const userId = req.user.id;

  const newComment = await contentCommentService.addComment(
    contentId,
    userId,
    comment
  );

  return res.status(201).json({
    success: true,
    message: "Comment added successfully",
    data: newComment,
  });
});

const getComments = asyncHandler(async (req, res) => {
  const { id: contentId } = req.params;

  const comments = await contentCommentService.getComments(contentId);

  return res.status(200).json({
    success: true,
    data: comments,
  });
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  const userId = req.user.id;

  const updatedComment = await contentCommentService.updateComment(
    commentId,
    userId,
    comment
  );

  return res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    data: updatedComment,
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  await contentCommentService.deleteComment(commentId, userId);

  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});

const getCommentsCount = asyncHandler(async (req, res) => {
  const { id: contentId } = req.params;

  const commentsCount = await contentCommentService.getCommentsCount(contentId);

  return res.status(200).json({
    success: true,
    data: {
      commentsCount,
    },
  });
});

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  getCommentsCount,
};