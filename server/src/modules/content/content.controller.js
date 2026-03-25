const contentService = require("./content.service");

const createContent = async (req, res) => {

  try {

    const content = await contentService.getContentById(
       req.params.id,
       req.user.id
    );

    res.status(201).json({
      message: "Content created successfully",
      content
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};

const getContents = async (req, res) => {

  const contents = await contentService.getAllContent();

  res.json(contents);

};

const getContent = async (req, res) => {

  const content = await contentService.getContentById(req.params.id);

  res.json(content);

};

const deleteContent = async (req, res) => {

  try {

    await contentService.deleteContent(req.params.id);

    res.json({
      message: "Content deleted"
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};

module.exports = {
  createContent,
  getContents,
  getContent,
  deleteContent
};