import { z } from "zod";

export const tierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Tier name must be at least 3 characters")
    .max(100, "Tier name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  price: z.coerce
    .number()
    .positive("Price must be greater than 0"),

  unlockDuration: z.coerce
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 day")
    .max(3650, "Duration cannot exceed 3650 days"),
});