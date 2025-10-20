const express = require('express');
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');
const User = require('../models/User');

const router = express.Router();

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

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [],
        totalAmount: 0
      });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { craftId, craftTitle, craftPrice, craftImage } = req.body;

    if (!craftId || !craftTitle || !craftPrice || !craftImage) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [],
        totalAmount: 0
      });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(item => item.craftId === craftId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        craftId,
        craftTitle,
        craftPrice,
        craftImage,
        quantity: 1
      });
    }

    // Calculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
      const price = parseFloat(item.craftPrice.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);

    await cart.save();
    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:craftId', authenticateToken, async (req, res) => {
  try {
    const { craftId } = req.params;
    
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.craftId !== craftId);
    
    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
      const price = parseFloat(item.craftPrice.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);

    await cart.save();
    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear entire cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalAmount = 0;
    
    await cart.save();
    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

