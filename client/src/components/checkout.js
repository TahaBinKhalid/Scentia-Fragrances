import React, { useState } from 'react';
import axios from 'axios';

const Checkout = ({ cartItems, cartTotal, user }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        customerPhone: '',
        shippingAddress: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Send ONLY product IDs and quantities to backend
            const orderData = {
                items: cartItems.map(item => ({
                    productId: item._id,
                    quantity: item.quantity
                })),
                shippingAddress: formData.shippingAddress,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone
            };

            // Backend calculates the actual price
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/payment/create-order`,
                orderData,
                { headers: { 'x-auth-token': localStorage.getItem('token') } }
            );

            if (response.data.success) {
                // Create a form to submit to PayFast
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = response.data.paymentUrl;
                form.target = '_blank';

                // Add all PayFast parameters
                Object.keys(response.data.pfData).forEach(key => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = response.data.pfData[key];
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
                
                // Store order ID for success page
                localStorage.setItem('pendingOrderId', response.data.orderId);
            }
        } catch (error) {
            console.error('Order creation failed:', error);
            alert('Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Your form fields */}
            <button type="submit" disabled={loading}>
                {loading ? 'Processing...' : `Pay ${cartTotal} PKR with PayFast`}
            </button>
        </form>
    );
};