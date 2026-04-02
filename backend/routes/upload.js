const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'biralstore_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  },
});

const upload = multer({ storage: storage });

// POST /api/upload
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ error: 'CLOUDINARY_CLOUD_NAME .env faylında tapılmadı' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Heç bir şəkil seçilməyib' });
    }

    res.json({
      url: req.file.path,
      message: 'Şəkil uğurla yükləndi',
    });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Şəkil yüklənərkən xəta baş verdi', details: err.message });
  }
});

module.exports = router;
