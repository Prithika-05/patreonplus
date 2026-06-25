const asyncHandler = require("../../utils/asyncHandler");
const contentLikeService = require("./contentLike.service");

const toggleLike = asyncHandler(async (req, res) => {
  const { id: contentId } = req.params;
  const userId = req.user.id;

  const result = await contentLikeService.toggleLike(
    contentId,
    userId
  );

  return res.status(200).json({
    success: true,
    message: result.liked
      ? "Content liked successfully"
      : "Content unliked successfully",
    data: result,
  });
});

const getLikes = asyncHandler(async (req, res) => {
  const { id: contentId } = req.params;
  const userId = req.user.id;

  const [likesCount, liked] = await Promise.all([
    contentLikeService.getLikesCount(contentId),
    contentLikeService.hasUserLiked(contentId, userId),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      likesCount,
      liked,
    },
  });
});

module.exports = {
  toggleLike,
  getLikes,
};