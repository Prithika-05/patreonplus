jest.mock("./user.model", () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../tiers/tier.model", () => ({
  findAll: jest.fn(),
}));

const { searchUsers, getPublicProfile } = require("./user.service");
const User = require("./user.model");
const Tier = require("../tiers/tier.model");
const { Op } = require("sequelize");

describe("User Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("searchUsers", () => {
    it("should return latest 5 creators when query is empty", async () => {
      const mockUsers = [{ id: 1 }, { id: 2 }];
      User.findAll.mockResolvedValue(mockUsers);

      const result = await searchUsers("");

      expect(User.findAll).toHaveBeenCalledWith({
        where: { role: "creator" },
        attributes: [
          "id",
          "name",
          "username",
          "role",
          "bio",
          "profileImage",
          "createdAt",
        ],
        order: [["createdAt", "DESC"]],
        limit: 5,
      });

      expect(result).toEqual(mockUsers);
    });

    it("should search users by username when query is provided", async () => {
      const mockUsers = [{ id: 3 }];
      User.findAll.mockResolvedValue(mockUsers);

      const result = await searchUsers("john");

      expect(User.findAll).toHaveBeenCalledWith({
        where: {
          role: "creator",
          username: { [Op.like]: "%john%" },
        },
        attributes: [
          "id",
          "name",
          "username",
          "role",
          "bio",
          "profileImage",
          "createdAt",
        ],
        order: [["createdAt", "DESC"]],
      });

      expect(result).toEqual(mockUsers);
    });
  });

  describe("getPublicProfile", () => {
    it("should return user and tiers for creator", async () => {
      const mockUser = {
        id: "123",
        username: "creator1",
        role: "creator",
      };

      const mockTiers = [{ id: 1, level: 1 }];

      User.findOne.mockResolvedValue(mockUser);
      Tier.findAll.mockResolvedValue(mockTiers);

      const result = await getPublicProfile("creator1");

      expect(User.findOne).toHaveBeenCalledWith({
        where: { username: "creator1" },
        attributes: ["id", "name", "username", "bio", "profileImage", "role"],
      });

      expect(Tier.findAll).toHaveBeenCalledWith({
        where: { creatorId: mockUser.id },
        order: [["level", "ASC"]],
      });

      expect(result).toEqual({
        user: mockUser,
        tiers: mockTiers,
      });
    });

    it("should return user with empty tiers if not a creator", async () => {
      const mockUser = {
        id: "456",
        username: "sub1",
        role: "subscriber",
      };

      User.findOne.mockResolvedValue(mockUser);

      const result = await getPublicProfile("sub1");

      expect(Tier.findAll).not.toHaveBeenCalled();

      expect(result).toEqual({
        user: mockUser,
        tiers: [],
      });
    });

    it("should throw error if user not found", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(getPublicProfile("unknown")).rejects.toThrow(
        "User not found"
      );
    });
  });
});