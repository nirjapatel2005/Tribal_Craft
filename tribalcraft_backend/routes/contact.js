const express = require('express');
const jwt = require('jsonwebtoken');
const Contact = require('../models/Contact');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const router = express.Router();

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Create contact submission
    const contact = new Contact({
      name,
      email,
      message
    });

    await contact.save();

    res.status(201).json({ 
      message: 'Message sent successfully! We will get back to you soon.',
      contactId: contact._id
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all contact submissions (admin only)
router.get('/admin/submissions', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const submissions = await Contact.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update contact submission status (admin only)
router.put('/admin/submissions/:id/status', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { status, adminNotes } = req.body;
    const { id } = req.params;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }

    contact.status = status;
    if (adminNotes) {
      contact.adminNotes = adminNotes;
    }

    await contact.save();

    res.json({ message: 'Status updated successfully', contact });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete contact submission (admin only)
router.delete('/admin/submissions/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }

    res.json({ message: 'Contact submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
