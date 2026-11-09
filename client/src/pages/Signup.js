import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import scentiaHero from '../assets/InShot_20260405_235216007.png';
import { refreshCart } from '../redux/cartSlice';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Save current cart before signup
      const currentCart = localStorage.getItem('scentia_cart');
      console.log("Cart before signup:", currentCart);

      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        
        // Restore cart after signup
        setTimeout(() => {
          dispatch(refreshCart());
          console.log("Cart restored after signup:", localStorage.getItem('scentia_cart'));
        }, 100);
        
        navigate('/');
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.splitWrapper}>
        <div style={styles.formSide}>
          <div style={styles.formContainer}>
            <h2 style={styles.heading}>CREATE ACCOUNT</h2>
            <p style={styles.subHeading}>Join the exclusive world of Scentia.</p>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>FULL NAME</label>
                <input 
                  type="text" 
                  required 
                  style={styles.input} 
                  placeholder="Enter your name"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  required 
                  style={styles.input} 
                  placeholder="Enter your email"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>PASSWORD</label>
                <input 
                  type="password" 
                  required 
                  style={styles.input} 
                  placeholder="Create a strong password"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                style={{...styles.primaryBtn, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'}}
                disabled={loading}
              >
                {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
              </button>
            </form>

            <p style={styles.footerText}>
              ALREADY A MEMBER? <Link to="/login" style={styles.goldLink}>SIGN IN</Link>
            </p>
          </div>
        </div>

        <div style={{...styles.imageSide, backgroundImage: `url(${scentiaHero})`}}>
          <div style={styles.overlay}>
            <span style={styles.brandTitle}>SCENTIA</span>
            <p style={styles.imageQuote}>"Crafted for the few who lead."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
  splitWrapper: { display: 'flex', width: '100%', maxWidth: '1200px', height: '80vh', backgroundColor: '#000', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' },
  imageSide: { flex: 1, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  overlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px' },
  brandTitle: { fontSize: '2rem', letterSpacing: '8px', color: '#D4AF37', fontWeight: 'bold' },
  imageQuote: { fontSize: '0.9rem', color: '#ccc', letterSpacing: '2px', fontStyle: 'italic', marginTop: '10px' },
  formSide: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backgroundColor: '#0a0a0a' },
  formContainer: { width: '100%', maxWidth: '380px' },
  heading: { fontSize: '2.5rem', letterSpacing: '2px', marginBottom: '10px' },
  subHeading: { color: '#666', fontSize: '0.9rem', marginBottom: '40px', letterSpacing: '1px' },
  form: { display: 'flex', flexDirection: 'column', gap: '25px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.7rem', color: '#D4AF37', letterSpacing: '2px', fontWeight: 'bold' },
  input: { background: 'none', border: 'none', borderBottom: '1px solid #333', color: '#fff', padding: '12px 0', outline: 'none', transition: '0.3s' },
  primaryBtn: { backgroundColor: '#D4AF37', color: '#000', border: 'none', padding: '15px', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer', marginTop: '15px', transition: '0.3s' },
  footerText: { textAlign: 'center', marginTop: '30px', color: '#666', fontSize: '0.75rem', letterSpacing: '1px' },
  goldLink: { color: '#D4AF37', textDecoration: 'none', marginLeft: '5px' },
  errorMessage: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    color: '#FF4444',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.85rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 68, 68, 0.3)'
  }
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  input:focus { border-bottom-color: #D4AF37 !important; }
  button:hover:not(:disabled) { background-color: #c4a030 !important; transform: translateY(-2px); }
  .goldLink:hover { color: #fff !important; }
`;
document.head.appendChild(styleSheet);

export default Signup;