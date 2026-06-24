const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");
const s3Client = require("../config/s3"); // Imports the connection instance above

const uploadToS3 = async (file) => {
  const fileKey = `${crypto.randomBytes(16).toString("hex")}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);
  return fileKey;
};


const generatePresignedUrl = async (fileKey) => {
  if (!fileKey) return null;

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 900 });
};

module.exports = {
  uploadToS3,
  generatePresignedUrl,
};
