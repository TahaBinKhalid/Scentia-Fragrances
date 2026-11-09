const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// ========== PUBLIC TEST ROUTE (NO AUTH) ==========
router.get('/test', (req, res) => {
    res.json({ 
        message: 'Orders route is working',
        timestamp: new Date().toISOString(),
        status: 'active'
    });
});

// ========== PROTECTED ROUTES ==========

// @route    POST api/orders
// @desc     Create a new order
// @access   Private
router.post('/', auth, async (req, res) => {
    try {
        console.log("=== ORDER CREATION START ===");
        console.log("Request body:", JSON.stringify(req.body, null, 2));
        console.log("User from token:", req.user);
        
        const { products, totalAmount, shippingAddress, paymentMethod, orderId, customerName, customerEmail, customerPhone } = req.body;

        // Validation
        if (!products || products.length === 0) {
            return res.status(400).json({ 
                success: false, 
                msg: 'No products in order' 
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({ 
                success: false, 
                msg: 'Shipping address is required' 
            });
        }

        // Get user info from auth middleware
        const user = req.user;
        
        if (!user || !user.id) {
            console.error("User not found in token. User object:", user);
            return res.status(401).json({ 
                success: false, 
                msg: 'User not authenticated. Please login again.' 
            });
        }
        
        // Validate user ID is a proper ObjectId
        const userId = user.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error("Invalid user ID format:", userId);
            return res.status(400).json({ 
                success: false, 
                msg: 'Invalid user ID format' 
            });
        }
        
        // Process products - handle both with and without product IDs
        const processedProducts = products.map(item => {
            // If product has a valid ObjectId, use it; otherwise create a generic one
            let productId = item._id || item.product;
            
            // Check if it's a valid ObjectId, if not, create a dummy one for testing
            if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
                // For testing, you can use a dummy ObjectId
                productId = new mongoose.Types.ObjectId();
                console.log("Using generated ObjectId for product:", productId);
            }
            
            return {
                product: productId,
                name: item.name || 'Unknown Product',
                quantity: item.quantity || 1,
                price: item.price || 0
            };
        });
        
        // Create Order Object
        const newOrder = new Order({
            orderId: orderId || `SCN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            user: userId,
            products: processedProducts,
            totalAmount: totalAmount,
            shippingAddress: shippingAddress,
            customerName: customerName || user.name || formData?.fullName,
            customerEmail: customerEmail || user.email,
            customerPhone: customerPhone,
            paymentMethod: paymentMethod,
            status: paymentMethod === 'Cash on Delivery' ? 'confirmed' : 'pending',
            paymentStatus: 'Pending'
        });

        console.log("Order object to save:", JSON.stringify(newOrder, null, 2));
        
        // Save to MongoDB
        const order = await newOrder.save();
        
        console.log("✅ Order saved successfully:", order.orderId);
        
        res.status(201).json({ 
            success: true, 
            message: "Order placed successfully!",
            orderId: order.orderId 
        });

    } catch (err) {
        console.error('❌ Order Creation Error:', err.message);
        console.error('Full error stack:', err.stack);
        
        // Check for validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ 
                success: false, 
                message: 'Validation error', 
                errors: errors 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Server Error', 
            error: err.message 
        });
    }
});

// @route    GET api/orders/my-orders
// @desc     Get logged-in user's orders
// @access   Private
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders: orders
        });
    } catch (err) {
        console.error('Fetch Orders Error:', err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error' 
        });
    }
});

// @route    GET api/orders/:orderId
// @desc     Get single order by ID
// @access   Private
router.get('/:orderId', auth, async (req, res) => {
    try {
        const order = await Order.findOne({ 
            orderId: req.params.orderId, 
            user: req.user.id 
        });

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                msg: 'Order not found' 
            });
        }

        res.json({
            success: true,
            order: order
        });
    } catch (err) {
        console.error('Fetch Order Error:', err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error' 
        });
    }
});

module.exports = router;