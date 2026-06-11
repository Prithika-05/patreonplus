const authService = require("./auth.service");
const asyncHandler = require("../../utils/asyncHandler");


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

module.exports = {
  signup,
  login
};