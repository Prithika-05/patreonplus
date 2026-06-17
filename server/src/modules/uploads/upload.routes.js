const express = require("express");
const multer = require("multer");
const { authenticate } = require("../auth/auth.middleware");
const validateFile = require("../../validations/upload.validation");
const controller = require("./upload.controller");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

router.post(
  "/",
  authenticate,
  upload.single("file"), 
  validateFile,     
  controller.upload
);

module.exports = router;
