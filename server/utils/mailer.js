const nodemailer = require('nodemailer');

// 1. Setup the transporter (Use your Gmail or SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Mailer Connection Error:", error);
  } else {
    console.log("✅ Scentia Mailer is ready to send emails");
  }
});

console.log("Attempting login for:", process.env.EMAIL_USER);
console.log("Password length check:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : "0");

// Helper function to format currency
const formatCurrency = (amount, currency = 'PKR') => {
  return `${currency} ${parseFloat(amount).toFixed(2)}`;
};

// Helper function to format date
const formatDate = () => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 2. Welcome Email Template
const sendWelcomeEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: '"SCENTIA CONCIERGE" <welcome@scentia.com>',
    to: userEmail,
    subject: 'WELCOME TO THE HOUSE OF SCENTIA',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #000; font-family: 'Georgia', 'Times New Roman', serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #050505;">
          <!-- Header with Gold Accent -->
          <div style="background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); padding: 40px 20px; text-align: center; border-bottom: 2px solid #D4AF37;">
            <h1 style="color: #D4AF37; font-size: 2.5rem; letter-spacing: 8px; margin: 0; font-weight: normal;">SCENTIA</h1>
            <p style="color: #888; font-size: 0.8rem; letter-spacing: 3px; margin-top: 10px;">LUXURY FRAGRANCE HOUSE</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #D4AF37; font-size: 1.8rem; margin-bottom: 20px; text-align: center;">
              WELCOME, ${userName.toUpperCase()}
            </h2>
            
            <p style="color: #fff; font-size: 1rem; line-height: 1.6; margin-bottom: 30px; text-align: center;">
              You have officially joined the exclusive world of Scentia. 
              Where luxury meets artistry, and every fragrance tells a story.
            </p>
            
            <!-- Benefits Section -->
            <div style="background-color: #0a0a0a; border-left: 3px solid #D4AF37; padding: 20px; margin-bottom: 30px;">
              <h3 style="color: #D4AF37; font-size: 1.1rem; margin-bottom: 15px;">✦ YOUR EXCLUSIVE BENEFITS</h3>
              <p style="color: #aaa; font-size: 0.9rem; margin-bottom: 10px;">✓ 10% OFF on your first order (Code: WELCOME10)</p>
              <p style="color: #aaa; font-size: 0.9rem; margin-bottom: 10px;">✓ Complimentary shipping on orders over PKR 15,000</p>
              <p style="color: #aaa; font-size: 0.9rem; margin-bottom: 10px;">✓ Early access to new collections</p>
              <p style="color: #aaa; font-size: 0.9rem;">✓ Birthday rewards & exclusive invites</p>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
                 style="display: inline-block; background-color: #D4AF37; color: #000; padding: 14px 40px; text-decoration: none; font-weight: bold; letter-spacing: 2px; border-radius: 0; transition: all 0.3s;">
                EXPLORE COLLECTION
              </a>
            </div>
            
            <!-- Social Links -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #222;">
              <p style="color: #555; font-size: 0.7rem; margin-bottom: 10px;">FOLLOW OUR JOURNEY</p>
              <div style="margin-top: 10px;">
                <span style="color: #D4AF37; margin: 0 10px;">📷 Instagram</span>
                <span style="color: #D4AF37; margin: 0 10px;">🐦 Twitter</span>
                <span style="color: #D4AF37; margin: 0 10px;">📘 Facebook</span>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #000; padding: 30px; text-align: center; border-top: 1px solid #111;">
            <p style="color: #555; font-size: 0.7rem; margin-bottom: 5px;">© 2024 SCENTIA. ALL RIGHTS RESERVED.</p>
            <p style="color: #555; font-size: 0.7rem;">Crafted for the few who lead.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent to:", userEmail);
    return true;
  } catch (error) {
    console.error("❌ Welcome email failed:", error.message);
    return false;
  }
};

// 3. Order Confirmation Email Template (Enhanced)
const sendConfirmationEmail = async (userEmail, orderData) => {
  const currentDate = formatDate();
  const itemsList = orderData.items && orderData.items.length > 0 ? 
    orderData.items.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #222;">
        <div>
          <span style="color: #fff;">${item.name}</span>
          <span style="color: #888; font-size: 0.75rem; margin-left: 10px;">x ${item.quantity}</span>
        </div>
        <span style="color: #D4AF37;">${formatCurrency((item.price || 0) * (item.quantity || 1))}</span>
      </div>
    `).join('') : '<p style="color: #888;">Items will be updated in your order dashboard</p>';

  const mailOptions = {
    from: '"SCENTIA CONCIERGE" <orders@scentia.com>',
    to: userEmail,
    subject: `ORDER CONFIRMED: ${orderData.orderId} | SCENTIA`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #000; font-family: 'Georgia', 'Times New Roman', serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #050505;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); padding: 40px 20px; text-align: center; border-bottom: 2px solid #D4AF37;">
            <h1 style="color: #D4AF37; font-size: 2rem; letter-spacing: 8px; margin: 0;">SCENTIA</h1>
            <p style="color: #888; font-size: 0.7rem; letter-spacing: 2px; margin-top: 10px;">ORDER CONFIRMATION</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 48px; margin-bottom: 10px;">✓</div>
              <h2 style="color: #D4AF37; font-size: 1.5rem; margin-bottom: 5px;">ORDER SECURED</h2>
              <p style="color: #888; font-size: 0.8rem;">${currentDate}</p>
            </div>
            
            <!-- Order Details -->
            <div style="background-color: #0a0a0a; border: 1px solid #1a1a1a; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #D4AF37; font-size: 0.9rem; letter-spacing: 2px; margin-bottom: 15px;">ORDER SUMMARY</h3>
              <div style="margin-bottom: 15px;">
                <p style="color: #aaa; font-size: 0.8rem; margin-bottom: 5px;">Order ID: <span style="color: #fff;">${orderData.orderId}</span></p>
                <p style="color: #aaa; font-size: 0.8rem;">Status: <span style="color: #D4AF37;">Pending Payment</span></p>
              </div>
              
              <div style="margin: 20px 0;">
                <h4 style="color: #D4AF37; font-size: 0.85rem; margin-bottom: 10px;">ITEMS</h4>
                ${itemsList}
              </div>
              
              <div style="border-top: 1px solid #222; padding-top: 15px; margin-top: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #aaa;">Subtotal</span>
                  <span style="color: #fff;">${formatCurrency(orderData.total)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #aaa;">Shipping</span>
                  <span style="color: #fff;">FREE</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 1.1rem; margin-top: 15px; padding-top: 10px; border-top: 1px solid #333;">
                  <span style="color: #D4AF37; font-weight: bold;">TOTAL</span>
                  <span style="color: #D4AF37; font-weight: bold;">${formatCurrency(orderData.total)}</span>
                </div>
              </div>
            </div>
            
            <!-- Shipping Information -->
            <div style="background-color: #0a0a0a; border-left: 3px solid #D4AF37; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #D4AF37; font-size: 0.9rem; letter-spacing: 2px; margin-bottom: 10px;">SHIPPING ADDRESS</h3>
              <p style="color: #fff; font-size: 0.85rem; margin-bottom: 5px;">${orderData.shippingAddress || 'To be confirmed'}</p>
              <p style="color: #888; font-size: 0.75rem;">Phone: ${orderData.phone || 'N/A'}</p>
            </div>
            
            <!-- Payment Instructions -->
            <div style="background-color: #0a0a0a; padding: 20px; margin-bottom: 25px; border: 1px dashed #D4AF37;">
              <h3 style="color: #D4AF37; font-size: 0.9rem; letter-spacing: 2px; margin-bottom: 10px;">💰 PAYMENT INSTRUCTIONS</h3>
              <p style="color: #aaa; font-size: 0.8rem; margin-bottom: 10px;">Bill ID: <span style="color: #fff;">${orderData.billId || 'N/A'}</span></p>
              <p style="color: #aaa; font-size: 0.8rem; line-height: 1.5;">
                1. Open your mobile banking app (EasyPaisa, JazzCash, or any bank)<br>
                2. Go to Bill Payment → 1LINK / Invoice Payment<br>
                3. Enter the Consumer ID shown above<br>
                4. Confirm amount and complete payment
              </p>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile" 
                 style="display: inline-block; background-color: #D4AF37; color: #000; padding: 12px 30px; text-decoration: none; font-weight: bold; letter-spacing: 2px;">
                VIEW ORDER STATUS
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #000; padding: 30px; text-align: center; border-top: 1px solid #111;">
            <p style="color: #555; font-size: 0.7rem; margin-bottom: 5px;">Need assistance? Contact our concierge at <span style="color: #D4AF37;">concierge@scentia.com</span></p>
            <p style="color: #555; font-size: 0.7rem;">© 2024 SCENTIA. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Order confirmation email sent to:", userEmail);
    return true;
  } catch (error) {
    console.error("❌ Order confirmation email failed:", error.message);
    return false;
  }
};

// 4. Payment Confirmation Email Template
const sendPaymentConfirmationEmail = async (userEmail, paymentData) => {
  const mailOptions = {
    from: '"SCENTIA CONCIERGE" <payments@scentia.com>',
    to: userEmail,
    subject: `PAYMENT CONFIRMED | Order ${paymentData.orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #000; font-family: 'Georgia', 'Times New Roman', serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #050505;">
          <div style="background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); padding: 40px 20px; text-align: center; border-bottom: 2px solid #D4AF37;">
            <h1 style="color: #D4AF37; font-size: 2rem; letter-spacing: 8px; margin: 0;">SCENTIA</h1>
            <p style="color: #888; font-size: 0.7rem; letter-spacing: 2px; margin-top: 10px;">PAYMENT CONFIRMED</p>
          </div>
          
          <div style="padding: 40px 30px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
            <h2 style="color: #D4AF37; font-size: 1.8rem; margin-bottom: 20px;">PAYMENT SUCCESSFUL!</h2>
            <p style="color: #fff; font-size: 1rem; margin-bottom: 30px;">
              Your payment of <strong style="color: #D4AF37;">${formatCurrency(paymentData.amount)}</strong> has been confirmed.
            </p>
            
            <div style="background-color: #0a0a0a; padding: 20px; margin-bottom: 30px; text-align: left;">
              <p style="color: #aaa; margin-bottom: 10px;">Transaction ID: <span style="color: #fff;">${paymentData.transactionId}</span></p>
              <p style="color: #aaa;">Order ID: <span style="color: #fff;">${paymentData.orderId}</span></p>
            </div>
            
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 30px;">
              Your order will be prepared and shipped within 2-3 business days. 
              You will receive tracking information via email once shipped.
            </p>
            
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile" 
               style="display: inline-block; background-color: #D4AF37; color: #000; padding: 12px 30px; text-decoration: none; font-weight: bold; letter-spacing: 2px;">
              TRACK YOUR ORDER
            </a>
          </div>
          
          <div style="background-color: #000; padding: 30px; text-align: center; border-top: 1px solid #111;">
            <p style="color: #555; font-size: 0.7rem;">Thank you for choosing Scentia.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Payment confirmation email sent to:", userEmail);
    return true;
  } catch (error) {
    console.error("❌ Payment confirmation email failed:", error.message);
    return false;
  }
};

// 5. Order Shipping Confirmation Email
const sendShippingConfirmationEmail = async (userEmail, shippingData) => {
  const mailOptions = {
    from: '"SCENTIA CONCIERGE" <shipping@scentia.com>',
    to: userEmail,
    subject: `YOUR ORDER HAS BEEN SHIPPED | ${shippingData.orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #000; font-family: 'Georgia', 'Times New Roman', serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #050505;">
          <div style="background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); padding: 40px 20px; text-align: center; border-bottom: 2px solid #D4AF37;">
            <h1 style="color: #D4AF37; font-size: 2rem; letter-spacing: 8px; margin: 0;">SCENTIA</h1>
            <p style="color: #888; font-size: 0.7rem; letter-spacing: 2px; margin-top: 10px;">ORDER SHIPPED</p>
          </div>
          
          <div style="padding: 40px 30px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 20px;">📦</div>
            <h2 style="color: #D4AF37; font-size: 1.8rem; margin-bottom: 20px;">ON ITS WAY!</h2>
            <p style="color: #fff; font-size: 1rem; margin-bottom: 20px;">
              Your order has been shipped and is on its way to you.
            </p>
            
            <div style="background-color: #0a0a0a; padding: 20px; margin-bottom: 30px;">
              <p style="color: #aaa; margin-bottom: 10px;">Tracking Number: <span style="color: #D4AF37;">${shippingData.trackingNumber}</span></p>
              <p style="color: #aaa;">Estimated Delivery: <span style="color: #fff;">${shippingData.estimatedDelivery}</span></p>
            </div>
            
            <a href="${shippingData.trackingUrl}" 
               style="display: inline-block; background-color: #D4AF37; color: #000; padding: 12px 30px; text-decoration: none; font-weight: bold; letter-spacing: 2px;">
              TRACK PACKAGE
            </a>
          </div>
          
          <div style="background-color: #000; padding: 30px; text-align: center; border-top: 1px solid #111;">
            <p style="color: #555; font-size: 0.7rem;">We hope you enjoy your Scentia experience.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Shipping confirmation email sent to:", userEmail);
    return true;
  } catch (error) {
    console.error("❌ Shipping confirmation email failed:", error.message);
    return false;
  }
};

module.exports = { 
  sendWelcomeEmail,
  sendConfirmationEmail, 
  sendPaymentConfirmationEmail,
  sendShippingConfirmationEmail
};