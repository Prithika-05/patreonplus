const { z } = require("zod");

const searchUserSchema = z.object({
  q: z
    .string()
    .trim()
    .max(50, "Search query cannot exceed 50 characters")
    .optional(),
});

const usernameParamSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Invalid username format"
    ),
});

module.exports = {
  searchUserSchema,
  usernameParamSchema,
};