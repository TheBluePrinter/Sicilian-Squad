import jwt from "jsonwebtoken";

const SECRET_KEY = "secret_key";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const userInfo = jwt.verify(token, SECRET_KEY);
    req.user = userInfo;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;
