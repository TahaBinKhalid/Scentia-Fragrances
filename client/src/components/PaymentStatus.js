import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('order_id');
    const [status, setStatus] = useState('checking');
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const checkPaymentStatus = async () => {
            if (!orderId) {
                navigate('/profile');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/payment/status/${orderId}`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );

                if (response.data.success) {
                    setOrderDetails(response.data);
                    if (response.data.paymentStatus === 'Paid') {
                        setStatus('success');
                        // Clear pending order
                        localStorage.removeItem('pendingPayFastOrder');
                    } else if (response.data.paymentStatus === 'Failed') {
                        setStatus('failed');
                    } else {
                        setStatus('pending');
                    }
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                console.error('Status check error:', error);
                setStatus('failed');
            }
        };

        checkPaymentStatus();
        
        // Poll every 5 seconds for updates
        const interval = setInterval(checkPaymentStatus, 5000);
        return () => clearInterval(interval);
    }, [orderId, navigate]);

    if (status === 'checking') {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <h1>Verifying Payment Status...</h1>
                    <div style={styles.loadingSpinner}></div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {status === 'success' ? (
                    <>
                        <div style={styles.successIcon}>✓</div>
                        <h1 style={styles.successTitle}>Payment Successful!</h1>
                        <p>Your order has been confirmed.</p>
                        <p>Order ID: <strong>{orderId}</strong></p>
                        <p>Amount Paid: <strong>PKR {orderDetails?.totalAmount}</strong></p>
                        <button 
                            onClick={() => navigate('/profile')}
                            style={styles.button}
                        >
                            View My Orders
                        </button>
                        <button 
                            onClick={() => navigate('/products')}
                            style={styles.buttonSecondary}
                        >
                            Continue Shopping
                        </button>
                    </>
                ) : status === 'failed' ? (
                    <>
                        <div style={styles.errorIcon}>✗</div>
                        <h1 style={styles.errorTitle}>Payment Failed</h1>
                        <p>Your payment could not be processed.</p>
                        <p>Please try again or contact support.</p>
                        <button 
                            onClick={() => navigate('/checkout')}
                            style={styles.button}
                        >
                            Try Again
                        </button>
                        <button 
                            onClick={() => navigate('/cart')}
                            style={styles.buttonSecondary}
                        >
                            Return to Cart
                        </button>
                    </>
                ) : (
                    <>
                        <div style={styles.pendingIcon}>⏳</div>
                        <h1>Payment Pending</h1>
                        <p>We are waiting for payment confirmation.</p>
                        <p>This page will update automatically once payment is verified.</p>
                        <button 
                            onClick={() => navigate('/profile')}
                            style={styles.button}
                        >
                            Go to Profile
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: {
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        padding: '120px 5%',
        textAlign: 'center'
    },
    container: {
        maxWidth: '600px',
        margin: '0 auto'
    },
    successIcon: {
        fontSize: '80px',
        color: '#D4AF37',
        marginBottom: '20px'
    },
    errorIcon: {
        fontSize: '80px',
        color: '#ff4444',
        marginBottom: '20px'
    },
    pendingIcon: {
        fontSize: '80px',
        color: '#ffaa00',
        marginBottom: '20px'
    },
    successTitle: {
        color: '#D4AF37',
        marginBottom: '20px'
    },
    errorTitle: {
        color: '#ff4444',
        marginBottom: '20px'
    },
    button: {
        padding: '12px 30px',
        backgroundColor: '#D4AF37',
        color: '#000',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '20px',
        marginRight: '10px'
    },
    buttonSecondary: {
        padding: '12px 30px',
        backgroundColor: 'transparent',
        border: '2px solid #D4AF37',
        color: '#D4AF37',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '20px'
    },
    loadingSpinner: {
        width: '50px',
        height: '50px',
        border: '3px solid #1a1a1a',
        borderTop: '3px solid #D4AF37',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '20px auto'
    }
};

export default PaymentStatus;