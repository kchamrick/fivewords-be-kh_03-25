// server/api/users.js -- There are three primary functions in this route that serve the following purposes: registering a new user with a secure password, allowing a registered user to login, and let's registered users view their profile. 

const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    
// Hash password
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
    
// Insert user into database
const result = await db.query(
    `INSERT INTO users (username, email, phone, password) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, username, email, phone`,
    [username, email, phone, hashedPassword]
    );
    
res.status(201).json({ 
    success: true, 
    message: 'User registered successfully', 
    user: result.rows[0] 
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
});

// Login
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
    
// Find user
const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
    );
    
if (result.rows.length === 0) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
const user = result.rows[0];
    
// Check password
const validPassword = await bcrypt.compare(password, user.password);
if (!validPassword) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
// Create token
const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT,
    { expiresIn: '24h' }
    );
    
res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
    id: user.id,
    username: user.username,
    email: user.email
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
// This would use auth middleware to get user ID from token
    const userId = req.user.id;
    
    const result = await db.query(
      'SELECT id, username, email, phone FROM users WHERE id = $1',
      [userId]
    );
    
if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
res.status(200).json({
    success: true,
    user: result.rows[0]
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ success: false, message: 'Error getting profile' });
  }
});

module.exports = router;