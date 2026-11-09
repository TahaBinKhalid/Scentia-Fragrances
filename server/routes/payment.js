const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// ========== PAYFAST HELPER FUNCTIONS ==========

const generatePayFastSignature = (data, passphrase = '') => {
    let pfOutput = "";

    // 1. MANDATORY ORDER: PayFast requires these fields in this exact sequence.
    // If a field is not present in your data, it is skipped.
    const checkoutFields = [
        "merchant_id", "merchant_key", "return_url", "cancel_url",
        "notify_url", "name_first", "name_last", "email_address",
        "cell_number", "m_payment_id", "amount", "item_name",
        "item_description", "custom_int1", "custom_int2", "custom_int3",
        "custom_int4", "custom_int5", "custom_str1", "custom_str2",
        "custom_str3", "custom_str4", "custom_str5", "email_confirmation",
        "confirmation_address", "payment_method", "subscription_type",
        "billing_date", "recurring_amount", "frequency", "cycles"
    ];

    // 2. BUILD PARAMETER STRING
    checkoutFields.forEach((key) => {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            // PayFast rule: Concatenate non-blank variables
            if (value !== "" && value !== null && value !== undefined) {
                const valStr = String(value).trim();
                // PayFast rule: encodeURIComponent, replace %20 with +, and UPPERCASE the hex codes
                const encodedVal = encodeURIComponent(valStr)
                    .replace(/%20/g, "+")
                    .replace(/%[0-9a-fA-F]{2}/g, (match) => match.toUpperCase());
                
                pfOutput += `${key}=${encodedVal}&`;
            }
        }
    });

    // 3. REMOVE TRAILING AMPERSAND
    let getString = pfOutput.slice(0, -1);

    // 4. APPEND PASSPHRASE
    // Important: Only add if set in PayFast Dashboard > Settings
    if (passphrase && passphrase.trim() !== "") {
        const encodedPass = encodeURIComponent(passphrase.trim())
            .replace(/%20/g, "+")
            .replace(/%[0-9a-fA-F]{2}/g, (match) => match.toUpperCase());
        getString += `&passphrase=${encodedPass}`;
    }

    // 5. GENERATE MD5 HASH
    return crypto.createHash('md5').update(getString).digest('hex');
};

const verifyPayFastSignature = (data, receivedSignature) => {
    const passphrase = process.env.PAYFAST_PASSPHRASE || '';
    
    // Create a clean copy and remove signature
    const cleanData = { ...data };
    delete cleanData.signature;
    
    const generatedSignature = generatePayFastSignature(cleanData, passphrase);
    return generatedSignature === receivedSignature;
};

// Validate South African phone number for PayFast
const validatePayFastPhone = (phone) => {
    if (!phone) return null;
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // PayFast expects South African format: 10 digits starting with 0
    if (cleaned.length === 10 && cleaned.startsWith('0')) {
        return cleaned;
    }
    return null; 
};

// ========== EMAIL CONFIGURATION ==========

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send order confirmation email to customer
const sendOrderConfirmationEmail = async (email, orderData) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Order Confirmation - ${orderData.orderId}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #D4AF37;">Thank You for Your Order!</h2>
                <p>Dear ${orderData.customerName},</p>
                <p>Your order has been successfully placed.</p>
                
                <h3>Order Details:</h3>
                <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                <p><strong>Total Amount:</strong> PKR ${orderData.total}</p>
                <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
                <p><strong>Status:</strong> ${orderData.status}</p>
                
                <h3>Shipping Address:</h3>
                <p>${orderData.shippingAddress}</p>
                
                <h3>Items Ordered:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr><th style="border-bottom: 1px solid #ddd; text-align: left; padding: 8px;">Product</th>
                            <th style="border-bottom: 1px solid #ddd; text-align: left; padding: 8px;">Quantity</th>
                            <th style="border-bottom: 1px solid #ddd; text-align: left; padding: 8px;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderData.items.map(item => `
                            <tr>
                                <td style="padding: 8px;">${item.name}</td>
                                <td style="padding: 8px;">${item.quantity}</td>
                                <td style="padding: 8px;">PKR ${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <p style="margin-top: 20px;">We will notify you once your order is shipped.</p>
                <p>Thank you for shopping with Scentia!</p>
            </div>
        `
    };
    
    await transporter.sendMail(mailOptions);
};

// Send admin notification for manual payment methods
const sendAdminNotification = async (orderData, customerDetails, paymentDetails) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@scentia.com';
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `New Order Requires Verification - ${orderData.orderId}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #D4AF37;">New Order Requires Payment Verification</h2>
                
                <h3>Order Details:</h3>
                <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                <p><strong>Total Amount:</strong> PKR ${orderData.amount}</p>
                <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
                <p><strong>Status:</strong> Pending Verification</p>
                
                <h3>Customer Details:</h3>
                <p><strong>Name:</strong> ${customerDetails.fullName}</p>
                <p><strong>Email:</strong> ${customerDetails.email}</p>
                <p><strong>Phone:</strong> ${customerDetails.phone}</p>
                <p><strong>Address:</strong> ${customerDetails.address}</p>
                
                <h3>Payment Details Provided:</h3>
                ${paymentDetails.bankName ? `
                    <p><strong>Bank Name:</strong> ${paymentDetails.bankName}</p>
                    <p><strong>Account Holder:</strong> ${paymentDetails.accountHolderName}</p>
                    <p><strong>Account Number:</strong> ${paymentDetails.accountNumber}</p>
                    <p><strong>Transaction Reference:</strong> ${paymentDetails.transactionRef}</p>
                    <p><strong>Transfer Date:</strong> ${paymentDetails.transferDate}</p>
                ` : ''}
                ${paymentDetails.jazzCashNumber ? `
                    <p><strong>JazzCash Number:</strong> ${paymentDetails.jazzCashNumber}</p>
                    <p><strong>Account Holder:</strong> ${paymentDetails.accountHolderName}</p>
                    <p><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
                    <p><strong>Amount Sent:</strong> PKR ${paymentDetails.amountSent}</p>
                ` : ''}
                ${paymentDetails.easyPaisaNumber ? `
                    <p><strong>EasyPaisa Number:</strong> ${paymentDetails.easyPaisaNumber}</p>
                    <p><strong>Account Holder:</strong> ${paymentDetails.accountHolderName}</p>
                    <p><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
                    <p><strong>Amount Sent:</strong> PKR ${paymentDetails.amountSent}</p>
                ` : ''}
                
                <h3>Items Ordered:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr><th style="border-bottom: 1px solid #ddd; text-align: left; padding: 8px;">Product</th>
                            <th style="border-bottom: 1px solid #ddd; text-align: left; padding: 8px;">Quantity</th>
                            <th style="border-bottom: 1px solid #ddd; text-align: left; padding: 8px;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderData.items.map(item => `
                            <tr>
                                <td style="padding: 8px;">${item.name}</td>
                                <td style="padding: 8px;">${item.quantity}</td>
                                <td style="padding: 8px;">PKR ${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <p style="margin-top: 20px;">Please verify the payment and update the order status in the admin panel.</p>
            </div>
        `
    };
    
    await transporter.sendMail(mailOptions);
};

// ========== PAYFAST ROUTES ==========

// Create PayFast payment order (AUTOMATIC - Real Money)
router.post('/create-payfast-order', auth, async (req, res) => {
    try {
        console.log('Creating PayFast order...');
        const { items, shippingAddress, customerName, customerEmail, customerPhone } = req.body;
        const userId = req.user.id;
        
        console.log('User ID:', userId);
        console.log('Customer Phone:', customerPhone);
        
        // CRITICAL: Calculate total on server-side using prices from database
        let totalAmount = 0;
        const verifiedProducts = [];
        
        for (const item of items) {
            // Fetch product from database (not from client)
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Product ${item.productId} not found` 
                });
            }
            
            const quantity = parseInt(item.quantity);
            const price = product.price; // Server price, not client price
            const itemTotal = price * quantity;
            
            totalAmount += itemTotal;
            
            verifiedProducts.push({
                product: product._id,
                name: product.name,
                quantity: quantity,
                price: price
            });
        }
        
        console.log('Total amount calculated:', totalAmount);
        
        // Generate unique order ID
        const orderId = `PAYFAST-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        
        // Create order with PENDING status
        const order = new Order({
            orderId: orderId,
            user: userId,
            products: verifiedProducts,
            totalAmount: totalAmount,
            shippingAddress: shippingAddress,
            customerName: customerName,
            customerEmail: customerEmail,
            customerPhone: customerPhone,
            paymentMethod: 'PayFast',
            status: 'pending',
            paymentStatus: 'Pending'
        });
        
        await order.save();
        console.log('Order saved:', orderId);
        
        // Prepare PayFast data
        const isSandbox = process.env.PAYFAST_SANDBOX === 'true';
        const payfastUrl = isSandbox 
            ? 'https://sandbox.payfast.co.za/eng/process'
            : 'https://www.payfast.co.za/eng/process';
        
        // Split name into first and last
        const nameParts = customerName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Validate phone number for PayFast (must be South African format)
        const validPhone = validatePayFastPhone(customerPhone);
        
        // Get credentials with proper trimming
        const merchantId = (process.env.PAYFAST_MERCHANT_ID || '10000100').toString().trim();
        const merchantKey = (process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a').toString().trim();
        
        console.log('Using Merchant ID:', merchantId);
        console.log('Using Merchant Key:', merchantKey.substring(0, 10) + '...');
        
        // UPDATED: pfData with EXACT order for signature
        const pfData = {
            merchant_id: merchantId,
            merchant_key: merchantKey,
            return_url: (process.env.PAYFAST_RETURN_URL || 'http://localhost:3000/profile').toString().trim(),
            cancel_url: (process.env.PAYFAST_CANCEL_URL || 'http://localhost:3000/checkout').toString().trim(),
            notify_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/payfast-webhook`,
            name_first: firstName,
            name_last: lastName,
            email_address: customerEmail,
            m_payment_id: orderId,
            amount: totalAmount.toFixed(2),
            item_name: `Order #${orderId.split('-')[1] || orderId.substring(0, 10)}`,
            item_description: `${verifiedProducts.length} items`,
            custom_int1: Math.floor(Date.now() / 1000), // Pure number
            custom_str1: orderId
        };
        
        // Add cell_number only if valid (CRITICAL: Add BEFORE signature generation)
        if (validPhone) {
            pfData.cell_number = validPhone;
            console.log('Adding valid cell_number:', validPhone);
        } else {
            console.log('Skipping cell_number - not a valid SA number:', customerPhone);
        }
        
        console.log('PayFast data prepared with fields:', Object.keys(pfData).join(', '));
        
        // Generate signature AFTER all fields (including phone) are added
        const passphrase = process.env.PAYFAST_PASSPHRASE ? process.env.PAYFAST_PASSPHRASE.toString().trim() : '';
        const signature = generatePayFastSignature(pfData, passphrase);
        pfData.signature = signature;
        
        console.log('Signature generated successfully');
        console.log('Signature preview:', signature.substring(0, 16) + '...');
        
        res.json({
            success: true,
            paymentUrl: payfastUrl,
            orderId: orderId,
            pfData: pfData,
            totalAmount: totalAmount
        });
        
    } catch (error) {
        console.error('PayFast order creation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create payment order',
            error: error.message 
        });
    }
});

// ITN Webhook (Called by PayFast server - CRITICAL for security)
router.post('/payfast-webhook', express.raw({ type: 'application/x-www-form-urlencoded' }), async (req, res) => {
    try {
        // Parse the raw body to URL encoded
        const qs = require('querystring');
        const pfData = qs.parse(req.body.toString());
        
        console.log('PayFast Webhook Received, payment_status:', pfData.payment_status);
        
        // Verify signature
        const isValid = verifyPayFastSignature(pfData, pfData.signature);
        
        if (!isValid) {
            console.error('Invalid signature from PayFast');
            return res.status(400).send('Invalid signature');
        }
        
        // Verify that amount matches order in database
        const orderId = pfData.m_payment_id;
        const order = await Order.findOne({ orderId: orderId });
        
        if (!order) {
            console.error(`Order ${orderId} not found`);
            return res.status(404).send('Order not found');
        }
        
        // Verify amount matches
        const receivedAmount = parseFloat(pfData.amount);
        const expectedAmount = order.totalAmount;
        
        if (Math.abs(receivedAmount - expectedAmount) > 0.01) {
            console.error(`Amount mismatch: ${receivedAmount} vs ${expectedAmount}`);
            order.paymentStatus = 'Failed';
            await order.save();
            return res.status(400).send('Amount mismatch');
        }
        
        // Check payment status
        if (pfData.payment_status === 'COMPLETE') {
            order.status = 'confirmed';
            order.paymentStatus = 'Paid';
            order.transactionReference = pfData.pf_payment_id;
            order.paymentDate = new Date();
            order.amountPaid = receivedAmount;
            await order.save();
            
            console.log(`✅ Order ${orderId} marked as PAID`);
            
            // Send confirmation email for successful payment
            const orderData = {
                orderId: order.orderId,
                total: order.totalAmount,
                paymentMethod: 'PayFast',
                status: 'Confirmed',
                shippingAddress: order.shippingAddress,
                customerName: order.customerName,
                items: order.products
            };
            
            await sendOrderConfirmationEmail(order.customerEmail, orderData);
            
            // Emit socket event for real-time update
            const io = req.app.get('io');
            if (io) {
                io.to(order.user.toString()).emit('payment_confirmed', {
                    orderId: orderId,
                    status: 'Paid'
                });
            }
        } else if (pfData.payment_status === 'FAILED') {
            order.paymentStatus = 'Failed';
            await order.save();
            console.log(`❌ Order ${orderId} payment FAILED`);
        }
        
        // Always return 200 to PayFast
        res.sendStatus(200);
        
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.sendStatus(500);
    }
});

// Check order payment status
router.get('/status/:orderId', auth, async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        
        const order = await Order.findOne({ orderId: orderId, user: userId });
        
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }
        
        res.json({
            success: true,
            orderId: order.orderId,
            status: order.status,
            paymentStatus: order.paymentStatus,
            totalAmount: order.totalAmount,
            transactionReference: order.transactionReference
        });
        
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to check order status' 
        });
    }
});

// ========== MANUAL PAYMENT ROUTES (JazzCash, EasyPaisa, Bank Transfer) ==========

// Send order confirmation email (for manual payment methods)
router.post('/send-confirmation-email', auth, async (req, res) => {
    try {
        const { email, orderData } = req.body;
        
        await sendOrderConfirmationEmail(email, orderData);
        
        res.json({ 
            success: true, 
            message: 'Confirmation email sent successfully' 
        });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send confirmation email' 
        });
    }
});

// Send admin notification for manual payment methods
router.post('/send-admin-notification', auth, async (req, res) => {
    try {
        const { orderData, customerDetails, paymentDetails } = req.body;
        
        await sendAdminNotification(orderData, customerDetails, paymentDetails);
        
        res.json({ 
            success: true, 
            message: 'Admin notification sent successfully' 
        });
    } catch (error) {
        console.error('Admin notification error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send admin notification' 
        });
    }
});

// ========== ADMIN VERIFICATION ROUTES ==========

// Admin: Get all pending verification orders
router.get('/admin/pending-verifications', auth, async (req, res) => {
    try {
        // Check if user is admin
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Admin access required' 
            });
        }
        
        const pendingOrders = await Order.find({ 
            paymentStatus: 'Pending',
            paymentMethod: { $in: ['JazzCash', 'EasyPaisa', 'Bank Transfer'] }
        }).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            orders: pendingOrders
        });
    } catch (error) {
        console.error('Error fetching pending verifications:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch pending verifications' 
        });
    }
});

// Admin: Verify a payment (mark as paid)
router.put('/admin/verify-payment/:orderId', auth, async (req, res) => {
    try {
        // Check if user is admin
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Admin access required' 
            });
        }
        
        const { orderId } = req.params;
        const { adminNotes } = req.body;
        
        const order = await Order.findOne({ orderId: orderId });
        
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }
        
        // Update order status
        order.paymentStatus = 'Paid';
        order.status = 'confirmed';
        order.verifiedBy = req.user.id;
        order.verifiedAt = new Date();
        order.adminNotes = adminNotes || 'Payment verified by admin';
        await order.save();
        
        // Send confirmation email to customer
        const orderData = {
            orderId: order.orderId,
            total: order.totalAmount,
            paymentMethod: order.paymentMethod,
            status: 'Payment Verified - Order Confirmed',
            shippingAddress: order.shippingAddress,
            customerName: order.customerName,
            items: order.products
        };
        
        await sendOrderConfirmationEmail(order.customerEmail, orderData);
        
        res.json({
            success: true,
            message: 'Payment verified successfully',
            order: order
        });
        
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to verify payment' 
        });
    }
});

// Admin: Reject a payment
router.put('/admin/reject-payment/:orderId', auth, async (req, res) => {
    try {
        // Check if user is admin
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Admin access required' 
            });
        }
        
        const { orderId } = req.params;
        const { rejectionReason } = req.body;
        
        const order = await Order.findOne({ orderId: orderId });
        
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }
        
        // Update order status
        order.paymentStatus = 'Failed';
        order.status = 'cancelled';
        order.adminNotes = rejectionReason || 'Payment verification failed';
        await order.save();
        
        res.json({
            success: true,
            message: 'Payment rejected',
            order: order
        });
        
    } catch (error) {
        console.error('Error rejecting payment:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to reject payment' 
        });
    }
});

// ========== TEST ROUTE ==========

router.get('/test', (req, res) => {
    res.json({ 
        message: 'Payment routes are working',
        timestamp: new Date().toISOString(),
        availableMethods: ['PayFast', 'JazzCash', 'EasyPaisa', 'Bank Transfer']
    });
});

module.exports = router;