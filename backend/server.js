const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
require("dotenv").config();

// Zorvyn Routes & Models
const authRoutes = require("./routes/auth");
const recordRoutes = require("./routes/records");
const exportRoutes = require("./routes/export");
const adminRoutes = require("./routes/admin");
const Role = require("./models/Role");

const app = express();
const server = http.createServer(app);

/**
 * 🛠️ FINAL PRODUCTION-READY CORS CONFIG
 */
const allowedOrigins = [
  "https://zorvyn-finance-frontend.onrender.com",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

/**
 * 🔌 SOCKET.IO SETUP
 */
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

/**
 * 📁 DIRECTORY SETUP
 */
const uploadDir = "./uploads/receipts";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created Zorvyn Storage directory");
}

/**
 * 🗄️ DATABASE CONNECTION
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Zorvyn Database Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/**
 * 🛡️ ROLE INITIALIZATION
 */
const initRoles = async () => {
  try {
    const roles = [
      {
        name: "viewer",
        description: "Read financial records only",
        permissions: [{ resource: "records", actions: ["read"] }],
      },
      {
        name: "analyst",
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
        returnDocument: "after", // ✅ FIXED deprecation warning
      });
    }

    console.log("✅ Zorvyn Roles Initialized");
  } catch (error) {
    console.error("❌ Role Initialization Failed:", error);
  }
};

mongoose.connection.once("open", initRoles);

/**
 * 🔌 SOCKET EVENTS
 */
io.on("connection", (socket) => {
  console.log("👤 Analyst Connected:", socket.id);

  socket.on("join-record-room", (recordId) => {
    socket.join(recordId);
    console.log(`📊 Tracking Audit for Record: ${recordId}`);
  });

  socket.on("disconnect", () => {
    console.log("👤 User Disconnected");
  });
});

app.set("io", io);

/**
 * 🌐 ROUTES
 */
app.get("/", (req, res) => {
  res.send("🚀 Zorvyn Finance Backend is running and healthy!");
});

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/admin", adminRoutes);

/**
 * ⚠️ GLOBAL ERROR HANDLER
 */
app.use((err, req, res, next) => {
  console.error("❌ GLOBAL ERROR:", err.message);

  res.status(500).json({
    error: "Zorvyn Internal Server Error",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

/**
 * 🚀 SERVER START
 */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Zorvyn Finance running on Port: ${PORT}`);
});
