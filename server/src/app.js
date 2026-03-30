const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const tierRoutes = require("./modules/tiers/tier.routes");
const contentRoutes = require("./modules/contents/content.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tiers", tierRoutes);
app.use("/contents", contentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Patreon+ API Running" });
});

module.exports = app;