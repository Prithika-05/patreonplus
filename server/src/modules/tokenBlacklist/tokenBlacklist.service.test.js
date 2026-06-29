const { Op } = require("sequelize");

const TokenBlacklist = require("./tokenBlacklist.model");

const {
  blacklistToken,
  isBlacklisted,
} = require("./tokenBlacklist.service");

jest.mock("./tokenBlacklist.model", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
}));

describe("Token Blacklist Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("blacklistToken()", () => {
    it("should create a blacklist record", async () => {
      const expiresAt = new Date();

      TokenBlacklist.create.mockResolvedValue({
        id: "1",
        jti: "abc123",
        expiresAt,
      });

      const result = await blacklistToken(
        "abc123",
        expiresAt
      );

      expect(TokenBlacklist.create).toHaveBeenCalledTimes(1);

      expect(TokenBlacklist.create).toHaveBeenCalledWith({
        jti: "abc123",
        expiresAt,
      });

      expect(result).toEqual({
        id: "1",
        jti: "abc123",
        expiresAt,
      });
    });
  });

  describe("isBlacklisted()", () => {
    it("should return true when token exists", async () => {
      TokenBlacklist.findOne.mockResolvedValue({
        id: "1",
        jti: "abc123",
      });

      const result = await isBlacklisted("abc123");

      expect(TokenBlacklist.findOne).toHaveBeenCalledTimes(1);

      expect(TokenBlacklist.findOne).toHaveBeenCalledWith({
        where: {
          jti: "abc123",
          expiresAt: {
            [Op.gt]: expect.any(Date),
          },
        },
      });

      expect(result).toBe(true);
    });

    it("should return false when token does not exist", async () => {
      TokenBlacklist.findOne.mockResolvedValue(null);

      const result = await isBlacklisted("abc123");

      expect(result).toBe(false);
    });

    it("should query using the supplied jti", async () => {
      TokenBlacklist.findOne.mockResolvedValue(null);

      await isBlacklisted("jwt-id-999");

      expect(TokenBlacklist.findOne).toHaveBeenCalledWith({
        where: {
          jti: "jwt-id-999",
          expiresAt: {
            [Op.gt]: expect.any(Date),
          },
        },
      });
    });
  });
});