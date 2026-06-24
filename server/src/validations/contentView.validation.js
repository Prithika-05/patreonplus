const { z } = require("zod");


const CONTENT_VIEW_SOURCES = [
  "feed",
  "search",
  "direct",
  "notification",
];


const recordViewSchema = z.object({
  body: z.object({
    contentId: z
      .string()
      .uuid("Invalid content ID"),

    creatorId: z
      .string()
      .uuid("Invalid creator ID"),

    watchDuration: z
      .number()
      .int("Watch duration must be an integer")
      .min(
        0,
        "Watch duration cannot be negative"
      )
      .optional()
      .default(0),

    completed: z
      .boolean()
      .optional()
      .default(false),

    source: z
      .enum(CONTENT_VIEW_SOURCES, {
        errorMap: () => ({
          message:
            "Invalid content view source",
        }),
      })
      .optional()
      .default("feed"),
  }),
});


const contentIdParamSchema = z.object({
  contentId: z.string().uuid(),
});


const topContentQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(10),
});

const contentEngagementSchema = z.object({
  params: z.object({
    contentId: z
      .string()
      .uuid("Invalid content ID"),
  }),
});

module.exports = {
  CONTENT_VIEW_SOURCES,

  recordViewSchema,

  contentIdParamSchema,

  topContentQuerySchema,

  contentEngagementSchema,
};