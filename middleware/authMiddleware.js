import jwt from 'jsonwebtoken';

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
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token. Redirecting to login.',
      redirect: '/api/auth/login',
    });
  }
};
