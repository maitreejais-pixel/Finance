const express = require("express");
const router = express.Router();
const Record = require("../models/Record");
const auth = require("../middleware/auth");

// The Handler for creating new financial records
const createEntryHandler = async (req, res) => {
  try {
    const { description, amount, type, category } = req.body;

    // Validation check
    if (!description || !amount || !type || !category) {
      return res
        .status(400)
        .json({ error: "All financial fields are required" });
    }

    const record = new Record({
      description,
      amount: Number(amount),
      type, // 'income' or 'expense'
      category,
      createdBy: req.user._id,
      status: "pending", // Replaces 'processing'
    });

    await record.save();

    // 🏆 THE "WOW" FACTOR: Simulated AI Fraud/Audit Check
    // We keep your Socket.io logic to show real-time background processing
    let currentProgress = 0;
    const io = req.app.get("io");

    const auditInterval = setInterval(async () => {
      currentProgress += 10;

      if (io) {
        io.to(record._id.toString()).emit("progress", {
          recordId: record._id,
          progress: currentProgress,
          status: "verifying", // Replaces 'analyzing'
        });
      }

      if (currentProgress >= 100) {
        clearInterval(auditInterval);

        // Simulated logic: If expense is huge (> 10000), flag it, else verify it.
        const finalStatus =
          record.type === "expense" && record.amount > 10000
            ? "flagged"
            : "verified";

        record.status = finalStatus;
        await record.save();

        if (io) {
          io.to(record._id.toString()).emit("complete", {
            recordId: record._id,
            status: finalStatus,
          });
        }
      }
    }, 150);

    // Respond immediately so the frontend can show the loading state
    res.json({
      message: "Entry submitted for audit",
      recordId: record._id,
    });
  } catch (error) {
    console.error("BACKEND ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// THE ROUTE (No more multer needed!)
router.post("/", auth, createEntryHandler);

module.exports = router;
