const sanitize = (req, res, next) => {
  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== "object") {
      return obj;
    }

    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      if (typeof value === "string") {
        obj[key] = value.trim();
      }

      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        sanitizeObject(value);
      }
    });

    return obj;
  };

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);

  next();
};

module.exports = sanitize;