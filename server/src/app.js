const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const tierRoutes = require("./modules/tiers/tier.routes");
const contentRoutes = require("./modules/contents/content.routes");
const subscriptionRoutes = require("./modules/subscriptions/subscription.routes")
const userRoutes = require("./modules/users/user.routes")
const errorHandler = require("./middleware/errorHandler");
const sanitize = require("./middleware/sanitize");
const uploadRoutes = require("./modules/uploads/upload.routes");
const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());
app.use(sanitize);

app.use("/auth", authRoutes);
app.use("/tiers", tierRoutes);
app.use("/contents", contentRoutes);
app.use("/subscriptions",subscriptionRoutes)
app.use("/users",userRoutes)
app.use("/uploads",uploadRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "Patreon+ API Running" });
});

module.exports = app;