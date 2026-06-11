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

module.exports = {
  subscribe,
  getMySubscriptions,
  cancelSubscription,
};
