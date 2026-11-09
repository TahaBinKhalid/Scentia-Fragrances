import React from 'react';
import { useNavigate } from 'react-router-dom';

const RefundPolicy = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
        
        <h1 style={styles.title}>Refund & Return Policy</h1>
        <p style={styles.lastUpdated}>Last Updated: April 23, 2026</p>

        <div style={styles.content}>
          {/* CRITICAL PERFUME DISCLAIMER */}
          <div style={styles.criticalBox}>
            <h3 style={styles.criticalTitle}>⚠️ Important Notice for Fragrance Purchases</h3>
            <p><strong>For hygiene and safety reasons, we CANNOT accept returns on any perfume products where the protective seal has been broken or the bottle has been opened.</strong> This policy is strictly enforced to ensure all customers receive authentic, untouched products.</p>
          </div>

          <section style={styles.section}>
            <h2 style={styles.h2}>1. Returns Accepted For</h2>
            <p>We accept returns in the following circumstances:</p>
            <ul style={styles.list}>
              <li><strong>Damaged in Transit:</strong> If your package arrives visibly damaged with the product affected</li>
              <li><strong>Wrong Item Shipped:</strong> If you received a different product than what you ordered</li>
              <li><strong>Defective Product:</strong> Manufacturing defects (excluding normal variations in scent perception)</li>
              <li><strong>Unopened/Sealed Items:</strong> Products with factory seal intact within 14 days of delivery</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>2. Non-Returnable Items</h2>
            <p>The following items cannot be returned:</p>
            <ul style={styles.list}>
              <li><strong>Perfumes with broken seals or any signs of opening</strong></li>
              <li><strong>Personalized or engraved fragrance bottles</strong></li>
              <li><strong>Gift cards</strong></li>
              <li><strong>Sale or clearance items (marked "Final Sale")</strong></li>
              <li><strong>Products damaged due to customer mishandling</strong></li>
              <li><strong>Items returned after 30 days from delivery</strong></li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>3. Return Window</h2>
            <ul style={styles.list}>
              <li>Returns must be initiated <strong>within 14 days</strong> of delivery date</li>
              <li>Items must be received at our facility <strong>within 30 days</strong> of delivery</li>
              <li>Returns outside these windows will be rejected</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>4. How to Request a Return</h2>
            <ol style={styles.list}>
              <li>Contact our support team at <span style={styles.gold}>returns@scentia.com</span> with your order number</li>
              <li>Provide photos/video showing the issue (for damaged/defective items)</li>
              <li>Receive a Return Authorization (RA) number within 2 business days</li>
              <li>Package the item securely in original packaging (if possible)</li>
              <li>Write the RA number clearly on the outside of the package</li>
              <li>Ship to our returns address (see Section 8)</li>
            </ol>
            <p><strong>Note:</strong> We recommend using tracked shipping for returns. SCENTIA is not responsible for lost return packages.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>5. Refund Process</h2>
            <ul style={styles.list}>
              <li><strong>Approved Returns:</strong> Refunds processed within 5-7 business days of receiving the item</li>
              <li><strong>Refund Method:</strong> Original payment method used for purchase</li>
              <li><strong>Restocking Fee:</strong> 15% restocking fee applies to non-defective, unopened returns</li>
              <li><strong>Shipping Costs:</strong> Original shipping fees are non-refundable unless we made an error</li>
              <li><strong>Return Shipping:</strong> Customer pays for return shipping except for damaged/wrong items</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>6. "Seal Broken" Policy - Detailed Explanation</h2>
            <p>Due to the nature of fragrance products and hygiene standards:</p>
            <ul style={styles.list}>
              <li><strong>Seal Intact:</strong> We can accept returns for unopened, factory-sealed perfumes</li>
              <li><strong>Seal Broken/Removed:</strong> The product is considered "used" and cannot be restocked or resold</li>
              <li><strong>Opened Bottles:</strong> No exceptions, even if only sprayed once</li>
              <li><strong>Testing Products:</strong> We encourage sampling in-store or purchasing discovery sets before buying full bottles</li>
            </ul>
            <p><span style={styles.gold}>Note:</span> This policy protects both you and future customers from receiving tampered or contaminated products.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>7. Exchanges</h2>
            <p>We do not offer direct exchanges. To exchange a product:</p>
            <ol style={styles.list}>
              <li>Return the original item following our return process</li>
              <li>Place a new order for the desired product</li>
              <li>Your refund for the return will be processed separately</li>
            </ol>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>8. Returns Address</h2>
            <p>SCENTIA PARFUMS Returns<br />
            123 Fifth Avenue, Floor 2<br />
            New York, NY 10003<br />
            United States</p>
            <p><strong>Important:</strong> Do NOT send returns without an RA number. Unauthorized returns will be rejected.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>9. International Returns</h2>
            <p>For international orders:</p>
            <ul style={styles.list}>
              <li>Return shipping costs and customs fees are customer's responsibility</li>
              <li>International returns must clearly mark "Returned Goods" on customs forms</li>
              <li>Allow 2-3 weeks for international return processing</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>10. Disputes & Chargebacks</h2>
            <p>If you dispute a charge without first contacting our support team, you waive your eligibility for return resolution. We always work with customers to resolve legitimate issues before chargeback proceedings.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>11. Contact for Returns</h2>
            <p>📧 <span style={styles.gold}>returns@scentia.com</span> (include your order number in subject line)</p>
            <p>📞 +1 (212) 555-0123 (Mon-Fri, 9AM-6PM EST)</p>
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
  criticalBox: {
    backgroundColor: '#FFF5F0',
    borderLeft: '4px solid #D4AF37',
    padding: '1.5rem',
    marginBottom: '2rem',
    borderRadius: '4px',
  },
  criticalTitle: {
    color: '#D4AF37',
    marginBottom: '0.75rem',
    fontSize: '1.1rem',
    fontWeight: '600',
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

export default RefundPolicy;