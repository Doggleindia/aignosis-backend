import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Authentication required. Redirecting to login.',
      redirect: '/api/auth/login',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.status(200).json({
      success: true,
      message: 'Token is valid.',
      user: decoded, // Optional: Include decoded user info if needed
    });
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token. Redirecting to login.',
      redirect: '/api/auth/login',
    });
  }
};

// Moved outside and exported
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  try {
    console.log('Verifying token:', token); // Debug log
    console.log('JWT Secret:', process.env.JWT_SECRET); // Debug log
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message); // Debug log
    return res.status(401).json({ message: 'Invalid token.' });
  }
};
