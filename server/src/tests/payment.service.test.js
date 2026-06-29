jest.mock("../modules/tiers/tier.model", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../modules/payments/stripe.service", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  },
}));

const paymentService = require("../modules/payments/payment.service");
const Tier = require("../modules/tiers/tier.model");
const { stripe } = require("../modules/payments/stripe.service");
const AppError = require("../utils/AppError");

describe("Payment Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.CLIENT_URL = "http://localhost:5173";
  });

  describe("createCheckoutSession", () => {

    it("should create checkout session successfully", async () => {

      Tier.findByPk.mockResolvedValue({
        id: "tier1",
        stripePriceId: "price_123",
      });

      stripe.checkout.sessions.create.mockResolvedValue({
        url: "https://checkout.stripe.com/test",
      });

      const result =
        await paymentService.createCheckoutSession(
          "tier1",
          "subscriber1"
        );

      expect(Tier.findByPk)
        .toHaveBeenCalledWith("tier1");

      expect(stripe.checkout.sessions.create)
        .toHaveBeenCalled();

      expect(result)
        .toBe("https://checkout.stripe.com/test");
    });

    it("should throw if tier does not exist", async () => {

      Tier.findByPk.mockResolvedValue(null);

      await expect(
        paymentService.createCheckoutSession(
          "tier1",
          "subscriber1"
        )
      ).rejects.toThrow(AppError);
    });

    it("should throw if stripePriceId is missing", async () => {

      Tier.findByPk.mockResolvedValue({
        id: "tier1",
        stripePriceId: null,
      });

      await expect(
        paymentService.createCheckoutSession(
          "tier1",
          "subscriber1"
        )
      ).rejects.toThrow(AppError);
    });

    it("should pass correct metadata to Stripe", async () => {

      Tier.findByPk.mockResolvedValue({
        id: "tier1",
        stripePriceId: "price_123",
      });

      stripe.checkout.sessions.create.mockResolvedValue({
        url: "https://checkout.stripe.com/test",
      });

      await paymentService.createCheckoutSession(
        "tier1",
        "subscriber1"
      );

      expect(
        stripe.checkout.sessions.create
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: {
            tierId: "tier1",
            subscriberId: "subscriber1",
          },
        })
      );
    });

    it("should throw when Stripe API fails", async () => {

      Tier.findByPk.mockResolvedValue({
        id: "tier1",
        stripePriceId: "price_123",
      });

      stripe.checkout.sessions.create.mockRejectedValue(
        new Error("Stripe Error")
      );

      await expect(
        paymentService.createCheckoutSession(
          "tier1",
          "subscriber1"
        )
      ).rejects.toThrow("Stripe Error");
    });

  });
});