import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShippingReturns = () => {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.page} className="fade-in">
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← RETURN TO PREVIOUS</button>
        
        <header style={styles.headerSection}>
          <h1 style={styles.title}>CLIENT <span style={styles.goldText}>SERVICES</span></h1>
          <p style={styles.subtitle}>Our commitment to your experience is as refined as our fragrances.</p>
        </header>

        <div style={styles.contentGrid}>
          {/* Shipping Section */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>SHIPPING & DELIVERY</h2>
            <div style={styles.article}>
              <h3 style={styles.articleHeader}>DOMESTIC EXPEDITION</h3>
              <p style={styles.text}>
                All Scentia orders are processed within 24–48 hours. We offer complimentary standard shipping on all orders exceeding $150. For orders below this threshold, a flat rate of $20 applies.
              </p>
              <ul style={styles.list}>
                <li>Standard Delivery: 3–5 Business Days</li>
                <li>Priority Courier: 1–2 Business Days ($45)</li>
              </ul>
            </div>

            <div style={styles.article}>
              <h3 style={styles.articleHeader}>PACKAGING</h3>
              <p style={styles.text}>
                Every bottle is encased in our signature crush-resistant obsidian box and vacuum-sealed to preserve the molecular integrity of the scent during transit.
              </p>
            </div>
          </section>

          {/* Returns Section */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>RETURNS & EXCHANGES</h2>
            <div style={styles.article}>
              <h3 style={styles.articleHeader}>THE 30-DAY GUARANTEE</h3>
              <p style={styles.text}>
                If a fragrance does not resonate with your chemistry, you may return the product within 30 days of arrival. The bottle must be at least 95% full and in its original architectural packaging.
              </p>
            </div>

            <div style={styles.article}>
              <h3 style={styles.articleHeader}>HOW TO INITIATE</h3>
              <p style={styles.text}>
                Contact our concierge at <span style={styles.goldText}>support@scentia.com</span> with your order ID. We will provide a prepaid insured shipping label. A restocking fee of $10 is deducted from the final refund.
              </p>
            </div>

            <div style={styles.article}>
              <h3 style={styles.articleHeader}>EXCLUSIONS</h3>
              <p style={styles.text}>
                Sample discovery sets and limited "Snyder Edition" collector's carafes are final sale and ineligible for return.
              </p>
            </div>
          </section>
        </div>

        <footer style={styles.footer}>
          <p style={styles.footerText}>Questions regarding your shipment? Contact our 24/7 Concierge.</p>
          <button style={styles.contactBtn} onClick={() => navigate('/contact')}>CONTACT US</button>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#050505', minHeight: '100vh', color: '#FFF', padding: '140px 5% 80px 5%', fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: '1100px', margin: '0 auto' },
  backBtn: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '40px', transition: 'color 0.3s' },
  headerSection: { textAlign: 'center', marginBottom: '80px' },
  title: { fontSize: '3rem', letterSpacing: '8px', fontWeight: '300', marginBottom: '20px' },
  goldText: { color: '#D4AF37' },
  subtitle: { color: '#888', fontSize: '1rem', letterSpacing: '1px' },
  contentGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px' },
  section: { display: 'flex', flexDirection: 'column', gap: '40px' },
  sectionTitle: { fontSize: '0.8rem', letterSpacing: '4px', color: '#D4AF37', borderBottom: '1px solid #222', paddingBottom: '15px' },
  article: { display: 'flex', flexDirection: 'column', gap: '15px' },
  articleHeader: { fontSize: '1.1rem', letterSpacing: '2px', fontWeight: '500' },
  text: { color: '#aaa', lineHeight: '1.8', fontSize: '0.95rem', fontWeight: '300' },
  list: { paddingLeft: '20px', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' },
  footer: { marginTop: '100px', textAlign: 'center', borderTop: '1px solid #111', paddingTop: '60px' },
  footerText: { color: '#555', fontSize: '0.85rem', marginBottom: '25px' },
  contactBtn: { padding: '15px 40px', backgroundColor: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', letterSpacing: '2px', fontSize: '0.8rem', transition: 'all 0.3s' }
};

// Add to your Global CSS or keep here
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .fade-in { animation: fadeIn 1s ease-out; }
  .back-btn:hover { color: #D4AF37 !important; }
  .contact-btn:hover { background-color: #D4AF37 !important; color: #000 !important; }
  @media (max-width: 850px) {
    .content-grid { grid-template-columns: 1fr !important; gap: 60px !important; }
  }
`;
document.head.appendChild(styleSheet);

export default ShippingReturns;