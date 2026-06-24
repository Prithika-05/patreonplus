const express =
 require("express");

const {
 authenticate
} = require(
 "../auth/auth.middleware"
);

const controller =
 require("./payment.controller");

const webhookController = require("./webhook.controller");

const router =
 express.Router();


router.post(
 "/checkout",
 authenticate,
 controller.createCheckoutSession
);

module.exports = router;