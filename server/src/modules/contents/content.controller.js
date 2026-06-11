const contentService = require("./content.service");
const asyncHandler = require("../../utils/asyncHandler");

const createContent = asyncHandler(async (req, res) => {
    const content =
      await contentService.createContent(
        req.body,
        req.user.id
      );

    return res.status(201).json({
      success: true,
      message: "Content created successfully",
      data: content,
    });
  });

const updateContent = asyncHandler(async (req, res) => {
  const content = await contentService.updateContent(
    req.params.id,
    req.body,
    req.user.id
  );
  
  return res.status(201).json({
    success: true,
    message: "Content updated successfully",
    data: content,
  });
});

const getAllContents = asyncHandler(async (req, res) => {
  const contents = await contentService.getAllContents(req.user.id);
  
  return res.status(200).json({
    success: true,
    data: contents,
  });
});

const getContentById = asyncHandler(async (req, res) => {
  const content = await contentService.getContentById(
    req.params.id,
    req.user.id
  );
  
  return res.status(200).json({
    success: true,
    data: content,
  });
});

const deleteContent = asyncHandler(async (req, res) => {
  await contentService.deleteContent(req.params.id, req.user.id);

  return res.status(200).json({
    success: true,
    message: "Content deleted successfully",
  });
});

const getSubscriberFeed = asyncHandler(async (req, res) => {
  const contents = await contentService.getSubscriberFeed(req.user.id);
  
  return res.status(200).json({
    success: true,
    data: contents,
  });
});

module.exports = {
  createContent,
  getAllContents,
  getContentById,
  deleteContent,
  updateContent,
  getSubscriberFeed,
};