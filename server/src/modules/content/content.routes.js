const express = require("express");
const router = express.Router();

const contentController = require("./content.controller");

const { authenticate, authorizeRole } = require("../auth/auth.middleware");

router.get("/", contentController.getContents);
router.get("/:id", contentController.getContent);

router.post("/", 
  authenticate,               
  authorizeRole("creator"),   
  contentController.createContent 
);

router.delete("/:id", 
  authenticate, 
  authorizeRole("creator"), 
  contentController.deleteContent
);

module.exports = router;