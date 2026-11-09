import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would integrate with your email service (SendGrid, EmailJS, etc.)
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', orderNumber: '', subject: '', message: '' });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
        
        <h1 style={styles.title}>Contact Us</h1>
        
        <div style={styles.grid}>
          {/* Left Column - Contact Info */}
          <div style={styles.infoSection}>
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>📍 Physical Address</h3>
              <p style={styles.infoText}>
                SCENTIA PARFUMS<br />
                123 Fifth Avenue<br />
                New York, NY 10003<br />
                United States
              </p>
              <p style={styles.infoNote}>Showroom visits by appointment only</p>
            </div>

            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>📞 Phone Number</h3>
              <p style={styles.infoText}>
                <strong>Customer Service:</strong><br />
                +1 (212) 555-0123<br />
                <span style={styles.hours}>Mon-Fri, 9AM - 6PM EST</span>
              </p>
              <p style={styles.infoText}>
                <strong>Wholesale Inquiries:</strong><br />
                +1 (212) 555-0124
              </p>
            </div>

            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>📧 Email Addresses</h3>
              <p style={styles.infoText}>
                <strong>Customer Support:</strong><br />
                <span style={styles.gold}>support@scentia.com</span>
              </p>
              <p style={styles.infoText}>
                <strong>Returns:</strong><br />
                <span style={styles.gold}>returns@scentia.com</span>
              </p>
              <p style={styles.infoText}>
                <strong>Wholesale:</strong><br />
                <span style={styles.gold}>wholesale@scentia.com</span>
              </p>
              <p style={styles.infoText}>
                <strong>Press & Media:</strong><br />
                <span style={styles.gold}>press@scentia.com</span>
              </p>
              <p style={styles.infoText}>
                <strong>General Inquiries:</strong><br />
                <span style={styles.gold}>info@scentia.com</span>
              </p>
            </div>

            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>⏰ Business Hours</h3>
              <p style={styles.infoText}>
                Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                Saturday: 10:00 AM - 4:00 PM EST<br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div style={styles.formSection}>
            <h2 style={styles.formTitle}>Send Us a Message</h2>
            <p style={styles.formSubtitle}>We'll respond within 24-48 hours</p>
            
            {submitted && (
              <div style={styles.successMessage}>
                ✓ Thank you for your message! We'll get back to you soon.
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
              
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
              
              <input
                type="text"
                name="orderNumber"
                placeholder="Order Number (if applicable)"
                value={formData.orderNumber}
                onChange={handleChange}
                style={styles.input}
              />
              
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Select Subject *</option>
                <option value="order">Order Status</option>
                <option value="return">Return Request</option>
                <option value="product">Product Information</option>
                <option value="wholesale">Wholesale Inquiry</option>
                <option value="other">Other</option>
              </select>
              
              <textarea
                name="message"
                placeholder="Your Message *"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                style={styles.textarea}
              />
              
              <button type="submit" style={styles.submitBtn}>
                Send Message
              </button>
            </form>
            
            <p style={styles.formNote}>
              By submitting this form, you agree to our <span onClick={() => navigate('/privacy')} style={styles.link}>Privacy Policy</span>.
              We never share your information with third parties.
            </p>
          </div>
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
    maxWidth: '1200px',
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
    marginBottom: '2rem',
    color: '#000000',
    fontFamily: "'Playfair Display', serif",
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  infoCard: {
    backgroundColor: '#F8F8F8',
    padding: '1.5rem',
    borderRadius: '8px',
  },
  infoTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#D4AF37',
    letterSpacing: '1px',
  },
  infoText: {
    color: '#333333',
    lineHeight: '1.6',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
  },
  infoNote: {
    color: '#999999',
    fontSize: '0.8rem',
    marginTop: '0.5rem',
    fontStyle: 'italic',
  },
  hours: {
    fontSize: '0.8rem',
    color: '#666666',
  },
  gold: {
    color: '#D4AF37',
    fontWeight: '500',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    padding: '2rem',
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
    color: '#000000',
  },
  formSubtitle: {
    color: '#666666',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  successMessage: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '12px',
    border: '1px solid #CCCCCC',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  select: {
    padding: '12px',
    border: '1px solid #CCCCCC',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    backgroundColor: '#FFFFFF',
  },
  textarea: {
    padding: '12px',
    border: '1px solid #CCCCCC',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
  },
  submitBtn: {
    padding: '14px',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: '500',
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'background 0.3s',
    marginTop: '0.5rem',
  },
  formNote: {
    fontSize: '0.7rem',
    color: '#999999',
    marginTop: '1rem',
    textAlign: 'center',
  },
  link: {
    color: '#D4AF37',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default ContactUs;