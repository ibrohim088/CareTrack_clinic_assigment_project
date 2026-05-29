const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied: Insufficient permissions"
    });
  }
  next();
};

const isOwnerOrAdmin = (paramName = 'id') => async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const requestedId = req.params[paramName];

    if (req.user.role === 'admin') return next();

    if (req.user.role === 'patient' && userId === requestedId) return next();

    if (req.user.role === 'clinician') {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied: You can only view your own data"
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const isDoctorOrAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'clinician') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied: Only doctors and admins allowed"
  });
};

export { allowRoles, isOwnerOrAdmin, isDoctorOrAdmin };