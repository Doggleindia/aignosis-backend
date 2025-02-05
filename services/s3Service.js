import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_S3_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_S3_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Upload file to S3
 * @param {Object} file - Multer file object
 * @returns {Object} S3 upload response
 */
export const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return await s3.upload(params).promise();
};
