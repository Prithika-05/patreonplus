import { z } from "zod";

export const contentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .max(5000, "Description cannot exceed 5000 characters"),

  fileUrl: z
    .string()
    .url("Please enter a valid URL"),

  tierId: z.coerce
    .string()
    .uuid("Please select a valid tier")
    .refine((val) => val !== "", {
      message: "Please select a tier",
    }),
});