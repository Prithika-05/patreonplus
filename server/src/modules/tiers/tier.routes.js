const express = require("express");
const router = express.Router();

const tierController = require("./tier.controller");
const { authenticate, authorizeRole } = require("../auth/auth.middleware");

router.get(
  "/",
  authenticate,
  authorizeRole("creator"),
  tierController.getAllTiers,
);

router.get(
  "/:id",
  authenticate,
  authorizeRole("creator"),
  tierController.getTierById,
);

router.post(
  "/create",
  authenticate,
  authorizeRole("creator"),
  tierController.createTier,
);

router.put(
  "/update/:id",
  authenticate,
  authorizeRole("creator"),
  tierController.updateTier,
);

router.delete(
  "/delete/:id",
  authenticate,
  authorizeRole("creator"),
  tierController.deleteTier,
);

router.patch(
  "/reorder",
  authenticate,
  authorizeRole("creator"),
  tierController.reorderTiers,
);

module.exports = router;