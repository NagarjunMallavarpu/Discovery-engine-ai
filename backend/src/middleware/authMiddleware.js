const jwt = require('jsonwebtoken');
const config = require('../config/env');
const prisma = require('../config/db');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token === 'undefined' || token === 'null') {
    req.user = null; // Anonymous user allowed for public endpoints
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true, avatar: true }
    });

    req.user = user || null;
    next();
  } catch (err) {
    // If token verification fails (expired or invalid), treat as unauthenticated
    // Protected routes will enforce authentication via requireAuth middleware
    req.user = null;
    next();
  }
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAuth
};
