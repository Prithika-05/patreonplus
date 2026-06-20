const { z } = require("zod");

const subscribeSchema = z.object({
  tierId: z
    .string({
      required_error: "Tier selection is required",
      invalid_type_error: "Tier ID must be a string",
    })
    .uuid("Invalid tier selected. Must be a valid UUID"), 
});

const subscriptionIdSchema = z.object({
  id: z
    .string({
      required_error: "Subscription ID parameter is required",
      invalid_type_error: "Subscription ID must be a string",
    })
    .uuid("Invalid subscription id format. Must be a valid UUID"), 
});

// 🔥 ADD THIS NEW VALIDATION SCHEMA HERE:
const checkStatusSchema = z.object({
  session_id: z
    .string({
      required_error: "Stripe session_id query parameter is required",
      invalid_type_error: "Stripe session_id must be a string",
    })
    .trim()
    .min(10, "Session reference string is too short")
    .refine((val) => val.startsWith("cs_"), {
      message: "Invalid checkout session token format structure",
    }),
});

module.exports = {
  subscribeSchema,
  subscriptionIdSchema,
  checkStatusSchema, // Make sure to export your new schema
};
