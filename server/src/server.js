require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/database");

require("./modules/users/user.model");
require("./modules/tiers/tier.model");
require("./modules/contents/content.model")

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {

    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync();
    console.log("All models synchronized");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Unable to connect to database:", error);
  }
}

startServer();