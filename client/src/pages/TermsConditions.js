import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsConditions = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
        
        <h1 style={styles.title}>Terms & Conditions</h1>
        <p style={styles.lastUpdated}>Last Updated: April 23, 2026</p>

        <div style={styles.content}>
          <section style={styles.section}>
            <h2 style={styles.h2}>1. Acceptance of Terms</h2>
            <p>By accessing and using SCENTIA PARFUMS website (scentia.com), you agree to be bound by these Terms & Conditions. If you disagree with any part, please do not use our website.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>2. Eligibility</h2>
            <p>You must be at least 18 years old to make purchases on our website. By placing an order, you confirm that you are of legal age to purchase fragrance products in your jurisdiction.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>3. Account Responsibility</h2>
            <ul style={styles.list}>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You agree to accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized account use</li>
              <li>We reserve the right to refuse service, terminate accounts, or cancel orders at our discretion</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>4. Product Information</h2>
            <p>We make every effort to display product colors, ingredients, and descriptions accurately. However, actual product appearance may vary based on your screen display. We do not warrant that product descriptions, images, or other content are error-free.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>5. Pricing & Payment</h2>
            <ul style={styles.list}>
              <li>All prices are in USD ($) unless otherwise specified</li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to correct pricing errors</li>
              <li>Payment must be made in full at checkout</li>
              <li>Accepted payment methods: Visa, Mastercard, American Express, PayPal, Apple Pay</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>6. Order Acceptance</h2>
            <p>Order confirmation does not guarantee acceptance. We reserve the right to:</p>
            <ul style={styles.list}>
              <li>Cancel any order due to product unavailability</li>
              <li>Refuse orders with suspected fraud or unauthorized transactions</li>
              <li>Limit quantities purchased per customer</li>
              <li>Correct pricing errors after order placement</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>7. Shipping & Delivery</h2>
            <p>Delivery timeframes are estimates, not guarantees. We are not responsible for delays caused by customs, carriers, or natural events. Risk of loss transfers to you upon carrier pickup.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>8. Intellectual Property</h2>
            <p>All content on this website (text, graphics, logos, images, product designs) is the property of SCENTIA PARFUMS and protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works without written permission.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>9. User-Generated Content</h2>
            <p>By submitting product reviews, photos, or comments, you grant SCENTIA PARFUMS a non-exclusive, royalty-free, perpetual license to use, modify, and display your content on our platforms.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>10. Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul style={styles.list}>
              <li>Use our website for illegal purposes</li>
              <li>Attempt to bypass our security measures</li>
              <li>Scrape or copy product data without permission</li>
              <li>Interfere with website functionality</li>
              <li>Create false accounts or impersonate others</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>11. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, SCENTIA PARFUMS shall not be liable for any indirect, incidental, or consequential damages arising from your use of our products or website. Our total liability shall not exceed the amount you paid for the product in question.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>12. Governing Law</h2>
            <p>These Terms are governed by the laws of the State of New York, without regard to conflict of law principles. Any disputes shall be resolved exclusively in New York County courts.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>13. Changes to Terms</h2>
            <p>We may update these Terms periodically. Continued use of our website constitutes acceptance of the revised Terms.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>14. Contact Information</h2>
            <p>For questions about these Terms:</p>
            <p>📧 <span style={styles.gold}>legal@scentia.com</span></p>
            <p>📞 +1 (212) 555-0123</p>
            <p>📍 123 Fifth Avenue, New York, NY 10003</p>
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

export default TermsConditions;