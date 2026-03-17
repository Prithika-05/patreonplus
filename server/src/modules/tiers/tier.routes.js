const express = require("express");
const router = express.Router();

const tierController = require("./tier.controller");
const { authenticate, authorizeRole } = require("../auth/auth.middleware");

router.get("/", tierController.getTiers);        
router.get("/:id", tierController.getTier);

router.post("/", 
  authenticate, 
  authorizeRole("creator"), 
  tierController.createTier
);

router.put("/:id", 
  authenticate, 
  authorizeRole("creator"), 
  tierController.updateTier
);

router.delete("/:id", 
  authenticate, 
  authorizeRole("creator"), 
  tierController.deleteTier
);

module.exports = router;