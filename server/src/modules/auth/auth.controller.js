const authService = require("./auth.service");
const asyncHandler = require("../../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const { blacklistToken } = require("../tokenBlacklist/tokenBlacklist.service");

const signup = asyncHandler(async (req, res) => {
  const user = await authService.signup(req.body);

  return res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: user,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    data: result,
  });
});

// Added the refresh controller function here
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const result = await authService.refresh(refreshToken);

  return res.status(200).json({
    success: true,
    data: result,
  });
});

const logout = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  await blacklistToken(
    decoded.jti,
    new Date(decoded.exp * 1000)
  );

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = {
  signup,
  login,
  refresh, 
  logout,
};
