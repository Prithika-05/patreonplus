const User = require("../users/user.model");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../../utils/password");

const signup = async (data) => {

  const existingUser = await User.findOne({ where: { email: data.email } });

  if (existingUser) {
    throw new Error("Email already registered");
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
    throw new Error("Invalid credentials");
  }

  const validPassword = await comparePassword(password, user.password);

  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { user, token };
};

module.exports = {
  signup,
  login
};