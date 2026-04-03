// routes/admin.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/auth");

// GET ALL USERS (Admin Only)
router.get("/users", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const users = await User.find().populate("role").select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// TOGGLE USER STATUS (Active/Inactive)
router.patch(
  "/users/:id/status",
  auth,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      user.status = user.status === "active" ? "inactive" : "active";
      await user.save();
      res.json({ message: `User is now ${user.status}`, user });
    } catch (err) {
      res.status(500).json({ error: "Status update failed" });
    }
  },
);

module.exports = router;
