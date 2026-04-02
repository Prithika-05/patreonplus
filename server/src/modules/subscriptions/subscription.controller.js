const subscriptionService = require("./subscription.service");

const subscribe = async (req, res) => {
  try {
    const { tierId } = req.body;

    const subscription = await subscriptionService.subscribe(
      req.user.id,
      tierId,
    );

    res.status(201).json({
      message: "Subscribed successfully",
      subscription,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getMySubscriptions = async (req, res) => {
  const subscriptions = await subscriptionService.getMySubscriptions(
    req.user.id,
  );

  res.json(subscriptions);
};

const cancelSubscription = async (req, res) => {
  try {
    const subscription = await subscriptionService.cancelSubscription(
      req.params.id,
      req.user.id,
    );

    res.json({
      message: "Subscription cancelled",
      subscription,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  subscribe,
  getMySubscriptions,
  cancelSubscription,
};
