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

// --- 1. OPTIMIZED CORS CONFIGURATION ---
const allowedOrigins = [
  "https://zorvyn-finance-frontend.onrender.com",
  "https://zorvyn-finance-frontend.onrender.com/",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy violation: Unauthorized Origin"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS to Express
app.use(cors(corsOptions));
// Handle Preflight for all routes
app.options("*", cors(corsOptions));

// --- 2. SOCKET.IO INITIALIZATION ---
const io = socketIo(server, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

app.use(express.json());

// --- 3. DIRECTORY & STORAGE SETUP ---
const uploadDir = "./uploads/receipts";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created Zorvyn Storage directory");
}

// --- 4. DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Zorvyn Database Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// --- 5. ROLE INITIALIZATION ---
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
        new: true,
      });
    }
    console.log("✅ Zorvyn Roles Initialized");
  } catch (error) {
    console.error("❌ Role Initialization Failed:", error);
  }
};

mongoose.connection.once("open", initRoles);

// --- 6. SOCKET.IO LOGIC ---
io.on("connection", (socket) => {
  console.log("👤 Analyst Connected:", socket.id);

  socket.on("join-record-room", (recordId) => {
    socket.join(recordId);
    console.log(`📊 Tracking Audit for Record: ${recordId}`);
  });

  socket.on("disconnect", () => console.log("👤 User Disconnected"));
});

app.set("io", io);

// --- 7. ROUTES ---
app.get("/", (req, res) => {
  res.send("🚀 Zorvyn Finance Backend is running and healthy!");
});

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/admin", adminRoutes);

// --- 8. ERROR HANDLING ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Zorvyn Internal Server Error",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// --- 9. SERVER START ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Zorvyn Finance running on Port: ${PORT}`);
});
