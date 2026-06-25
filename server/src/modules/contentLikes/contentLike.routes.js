const express = require("express");
const router = express.Router();

const contentLikeController = require("./contentLike.controller");

const {
  authenticate,
  authorizeRole,
} = require("../auth/auth.middleware");

const validate = require("../../middleware/validate");

const {
  contentIdSchema,
} = require("../../validations/content.validation");

router.post(
  "/:id/toggle",
  authenticate,
  authorizeRole("subscriber"),
  validate(contentIdSchema, "params"),
  contentLikeController.toggleLike
);

router.get(
  "/:id",
  authenticate,
  authorizeRole("subscriber"),
  validate(contentIdSchema, "params"),
  contentLikeController.getLikes
);

module.exports = router;