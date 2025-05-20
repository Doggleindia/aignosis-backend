import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Middleware to verify JWT token
export const verifyJwt = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Authorization: Bearer <token>"

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token is required.' });
  }

  try {
    // Verify token with secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      message: 'Token is valid.',
      user: decoded, // Optional: Include decoded user info if neededm
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.', error: error.message });
  }
};