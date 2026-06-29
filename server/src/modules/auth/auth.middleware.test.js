const jwt = require("jsonwebtoken");

const {
  authenticate,
  authorizeRole,
} = require("./auth.middleware");

const AppError = require("../../utils/AppError");

jest.mock("jsonwebtoken");

jest.mock("../tokenBlacklist/tokenBlacklist.service", () => ({
  isBlacklisted: jest.fn(),
}));

const {
  isBlacklisted,
} = require("../tokenBlacklist/tokenBlacklist.service");

describe("Authentication Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  describe("authenticate()", () => {
    test("should return 401 when authorization header is missing", async () => {
      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "Access denied. No token provided.",
      });

      expect(next).not.toHaveBeenCalled();
    });

    test("should return 401 when token format is invalid", async () => {
      req.headers.authorization = "InvalidToken";

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "Access denied. No token provided.",
      });
    });

    test("should return 401 for invalid JWT", async () => {
      req.headers.authorization = "Bearer token";

      jwt.verify.mockImplementation(() => {
        const err = new Error("Invalid");
        err.name = "JsonWebTokenError";
        throw err;
      });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid token.",
      });
    });

    test("should return 401 for expired JWT", async () => {
      req.headers.authorization = "Bearer token";

      jwt.verify.mockImplementation(() => {
        const err = new Error("Expired");
        err.name = "TokenExpiredError";
        throw err;
      });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "Token expired.",
      });
    });

    test("should return 401 when token is blacklisted", async () => {
      req.headers.authorization = "Bearer token";

      jwt.verify.mockReturnValue({
        id: "1",
        role: "creator",
        jti: "abc123",
        exp: 12345,
      });

      isBlacklisted.mockResolvedValue(true);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "Token has been revoked",
      });

      expect(next).not.toHaveBeenCalled();
    });

    test("should authenticate a valid token", async () => {
      req.headers.authorization = "Bearer token";

      jwt.verify.mockReturnValue({
        id: "1",
        role: "creator",
        jti: "abc123",
        exp: 12345,
      });

      isBlacklisted.mockResolvedValue(false);

      await authenticate(req, res, next);

      expect(req.user).toEqual({
        id: "1",
        role: "creator",
        jti: "abc123",
        exp: 12345,
      });

      expect(next).toHaveBeenCalledTimes(1);
    });

    test("should return 500 for unexpected errors", async () => {
      req.headers.authorization = "Bearer token";

      jwt.verify.mockImplementation(() => {
        throw new Error("Database Error");
      });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message:
          "Internal server error during authentication.",
      });
    });
  });

  describe("authorizeRole()", () => {
    test("should return 401 when req.user does not exist", () => {
      const middleware = authorizeRole("creator");

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "Unauthorized. Please log in.",
      });
    });

    test("should allow authorized role", () => {
      req.user = {
        role: "creator",
      };

      const middleware = authorizeRole("creator");

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test("should deny unauthorized role", () => {
      req.user = {
        role: "subscriber",
      };

      const middleware = authorizeRole("creator");

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);

      expect(res.json).toHaveBeenCalledWith({
        message:
          "Access denied. Required roles: creator",
      });
    });

    test("should allow one of multiple roles", () => {
      req.user = {
        role: "subscriber",
      };

      const middleware = authorizeRole(
        "creator",
        "subscriber"
      );

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});