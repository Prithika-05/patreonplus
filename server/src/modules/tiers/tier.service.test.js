const tierService = require("./tier.service");
const Tier = require("./tier.model");
const AppError = require("../utils/AppError");
const sequelize = require("../config/database");

jest.mock("../src/modules/tiers/tier.model");
jest.mock("../src/config/database", () => ({
  transaction: jest.fn(),
}));

jest.mock("../src/modules/payments/stripe.service", () => ({
  stripe: {
    products: {
      create: jest.fn(),
    },
    prices: {
      create: jest.fn(),
    },
  },
}));

const {
  stripe,
} = require("../src/modules/payments/stripe.service");

describe("Tier Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTier", () => {
    const creatorId = "creator-1";

    const data = {
      name: "Gold",
      description: "Premium Tier",
      price: 20,
      unlockDuration: 30,
    };

    it("should create a tier successfully", async () => {
      Tier.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      stripe.products.create.mockResolvedValue({
        id: "prod_123",
      });

      stripe.prices.create.mockResolvedValue({
        id: "price_123",
      });

      Tier.create.mockResolvedValue({
        id: "tier1",
        ...data,
        creatorId,
        level: 1,
        stripePriceId: "price_123",
      });

      const result = await tierService.createTier(
        data,
        creatorId
      );

      expect(result.level).toBe(1);

      expect(stripe.products.create).toHaveBeenCalled();

      expect(stripe.prices.create).toHaveBeenCalled();

      expect(Tier.create).toHaveBeenCalled();
    });

    it("should throw if tier name already exists", async () => {
      Tier.findOne.mockResolvedValue({
        id: "existing",
      });

      await expect(
        tierService.createTier(data, creatorId)
      ).rejects.toThrow(AppError);
    });

    it("should assign next level correctly", async () => {
      Tier.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          level: 4,
        });

      stripe.products.create.mockResolvedValue({
        id: "prod",
      });

      stripe.prices.create.mockResolvedValue({
        id: "price",
      });

      Tier.create.mockResolvedValue({
        level: 5,
      });

      const result =
        await tierService.createTier(
          data,
          creatorId
        );

      expect(result.level).toBe(5);
    });

    it("should throw if stripe product creation fails", async () => {
      Tier.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      stripe.products.create.mockRejectedValue(
        new Error("Stripe Error")
      );

      await expect(
        tierService.createTier(data, creatorId)
      ).rejects.toThrow(AppError);
    });
  });

  describe("getAllTiers", () => {
    it("should return all tiers", async () => {
      const tiers = [{ id: 1 }, { id: 2 }];

      Tier.findAll.mockResolvedValue(tiers);

      const result =
        await tierService.getAllTiers("creator");

      expect(result).toEqual(tiers);
    });
  });

  describe("getTierById", () => {
    it("should return a tier", async () => {
      const tier = { id: "tier1" };

      Tier.findOne.mockResolvedValue(tier);

      const result =
        await tierService.getTierById(
          "tier1",
          "creator"
        );

      expect(result).toEqual(tier);
    });

    it("should throw if tier not found", async () => {
      Tier.findOne.mockResolvedValue(null);

      await expect(
        tierService.getTierById(
          "tier1",
          "creator"
        )
      ).rejects.toThrow(AppError);
    });
  });

  describe("updateTier", () => {
    it("should update tier", async () => {
      const update = jest.fn();

      Tier.findByPk.mockResolvedValue({
        creatorId: "creator",
        update,
      });

      await tierService.updateTier(
        "id",
        {
          name: "Updated",
        },
        "creator"
      );

      expect(update).toHaveBeenCalled();
    });

    it("should reject unauthorized creator", async () => {
      Tier.findByPk.mockResolvedValue({
        creatorId: "other",
      });

      await expect(
        tierService.updateTier(
          "id",
          {},
          "creator"
        )
      ).rejects.toThrow(AppError);
    });

    it("should reject price update", async () => {
      Tier.findByPk.mockResolvedValue({
        creatorId: "creator",
      });

      await expect(
        tierService.updateTier(
          "id",
          {
            price: 100,
          },
          "creator"
        )
      ).rejects.toThrow(AppError);
    });

    it("should throw if tier not found", async () => {
      Tier.findByPk.mockResolvedValue(null);

      await expect(
        tierService.updateTier(
          "id",
          {},
          "creator"
        )
      ).rejects.toThrow(AppError);
    });
  });

  describe("deleteTier", () => {
    it("should delete tier", async () => {
      const destroy = jest.fn();

      Tier.findByPk.mockResolvedValue({
        creatorId: "creator",
        destroy,
      });

      const result =
        await tierService.deleteTier(
          "id",
          "creator"
        );

      expect(result).toBe(true);

      expect(destroy).toHaveBeenCalled();
    });

    it("should reject unauthorized delete", async () => {
      Tier.findByPk.mockResolvedValue({
        creatorId: "other",
      });

      await expect(
        tierService.deleteTier(
          "id",
          "creator"
        )
      ).rejects.toThrow(AppError);
    });

    it("should throw if tier not found", async () => {
      Tier.findByPk.mockResolvedValue(null);

      await expect(
        tierService.deleteTier(
          "id",
          "creator"
        )
      ).rejects.toThrow(AppError);
    });
  });

  describe("reorderTiers", () => {
    it("should reorder tiers successfully", async () => {
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      sequelize.transaction.mockResolvedValue(
        transaction
      );

      const update = jest.fn();

      Tier.findByPk.mockResolvedValue({
        creatorId: "creator",
        update,
      });

      Tier.findAll.mockResolvedValue([
        {
          id: "1",
          level: 1,
        },
      ]);

      const result =
        await tierService.reorderTiers(
          [
            {
              id: "1",
              level: 1,
            },
          ],
          "creator"
        );

      expect(transaction.commit).toHaveBeenCalled();

      expect(result.length).toBe(1);
    });

    it("should rollback if tier not found", async () => {
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      sequelize.transaction.mockResolvedValue(
        transaction
      );

      Tier.findByPk.mockResolvedValue(null);

      await expect(
        tierService.reorderTiers(
          [
            {
              id: "1",
              level: 1,
            },
          ],
          "creator"
        )
      ).rejects.toThrow(AppError);

      expect(transaction.rollback).toHaveBeenCalled();
    });

    it("should rollback if unauthorized", async () => {
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      sequelize.transaction.mockResolvedValue(
        transaction
      );

      Tier.findByPk.mockResolvedValue({
        creatorId: "other",
      });

      await expect(
        tierService.reorderTiers(
          [
            {
              id: "1",
              level: 1,
            },
          ],
          "creator"
        )
      ).rejects.toThrow(AppError);

      expect(transaction.rollback).toHaveBeenCalled();
    });
  });
});