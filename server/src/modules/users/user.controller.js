const userService = require("./user.service");

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query required" });
    const users = await userService.searchUsers(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await userService.getPublicProfile(username);
    res.json(profile);
  } catch (error) {
    if (error.message === "User not found") return res.status(404).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchUsers, getPublicProfile };