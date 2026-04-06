const User = require("./user.model");
const Tier = require("../tiers/tier.model");
const { Op } = require("sequelize");

const searchUsers = async (query) => {
  const isEmptyQuery = !query || query.trim() === '';

  const whereClause = {
    role: 'creator' 
  };

  const options = {
    where: whereClause,
    attributes: ['id', 'name', 'username', 'role', 'bio', 'profileImage', 'createdAt'],
    order: [['createdAt', 'DESC']],
  };

  if (!isEmptyQuery) {
    whereClause.username = { [Op.like]: `%${query.trim()}%` };
  } else {
    options.limit = 5;
  }

  return await User.findAll(options);
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