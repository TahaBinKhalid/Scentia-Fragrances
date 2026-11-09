import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const billId = searchParams.get('bill_id');
    const amount = searchParams.get('amount');
    const orderRef = searchParams.get('order_id');

    useEffect(() => {
        // Store payment confirmation in localStorage to clear cart when returning
        const paymentData = {
            billId: billId,
            amount: amount,
            orderRef: orderRef,
            status: 'completed',
            timestamp: Date.now()
        };
        localStorage.setItem('pending_payment_confirmation', JSON.stringify(paymentData));
    }, [billId, amount, orderRef]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(billId);
        const msg = document.createElement('div');
        msg.textContent = 'Bill ID copied!';
        msg.style.cssText = 'position:fixed;top:20px;right:20px;background:#D4AF37;color:#000;padding:10px 20px;border-radius:5px;z-index:9999;animation:slideIn 0.5s ease-out';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
    };

    const handleReturnToCart = () => {
        // This will trigger cart clearing when returning
        window.location.href = '/cart?payment_status=success&order_success=true';
    };

    const containerStyle = { 
        backgroundColor: '#000', 
        color: '#fff', 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '20px', 
        fontFamily: 'serif' 
    };
    
    const billCard = { 
        backgroundColor: '#050505', 
        border: '1px solid #D4AF37', 
        padding: '40px', 
        textAlign: 'center', 
        width: '100%', 
        maxWidth: '500px',
        borderRadius: '8px',
        position: 'relative'
    };

    return (
        <div style={containerStyle}>
            <div style={billCard}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
                <h1 style={{ color: '#D4AF37', letterSpacing: '4px', marginBottom: '10px' }}>BILL GENERATED</h1>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '30px' }}>
                    Your payment bill has been created successfully
                </p>
                
                <hr style={{ borderColor: '#222', margin: '20px 0' }} />
                
                <p style={{ color: '#555', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    1LINK Consumer ID
                </p>
                <div style={{ 
                    fontSize: '2rem', 
                    color: '#D4AF37', 
                    margin: '15px 0', 
                    letterSpacing: '3px',
                    fontWeight: 'bold',
                    wordBreak: 'break-all'
                }}>
                    {billId || "PENDING"}
                </div>
                
                <button 
                    onClick={copyToClipboard}
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #D4AF37',
                        color: '#D4AF37',
                        padding: '8px 20px',
                        cursor: 'pointer',
                        marginBottom: '20px',
                        fontSize: '0.8rem',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#D4AF37';
                        e.target.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#D4AF37';
                    }}
                >
                    Copy Bill ID
                </button>
                
                <div style={{ borderTop: '1px solid #111', paddingTop: '20px', marginTop: '10px' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                        Amount Due: <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>PKR {amount || '0'}</span>
                    </p>
                    <p style={{ fontSize: '0.7rem', color: '#555' }}>Reference: {orderRef}</p>
                </div>

                <div style={{ 
                    textAlign: 'left', 
                    marginTop: '30px', 
                    backgroundColor: '#080808', 
                    padding: '20px', 
                    borderLeft: '3px solid #D4AF37'
                }}>
                    <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>
                        <strong>How to pay:</strong>
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '8px' }}>
                        1. Open your mobile banking app
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '8px' }}>
                        2. Go to Bill Payment → 1LINK / Invoice Payment
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '8px' }}>
                        3. Enter the Consumer ID shown above
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '8px' }}>
                        4. Confirm amount and complete payment
                    </p>
                </div>

                <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button 
                        onClick={handleReturnToCart}
                        style={{ 
                            color: '#D4AF37', 
                            textDecoration: 'none', 
                            fontSize: '0.8rem',
                            border: '1px solid #D4AF37',
                            padding: '10px 20px',
                            display: 'inline-block',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#D4AF37';
                            e.target.style.color = '#000';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#D4AF37';
                        }}
                    >
                        CONTINUE SHOPPING
                    </button>
                    <Link 
                        to="/profile" 
                        style={{ 
                            color: '#888', 
                            textDecoration: 'none', 
                            fontSize: '0.8rem',
                            border: '1px solid #333',
                            padding: '10px 20px',
                            display: 'inline-block',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.borderColor = '#D4AF37';
                            e.target.style.color = '#D4AF37';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.borderColor = '#333';
                            e.target.style.color = '#888';
                        }}
                    >
                        VIEW ORDERS
                    </Link>
                </div>
                
                <p style={{ fontSize: '0.7rem', color: '#333', marginTop: '20px' }}>
                    Your order will be processed once payment is confirmed
                </p>
            </div>
        </div>
    );
};



export default OrderSuccess;