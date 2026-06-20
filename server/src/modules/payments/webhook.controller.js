// server/src/modules/payments/webhook.controller.js
const { stripe } = require("./stripe.service");
const Subscription = require("../subscriptions/subscription.model"); 
const AppError = require("../../utils/AppError");
const Tier = require("../tiers/tier.model");
const PaymentEvent = require("./paymentEvent.model");

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // CRITICAL: req.body MUST be the raw buffer, not a parsed JSON object
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`❌ Webhook Signature Verification Failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 1. Prevent duplicate processing of the same Stripe Event ID immediately
  try {
    const existingEvent = await PaymentEvent.findOne({
      where: { stripeEventId: event.id },
    });

    if (existingEvent) {
      console.log(`ℹ️ Stripe Event ${event.id} already processed. Ignored.`);
      return res.status(200).json({ received: true, message: "Duplicate event ignored" });
    }
  } catch (err) {
    console.error(`❌ Failed tracking unique payment event:`, err.message);
    return res.status(500).json({ error: "Event tracking store unreachable" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        console.log("====================================");
        console.log("👉 WEBHOOK HIT 👈");
        console.log("Session ID:", session.id);
        console.log("Session Metadata:", session.metadata);
        console.log("====================================");

        // FIXED: Destructured as 'tier' to perfectly match your client payload signature
        const { subscriberId, tier: tierId } = session.metadata;
        
        if (!subscriberId || !tierId) {
          console.error("❌ Missing required operational metadata", session.metadata);
          return res.status(400).json({ error: "Missing Stripe metadata configuration properties" });
        }

        const tier = await Tier.findByPk(tierId);
        if (!tier) {
          console.error("❌ Target database tier record not found:", tierId);
          return res.status(400).json({ error: "Tier target signature mapping unavailable" });
        }

        const existingSub = await Subscription.findOne({
          where: { checkoutSessionId: session.id }
        });

        if (existingSub) {
          return res.status(200).json({ received: true, message: "Duplicate checkout session dropped" });
        }

        console.log(`💰 Payment success received for User ${subscriberId}, Tier ${tierId}`);

        const now = new Date();
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + tier.unlockDuration); 

        // Atomic storage operations
        await Subscription.create({
          subscriberId: subscriberId,
          creatorId: tier.creatorId,
          tierId: tierId,
          status: "active",
          startDate: now,
          endDate: endDate,
          stripeSubscriptionId: session.subscription || null, // Handles one-time billing configurations safely
          checkoutSessionId: session.id, 
        });

        // Record the event as successfully processed
        await PaymentEvent.create({ stripeEventId: event.id });
        return res.status(200).json({ received: true, message: "Subscription provisioning completed" });
      }

      case "customer.subscription.created": {
        const subscription = event.data.object;
        console.log(`🔄 Stripe Subscription engine contract built: ${subscription.id}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        console.log(`⚠️ Subscription canceled on Stripe dashboard: ${subscription.id}`);

        const localSub = await Subscription.findOne({
          where: { stripeSubscriptionId: subscription.id }
        });

        if (localSub) {
          await localSub.update({ status: "cancelled" });
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        if (!invoice.subscription) break; // Avoid updating one-time processing rows

        const subscription = await Subscription.findOne({
          where: { stripeSubscriptionId: invoice.subscription },
        });

        if (subscription) {
          const nextRenewal = new Date(invoice.lines.data[0].period.end * 1000);
          await subscription.update({
            status: "active",
            endDate: nextRenewal
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        if (!invoice.subscription) break;

        const subscription = await Subscription.findOne({
          where: { stripeSubscriptionId: invoice.subscription },
        });

        if (subscription) {
          await subscription.update({ status: "expired" });
        }
        break;
      }

      case "customer.subscription.updated": {
        const stripeSub = event.data.object;
        const localSub = await Subscription.findOne({
          where: { stripeSubscriptionId: stripeSub.id },
        });

        if (localSub) {
          await localSub.update({
            status: stripeSub.status === "active" ? "active" : "expired"
          });
        }
        break;
      }

      default:
        console.log(`⚠️ Unhandled Stripe Event Hook Type Received: ${event.type}`);
    }

    // Capture fallback executions safely
    await PaymentEvent.create({ stripeEventId: event.id });
    return res.status(200).json({ received: true });

  } catch (dbError) {
    console.error(`❌ Database operation failed inside webhook processing runtime:`, dbError.message);
    return res.status(500).json({ error: "Internal server processing failure" });
  }
};

module.exports = {
  handleWebhook,
};
