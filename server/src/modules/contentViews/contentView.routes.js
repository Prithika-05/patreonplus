const express = require("express");

const router = express.Router();

const contentViewController = require("./contentView.controller");

const validate = require("./contentView.middleware");

const {
  authenticate,
  authorizeRole,
} = require("../auth/auth.middleware");

const {
  recordViewSchema,
  contentIdParamSchema,
  topContentQuerySchema,
  contentEngagementSchema,
} = require("../../validations/contentView.validation");

router.post(
  "/",
  authenticate,
  validate(recordViewSchema),
  contentViewController.recordView
);

router.get(
  "/:contentId",
  authenticate,
  validate(contentIdParamSchema),
  contentViewController.getContentViews
);

router.get(
  "/analytics/top-content",
  authenticate,
  authorizeRole("creator"),
  validate(topContentQuerySchema),
  contentViewController.getTopContent
);

router.get(
  "/analytics/content/:contentId",
  authenticate,
  authorizeRole("creator"),
  validate(contentEngagementSchema),
  contentViewController.getContentEngagement
);

module.exports = router;