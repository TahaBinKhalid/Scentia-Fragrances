const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail } = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET || '8f364bcc9fe511a98392fe582c6b14181db587156408771589f89c274a12903e';

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
    }

    // Create token with user object structure expected by auth middleware
    const token = jwt.sign(
      { 
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role || 'user'
        }
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log("User saved to Atlas:", email);

    res.status(201).json({ 
      success: true,
      message: "User created successfully",
      token,
      user: { 
        id: newUser._id,
        name: newUser.name, 
        email: newUser.email,
        role: newUser.role || 'user',
        cart: newUser.cart || []
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login route - WITH CART DATA and proper token structure
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create token with user object structure expected by auth middleware
    const token = jwt.sign(
      { 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user'
        }
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log("User logged in:", email);

    // Send cart data with login response
    res.json({ 
      success: true,
      message: "Login successful",
      token,
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email,
        role: user.role || 'user',
        cart: user.cart || []
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get current user (me) route - for checking auth status
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user?.id || decoded.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        cart: user.cart || []
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

// Sync cart route
router.post('/sync-cart', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user?.id || decoded.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    const { cartItems } = req.body;

    if (!cartItems) {
      return res.status(400).json({ message: "No cart data provided" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure each cart item has the required fields
    const sanitizedCart = cartItems.map(item => ({
      _id: item._id || item.productId,
      productId: item._id || item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image || item.imageUrl
    }));

    // Update user's cart
    user.cart = sanitizedCart;
    await user.save();

    console.log(`Cart synced for user ${user.email}: ${sanitizedCart.length} items`);

    res.json({ 
      success: true, 
      message: "Cart synced successfully",
      cart: user.cart
    });
  } catch (error) {
    console.error("Cart sync error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get user cart
router.get('/get-cart', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user?.id || decoded.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      success: true, 
      cart: user.cart || []
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Logout route (optional - client side just removes token)
router.post('/logout', async (req, res) => {
  try {
    // Since JWT is stateless, logout is handled client-side
    // This endpoint exists for consistency
    res.json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;