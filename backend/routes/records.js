const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Record = require("../models/Record");
const router = express.Router();

// --- 1. LIST ALL RECORDS ---
router.get("/", auth, async (req, res) => {
  try {
    const isAdmin = req.user.role?.name === "admin";
    let query = isAdmin ? {} : { createdBy: req.user._id };
    const records = await Record.find(query)
      .populate("createdBy", "name") // Pulls the 'name' from the User model
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ✅ 2. DASHBOARD SUMMARY (MOVED UP) ---
// This MUST stay above /:id so Express doesn't think "summary" is an ID
router.get("/summary", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const isAdmin = req.user.role?.name === "admin";
    const matchQuery = isAdmin ? {} : { createdBy: userId };

    const stats = await Record.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [
                { $eq: ["$type", "income"] },
                {
                  $convert: {
                    input: "$amount",
                    to: "double",
                    onError: 0,
                    onNull: 0,
                  },
                },
                0,
              ],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [
                { $eq: ["$type", "expense"] },
                {
                  $convert: {
                    input: "$amount",
                    to: "double",
                    onError: 0,
                    onNull: 0,
                  },
                },
                0,
              ],
            },
          },
        },
      },
    ]);

    const result = stats[0] || { totalIncome: 0, totalExpenses: 0 };
    res.json({
      totalIncome: result.totalIncome || 0,
      totalExpenses: result.totalExpenses || 0,
      netBalance: (result.totalIncome || 0) - (result.totalExpenses || 0),
    });
  } catch (error) {
    console.error("DASHBOARD MATH ERROR:", error.message);
    res.status(500).json({ error: "Failed to load summary" });
  }
});

// --- 3. CREATE NEW RECORD ---
router.post("/", auth, async (req, res) => {
  try {
    const { description, amount, type, category } = req.body;
    const newRecord = new Record({
      description,
      amount: Number(amount),
      type,
      category,
      status: amount > 50000 ? "flagged" : "verified",
      riskScore: amount > 50000 ? 0.88 : 0.02,
      createdBy: req.user._id,
    });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(400).json({ error: "Failed to create record" });
  }
});

// --- ❗ 4. GET SINGLE RECORD (STAYS BELOW SUMMARY) ---
router.get("/:id", auth, async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ error: "Record not found" });

    const isOwner = record.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.name === "admin";

    if (!isOwner && !isAdmin)
      return res.status(403).json({ error: "Unauthorized" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 5. UPDATE RECORD ---
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.json(updatedRecord);
  } catch (error) {
    res.status(400).json({ error: "Update failed" });
  }
});

// --- 6. DELETE RECORD ---
router.delete("/:id", auth, async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
