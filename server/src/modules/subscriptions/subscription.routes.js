const express = require("express");
const router = express.Router();

const subscriptionController = require("./subscription.controller");
const { authenticate, authorizeRole } = require("../auth/auth.middleware");
const validate = require("../../middleware/validate");

const {
  subscribeSchema,
  subscriptionIdSchema,
} = require("../../validations/subscription.validation");

router.post(
  "/subscribe",
  authenticate,
  authorizeRole("subscriber"),
  validate(subscribeSchema),
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
  validate(subscriptionIdSchema, "params"),
  subscriptionController.cancelSubscription,
);

module.exports = router;
