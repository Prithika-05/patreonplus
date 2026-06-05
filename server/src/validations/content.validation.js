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
    .max(5000, "Description cannot exceed 5000 characters")
    .nullable() 
    .optional(),

  fileUrl: z
    .string()
    .url("Please provide a valid URL"),

  tierId: z
    .string({ required_error: "Tier selection is required" })
    .uuid("Invalid tier selected. Must be a valid UUID"), 
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
