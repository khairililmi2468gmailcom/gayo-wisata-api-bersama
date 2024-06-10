import { fileURLToPath } from "url";
import express from "express";
import multer from "multer";
import Tourism from "./schema.js";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(
  import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOADS_DIRECTORY || "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const upload = multer({ storage: storage });

// Get all tourism data
router.get("/", async (req, res) => {
  try {
    const tourism = await Tourism.find();
    res.json(tourism);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single tourism data by ID
router.get("/:id", getTourism, (req, res) => {
  res.json(res.tourism);
});

// Create a new tourism data
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" });
  }

  const tourism = new Tourism({
    name: req.body.name,
    category: req.body.category,
    address: req.body.address,
    description: req.body.description,
    image: req.file.path,
  });

  try {
    const newTourism = await tourism.save();
    res.status(201).json({ success: "Tourism data created successfully", data: newTourism });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a tourism data
router.put("/:id", upload.single("image"), getTourism, async (req, res) => {
  try {
    // Menghapus file lama jika ada file baru diunggah
    if (req.file) {
      try {
        fs.unlinkSync(path.join(__dirname, "..", res.tourism.image));
      } catch (err) {
        // Jika terjadi kesalahan saat menghapus file, lanjutkan saja tanpa menimbulkan kesalahan
        console.error("Error deleting old image file:", err.message);
      }
      res.tourism.image = req.file.path;
    }

    // Memperbarui properti yang diperlukan
    if (req.body.name != null) {
      res.tourism.name = req.body.name;
    }
    if (req.body.category != null) {
      res.tourism.category = req.body.category;
    }
    if (req.body.address != null) {
      res.tourism.address = req.body.address;
    }
    if (req.body.description != null) {
      res.tourism.description = req.body.description;
    }

    // Menyimpan data wisata yang diperbarui
    const updatedTourism = await res.tourism.save();
    res.json({
      success: "Tourism data updated successfully",
      data: updatedTourism,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a tourism data
router.delete("/:id", getTourism, async (req, res) => {
  try {
    try {
      fs.unlinkSync(path.join(__dirname, "..", res.tourism.image));
    } catch (err) {
      console.error("Error deleting image file:", err.message);
    }
    // Hapus data wisata
    await res.tourism.deleteOne({ _id: req.params.id });
    res.json({ success: "Tourism data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to get a tourism data by ID
async function getTourism(req, res, next) {
  let tourism;
  try {
    tourism = await Tourism.findById(req.params.id);
    if (tourism == null) {
      return res.status(404).json({ error: "Cannot find tourism" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  res.tourism = tourism;
  next();
}

export default router;
