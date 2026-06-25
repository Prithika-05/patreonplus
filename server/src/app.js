const express = require("express");
const cors = require("cors");


require("./modules/users/user.model");
require("./modules/tiers/tier.model");
require("./modules/subscriptions/subscription.model");
require("./modules/payments/paymentEvent.model"); 

const authRoutes = require("./modules/auth/auth.routes");
const tierRoutes = require("./modules/tiers/tier.routes");
const contentRoutes = require("./modules/contents/content.routes");
const contentLikeRoutes = require("./modules/contentLikes/contentLike.routes");
const subscriptionRoutes = require("./modules/subscriptions/subscription.routes");
const userRoutes = require("./modules/users/user.routes");
const paymentRoutes = require("./modules/payments/payment.routes");
const webhookController = require("./modules/payments/webhook.controller");
const errorHandler = require("./middleware/errorHandler");
const sanitize = require("./middleware/sanitize");
const uploadRoutes = require("./modules/uploads/upload.routes");
const contentCommentRoutes = require("./modules/contentComments/contentComment.routes");

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'authorization', 'X-Requested-With', 'Accept']
}));

app.post(
  "/payments/webhook",
  express.raw({ type: "application/json" }), 
  (req, res, next) => {
    if (!req.headers["stripe-signature"] || !req.body || req.body.length === 0) {
      console.log(`⚠️ Blocked non-Stripe trash request from user-agent: ${req.headers['user-agent']}`);
      return res.status(400).json({ error: "Invalid client payload layout drop" });
    }

    console.log("====================================");
    console.log("📥 VALID STRIPE WEBHOOK PACKET RECEIVED");
    console.log("Is Body a Buffer?:", Buffer.isBuffer(req.body));
    console.log("Body Length (Bytes):", req.body.length);
    console.log("====================================");
    next(); 
  },
  webhookController.handleWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitize);

const analyticsRoutes = require("./modules/analytics/analytics.routes");

app.use("/auth", authRoutes);
app.use("/tiers", tierRoutes);
app.use("/contents", contentRoutes);
app.use("/content-likes", contentLikeRoutes);
app.use("/content-comments", contentCommentRoutes);
app.use("/subscriptions",subscriptionRoutes)
app.use("/users",userRoutes)
app.use( "/payments", paymentRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/uploads",uploadRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "Patreon+ API Running" });
});

module.exports = app;