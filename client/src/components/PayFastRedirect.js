import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PayFastRedirect = ({ url, payload, headers }) => {
    const [error, setError] = useState(null);

    useEffect(() => {
        const initiateHandshake = async () => {
            try {
                // 1LINK requires an actual API call with headers to authorize the session
                const response = await axios.post(url, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers // This includes the client_id and secret from backend
                    }
                });

                // If 1LINK returns a redirection URL or a Bill ID
                if (response.data.redirect_url) {
                    window.location.href = response.data.redirect_url;
                } else if (response.data.bill_id || response.data.consumer_number) {
                    // If it's a 1BILL success, redirect to a success info page
                    window.location.href = `/order-success?bill_id=${response.data.bill_id || response.data.consumer_number}`;
                } else {
                    console.log("1LINK Response:", response.data);
                    // Fallback if the sandbox just returns data
                    alert("Bill Generated Successfully. Please check console for Consumer ID.");
                }

            } catch (err) {
                console.error("Gateway Handshake Failed:", err.response?.data || err.message);
                setError(err.response?.data?.message || "Secure Gateway rejected the handshake (403).");
            }
        };

        if (url && payload) {
            initiateHandshake();
        }
    }, [url, payload, headers]);

    if (error) {
        return (
            <div style={containerStyle}>
                <h2 style={{ color: '#ff4d4d', letterSpacing: '2px' }}>GATEWAY ERROR</h2>
                <p style={{ color: '#ccc' }}>{error}</p>
                <button onClick={() => window.location.reload()} style={buttonStyle}>RETRY CONNECTION</button>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={loaderStyle}></div>
            <h2 style={{ color: '#D4AF37', fontFamily: 'serif', letterSpacing: '2px', marginTop: '20px' }}>
                ESTABLISHING SECURE CONNECTION...
            </h2>
            <p style={{ color: '#555', fontSize: '0.8rem', letterSpacing: '1px' }}>VERIFYING WITH 1LINK PAKISTAN</p>
        </div>
    );
};

// Snyder Aesthetic Styles
const containerStyle = { 
    backgroundColor: '#000', 
    height: '100vh', 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center',
    textAlign: 'center'
};

const loaderStyle = {
    border: "2px solid #111",
    borderTop: "2px solid #D4AF37",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 2s linear infinite",
};

const buttonStyle = {
    backgroundColor: 'transparent',
    color: '#D4AF37',
    border: '1px solid #D4AF37',
    padding: '10px 20px',
    marginTop: '20px',
    cursor: 'pointer',
    fontSize: '0.8rem'
};

export default PayFastRedirect;