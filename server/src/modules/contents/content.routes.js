const express = require("express");
const router = express.Router();

const contentController = require("./content.controller");

const { authenticate, authorizeRole } = require("../auth/auth.middleware");

const validate = require("../../middleware/validate");

const {
  createContentSchema,
  updateContentSchema,
  contentIdSchema,
} = require("../../validations/content.validation");

router.get(
  "/",
  authenticate,
  authorizeRole("creator"),
  contentController.getAllContents,
);

router.get(
  "/feed",
  authenticate,
  authorizeRole("subscriber"),
  contentController.getSubscriberFeed,
);

router.get(
  "/:id",
  authenticate,
  authorizeRole("creator"),
  validate(contentIdSchema, "params"),
  contentController.getContentById,
);

router.post(
  "/create",
  authenticate,
  authorizeRole("creator"),
  validate(createContentSchema),
  contentController.createContent,
);

router.put(
  "/update/:id",
  authenticate,
  authorizeRole("creator"),
  validate(contentIdSchema, "params"),
  validate(updateContentSchema),
  contentController.updateContent,
);

router.delete(
  "/delete/:id",
  authenticate,
  authorizeRole("creator"),
  validate(contentIdSchema, "params"),
  contentController.deleteContent,
);

module.exports = router;