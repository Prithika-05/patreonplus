const { ZodError } = require("zod");

/**
 * Generic Zod validation middleware
 *
 * Usage:
 * validate(recordViewSchema)
 * validate(contentIdParamSchema)
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query ,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      return next(error);
    }
  };
};

module.exports = validate;