function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (req.user.role !== role && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: `Access forbidden: requires ${role} role` });
    }

    next();
  };
}

module.exports = {
  requireRole
};
