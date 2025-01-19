import express from 'express';
import multer from 'multer';
import { uploadFileToS3 } from '../services/s3Service.js';

const router = express.Router();

// Configure Multer for file uploads
const upload = multer();

// Upload file to S3
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const result = await uploadFileToS3(file);
    res.status(200).json({ message: 'File uploaded successfully', result });
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    res.status(500).json({ error: 'Failed to upload file to S3' });
  }
});

export default router;
