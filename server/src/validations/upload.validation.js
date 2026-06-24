const AppError = require("../utils/AppError");

const validateFile = (req, res, next) => {
  if (!req.file) {
    return next(
      new AppError(
        "File is required",
        400
      )
    );
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "video/mp4",
    "image/webp",
    "video/webm"
  ];

  if (!allowedTypes.includes(req.file.mimetype)) {
    return next(
      new AppError(
        "Unsupported file type. Allowed formats: JPEG, PNG, PDF, MP4.",
        400
      )
    );
  }

  next();
};

module.exports = validateFile;