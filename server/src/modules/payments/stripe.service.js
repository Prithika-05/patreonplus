const Stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("CRITICAL ERROR: STRIPE_SECRET_KEY is missing from environment variables.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16", 
});

module.exports = { stripe };