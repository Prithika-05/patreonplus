jest.mock("./subscription.model", () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
}));
jest.mock("../tiers/tier.model", () => ({
  findByPk: jest.fn(),
}));
jest.mock("../users/user.model", () => ({}));

const subscriptionService = require("./subscription.service");
const Subscription = require("./subscription.model");
const Tier = require("../tiers/tier.model");
const AppError = require("../../utils/AppError");


describe("Subscription Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("subscribe", () => {
    const userId = "subscriber-1";

    const tier = {
      id: "tier-1",
      creatorId: "creator-1",
      unlockDuration: 30,
    };

    it("should create a new subscription", async () => {
      Tier.findByPk.mockResolvedValue(tier);

      Subscription.findOne.mockResolvedValue(null);

      Subscription.create.mockResolvedValue({
        id: "sub-1",
        subscriberId: userId,
      });

      const result = await subscriptionService.subscribe(
        userId,
        tier.id
      );

      expect(Tier.findByPk).toHaveBeenCalledWith(tier.id);

      expect(Subscription.create).toHaveBeenCalled();

      expect(result.id).toBe("sub-1");
    });

    it("should update an existing subscription", async () => {
      Tier.findByPk.mockResolvedValue(tier);

      const save = jest.fn();

      const existing = {
        subscriberId: userId,
        creatorId: tier.creatorId,
        save,
      };

      Subscription.findOne.mockResolvedValue(existing);

      const result = await subscriptionService.subscribe(
        userId,
        tier.id
      );

      expect(save).toHaveBeenCalled();

      expect(result).toBe(existing);
    });

    it("should throw when tier does not exist", async () => {
      Tier.findByPk.mockResolvedValue(null);

      await expect(
        subscriptionService.subscribe(userId, "tier")
      ).rejects.toThrow(AppError);
    });

    it("should prevent creator from subscribing to own tier", async () => {
      Tier.findByPk.mockResolvedValue({
        creatorId: userId,
      });

      await expect(
        subscriptionService.subscribe(userId, "tier")
      ).rejects.toThrow(AppError);
    });
  });

  describe("getMySubscriptions", () => {
    it("should return subscriptions", async () => {
      const subscriptions = [
        { id: "1" },
        { id: "2" },
      ];

      Subscription.findAll.mockResolvedValue(subscriptions);

      const result =
        await subscriptionService.getMySubscriptions(
          "user"
        );

      expect(result).toEqual(subscriptions);

      expect(Subscription.findAll).toHaveBeenCalled();
    });

    it("should return empty array", async () => {
      Subscription.findAll.mockResolvedValue([]);

      const result =
        await subscriptionService.getMySubscriptions(
          "user"
        );

      expect(result).toEqual([]);
    });
  });

  describe("cancelSubscription", () => {
    it("should cancel subscription", async () => {
      const save = jest.fn();

      const subscription = {
        subscriberId: "user",
        status: "active",
        save,
      };

      Subscription.findByPk.mockResolvedValue(
        subscription
      );

      const result =
        await subscriptionService.cancelSubscription(
          "id",
          "user"
        );

      expect(subscription.status).toBe("cancelled");

      expect(save).toHaveBeenCalled();

      expect(result).toBe(subscription);
    });

    it("should throw if subscription not found", async () => {
      Subscription.findByPk.mockResolvedValue(null);

      await expect(
        subscriptionService.cancelSubscription(
          "id",
          "user"
        )
      ).rejects.toThrow(AppError);
    });

    it("should reject unauthorized user", async () => {
      Subscription.findByPk.mockResolvedValue({
        subscriberId: "someoneElse",
      });

      await expect(
        subscriptionService.cancelSubscription(
          "id",
          "user"
        )
      ).rejects.toThrow(AppError);
    });
  });

  describe("getSubscriptionBySessionId", () => {
    it("should return subscription", async () => {
      const subscription = {
        id: "sub-1",
      };

      Subscription.findOne.mockResolvedValue(
        subscription
      );

      const result =
        await subscriptionService.getSubscriptionBySessionId(
          "session123"
        );

      expect(result).toEqual(subscription);

      expect(
        Subscription.findOne
      ).toHaveBeenCalledWith({
        where: {
          checkoutSessionId: "session123",
        },
      });
    });

    it("should return null if session does not exist", async () => {
      Subscription.findOne.mockResolvedValue(null);

      const result =
        await subscriptionService.getSubscriptionBySessionId(
          "invalid"
        );

      expect(result).toBeNull();
    });
  });
});