import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterStatus('Thank you for subscribing!');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus(''), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSocialClick = (platform) => {
    // Add your social media URLs here
    const socialUrls = {
      instagram: 'https://instagram.com/scentia',
      facebook: 'https://facebook.com/scentia',
      twitter: 'https://twitter.com/scentia',
      youtube: 'https://youtube.com/scentia',
      pinterest: 'https://pinterest.com/scentia'
    };
    window.open(socialUrls[platform], '_blank', 'noopener noreferrer');
  };

  return (
    <footer style={styles.footer}>
      {/* Main Footer Content */}
      <div style={styles.container}>
        
        {/* Column 1: Brand & Newsletter */}
        <div style={styles.column}>
          <div style={styles.logoSection} onClick={scrollToTop} className="footer-logo-clickable">
            <span style={styles.logoIcon}>✨</span>
            <h2 style={styles.logo}>SCENTIA</h2>
          </div>
          <p style={styles.description}>
            The art of silent declaration. Defining modern luxury through olfactory craftsmanship since 2024.
          </p>
          <div style={styles.socialLinks}>
            <button 
              onClick={() => handleSocialClick('instagram')} 
              style={styles.socialIcon}
              className="social-icon-hover"
              aria-label="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="17" y1="7" x2="17.01" y2="7"></line>
              </svg>
            </button>
            <button 
              onClick={() => handleSocialClick('facebook')} 
              style={styles.socialIcon}
              className="social-icon-hover"
              aria-label="Facebook"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </button>
            <button 
              onClick={() => handleSocialClick('twitter')} 
              style={styles.socialIcon}
              className="social-icon-hover"
              aria-label="Twitter"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </button>
            <button 
              onClick={() => handleSocialClick('youtube')} 
              style={styles.socialIcon}
              className="social-icon-hover"
              aria-label="YouTube"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </button>
            <button 
              onClick={() => handleSocialClick('pinterest')} 
              style={styles.socialIcon}
              className="social-icon-hover"
              aria-label="Pinterest"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 20.27a9 9 0 0 1-2-5.77 9 9 0 0 1 9-9 9 9 0 0 1 0 18 8.73 8.73 0 0 1-4.84-1.39"></path>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Column 2: Explore */}
        <div style={styles.column}>
          <h4 style={styles.heading}>
            <span style={styles.headingIcon}>⌘</span> EXPLORE
          </h4>
          <ul style={styles.list}>
            <li style={styles.listItem} onClick={() => navigate('/shop')} className="list-item-hover">
              <span style={styles.linkIcon}>→</span> The Collection
            </li>
            <li style={styles.listItem} onClick={() => navigate('/discover')} className="list-item-hover">
              <span style={styles.linkIcon}>→</span> Our Heritage
            </li>
            <li style={styles.listItem} onClick={() => navigate('/terms')} className="list-item-hover">
              <span style={styles.linkIcon}>→</span> Terms & Conditions
            </li>
            <li style={styles.listItem} className="list-item-hover">
              <span style={styles.linkIcon}>→</span> Store Locator
            </li>
            <li style={styles.listItem} className="list-item-hover">
              <span style={styles.linkIcon}>→</span> New Arrivals
            </li>
          </ul>
        </div>

        {/* Column 3: Client Care */}
        <div style={styles.column}>
          <h4 style={styles.heading}>
            <span style={styles.headingIcon}>✧</span> CLIENT CARE
          </h4>
          <ul style={styles.list}>
            <li style={styles.listItem} onClick={() => navigate('/shipping-returns')} className="list-item-hover">
              <span style={styles.linkIcon}>→</span> Shipping & Returns
            </li>
            <li style={styles.listItem} className="list-item-hover">
              <span style={styles.linkIcon}>→</span> Fragrance Finder
            </li>
            <li style={styles.listItem} onClick={() => navigate('/privacy')} className="list-item-hover">
              <span style={styles.linkIcon}>→</span> Privacy Policy
            </li>
            <li style={styles.listItem} onClick={() => navigate('/contact')} className="list-item-hover">
              <span style={styles.linkIcon}>→</span> Contact Us
            </li>
            <li style={styles.listItem} className="list-item-hover">
              <span style={styles.linkIcon}>→</span> FAQ
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Newsletter */}
        <div style={styles.column}>
          <h4 style={styles.heading}>
            <span style={styles.headingIcon}>✦</span> THE ATELIER
          </h4>
          <div style={styles.contactInfo}>
            <p style={styles.contactItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              123 Fifth Avenue, New York, NY 10003
            </p>
            <p style={styles.contactItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              +1 (212) 555-0123
            </p>
            <p style={styles.contactItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              hello@scentia.com
            </p>
          </div>
          
          <div style={styles.newsletterSection}>
            <p style={styles.newsletterText}>
              <span style={styles.gold}>Subscribe</span> to receive exclusive offers and fragrance stories.
            </p>
            <form onSubmit={handleNewsletterSubmit} style={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Your email address"
                style={styles.newsletterInput}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" style={styles.newsletterBtn} className="newsletter-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
            {newsletterStatus && <p style={styles.newsletterStatus}>{newsletterStatus}</p>}
          </div>
        </div>
      </div>

      {/* Payment Methods & Trust Badges */}
      <div style={styles.paymentSection}>
        <div style={styles.paymentIcons}>
          <span style={styles.paymentIcon}>VISA</span>
          <span style={styles.paymentIcon}>Mastercard</span>
          <span style={styles.paymentIcon}>AMEX</span>
          <span style={styles.paymentIcon}>PayPal</span>
          <span style={styles.paymentIcon}>Apple Pay</span>
        </div>
        <div style={styles.trustBadges}>
          <span style={styles.trustBadge}>🔒 256-bit SSL Secure</span>
          <span style={styles.trustBadge}>⭐ 4.9/5 Customer Rating</span>
          <span style={styles.trustBadge}>🚚 Free Shipping on $100+</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={styles.bottomBar}>
        <p style={styles.copyright}>
          © {currentYear} SCENTIA PARFUMS. ALL RIGHTS RESERVED.
        </p>
        <div style={styles.bottomLinks}>
          <span style={styles.bottomLink} className="bottom-link-hover">Terms of Use</span>
          <span style={styles.bottomLink} className="bottom-link-hover">Privacy Policy</span>
          <span style={styles.bottomLink} className="bottom-link-hover">Cookie Settings</span>
        </div>
        <div style={styles.designerCredit}>
          CRAFTED FOR THE <span style={styles.gold}>CONNOISSEUR</span>
        </div>
      </div>

      {/* Back to Top Button */}
      <button onClick={scrollToTop} style={styles.backToTop} className="back-to-top" aria-label="Back to top">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#050505',
    color: '#FFFFFF',
    padding: '70px 5% 30px',
    borderTop: '1px solid rgba(212, 175, 55, 0.2)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: 'relative',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '50px',
    maxWidth: '1400px',
    margin: '0 auto',
    marginBottom: '50px',
  },
  column: {
    minWidth: '200px',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    cursor: 'pointer',
    transition: 'opacity 0.3s ease',
  },
  logoIcon: {
    fontSize: '1.8rem',
  },
  logo: {
    fontSize: '1.6rem',
    letterSpacing: '6px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #FFFFFF 0%, #D4AF37 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
  },
  description: {
    color: '#888888',
    lineHeight: '1.7',
    fontSize: '0.85rem',
    maxWidth: '280px',
    marginBottom: '25px',
  },
  socialLinks: {
    display: 'flex',
    gap: '18px',
    alignItems: 'center',
  },
  socialIcon: {
    color: '#D4AF37',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    background: 'none',
  },
  heading: {
    fontSize: '0.75rem',
    letterSpacing: '3px',
    color: '#D4AF37',
    marginBottom: '28px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headingIcon: {
    fontSize: '0.9rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    color: '#AAAAAA',
    marginBottom: '14px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  linkIcon: {
    fontSize: '0.7rem',
    opacity: 0,
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    color: '#D4AF37',
  },
  contactInfo: {
    marginBottom: '30px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#AAAAAA',
    fontSize: '0.8rem',
    marginBottom: '12px',
    lineHeight: '1.5',
  },
  newsletterSection: {
    marginTop: '20px',
  },
  newsletterText: {
    fontSize: '0.8rem',
    color: '#888888',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  newsletterForm: {
    display: 'flex',
    borderBottom: '1px solid #333333',
    paddingBottom: '8px',
  },
  newsletterInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '8px 0',
    color: '#FFFFFF',
    fontSize: '0.85rem',
    outline: 'none',
    fontFamily: 'inherit',
  },
  newsletterBtn: {
    background: 'transparent',
    border: 'none',
    color: '#D4AF37',
    cursor: 'pointer',
    padding: '4px 8px',
    transition: 'transform 0.3s ease',
  },
  newsletterStatus: {
    fontSize: '0.7rem',
    color: '#D4AF37',
    marginTop: '10px',
  },
  paymentSection: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '30px 0 20px',
    borderTop: '1px solid #111111',
    borderBottom: '1px solid #111111',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  paymentIcons: {
    display: 'flex',
    gap: '20px',
  },
  paymentIcon: {
    fontSize: '0.7rem',
    letterSpacing: '1px',
    color: '#666666',
    fontWeight: '500',
  },
  trustBadges: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  trustBadge: {
    fontSize: '0.7rem',
    color: '#888888',
    letterSpacing: '0.5px',
  },
  bottomBar: {
    maxWidth: '1400px',
    margin: '30px auto 0',
    paddingTop: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  copyright: {
    fontSize: '0.7rem',
    color: '#555555',
    letterSpacing: '1px',
  },
  bottomLinks: {
    display: 'flex',
    gap: '24px',
  },
  bottomLink: {
    fontSize: '0.7rem',
    color: '#666666',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
  designerCredit: {
    fontSize: '0.7rem',
    color: '#555555',
    letterSpacing: '2px',
  },
  gold: {
    color: '#D4AF37',
  },
  backToTop: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#D4AF37',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
    zIndex: 100,
  },
};

// CSS Injection for Hover Effects
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .footer-logo-clickable:hover {
      opacity: 0.85;
    }
    .list-item-hover:hover {
      color: #D4AF37 !important;
      transform: translateX(5px);
    }
    .list-item-hover:hover .link-icon {
      opacity: 1 !important;
      transform: translateX(3px);
    }
    .social-icon-hover:hover {
      background-color: #D4AF37 !important;
      color: #000000 !important;
      transform: translateY(-3px);
    }
    .newsletter-btn:hover {
      transform: translateX(3px);
    }
    .bottom-link-hover:hover {
      color: #D4AF37 !important;
    }
    .back-to-top:hover {
      background-color: #FFFFFF !important;
      color: #D4AF37 !important;
      transform: translateY(-3px);
    }
    button.social-icon-hover:focus-visible {
      outline: 2px solid #D4AF37;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Footer;