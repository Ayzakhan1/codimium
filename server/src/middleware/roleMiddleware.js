const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.decoded) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (!allowedRoles.includes(req.decoded.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
};

module.exports = roleMiddleware;