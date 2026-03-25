const Subscription = require("../subscriptions/subscription.model");

const getContentById = async (id, userId) => {

  const content = await Content.findByPk(id);

  if (!content) {
    throw new Error("Content not found");
  }

  const subscription = await Subscription.findOne({
    where: {
      subscriberId: userId,
      tierId: content.tierId,
      status: "active"
    }
  });

  if (!subscription) {
    throw new Error("Access denied. Subscribe to this tier.");
  }

  return content;
};