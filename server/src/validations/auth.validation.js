// server/src/validations/auth.validation.js

const { z } = require("zod");
const CONSTANTS = require(
  "../constants/validation.constants"
);

const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONSTANTS.NAME_MIN, "Name must be at least 3 characters")
    .max(CONSTANTS.NAME_MAX, "Name cannot exceed 50 characters"),

  username: z
    .string()
    .trim()
    .min(CONSTANTS.NAME_MIN, "Username must be at least 3 characters")
    .max(CONSTANTS.NAME_MAX, "Username cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    ),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(CONSTANTS.PASSWORD_MIN, "Password must be at least 8 characters")
    .regex(
      /[A-Z]/,
      "Password must contain at least one uppercase letter"
    )
    .regex(
      /[a-z]/,
      "Password must contain at least one lowercase letter"
    )
    .regex(
      /[0-9]/,
      "Password must contain at least one number"
    )
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),

  role: z.enum(
    ["creator", "subscriber"],
    {
      errorMap: () => ({
        message: "Role must be creator or subscriber",
      }),
    }
  ),
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

module.exports = {
  signupSchema,
  loginSchema,
};