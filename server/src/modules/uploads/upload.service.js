const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../../config/s3");
const { randomUUID } = require("crypto");

const uploadFile = async (file) => {
  const key = `content/${randomUUID()}-${file.originalname}`;

  // 1. Stream the memory buffer directly to AWS S3 bucket destination
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return key; 
};

const getSecureUrl = async (key) => {
  if (!key) return null;

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 900 });
  
  return url;

};

module.exports = {
  uploadFile,
  getSecureUrl,
};