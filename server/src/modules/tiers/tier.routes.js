const express = require("express");
const router = express.Router();

const tierController = require("./tier.controller");
const { authenticate, authorizeRole } = require("../auth/auth.middleware");
const validate = require("../../middleware/validate");

const {
  createTierSchema,
  updateTierSchema,
  tierIdSchema,
  reorderTiersSchema,
} = require("../../validations/tier.validation");

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
  validate(createTierSchema),
  tierController.createTier,
);

router.put(
  "/update/:id",
  authenticate,
  authorizeRole("creator"),
  validate(tierIdSchema, "params"),
  validate(updateTierSchema),
  tierController.updateTier,
);

router.delete(
  "/delete/:id",
  authenticate,
  authorizeRole("creator"),
  validate(tierIdSchema, "params"),
  tierController.deleteTier,
);

router.patch(
  "/reorder",
  authenticate,
  authorizeRole("creator"),
  validate(reorderTiersSchema),
  tierController.reorderTiers,
);

module.exports = router;