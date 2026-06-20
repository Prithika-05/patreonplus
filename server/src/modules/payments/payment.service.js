// server/src/modules/payments/payment.service.js
const { stripe } = require("./stripe.service");
const Tier = require("../tiers/tier.model");
const AppError = require("../../utils/AppError");

const createCheckoutSession = async (tierId, subscriberId) => {
  const tier = await Tier.findByPk(tierId);

  if (!tier) {
    throw new AppError("Tier not found", 404);
  }

  if (!tier.stripePriceId) {
    throw new AppError("This tier does not have a valid payment product configured", 400);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"], 

    line_items: [
      {
        price: tier.stripePriceId,
        quantity: 1,
      },
    ],

    success_url: process.env.CLIENT_URL + "/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: process.env.CLIENT_URL + "/cancel",

    metadata: {
      tierId: tierId,
      subscriberId: subscriberId,
      createdAt: Date.now().toString(),
    },
  });

  return session.url;
};

module.exports = {
  createCheckoutSession,
};
