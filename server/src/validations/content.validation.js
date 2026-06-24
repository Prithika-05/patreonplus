const { z } = require("zod");

const createContentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .max(5000, "Description cannot exceed 5000 characters"),

  previewUrl: z
    .string()
    .url("Please enter a valid URL"),

  fileKey: z
    .string()
    .trim(),

  tierId: z.coerce
    .string()
    .uuid("Please select a valid tier")
    .refine((val) => val !== "", {
      message: "Please select a tier",
    }),

});

const updateContentSchema = createContentSchema.partial();

const contentIdSchema = z.object({
  id: z
    .string({ required_error: "Content ID parameter is required" })
    .uuid("Invalid content id format"),
});

module.exports = {
  createContentSchema,
  updateContentSchema,
  contentIdSchema,
};