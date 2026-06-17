const asyncHandler = require("../../utils/asyncHandler");
const uploadService = require("./upload.service");
const AppError = require("../../utils/AppError"); 

const upload = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("No file uploaded", 400);
  }

  const fileKey = await uploadService.uploadFile(req.file);

  const secureUrl = await uploadService.getSecureUrl(fileKey);

  return res.status(201).json({
    success: true,
    message: "File uploaded successfully",
    data: {
      key: fileKey 
    }
  });
});

module.exports = {
  upload,
};
