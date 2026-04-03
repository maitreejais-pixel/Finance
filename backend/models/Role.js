const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // Rebranded 'editor' to 'analyst' for the Finance context
      enum: ["viewer", "analyst", "admin"],
      unique: true,
    },
    description: String,
    permissions: [
      {
        resource: {
          type: String,
          // Updated from 'videos' to 'records'
          enum: ["records", "users", "analytics", "settings"],
        },
        actions: [String], // 'read', 'create', 'update', 'delete'
      },
    ],
    organization: {
      type: String,
      default: "zorvyn-org", // Updated default org name
    },
  },
  { timestamps: true },
);

// Static method: Get role by name
roleSchema.statics.findByName = function (name, organization = "zorvyn-org") {
  return this.findOne({ name, organization });
};

module.exports = mongoose.model("Role", roleSchema);
