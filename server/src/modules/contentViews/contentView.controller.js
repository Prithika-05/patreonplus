const asyncHandler = require("../../utils/asyncHandler");
const contentViewService = require("./contentView.service");

const recordView = asyncHandler(
  async (req, res) => {
    const {
      contentId,
      watchDuration,
      completed,
      source,
      creatorId, 
    } = req.body;

    const view = await contentViewService.recordView({
      contentId,
      viewerId: req.user.id,
      creatorId: creatorId, 
      watchDuration,
      completed,
      source,
    });

    return res.status(201).json({
      success: true,
      message: "Content view recorded successfully",
      data: view,
    });
  }
);


const getContentViews = asyncHandler(async (req, res) => {
  const { contentId } = req.params;

  const data = await contentViewService.getContentViews(contentId);

  return res.status(200).json({
    success: true,
    data,
  });
});


const getCreatorEngagement = asyncHandler(async (req, res) => {
  const data = await contentViewService.getCreatorEngagement(req.user.id);

  return res.status(200).json({
    success: true,
    data,
  });
});


const getTopContent = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 10);

  const data = await contentViewService.getTopContent(
    req.user.id,
    limit
  );

  return res.status(200).json({
    success: true,
    data,
  });
});


const getContentEngagement = asyncHandler(async (req, res) => {
  const { contentId } = req.params;

  const data = await contentViewService.getContentEngagement(contentId);

  return res.status(200).json({
    success: true,
    data,
  });
});

module.exports = {
  recordView,
  getContentViews,
  getCreatorEngagement,
  getTopContent,
  getContentEngagement,
};
