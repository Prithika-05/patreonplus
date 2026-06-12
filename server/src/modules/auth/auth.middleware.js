const jwt = require("jsonwebtoken");
const User = require("../users/user.model");
const { isBlacklisted } = require("../tokenBlacklist/tokenBlacklist.service");
const AppError = require("../../utils/AppError");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const blacklisted = await isBlacklisted(decoded.jti);

    if (blacklisted) {
      throw new AppError("Token has been revoked", 401);
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      jti: decoded.jti,
      exp: decoded.exp 
    };

    next();

  } catch (error) {
    
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(500).json({ message: "Internal server error during authentication." });
  }
};

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${allowedRoles.join(", ")}` 
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorizeRole
};
