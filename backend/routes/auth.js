const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "An account with this email already exists" });
    }

    // 2. FIND the default role (Rebranded to 'analyst' for Zorvyn)
    const analystRole = await Role.findOne({ name: "analyst" });
    if (!analystRole) {
      return res
        .status(500)
        .json({ error: "System roles have not been initialized" });
    }

    // 3. CREATE the user with the analyst role
    const user = new User({
      email,
      password,
      name,
      role: analystRole._id, // Attaching the Analyst Role ID
    });

    // 4. SAVE to MongoDB
    await user.save();

    // 5. Generate Secure Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: analystRole.name,
      },
    });
  } catch (error) {
    console.error("Zorvyn Auth Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role.name, // Will be 'admin', 'analyst', or 'viewer'
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/update-income", auth, async (req, res) => {
  try {
    const { income } = req.body;

    // Safety check: if income is missing, don't crash
    if (income === undefined)
      return res.status(400).json({ error: "Income value required" });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { declaredIncome: Number(income) } },
      { new: true },
    ).populate("role");

    res.json({
      message: "Income updated successfully",
      declaredIncome: user.declaredIncome,
    });
  } catch (error) {
    console.error("Update Income Error:", error.message);
    res.status(500).json({ error: "Failed to update income" });
  }
});

module.exports = router;
