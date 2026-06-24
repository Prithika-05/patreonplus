const { z } = require("zod");

/**
 * Validates request query properties directly
 * Comports with validate(schema, "query") middleware design
 */
const analyticsQuerySchema = z
  .object({
    startDate: z
      .string()
      .datetime({ message: "Start date must be a valid ISO8601 string" })
      .optional(),
    endDate: z
      .string()
      .datetime({ message: "End date must be a valid ISO8601 string" })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date cannot be prior to start date",
      path: ["endDate"], // Maps the path straight to the 'endDate' key
    }
  );

module.exports = {
  analyticsQuerySchema,
};
