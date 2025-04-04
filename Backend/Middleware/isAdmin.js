const isAdmin = (req, res, next) => {
  if (!req.user || req.user.user_admin !== 1) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};

export default isAdmin;
