const express = require("express");
const router = express.Router();

const contentController = require("./content.controller");

const { authenticate, authorizeRole } = require("../auth/auth.middleware");

router.get(
  "/",
  authenticate,
  authorizeRole("creator"),
  contentController.getAllContents,
);

router.get(
  "/:id",
  authenticate,
  authorizeRole("creator"),
  contentController.getContentById,
);

router.post(
  "/create",
  authenticate,
  authorizeRole("creator"),
  contentController.createContent,
);

router.put(
  "/update/:id",
  authenticate,
  authorizeRole("creator"),
  contentController.updateContent,
);

router.delete(
  "/delete/:id",
  authenticate,
  authorizeRole("creator"),
  contentController.deleteContent,
);

module.exports = router;