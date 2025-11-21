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
app.use('/api/contact', require('./routes/contact'));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../tribalcraft_frontend/build')));

// Root route - serve the React app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../tribalcraft_frontend/build', 'index.html'));
});

// Catch-all handler: send back React's index.html file for any non-API routes
// Use a RegExp to avoid path-to-regexp parsing issues in Express 5
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../tribalcraft_frontend/build', 'index.html'));
});

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

// Enhanced MongoDB connection options for better reliability
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000, // Increase to 30 seconds for Atlas connections
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 30000, // Wait 30 seconds before timing out initial connection
  retryWrites: true,
  w: 'majority',
};

mongoose.connect(mongoURI, mongooseOptions).catch((err) => {
  console.error('Failed to connect to MongoDB:', err.message);
  
  // Provide specific guidance based on error type
  if (err.message.includes('IP') || err.message.includes('whitelist')) {
    console.error('\n⚠️  IP ADDRESS NOT WHITELISTED');
    console.error('Your current IP address is not whitelisted in MongoDB Atlas.');
    console.error('To fix this:');
    console.error('1. Go to MongoDB Atlas Dashboard: https://cloud.mongodb.com/');
    console.error('2. Navigate to Network Access (or IP Whitelist)');
    console.error('3. Click "Add IP Address"');
    console.error('4. Click "Add Current IP Address" or add 0.0.0.0/0 (allow all IPs - less secure)');
    console.error('5. Wait a few minutes for changes to propagate\n');
  } else if (err.message.includes('authentication')) {
    console.error('\n⚠️  AUTHENTICATION FAILED');
    console.error('Check your MongoDB connection string in the .env file.');
    console.error('Make sure your username and password are correct.\n');
  } else if (err.message.includes('timeout') || err.message.includes('timed out')) {
    console.error('\n⚠️  CONNECTION TIMEOUT');
    console.error('The connection to MongoDB timed out. Possible causes:');
    console.error('1. Your IP address is not whitelisted');
    console.error('2. Network connectivity issues');
    console.error('3. MongoDB Atlas cluster is paused or unavailable');
    console.error('4. Firewall blocking the connection\n');
  } else {
    console.error('\n⚠️  CONNECTION ERROR');
    console.error('Please check:');
    console.error('1. MongoDB Atlas cluster is running');
    console.error('2. Your IP address is whitelisted');
    console.error('3. Connection string in .env is correct');
    console.error('4. Network connectivity\n');
  }
  
  console.log('For local MongoDB: https://www.mongodb.com/try/download/community');
  console.log('For MongoDB Atlas: https://www.mongodb.com/atlas');
  console.log('Atlas IP Whitelist Guide: https://www.mongodb.com/docs/atlas/security-whitelist/\n');
});

mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
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