const { z } = require("zod");

const addCommentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

const updateCommentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

const contentIdSchema = z.object({
  id: z.string().uuid("Invalid content ID"),
});

const commentIdSchema = z.object({
  commentId: z.string().uuid("Invalid comment ID"),
});

module.exports = {
  addCommentSchema,
  updateCommentSchema,
  contentIdSchema,
  commentIdSchema,
};