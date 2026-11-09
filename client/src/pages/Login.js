import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { setCartFromDB } from '../redux/cartSlice';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Login user
        login(data.user, data.token);
        
        // IMPORTANT: Restore cart from database
        if (data.user.cart && data.user.cart.length > 0) {
          dispatch(setCartFromDB(data.user.cart));
          console.log("Cart restored from database:", data.user.cart);
        }
        
        // Redirect
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError("Server connection failed");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Login to <span style={styles.goldText}>Scentia</span></h2>
        <p style={styles.subtitle}>Enter your credentials to continue your journey.</p>
        
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
          disabled={loading}
        />
        
        <button 
          type="submit" 
          style={{...styles.button, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'}}
          disabled={loading}
        >
          {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
        </button>
        
        <div style={styles.footer}>
          <span style={styles.footerText}>New to the house?</span>
          <span style={styles.link} onClick={() => !loading && navigate('/signup')}>
            Create Account
          </span>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    backgroundColor: '#050505',
    fontFamily: "'Inter', sans-serif"
  },
  form: { 
    backgroundColor: '#111', 
    padding: '3rem', 
    borderRadius: '4px', 
    width: '90%', 
    maxWidth: '450px',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
  },
  title: { 
    color: '#fff', 
    marginBottom: '0.5rem', 
    textAlign: 'center',
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem'
  },
  goldText: { color: '#D4AF37' },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    fontSize: '0.9rem',
    marginBottom: '2rem'
  },
  input: { 
    width: '100%', 
    padding: '14px', 
    marginBottom: '1.2rem', 
    backgroundColor: '#050505', 
    border: '1px solid #222', 
    color: '#fff', 
    borderRadius: '2px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease'
  },
  button: { 
    width: '100%', 
    padding: '14px', 
    backgroundColor: '#D4AF37', 
    color: '#000', 
    border: 'none', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    borderRadius: '2px',
    letterSpacing: '2px',
    marginTop: '10px',
    transition: '0.3s'
  },
  footer: {
    marginTop: '2rem',
    textAlign: 'center',
    fontSize: '0.85rem'
  },
  footerText: { color: '#666', marginRight: '8px' },
  link: { 
    color: '#D4AF37', 
    cursor: 'pointer', 
    textDecoration: 'underline',
    fontWeight: '600',
    transition: '0.3s'
  },
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
  input:focus { border-color: #D4AF37 !important; }
  button:hover:not(:disabled) { background-color: #c4a030 !important; transform: translateY(-2px); }
  .link:hover { color: #fff !important; }
`;
document.head.appendChild(styleSheet);

export default Login;