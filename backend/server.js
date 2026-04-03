const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
require("dotenv").config();

// Routes & Models
const authRoutes = require("./routes/auth");
const recordRoutes = require("./routes/records");
const exportRoutes = require("./routes/export");
const adminRoutes = require("./routes/admin");
const Role = require("./models/Role");

const app = express();
const server = http.createServer(app);

/**
 * ✅ 1. BULLETPROOF CORS (FIXES YOUR ERROR)
 */
const allowedOrigins = [
  "https://zorvyn-finance-frontend.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS BLOCKED:", origin);
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/**
 * ✅ CRITICAL: HANDLE PREFLIGHT BEFORE ROUTES
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

/**
 * 🔌 SOCKET.IO
 */
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

/**
 * 📁 DIRECTORY SETUP
 */
const uploadDir = "./uploads/receipts";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Storage directory created");
}

/**
 * 🗄️ DATABASE
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

/**
 * 🛡️ ROLES INIT
 */
const initRoles = async () => {
  try {
    const roles = [
      {
        name: "viewer",
        description: "Read only",
        permissions: [{ resource: "records", actions: ["read"] }],
      },
      {
        name: "analyst",
        description: "Manage records",
        permissions: [
          {
            resource: "records",
            actions: ["read", "create", "update", "delete"],
          },
        ],
      },
      {
        name: "admin",
        description: "Full access",
        permissions: [{ resource: "*", actions: ["*"] }],
      },
    ];

    for (let role of roles) {
      await Role.findOneAndUpdate({ name: role.name }, role, {
        upsert: true,
        returnDocument: "after",
      });
    }

    console.log("✅ Roles Initialized");
  } catch (err) {
    console.error("❌ Role Init Error:", err);
  }
};

mongoose.connection.once("open", initRoles);

/**
 * 🔌 SOCKET EVENTS
 */
io.on("connection", (socket) => {
  console.log("👤 Connected:", socket.id);

  socket.on("join-record-room", (id) => {
    socket.join(id);
  });

  socket.on("disconnect", () => {
    console.log("👤 Disconnected");
  });
});

/**
 * 🌐 ROUTES
 */
app.get("/", (req, res) => {
  res.send("🚀 Zorvyn Backend Live");
});

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/admin", adminRoutes);

/**
 * ⚠️ ERROR HANDLER
 */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

/**
 * 🚀 START SERVER
 */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
