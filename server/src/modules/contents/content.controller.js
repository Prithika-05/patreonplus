const contentService = require("./content.service");

const createContent = async (req, res) => {
  try {
    const content = await contentService.createContent(req.body, req.user.id);

    res.status(201).json({
      message: "Content created successfully",
      content,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const updateContent = async (req, res) => {
  try {
    const content = await contentService.updateContent(
      req.params.id,
      req.body,
      req.user.id,
    );
    res.status(201).json({
      message: "Content updated successfully",
      content,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getAllContents = async (req, res) => {
  const contents = await contentService.getAllContents(req.user.id);
  res.json(contents);
};

const getContentById = async (req, res) => {
  try {
    const content = await contentService.getContentById(
      req.params.id,
      req.user.id,
    );
    res.json(content);
  } catch (error) {
    if (error.message === "Content not found") {
      return res.status(404).json({ message: error.message });
    }
    if (
      error.message.includes("Access denied") ||
      error.message.includes("Unauthorized")
    ) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteContent = async (req, res) => {
  try {
    await contentService.deleteContent(req.params.id, req.user.id);

    res.json({
      message: "Content deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getSubscriberFeed = async (req, res) => {
  try {
    const contents = await contentService.getSubscriberFeed(req.user.id);
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createContent,
  getAllContents,
  getContentById,
  deleteContent,
  updateContent,
  getSubscriberFeed,
};