const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const tierRoutes = require("./modules/tiers/tier.routes");
const contentRoutes = require("./modules/contents/content.routes");
const subscriptionRoutes = require("./modules/subscriptions/subscription.routes")
const userRoutes = require("./modules/users/user.routes")

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tiers", tierRoutes);
app.use("/api/contents", contentRoutes);
app.use("/api/subscriptions",subscriptionRoutes)
app.use("/api/users",userRoutes)

app.get("/", (req, res) => {
  res.json({ message: "Patreon+ API Running" });
});

module.exports = app;