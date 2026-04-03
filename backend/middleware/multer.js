const multer = require("multer");
const Record = require("../models/Record");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Stores receipts in a dedicated 'receipts' folder
    cb(null, process.env.UPLOAD_DIR || "./uploads/receipts");
  },
  filename: (req, file, cb) => {
    const uniqueName = `RECEIPT-${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    // Keeping the original extension of the uploaded file
    const ext = file.originalname.split(".").pop();
    cb(null, `${uniqueName}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Allow PDFs and common image formats for receipts
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPEG, and PNG receipts are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Reduced to 5MB (standard for docs/images)
});

const saveRecordMetadata = async (req, res, next) => {
  if (!req.file) return next();

  try {
    // This creates a financial record linked to an uploaded receipt
    const record = new Record({
      description: req.body.description || "Uploaded Receipt",
      amount: req.body.amount || 0,
      type: req.body.type || "expense",
      category: req.body.category || "Uncategorized",
      receiptPath: req.file.path, // Store the path to the physical file
      createdBy: req.user._id,
      organization: req.user.organization,
    });

    await record.save();
    req.record = record;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { upload, saveRecordMetadata };
