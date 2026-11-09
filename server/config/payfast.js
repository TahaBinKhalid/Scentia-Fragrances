// server/config/payfast.js
module.exports = {
  // PayFast Merchant IDs (Get these from PayFast after registration)
  merchant_id: '10000100', // Test merchant ID - Replace with your live ID
  merchant_key: '46f0cd694581a', // Test key - Replace with your live key
  
  // PayFast URLs
  testMode: true, // Set to false for live payments
  payfastUrl: 'https://sandbox.payfast.co.za/eng/process', // Test URL
  // payfastUrl: 'https://www.payfast.co.za/eng/process', // Live URL
  
  // Return URLs
  returnUrl: 'http://localhost:3000/order-success',
  cancelUrl: 'http://localhost:3000/checkout',
  notifyUrl: 'http://localhost:5000/api/payments/notify', // Webhook URL
  
  // Passphrase for security (set in PayFast settings)
  passphrase: 'your-payfast-passphrase',
  
  // Bank Transfer details
  bankDetails: {
    bankName: 'Example Bank',
    accountName: 'Scentia Perfumes',
    accountNumber: '1234567890',
    branchCode: '123456',
    swiftCode: 'EXMPZA12'
  }
};