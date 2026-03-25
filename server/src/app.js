const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const tierRoutes = require("./modules/tiers/tier.routes");
const contentRoutes = require("./modules/content/content.routes");
const subscriptionRoutes = require("./modules/subscriptions/subscription.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tiers", tierRoutes);
app.use("/content", contentRoutes);
app.use("/subscriptions", subscriptionRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Patreon+ API Running" });
});

module.exports = app;