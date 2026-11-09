import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
        
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.lastUpdated}>Last Updated: April 23, 2026</p>

        <div style={styles.content}>
          <section style={styles.section}>
            <h2 style={styles.h2}>1. Information We Collect</h2>
            <p>At SCENTIA PARFUMS, we collect information to provide better services to our customers. We collect:</p>
            <ul style={styles.list}>
              <li><strong>Personal Information:</strong> Name, email address, phone number, shipping/billing address</li>
              <li><strong>Account Information:</strong> Username, password, order history, wishlist items</li>
              <li><strong>Payment Information:</strong> Credit card details (processed securely via our payment partners)</li>
              <li><strong>Shopping Cart Data:</strong> Products added to cart, quantities, and saved items</li>
              <li><strong>Usage Data:</strong> IP address, browser type, device information, pages visited</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>2. How We Use Your Information</h2>
            <p>Your data helps us:</p>
            <ul style={styles.list}>
              <li>Process and fulfill your orders</li>
              <li>Save and restore your shopping cart across sessions</li>
              <li>Send order confirmations, shipping updates, and delivery notifications</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send marketing communications (only with your consent)</li>
              <li>Improve our website, products, and services</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>3. Email & Cart Data Handling</h2>
            <p><strong>Your Email Address:</strong> We use your email to send order confirmations, shipping updates, and account-related communications. You may unsubscribe from marketing emails at any time using the link in our emails.</p>
            <p><strong>Your Shopping Cart:</strong> Items in your cart are saved to your account when you're logged in. Guest carts are stored temporarily via cookies. We never share your cart data with third parties.</p>
            <p><strong>Data Retention:</strong> We retain your order history for 7 years as required by tax laws. Cart data is kept for 30 days for logged-in users and 7 days for guests.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>4. Cookies & Tracking</h2>
            <p>We use cookies to:</p>
            <ul style={styles.list}>
              <li>Remember items in your shopping cart</li>
              <li>Keep you logged in (if you choose "Remember Me")</li>
              <li>Analyze website traffic and improve performance</li>
              <li>Personalize product recommendations</li>
            </ul>
            <p>You can disable cookies in your browser settings, but this may affect cart functionality and your shopping experience.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>5. Information Sharing</h2>
            <p>We never sell your personal information. We share data only:</p>
            <ul style={styles.list}>
              <li>With shipping carriers to deliver your order</li>
              <li>With payment processors to complete transactions (Stripe, PayPal, etc.)</li>
              <li>When required by law or to protect our legal rights</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>6. Data Security</h2>
            <p>We implement industry-standard security measures including:</p>
            <ul style={styles.list}>
              <li>256-bit SSL encryption for all transactions</li>
              <li>PCI compliance for payment processing</li>
              <li>Regular security audits and updates</li>
              <li>Secure password hashing (we never store plain-text passwords)</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul style={styles.list}>
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of marketing communications</li>
              <li>Export your order history</li>
            </ul>
            <p>To exercise these rights, contact us at <span style={styles.gold}>privacy@scentia.com</span></p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>8. Children's Privacy</h2>
            <p>Our website is not intended for children under 13. We do not knowingly collect information from minors.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last Updated" date.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>10. Contact Us</h2>
            <p>For privacy-related questions:</p>
            <p>📧 <span style={styles.gold}>privacy@scentia.com</span></p>
            <p>📞 +1 (212) 555-0123</p>
            <p>📍 123 Fifth Avenue, New York, NY 10003, USA</p>
          </section>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
    padding: '120px 5% 5rem 5%',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#D4AF37',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginBottom: '2rem',
    padding: '8px 0',
    fontFamily: 'inherit',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#000000',
    fontFamily: "'Playfair Display', serif",
  },
  lastUpdated: {
    color: '#666666',
    fontSize: '0.8rem',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #D4AF37',
    display: 'inline-block',
  },
  content: {
    color: '#333333',
    lineHeight: '1.7',
  },
  section: {
    marginBottom: '2.5rem',
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#000000',
    fontFamily: "'Playfair Display', serif",
  },
  list: {
    marginTop: '0.5rem',
    paddingLeft: '1.5rem',
  },
  gold: {
    color: '#D4AF37',
    fontWeight: '500',
  },
};

export default PrivacyPolicy;