// server/src/middleware/validate.js

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const data = req[source];

      const result = schema.safeParse(data);

      if (!result.success) {
        const errorIssues = result.error.issues || []; 

        const errors = errorIssues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      req[source] = result.data;

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Validation middleware error",
      });
    }
  };
};

module.exports = validate;