const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Good practice for finance apps
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    // ✅ RBAC Link: Connects the user to their permissions profile
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    declaredIncome: { type: Number, default: 0 },
    organization: {
      type: String,
      default: "zorvyn-org", // Updated from 'default-org'
    },
  },
  { timestamps: true },
);

// Middleware: Modern Async Hash (No 'next' required)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (error) {
    throw new Error("Password encryption failed: " + error.message);
  }
});

// Method: Verify login credentials
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
