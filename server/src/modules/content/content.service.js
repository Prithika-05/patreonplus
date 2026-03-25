const Content = require("./content.model");

const createContent = async (data, creatorId) => {

  const content = await Content.create({
    ...data,
    creatorId
  });

  return content;
};

const getAllContent = async () => {
  return await Content.findAll();
};

const getContentById = async (id) => {
  return await Content.findByPk(id);
};

const deleteContent = async (id) => {

  const content = await Content.findByPk(id);

  if (!content) {
    throw new Error("Content not found");
  }

  await content.destroy();

  return true;
};

module.exports = {
  createContent,
  getAllContent,
  getContentById,
  deleteContent
};