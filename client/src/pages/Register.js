import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
// Removed react-toastify import

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const { name, email, password, confirmPassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password
            });

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                
                setSuccess("Welcome to Scentia! Redirecting...");
                
                // Show success message and redirect
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.response?.data?.message || "Registration failed. Please try again.";
            setError(errorMsg);
        }
    };

    // Custom alert styles
    const alertStyles = {
        success: {
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid #D4AF37',
            color: '#D4AF37',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            textAlign: 'center'
        },
        error: {
            backgroundColor: 'rgba(255, 68, 68, 0.1)',
            border: '1px solid #ff4444',
            color: '#ff4444',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            textAlign: 'center'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.authCard}>
                <h1 style={styles.title}>JOIN THE ATELIER</h1>
                <p style={styles.subtitle}>START YOUR OLFACTORY JOURNEY</p>
                <div style={styles.divider}></div>

                {error && (
                    <div style={alertStyles.error}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={alertStyles.success}>
                        {success}
                    </div>
                )}

                <form onSubmit={onSubmit} style={styles.form}>
                    <input
                        type="text"
                        placeholder="FULL NAME"
                        name="name"
                        value={name}
                        onChange={onChange}
                        style={styles.input}
                        required
                    />
                    <input
                        type="email"
                        placeholder="EMAIL ADDRESS"
                        name="email"
                        value={email}
                        onChange={onChange}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="PASSWORD"
                        name="password"
                        value={password}
                        onChange={onChange}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="CONFIRM PASSWORD"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        style={styles.input}
                        required
                    />
                    
                    <button type="submit" style={styles.button}>
                        CREATE ACCOUNT
                    </button>
                </form>

                <p style={styles.footerText}>
                    ALREADY A MEMBER? <Link to="/login" style={styles.link}>SIGN IN</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: { backgroundColor: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif' },
    authCard: { width: '100%', maxWidth: '400px', padding: '50px', backgroundColor: '#050505', border: '1px solid #111', textAlign: 'center' },
    title: { color: '#D4AF37', letterSpacing: '6px', fontSize: '1.8rem', fontWeight: '300', margin: '0' },
    subtitle: { color: '#444', fontSize: '0.7rem', letterSpacing: '3px', marginTop: '10px' },
    divider: { height: '1px', backgroundColor: '#222', width: '50px', margin: '30px auto' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    input: { backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #222', padding: '12px', color: '#fff', outline: 'none', letterSpacing: '2px', fontSize: '0.8rem' },
    button: { backgroundColor: '#D4AF37', color: '#000', border: 'none', padding: '15px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '3px', marginTop: '20px', transition: '0.4s' },
    footerText: { color: '#333', fontSize: '0.7rem', marginTop: '30px', letterSpacing: '1px' },
    link: { color: '#D4AF37', textDecoration: 'none', marginLeft: '5px' }
};

// Add hover effect for button
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    button:hover {
        background-color: #c4a030 !important;
        transform: translateY(-2px);
    }
    input:focus {
        border-bottom-color: #D4AF37 !important;
    }
`;
document.head.appendChild(styleSheet);

export default Register;