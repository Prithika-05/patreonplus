const subscriptionService = require("./subscription.service");

const subscribe = async (req, res) => {

  try {

    const { tierId } = req.body;

    const subscription = await subscriptionService.createSubscription(
      tierId,
      req.user.id
    );

    res.status(201).json({
      message: "Subscribed successfully",
      subscription
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};

const getMySubscriptions = async (req, res) => {

  const subscriptions = await subscriptionService.getUserSubscriptions(
    req.user.id
  );

  res.json(subscriptions);

};

const getAllSubscriptions = async (req, res) => {

  const subscriptions = await subscriptionService.getAllSubscriptions();

  res.json(subscriptions);

};

module.exports = {
  subscribe,
  getMySubscriptions,
  getAllSubscriptions
};