const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/crafts', require('./routes/crafts'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/checkout', require('./routes/checkout'));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../tribalcraft_frontend/build')));

// Root route - serve the React app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../tribalcraft_frontend/build', 'index.html'));
});

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../tribalcraft_frontend/build', 'index.html'));
});

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tribalcraft';

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  console.log('Please make sure MongoDB is running on your system');
  console.log('You can install MongoDB locally or use MongoDB Atlas');
  console.log('For local MongoDB: https://www.mongodb.com/try/download/community');
  console.log('For MongoDB Atlas: https://www.mongodb.com/atlas');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});