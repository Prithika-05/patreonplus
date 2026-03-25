const express = require("express");
const router = express.Router();

const subscriptionController = require("./subscription.controller");
const { authenticate, authorizeRole } = require("../auth/auth.middleware");

router.get("/my", subscriptionController.getMySubscriptions);
router.get("/", subscriptionController.getAllSubscriptions);

router.post("/", 
    authenticate,               
    authorizeRole("creator"),
    subscriptionController.subscribe);

module.exports = router;