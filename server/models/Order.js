// const mongoose = require('mongoose');

// const OrderSchema = new mongoose.Schema({
//     orderId: { type: String, required: true, unique: true },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     products: [{
//         product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//         name: { type: String, required: true },
//         quantity: { type: Number, required: true, min: 1 },
//         price: { type: Number, required: true, min: 0 }
//     }],
//     totalAmount: { type: Number, required: true, min: 0 },
//     shippingAddress: { type: String, required: true },
//     customerName: { type: String },
//     customerEmail: { type: String },
//     customerPhone: { type: String },
//     status: { 
//         type: String, 
//         enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'pending_verification', 'Awaiting Verification', 'Paid', 'Payment Failed'],
//         default: 'pending'
//     },
//     paymentStatus: {
//         type: String,
//         enum: ['Pending', 'Awaiting Proof', 'Verified', 'Completed', 'Failed', 'Refunded'],
//         default: 'Pending'
//     },
//     paymentMethod: {
//         type: String,
//         enum: ['jazzcash', 'easypaisa', 'bank', 'JazzCash', 'EasyPaisa', 'Bank Transfer', 'Credit/Debit Card', 'Cash on Delivery', '1LINK', 'PayFast'],
//         required: true
//     },
//     paymentProof: {
//         filename: String,
//         filepath: String,
//         originalName: String,
//         mimeType: String,
//         size: Number,
//         uploadedAt: Date,
//         transactionId: String,
//         senderName: String,
//         senderPhone: String,
//         bankName: String,
//         accountNumber: String
//     },
//     billId: String,
//     transactionReference: String,
//     paymentDate: Date,
//     amountPaid: Number,
//     verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     verifiedAt: Date,
//     adminNotes: String,
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
// });

// // Update the updatedAt field on save
// OrderSchema.pre('save', function(next) {
//     this.updatedAt = Date.now();
//     next();
// });

// module.exports = mongoose.model('Order', OrderSchema);


const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    
    orderId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: Number,
        price: Number
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'Awaiting Verification'],
        default: 'pending'
    },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Awaiting Proof', 'Verified'], 
        default: 'Pending'
    },
    paymentMethod: { type: String },
    billId: { type: String },
    transactionReference: { type: String },
    cardLast4: { type: String },
    paymentProof: {
        filename: String,
        filepath: String,
        originalName: String,
        mimeType: String,
        size: Number,
        uploadedAt: Date,
        transactionId: String,
        senderName: String,
        senderPhone: String,
        bankName: String,
        accountNumber: String
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
verifiedAt: { type: Date },
adminNotes: { type: String },
paymentScreenshot: { type: String }
});

module.exports = mongoose.model('Order', orderSchema);