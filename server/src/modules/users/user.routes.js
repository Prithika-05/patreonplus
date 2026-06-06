const express = require("express");
const router = express.Router();

const userController = require("./user.controller");
const { authenticate, authorizeRole } = require("../auth/auth.middleware");
const validate = require("../../middleware/validate");

const {
  searchUserSchema,
  usernameParamSchema,
} = require("../../validations/user.validation");

router.get("/search", 
    authenticate,
    authorizeRole("subscriber"),
    validate(searchUserSchema, "query"),
    userController.searchUsers);

router.get("/profile/:username",
    authenticate,
    authorizeRole("subscriber"),
    validate(usernameParamSchema, "params"),
    userController.getPublicProfile);

module.exports = router;