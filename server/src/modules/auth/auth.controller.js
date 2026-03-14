const authService = require("./auth.service");

const signup = async (req, res) => {
  try {

    const user = await authService.signup(req.body);

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }
};

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json({
      message: "Login successful",
      user: result.user,
      token: result.token
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }
};

module.exports = {
  signup,
  login
};