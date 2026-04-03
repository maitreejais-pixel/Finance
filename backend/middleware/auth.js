const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization")?.replace("Bearer ", "") || req.query.token;
    if (!token) return res.status(401).json({ error: "No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id)
      .populate("role")
      .select("-password");

    if (!req.user) return res.status(401).json({ error: "User not found." });
    next();
  } catch (ex) {
    res.status(400).json({ error: "Invalid token." });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user && req.user.role ? req.user.role.name : null;
    if (!allowedRoles.includes(userRole))
      return res.status(403).json({ error: "Denied." });
    next();
  };
};

module.exports = auth;
module.exports.requireRole = requireRole;
