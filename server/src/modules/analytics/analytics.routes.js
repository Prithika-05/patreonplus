const express = require("express");

const {
  authenticate,
  authorizeRole,
} = require("../auth/auth.middleware");

const validate = require("../../middleware/validate");
const { analyticsQuerySchema } = require("../../validations/analytics.validation");
const controller = require("./analytics.controller");

const router = express.Router();

router.get(
  "/overview",
  authenticate,
  authorizeRole("creator"),
  validate(analyticsQuerySchema, "query"),
  controller.getOverview
);

router.get(
  "/recent-subscribers",
  authenticate,
  authorizeRole("creator"),
  controller.getRecentSubscribers
);

router.get(
  "/subscriber-growth",
  authenticate,
  authorizeRole("creator"),
  validate(analyticsQuerySchema, "query"),
  controller.getSubscriberGrowth
);

router.get(
  "/revenue-history",
  authenticate,
  authorizeRole("creator"),
  validate(analyticsQuerySchema, "query"),
  controller.getRevenueHistory
);

router.get(
  "/churn",
  authenticate,
  authorizeRole("creator"),
  controller.getChurnRate
);

router.get(
  "/tier-performance",
  authenticate,
  authorizeRole("creator"),
  controller.getTierPerformance
);

module.exports = router;