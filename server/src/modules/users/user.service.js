const User = require("./user.model");
const Tier = require("../tiers/tier.model");

const searchUsers = async (query) => {
  return await User.findAll({
    where: {
      username: { [require('sequelize').Op.like]: `%${query}%` }
    },
    attributes: ['id', 'name', 'username', 'role', 'bio', 'profileImage']
  });
};

const getPublicProfile = async (username) => {
  const user = await User.findOne({
    where: { username },
    attributes: ['id', 'name', 'username', 'bio', 'profileImage', 'role']
  });

  if (!user) throw new Error("User not found");
  
  let tiers = [];
  if (user.role === 'creator') {
    tiers = await Tier.findAll({
      where: { creatorId: user.id },
      order: [['level', 'ASC']]
    });
  }

  return { user, tiers };
};

module.exports = { searchUsers, getPublicProfile };