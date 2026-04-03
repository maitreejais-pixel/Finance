const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Zorvyn Routes & Models
const authRoutes = require("./routes/auth");
const recordRoutes = require("./routes/records");
const exportRoutes = require("./routes/export"); // Replaces streaming
const Role = require("./models/Role");
const adminRoutes = require("./routes/admin"); // This "defines" the variable
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "https://zorvyn-finance-frontend.onrender.com",
      "https://zorvyn-finance-frontend.onrender.com/",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: [
      "https://zorvyn-finance-frontend.onrender.com",
      "https://zorvyn-finance-frontend.onrender.com/", // With trailing slash
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);
app.use(express.json());

// Ensure the receipts/exports directory exists
const uploadDir = "./uploads/receipts";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created Zorvyn Storage directory");
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Zorvyn Database Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/**
 * ZORVYN ROLE INITIALIZATION
 * Rebranded from Video Editor to Financial Analyst
 */
const initRoles = async () => {
  const roles = [
    {
      name: "viewer",
      description: "Read financial records only",
      permissions: [{ resource: "records", actions: ["read"] }],
    },
    {
      name: "analyst", // Rebranded from 'editor'
      description: "Manage financial entries and audits",
      permissions: [
        {
          resource: "records",
          actions: ["read", "create", "update", "delete"],
        },
      ],
    },
    {
      name: "admin",
      description: "Full system administration",
      permissions: [{ resource: "*", actions: ["*"] }],
    },
  ];

  for (let roleData of roles) {
    await Role.findOneAndUpdate({ name: roleData.name }, roleData, {
      upsert: true,
      new: true,
    });
  }
  console.log("✅ Zorvyn Roles Initialized");
};

mongoose.connection.once("open", initRoles);

// Socket.IO for Real-time Audit Progress
io.on("connection", (socket) => {
  console.log("👤 Analyst Connected:", socket.id);

  socket.on("join-record-room", (recordId) => {
    socket.join(recordId);
    console.log(`📊 Tracking Audit for Record: ${recordId}`);
  });

  socket.on("disconnect", () => console.log("👤 User Disconnected"));
});

app.set("io", io);

// Health Check
app.get("/", (req, res) => {
  res.send("🚀 Zorvyn Finance Backend is running and healthy!");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Zorvyn Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Zorvyn Finance running on http://localhost:${PORT}`);
});
