import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the "uploads" directory exists
const uploadDir = path.join(path.resolve(), "uploads"); 
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); 
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

// File filter to allow only .pdf and .doc files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc/;  // Match .pdf and .doc extensions
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extName) {
    return cb(null, true); // Accept the file
  } else {
    cb(new Error("Only .pdf and .doc files are allowed!")); // Reject the file
  }
};

// Initialize Multer instance with updated file size limit and file filter
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // Limit file size to 3MB
  fileFilter, 
});

// Export multer instance to handle file uploads
export default upload;
