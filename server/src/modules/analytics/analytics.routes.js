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

module.exports = router;