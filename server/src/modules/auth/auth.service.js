const User = require("../users/user.model");
const RefreshToken = require("../refreshTokens/refreshToken.model"); 
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../../utils/password");
const AppError = require("../../utils/AppError");
const { randomUUID } = require("crypto");

const signup = async (data) => {
  const existingUser = await User.findOne({ where: { email: data.email } });
  if (existingUser) {
    throw new AppError("User already exists", 409);
  }
  const hashedPassword = await hashPassword(data.password);
  const user = await User.create({
    name: data.name,
    username: data.username,
    email: data.email,
    password: hashedPassword,
    role: data.role
  });
  return user;
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }
  const validPassword = await comparePassword(password, user.password);
  if (!validPassword) {
    throw new AppError("Invalid credentials", 401);
  }

  const jti = randomUUID();

  const accessToken = jwt.sign(
    { id: user.id, role: user.role, jti },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  const refreshExpiry = new Date();
  refreshExpiry.setDate(refreshExpiry.getDate() + 7);

  await RefreshToken.create({
    token: refreshToken,
    expiresAt: refreshExpiry,
    userId: user.id
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const refresh = async (tokenPayload) => {
  if (!tokenPayload) {
    throw new AppError("Refresh token is required", 400);
  }

  try {
    const decoded = jwt.verify(tokenPayload, process.env.JWT_REFRESH_SECRET);

    const storedToken = await RefreshToken.findOne({ where: { token: tokenPayload } });
    if (!storedToken) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const jti = randomUUID();
    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role, jti },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return {
      accessToken: newAccessToken,
    };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Refresh token has expired. Please login again.", 401);
    }
    throw error;
  }
};

module.exports = {
  signup,
  login,
  refresh
};
