const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product'); // You'll need to create this model

// Generate PayFast signature (server-side only)
const generatePayFastSignature = (data, passphrase) => {
    let pfOutput = "";
    
    // Sort parameters alphabetically as PayFast expects
    const sortedKeys = Object.keys(data).sort();
    
    for (let key of sortedKeys) {
        if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
            pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`;
        }
    }
    
    let getString = pfOutput.substring(0, pfOutput.length - 1);
    if (passphrase) {
        getString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;
    }
    
    return crypto.createHash('md5').update(getString).digest('hex');
};

// Create order and generate payment redirect
const createPaymentOrder = async (req, res) => {
    try {
        const { items, shippingAddress, customerName, customerEmail, customerPhone } = req.body;
        const userId = req.user.id;
        
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
        
        // Generate unique order ID
        const orderId = `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        
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
        
        // Prepare PayFast data
        const isSandbox = process.env.PAYFAST_SANDBOX === 'true';
        const payfastUrl = isSandbox 
            ? 'https://sandbox.payfast.co.za/eng/process'
            : 'https://www.payfast.co.za/eng/process';
        
        const pfData = {
            merchant_id: process.env.PAYFAST_MERCHANT_ID,
            merchant_key: process.env.PAYFAST_MERCHANT_KEY,
            return_url: `${process.env.FRONTEND_URL}/payment-success?order_id=${orderId}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled?order_id=${orderId}`,
            notify_url: `${process.env.BACKEND_URL}/api/payment/payfast-webhook`,
            name_first: customerName.split(' ')[0] || '',
            name_last: customerName.split(' ').slice(1).join(' ') || '',
            email_address: customerEmail,
            m_payment_id: orderId,
            amount: totalAmount.toFixed(2),
            item_name: `Order ${orderId}`,
            item_description: `${verifiedProducts.length} item(s)`,
            custom_int1: userId,
            custom_str1: orderId
        };
        
        // Add phone if available
        if (customerPhone) {
            pfData.cell_number = customerPhone;
        }
        
        // Generate signature
        const signature = generatePayFastSignature(pfData, process.env.PAYFAST_PASSPHRASE);
        pfData.signature = signature;
        
        res.json({
            success: true,
            paymentUrl: payfastUrl,
            orderId: orderId,
            pfData: pfData,
            totalAmount: totalAmount
        });
        
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create payment order',
            error: error.message 
        });
    }
};

// Verify PayFast signature (for ITN webhook)
const verifyPayFastSignature = (data, signature) => {
    const passphrase = process.env.PAYFAST_PASSPHRASE;
    
    // Remove signature from data before generating
    const { signature: receivedSig, ...pfData } = data;
    
    // Generate signature with same method
    let pfOutput = "";
    const sortedKeys = Object.keys(pfData).sort();
    
    for (let key of sortedKeys) {
        if (pfData[key] !== "" && pfData[key] !== null && pfData[key] !== undefined) {
            pfOutput += `${key}=${encodeURIComponent(pfData[key].trim()).replace(/%20/g, "+")}&`;
        }
    }
    
    let getString = pfOutput.substring(0, pfOutput.length - 1);
    if (passphrase) {
        getString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;
    }
    
    const generatedSignature = crypto.createHash('md5').update(getString).digest('hex');
    return generatedSignature === signature;
};

// ITN Webhook (Called by PayFast server - CRITICAL for security)
const handlePayFastWebhook = async (req, res) => {
    try {
        console.log('PayFast Webhook Received:', req.body);
        const pfData = req.body;
        
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
            // Still update as failed for audit trail
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
};

// Check order payment status
const checkOrderStatus = async (req, res) => {
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
            totalAmount: order.totalAmount
        });
        
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to check order status' 
        });
    }
};

module.exports = {
    createPaymentOrder,
    handlePayFastWebhook,
    checkOrderStatus
};