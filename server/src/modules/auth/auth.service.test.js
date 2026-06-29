const jwt = require("jsonwebtoken");

const User = require("../users/user.model");
const RefreshToken = require("../refreshTokens/refreshToken.model");

const {
  hashPassword,
  comparePassword,
} = require("../../utils/password");

const AppError = require("../../utils/AppError");

const authService = require("./auth.service");

jest.mock("../users/user.model");
jest.mock("../refreshTokens/refreshToken.model");

jest.mock("../../utils/password", () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signup()", () => {
    it("should create a new user", async () => {
      User.findOne.mockResolvedValue(null);

      hashPassword.mockResolvedValue(
        "hashedPassword"
      );

      User.create.mockResolvedValue({
        id: "1",
        email: "john@test.com",
      });

      const result =
        await authService.signup({
          name: "John",
          username: "john",
          email: "john@test.com",
          password: "123456",
          role: "creator",
        });

      expect(User.create).toHaveBeenCalled();

      expect(hashPassword).toHaveBeenCalledWith(
        "123456"
      );

      expect(result.id).toBe("1");
    });

    it("should throw error if user already exists", async () => {
      User.findOne.mockResolvedValue({
        id: "1",
      });

      await expect(
        authService.signup({
          email: "john@test.com",
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe("login()", () => {
    it("should login successfully", async () => {
      User.findOne.mockResolvedValue({
        id: "1",
        role: "creator",
        password: "hashed",
      });

      comparePassword.mockResolvedValue(true);

      jwt.sign
        .mockReturnValueOnce("access-token")
        .mockReturnValueOnce("refresh-token");

      RefreshToken.create.mockResolvedValue(
        {}
      );

      const result =
        await authService.login(
          "john@test.com",
          "123456"
        );

      expect(result.accessToken).toBe(
        "access-token"
      );

      expect(result.refreshToken).toBe(
        "refresh-token"
      );
    });

    it("should throw if email does not exist", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(
        authService.login(
          "abc@test.com",
          "123456"
        )
      ).rejects.toThrow(AppError);
    });

    it("should throw if password is incorrect", async () => {
      User.findOne.mockResolvedValue({
        password: "hashed",
      });

      comparePassword.mockResolvedValue(false);

      await expect(
        authService.login(
          "john@test.com",
          "wrong"
        )
      ).rejects.toThrow(AppError);
    });
  });

  describe("refresh()", () => {
    it("should generate new access token", async () => {
      jwt.verify.mockReturnValue({
        id: "1",
      });

      RefreshToken.findOne.mockResolvedValue(
        {
          token: "refresh",
        }
      );

      User.findByPk.mockResolvedValue({
        id: "1",
        role: "creator",
      });

      jwt.sign.mockReturnValue(
        "new-access-token"
      );

      const result =
        await authService.refresh(
          "refresh"
        );

      expect(result.accessToken).toBe(
        "new-access-token"
      );
    });

    it("should throw when refresh token is missing", async () => {
      await expect(
        authService.refresh(null)
      ).rejects.toThrow(AppError);
    });

    it("should throw when refresh token is not found", async () => {
      jwt.verify.mockReturnValue({
        id: "1",
      });

      RefreshToken.findOne.mockResolvedValue(
        null
      );

      await expect(
        authService.refresh("token")
      ).rejects.toThrow(AppError);
    });

    it("should throw when user is not found", async () => {
      jwt.verify.mockReturnValue({
        id: "1",
      });

      RefreshToken.findOne.mockResolvedValue(
        {}
      );

      User.findByPk.mockResolvedValue(null);

      await expect(
        authService.refresh("token")
      ).rejects.toThrow(AppError);
    });
  });
});