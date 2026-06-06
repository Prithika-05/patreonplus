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

module.exports = {
  subscribeSchema,
  subscriptionIdSchema,
};
