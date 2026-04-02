const express = require("express");
const router = express.Router();

const subscriptionController = require("./subscription.controller");
const { authenticate, authorizeRole } = require("../auth/auth.middleware");

router.post(
  "/subscribe",
  authenticate,
  authorizeRole("subscriber"),
  subscriptionController.subscribe,
);

router.get(
  "/my-subscriptions",
  authenticate,
  authorizeRole("subscriber"),
  subscriptionController.getMySubscriptions,
);

router.patch(
  "/cancel/:id",
  authenticate,
  authorizeRole("subscriber"),
  subscriptionController.cancelSubscription,
);

module.exports = router;
