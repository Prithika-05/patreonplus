const express = require("express");
const router = express.Router();

const contentCommentController = require("./contentComment.controller");

const {
  authenticate,
  authorizeRole,
} = require("../auth/auth.middleware");

const validate = require("../../middleware/validate");

const {
  addCommentSchema,
  updateCommentSchema,
  contentIdSchema,
  commentIdSchema,
} = require("../../validations/contentComment.validation");

router.post(
  "/:id",
  authenticate,
  authorizeRole("subscriber"),
  validate(contentIdSchema, "params"),
  validate(addCommentSchema),
  contentCommentController.addComment
);

router.get(
  "/:id",
  authenticate,
  validate(contentIdSchema, "params"),
  contentCommentController.getComments
);

router.put(
  "/:commentId",
  authenticate,
  validate(commentIdSchema, "params"),
  validate(updateCommentSchema),
  contentCommentController.updateComment
);

router.delete(
  "/:commentId",
  authenticate,
  validate(commentIdSchema, "params"),
  contentCommentController.deleteComment
);

router.get(
  "/:id/count",
  authenticate,
  validate(contentIdSchema, "params"),
  contentCommentController.getCommentsCount
);

module.exports = router;