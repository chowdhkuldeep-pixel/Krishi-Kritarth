const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Mock In-Memory Database
const users = [];
const BIDS = [
  {
    id: 'crop_101',
    farmerName: 'Ramesh Kumar',
    cropType: 'Wheat (Gehun)',
    quantity: '50 Quintals',
    startingPrice: 2200,
    currentHighestBid: 2450,
    highestBidder: 'AgriCorp Pvt Ltd',
    status: 'Active'
  },
  {
    id: 'crop_102',
    farmerName: 'Suresh Patel',
    cropType: 'Basmati Rice',
    quantity: '30 Quintals',
    startingPrice: 3800,
    currentHighestBid: 4100,
    highestBidder: 'Raj Traders',
    status: 'Active'
  }
];

// ================= API ROUTES =================

// 1. Auth Endpoint: Register
app.post('/api/auth/signup', (req, res) => {
  const { name, phoneOrEmail, password, role } = req.body;

  if (!phoneOrEmail || !password || !role) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
  }

  const existingUser = users.find(u => u.phoneOrEmail === phoneOrEmail);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already registered.' });
  }

  const newUser = { id: Date.now().toString(), name, phoneOrEmail, password, role };
  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'Registration successful!',
    user: { id: newUser.id, name: newUser.name, role: newUser.role }
  });
});

// Auth Endpoint: Login (Password or OTP)
app.post('/api/auth/login', (req, res) => {
  const { phoneOrEmail, password, otp, authMethod, role } = req.body;

  if (authMethod === 'otp') {
    // Validate OTP (Demo accepts '123456')
    if (otp !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid OTP entered.' });
    }
  } else {
    // Validate Password
    const user = users.find(u => u.phoneOrEmail === phoneOrEmail && u.password === password && u.role === role);
    if (!user && phoneOrEmail !== '9876543210') {
      return res.status(401).json({ success: false, message: 'Invalid credentials or user type.' });
    }
  }

  res.status(200).json({
    success: true,
    message: 'Login successful!',
    user: { id: 'demo_123', name: 'Verified User', role }
  });
});

// 3. Get Active Crop Auctions
app.get('/api/bids', (req, res) => {
  res.status(200).json({ success: true, bids: BIDS });
});

// 4. Submit a New Bid (Buyer)
app.post('/api/bids/place', (req, res) => {
  const { cropId, bidAmount, bidderName } = req.body;

  const crop = BIDS.find(b => b.id === cropId);
  if (!crop) {
    return res.status(404).json({ success: false, message: 'Crop listing not found.' });
  }

  if (bidAmount <= crop.currentHighestBid) {
    return res.status(400).json({ success: false, message: 'Bid amount must be higher than current highest bid.' });
  }

  crop.currentHighestBid = bidAmount;
  crop.highestBidder = bidderName || 'Anonymous Merchant';

  res.status(200).json({ success: true, message: 'Bid placed successfully!', updatedCrop: crop });
});

// Serve frontend fallback for SPA routes (Express 5 named wildcard fix)
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🌾 KRISHI KRITARTH Server running on http://localhost:${PORT}`);
});