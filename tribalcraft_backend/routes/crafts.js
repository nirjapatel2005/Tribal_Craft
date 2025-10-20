const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Craft = require('../models/Craft');
const User = require('../models/User');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Admin guard
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Get all approved crafts
router.get('/approved', async (req, res) => {
  try {
    const crafts = await Craft.find({ status: 'approved' });
    res.json(crafts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get pending crafts (for admin)
router.get('/pending', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const crafts = await Craft.find({ status: 'pending' });
    res.json(crafts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Sell craft
router.post('/sell', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const {
      sellerFullName,
      itemName,
      description,
      price,
      region,
      artistName,
      sellerEmail,
      sellerPhone
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const craft = new Craft({
      sellerFullName,
      itemName,
      description,
      price,
      region,
      artistName,
      sellerEmail,
      sellerPhone,
      imageUrl: `/uploads/${req.file.filename}`,
      status: 'pending',
      sellerId: req.user._id
    });

    await craft.save();
    res.status(201).json({ message: 'Craft submitted successfully', craft });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve craft (admin only)
router.put('/approve/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const craft = await Craft.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!craft) {
      return res.status(404).json({ message: 'Craft not found' });
    }

    res.json({ message: 'Craft approved successfully', craft });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject craft (admin only)
router.put('/reject/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const craft = await Craft.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!craft) {
      return res.status(404).json({ message: 'Craft not found' });
    }

    res.json({ message: 'Craft rejected', craft });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;