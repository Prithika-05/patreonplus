// server/src/modules/subscriptions/subscription.controller.js

const subscriptionService = require("./subscription.service");
const asyncHandler = require("../../utils/asyncHandler");

const subscribe = asyncHandler(async (req, res) => {
  const { tierId } = req.body;

  const subscription = await subscriptionService.subscribe(
    req.user.id,
    tierId
  );

  return res.status(201).json({
    success: true,
    message: "Subscribed successfully",
    data: subscription,
  });
});

const getMySubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await subscriptionService.getMySubscriptions(
    req.user.id
  );
  
  return res.status(200).json({
    success: true,
    data: subscriptions,
  });
});

const cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.cancelSubscription(
    req.params.id,
    req.user.id
  );

  return res.status(200).json({
    success: true,
    message: "Subscription cancelled successfully",
    data: subscription,
  });
});

const checkPaymentStatus = asyncHandler(async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({
      success: false,
      message: "Missing session_id query parameter",
    });
  }

  try {
    const subscription = await subscriptionService.getSubscriptionBySessionId(session_id);

    if (!subscription) {
      return res.status(200).json({
        success: true,
        status: "pending",
      });
    }

    return res.status(200).json({
      success: true,
      status: subscription.status, 
    });

  } catch (rawError) {
    return res.status(500).json({
      success: false,
      message: "Backend Diagnostic Triggered",
      errorDetails: rawError.message,
      stack: rawError.stack
    });
  }
});


module.exports = {
  subscribe,
  getMySubscriptions,
  cancelSubscription,
  checkPaymentStatus, 
};
