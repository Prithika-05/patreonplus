const User = require("./user.model");
const Tier = require("../tiers/tier.model");

const AppError = require("../../utils/AppError");

const {
  searchUsers,
  getPublicProfile,
  getMyProfile,
} = require("./user.service");

jest.mock("./user.model", () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock("../tiers/tier.model", () => ({
  findAll: jest.fn(),
}));

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("searchUsers()", () => {
    test("should return top creators when query is empty", async () => {
      User.findAll.mockResolvedValue([
        {
          id: "1",
          name: "Creator One",
          username: "creator1",
          role: "creator",
          subscriberCount: "10",
        },
        {
          id: "2",
          name: "Creator Two",
          username: "creator2",
          role: "creator",
          subscriberCount: "5",
        },
      ]);

      const result = await searchUsers("");

      expect(User.findAll).toHaveBeenCalled();

      expect(result).toHaveLength(2);

      expect(result[0].subscriberCount).toBe(10);
      expect(result[1].subscriberCount).toBe(5);
    });

    test("should search creators by username", async () => {
      User.findAll.mockResolvedValue([
        {
          id: "1",
          username: "john",
          subscriberCount: "3",
        },
      ]);

      const result = await searchUsers("john");

      expect(User.findAll).toHaveBeenCalled();

      expect(result[0].username).toBe("john");
    });

    test("should return empty array when no creators found", async () => {
      User.findAll.mockResolvedValue([]);

      const result = await searchUsers("unknown");

      expect(result).toEqual([]);
    });
  });

  describe("getPublicProfile()", () => {
    test("should return creator profile with tiers", async () => {
      User.findOne.mockResolvedValue({
        id: "1",
        username: "creator",
        role: "creator",
      });

      Tier.findAll.mockResolvedValue([
        {
          id: "tier1",
          name: "Bronze",
        },
      ]);

      const result =
        await getPublicProfile("creator");

      expect(User.findOne).toHaveBeenCalled();

      expect(Tier.findAll).toHaveBeenCalled();

      expect(result.user.username).toBe(
        "creator"
      );

      expect(result.tiers).toHaveLength(1);
    });

    test("should return subscriber profile without tiers", async () => {
      User.findOne.mockResolvedValue({
        id: "2",
        username: "subscriber",
        role: "subscriber",
      });

      const result =
        await getPublicProfile(
          "subscriber"
        );

      expect(Tier.findAll).not.toHaveBeenCalled();

      expect(result.tiers).toEqual([]);
    });

    test("should throw when user is not found", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(
        getPublicProfile("unknown")
      ).rejects.toThrow(AppError);
    });
  });

  describe("getMyProfile()", () => {
    test("should return user profile", async () => {
      User.findByPk.mockResolvedValue({
        id: "1",
        username: "john",
      });

      const result =
        await getMyProfile("1");

      expect(User.findByPk).toHaveBeenCalled();

      expect(result.username).toBe("john");
    });

    test("should throw when user does not exist", async () => {
      User.findByPk.mockResolvedValue(null);

      await expect(
        getMyProfile("100")
      ).rejects.toThrow(AppError);
    });
  });
});