const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "flagged"],
      default: "pending",
    },
    riskScore: {
      type: Number,
      default: 0, // Initialized at 0% risk
      min: 0,
      max: 1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Record", recordSchema);
