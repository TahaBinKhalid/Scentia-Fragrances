import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        // CLEANUP: Immediately empty the list so old data doesn't "flicker"
        setOrders([]);
        setLoading(true);

        const fetchOrders = async () => {
            if (!token) return;

            try {
                const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // The backend now filters orders by the specific userId in the token
                setOrders(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Archive fetch failed", err);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]); // Triggers every time a different user logs in

    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '50px', color: '#fff' }}>
            <h1 style={{ color: '#D4AF37', textAlign: 'center' }}>YOUR ARCHIVE</h1>
            {loading ? (
                <p style={{ textAlign: 'center' }}>DECRYPTING SELECTIONS...</p>
            ) : (
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    {orders.map(order => (
                        <div key={order._id} style={{ border: '1px solid #222', padding: '15px', marginBottom: '10px' }}>
                            <p style={{ color: '#D4AF37' }}>ORDER ID: {order._id.slice(-6)}</p>
                            <p>TOTAL: ${order.totalAmount}</p>
                            <p>STATUS: {order.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;