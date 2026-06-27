const express = require("express");
const multer = require("multer");
const { generateListing, ingestPDF, queryCampus } = require("../utils/rag");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      return callback(new Error("Only PDF files are supported"));
    }
    callback(null, true);
  },
});

router.post("/generate-listing", async (req, res) => {
  try {
    const { title, category, condition, price, description } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Title is required" });

    const listing = await generateListing({
      title: title.trim(),
      category: category || "Other",
      condition: condition || "Good",
      price: price || null,
      description: description || "",
    });
    res.json(listing);
  } catch (error) {
    console.error("Listing generation failed:", error.message);
    res.status(500).json({ error: "Failed to generate listing", message: error.message });
  }
});

router.post("/ingest", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "A PDF file is required" });

    const type = req.body.type?.trim() || "other";
    const name = req.body.name?.trim() || req.file.originalname;
    const result = await ingestPDF(req.file.buffer, {
      type,
      name,
      filename: req.file.originalname,
    });
    res.status(201).json({ message: "Document ingested successfully", ...result });
  } catch (error) {
    console.error("Document ingestion failed:", error.message);
    res.status(500).json({ error: "Document ingestion failed", message: error.message });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const question = req.body.question?.trim();
    if (!question) return res.status(400).json({ error: "Question is required" });

    const result = await queryCampus(question, req.body.type ? { type: req.body.type } : {});
    res.json(result);
  } catch (error) {
    console.error("Campus AI query failed:", error.message);
    res.status(500).json({ error: "Campus AI query failed", message: error.message });
  }
});

module.exports = router;
