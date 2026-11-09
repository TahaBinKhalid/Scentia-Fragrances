import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminVerification = () => {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    const API_URL = process.env.REACT_APP_API_URL || 'https://scentia-api.onrender.com';
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    const fetchPendingOrders = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/payment/admin/pending-verifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingOrders(response.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Failed to fetch pending orders');
        } finally {
            setLoading(false);
        }
    };

    const verifyPayment = async (orderId) => {
        if (!window.confirm('Verify this payment? The customer will be notified via email.')) return;
        
        try {
            await axios.put(`${API_URL}/api/payment/admin/verify-payment/${orderId}`, 
                { adminNotes },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Payment verified successfully!');
            fetchPendingOrders();
            setSelectedOrder(null);
            setAdminNotes('');
        } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Failed to verify payment');
        }
    };

    const rejectPayment = async (orderId) => {
        const reason = prompt('Enter reason for rejection:');
        if (!reason) return;
        
        if (!window.confirm('Reject this payment? The customer will be notified.')) return;
        
        try {
            await axios.put(`${API_URL}/api/payment/admin/reject-payment/${orderId}`,
                { rejectionReason: reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Payment rejected!');
            fetchPendingOrders();
            setSelectedOrder(null);
        } catch (error) {
            console.error('Error rejecting payment:', error);
            alert('Failed to reject payment');
        }
    };

    if (loading) return <div style={styles.loading}>Loading pending verifications...</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Payment Verification Dashboard</h1>
            
            {pendingOrders.length === 0 ? (
                <div style={styles.emptyState}>
                    <p>✅ No pending verifications</p>
                    <p>All payments have been verified</p>
                </div>
            ) : (
                <div style={styles.ordersGrid}>
                    {pendingOrders.map(order => (
                        <div key={order._id} style={styles.orderCard}>
                            <div style={styles.orderHeader}>
                                <h3>Order #{order.orderId}</h3>
                                <span style={styles.paymentMethod}>{order.paymentMethod}</span>
                            </div>
                            
                            <div style={styles.orderDetails}>
                                <p><strong>Customer:</strong> {order.customerName}</p>
                                <p><strong>Email:</strong> {order.customerEmail}</p>
                                <p><strong>Phone:</strong> {order.customerPhone}</p>
                                <p><strong>Amount:</strong> <span style={styles.amount}>PKR {order.totalAmount}</span></p>
                                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                
                                <div style={styles.paymentDetails}>
                                    <strong>Payment Details Provided:</strong>
                                    {order.paymentMethod === 'Bank Transfer' && (
                                        <>
                                            <p>Bank: {order.paymentDetails?.bankName}</p>
                                            <p>Account Holder: {order.paymentDetails?.accountHolderName}</p>
                                            <p>Account Number: {order.paymentDetails?.accountNumber}</p>
                                            <p>Transaction Ref: {order.paymentDetails?.transactionRef}</p>
                                            <p>Transfer Date: {order.paymentDetails?.transferDate}</p>
                                        </>
                                    )}
                                    {order.paymentMethod === 'JazzCash' && (
                                        <>
                                            <p>JazzCash Number: {order.paymentDetails?.jazzCashNumber}</p>
                                            <p>Account Holder: {order.paymentDetails?.accountHolderName}</p>
                                            <p>Transaction ID: {order.paymentDetails?.transactionId}</p>
                                            <p>Amount Sent: PKR {order.paymentDetails?.amountSent}</p>
                                        </>
                                    )}
                                    {order.paymentMethod === 'EasyPaisa' && (
                                        <>
                                            <p>EasyPaisa Number: {order.paymentDetails?.easyPaisaNumber}</p>
                                            <p>Account Holder: {order.paymentDetails?.accountHolderName}</p>
                                            <p>Transaction ID: {order.paymentDetails?.transactionId}</p>
                                            <p>Amount Sent: PKR {order.paymentDetails?.amountSent}</p>
                                        </>
                                    )}
                                </div>
                                
                                <div style={styles.orderItems}>
                                    <strong>Items:</strong>
                                    {order.products.map((item, idx) => (
                                        <p key={idx}>• {item.name} x{item.quantity} = PKR {(item.price * item.quantity).toFixed(2)}</p>
                                    ))}
                                </div>
                            </div>
                            
                            <div style={styles.actions}>
                                <button 
                                    onClick={() => verifyPayment(order.orderId)}
                                    style={styles.verifyBtn}
                                >
                                    ✓ Verify Payment
                                </button>
                                <button 
                                    onClick={() => rejectPayment(order.orderId)}
                                    style={styles.rejectBtn}
                                >
                                    ✗ Reject Payment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
    header: { color: '#D4AF37', marginBottom: '30px' },
    loading: { textAlign: 'center', padding: '50px', fontSize: '1.2rem' },
    emptyState: { textAlign: 'center', padding: '50px', backgroundColor: '#0a0a0a', borderRadius: '8px' },
    ordersGrid: { display: 'grid', gap: '20px' },
    orderCard: { backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: '8px', padding: '20px' },
    orderHeader: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' },
    paymentMethod: { backgroundColor: '#D4AF37', color: '#000', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold' },
    orderDetails: { marginBottom: '20px' },
    amount: { color: '#D4AF37', fontSize: '1.2rem', fontWeight: 'bold' },
    paymentDetails: { backgroundColor: '#111', padding: '15px', borderRadius: '4px', marginTop: '10px' },
    orderItems: { backgroundColor: '#111', padding: '15px', borderRadius: '4px', marginTop: '10px' },
    actions: { display: 'flex', gap: '10px', marginTop: '15px' },
    verifyBtn: { backgroundColor: '#4CAF50', color: '#fff', padding: '10px 20px', border: 'none', cursor: 'pointer', borderRadius: '4px' },
    rejectBtn: { backgroundColor: '#f44336', color: '#fff', padding: '10px 20px', border: 'none', cursor: 'pointer', borderRadius: '4px' }
};

export default AdminVerification;