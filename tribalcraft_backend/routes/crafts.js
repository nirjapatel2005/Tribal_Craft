const express = require('express');
const router = express.Router();

// Get all crafts
router.get('/', (req, res) => {
  res.json({ message: 'Get all crafts' });
});

// Buy craft
router.post('/buy/:id', (req, res) => {
  res.json({ message: `Buy craft with id: ${req.params.id}` });
});

// Sell craft
router.post('/sell', (req, res) => {
  res.json({ message: 'Sell craft endpoint' });
});

module.exports = router;