const { z } = require("zod");

const createTierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Tier name must be at least 3 characters")
    .max(100, "Tier name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .nullable() // Allows explicit null
    .optional(),

  price: z
    .number({
      required_error: "Price is required",
    })
    .positive("Price must be greater than 0"),

  unlockDuration: z
    .number({
      required_error: "Unlock duration is required",
    })
    .int("Unlock duration must be a whole number")
    .min(1, "Unlock duration must be at least 1 day")
    .max(3650, "Unlock duration cannot exceed 3650 days"),
});

const updateTierSchema = createTierSchema.partial();

const tierIdSchema = z.object({
  id: z.coerce
    .string({
      required_error: "Tier ID is required",
      invalid_type_error: "Tier ID must be a string",
    })
    .uuid("Invalid tier id format. Must be a valid UUID"),    
});

const reorderTiersSchema = z.object({
  tiers: z.array(
    z.object({
      id: z.coerce.number().int().positive("Invalid tier ID"),
      position: z.number().int().nonnegative("Position must be a positive number"),
    })
  ).min(1, "You must provide at least one tier to reorder"),
});

module.exports = {
  createTierSchema,
  updateTierSchema,
  tierIdSchema,
  reorderTiersSchema,
};