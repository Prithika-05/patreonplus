const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { authenticate, authorizeRole } = require("../auth/auth.middleware");

router.get("/search", userController.searchUsers);

router.get("/profile/:username", userController.getPublicProfile);

module.exports = router;