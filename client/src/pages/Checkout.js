import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/cartSlice';
import axios from 'axios';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items = [] } = useSelector((state) => state.cart || {});
    
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        zip: '',
        email: '',
        phone: ''
    });
    
    const [paymentMethod, setPaymentMethod] = useState('payfast');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [saveInfo, setSaveInfo] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    
    // PayFast Payment States
    const [payFastProcessing, setPayFastProcessing] = useState(false);
    
    // Bank Transfer Payment States
    const [showBankModal, setShowBankModal] = useState(false);
    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        accountHolderName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        transactionRef: '',
        transferDate: '',
        bankBranch: ''
    });
    
    // JazzCash Payment States
    const [showJazzCashModal, setShowJazzCashModal] = useState(false);
    const [jazzCashDetails, setJazzCashDetails] = useState({
        jazzCashNumber: '',
        accountHolderName: '',
        transactionId: '',
        amountSent: '',
        mobileNumber: ''
    });
    
    // EasyPaisa Payment States
    const [showEasyPaisaModal, setShowEasyPaisaModal] = useState(false);
    const [easyPaisaDetails, setEasyPaisaDetails] = useState({
        easyPaisaNumber: '',
        accountHolderName: '',
        transactionId: '',
        amountSent: '',
        mobileNumber: ''
    });

    useEffect(() => {
        const verifyAccess = () => {
            const user = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!user || !token) {
                navigate('/login', { 
                    state: { from: '/checkout', message: 'Please login to proceed.' } 
                });
                return;
            }

            if (items.length === 0) {
                navigate('/cart');
                return;
            }

            const saved = localStorage.getItem('savedCheckoutInfo');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setFormData(prev => ({ ...prev, ...parsed }));
                } catch (e) {
                    console.error("Failed to parse saved info");
                }
            }
            setIsCheckingAuth(false);
        };

        verifyAccess();
    }, [items.length, navigate]);

    const calculateTotal = () => {
        if (!items || items.length === 0) return 0;
        const total = items.reduce((acc, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            return acc + (price * quantity);
        }, 0);
        return parseFloat(total.toFixed(2));
    };

    const cartTotal = calculateTotal();
    const generatedOrderId = `SCENTIA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            setError('Please enter your full name');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Please enter your email');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Please enter your phone number');
            return false;
        }
        if (!formData.address.trim()) {
            setError('Please enter your address');
            return false;
        }
        if (!formData.city.trim()) {
            setError('Please enter your city');
            return false;
        }
        if (!formData.zip.trim()) {
            setError('Please enter your postal code');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        
        return true;
    };

    // Validate Bank Transfer Details
    const validateBankDetails = () => {
        if (!bankDetails.bankName.trim()) {
            setError('Please enter your bank name');
            return false;
        }
        if (!bankDetails.accountHolderName.trim()) {
            setError('Please enter account holder name');
            return false;
        }
        if (!bankDetails.accountNumber.trim()) {
            setError('Please enter account number');
            return false;
        }
        if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
            setError('Account numbers do not match');
            return false;
        }
        if (!bankDetails.transactionRef.trim()) {
            setError('Please enter transaction reference');
            return false;
        }
        if (!bankDetails.transferDate) {
            setError('Please select transfer date');
            return false;
        }
        
        return true;
    };

    // Validate JazzCash Details
    const validateJazzCashDetails = () => {
        const phoneRegex = /^03\d{9}$/;
        if (!phoneRegex.test(jazzCashDetails.jazzCashNumber)) {
            setError('Please enter a valid JazzCash number (03XXXXXXXXX)');
            return false;
        }
        if (!jazzCashDetails.accountHolderName.trim()) {
            setError('Please enter account holder name');
            return false;
        }
        if (!jazzCashDetails.transactionId.trim()) {
            setError('Please enter transaction ID');
            return false;
        }
        if (!jazzCashDetails.amountSent || parseFloat(jazzCashDetails.amountSent) !== cartTotal) {
            setError(`Please send exactly PKR ${cartTotal.toFixed(2)} and enter the amount sent`);
            return false;
        }
        
        return true;
    };

    // Validate EasyPaisa Details
    const validateEasyPaisaDetails = () => {
        const phoneRegex = /^03\d{9}$/;
        if (!phoneRegex.test(easyPaisaDetails.easyPaisaNumber)) {
            setError('Please enter a valid EasyPaisa number (03XXXXXXXXX)');
            return false;
        }
        if (!easyPaisaDetails.accountHolderName.trim()) {
            setError('Please enter account holder name');
            return false;
        }
        if (!easyPaisaDetails.transactionId.trim()) {
            setError('Please enter transaction ID');
            return false;
        }
        if (!easyPaisaDetails.amountSent || parseFloat(easyPaisaDetails.amountSent) !== cartTotal) {
            setError(`Please send exactly PKR ${cartTotal.toFixed(2)} and enter the amount sent`);
            return false;
        }
        
        return true;
    };

    const sendOrderConfirmationEmail = async (orderData) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/payment/send-confirmation-email`,
                {
                    email: formData.email,
                    orderData: {
                        orderId: orderData.orderId,
                        total: orderData.amount,
                        shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`,
                        items: items,
                        customerName: formData.fullName,
                        phone: formData.phone,
                        paymentMethod: orderData.paymentMethod || 'Manual',
                        billId: orderData.billId,
                        paymentDetails: orderData.paymentDetails || {},
                        status: orderData.status
                    }
                },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            // Don't block the flow if email fails
        }
    };

    const sendAdminNotification = async (orderData, paymentDetails) => {
        try {
            const token = localStorage.getItem('token');
            
            await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/payment/send-admin-notification`,
                {
                    orderData: {
                        orderId: orderData.orderId,
                        amount: orderData.amount,
                        paymentMethod: orderData.paymentMethod,
                        items: items,
                        status: orderData.status
                    },
                    customerDetails: {
                        fullName: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        address: `${formData.address}, ${formData.city}, ${formData.zip}`
                    },
                    paymentDetails: paymentDetails
                },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
        } catch (error) {
            console.error("Error sending admin notification:", error);
            // Don't block the flow if notification fails
        }
    };
    
    // REMOVED: saveOrderToHistory - No longer using localStorage for orders
    // Orders are now only stored in MongoDB for data consistency
    
    const createOrderInDB = async (orderData) => {
        try {
            const token = localStorage.getItem('token');
            
            const requestBody = {
                products: items.map(item => ({
                    _id: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: orderData.amount,
                shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`,
                paymentMethod: orderData.paymentMethod,
                orderId: orderData.orderId,
                customerName: formData.fullName,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                paymentDetails: orderData.paymentDetails || {},
                status: orderData.status
            };
            
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/orders`,
                requestBody,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            return response.data.success;
        } catch (error) {
            console.error("Order creation failed:", error);
            const errorMsg = error.response?.data?.message || error.response?.data?.msg || error.message;
            setError(`Order creation failed: ${errorMsg}`);
            return false;
        }
    };

    // Handle PayFast Payment (AUTOMATIC - Real Money)
    const handlePayFastPayment = async () => {
        if (!validateForm()) return;
        
        setPayFastProcessing(true);
        setError('');
        
        try {
            // Send ONLY product IDs and quantities to backend
            const orderData = {
                items: items.map(item => ({
                    productId: item._id,
                    quantity: item.quantity
                })),
                shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`,
                customerName: formData.fullName,
                customerEmail: formData.email,
                customerPhone: formData.phone
            };
            
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/payment/create-payfast-order`,
                orderData,
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            if (response.data.success) {
                // Store order ID for verification
                localStorage.setItem('pendingPayFastOrder', response.data.orderId);
                
                // Save shipping info for faster checkout
                if (saveInfo) {
                    localStorage.setItem('savedCheckoutInfo', JSON.stringify({
                        fullName: formData.fullName,
                        email: formData.email,
                        phone: formData.phone
                    }));
                }
                
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = 'https://sandbox.payfast.co.za/eng/process';
                form.target = '_self'; 
                
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
                
                // Show success message
                setShowSuccessPopup(true);
            } else {
                setError(response.data.message || "Failed to create payment");
                setShowErrorPopup(true);
                setPayFastProcessing(false);
            }
        } catch (err) {
            console.error("PayFast payment error:", err);
            setError(err.response?.data?.message || "Payment gateway error. Please try again.");
            setShowErrorPopup(true);
            setPayFastProcessing(false);
        }
    };

    // Handle Bank Transfer (MANUAL Verification)
    const handleBankTransfer = async () => {
        if (!validateBankDetails()) return;
        
        setIsProcessing(true);
        setShowBankModal(false);
        
        const paymentDetails = {
            bankName: bankDetails.bankName,
            accountHolderName: bankDetails.accountHolderName,
            accountNumber: bankDetails.accountNumber,
            transactionRef: bankDetails.transactionRef,
            transferDate: bankDetails.transferDate,
            bankBranch: bankDetails.bankBranch
        };
        
        const orderData = {
            orderId: generatedOrderId,
            amount: cartTotal,
            paymentMethod: 'Bank Transfer',
            status: 'pending_verification',
            billId: `BANK-${Date.now()}`,
            paymentDetails: paymentDetails
        };
        
        const orderCreated = await createOrderInDB(orderData);
        
        if (orderCreated) {
            // Save shipping info for faster checkout
            if (saveInfo) {
                localStorage.setItem('savedCheckoutInfo', JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone
                }));
            }
            
            await sendOrderConfirmationEmail(orderData);
            await sendAdminNotification(orderData, paymentDetails);
            dispatch(clearCart());
            setShowSuccessPopup(true);
            setTimeout(() => navigate('/profile'), 3000);
        } else {
            setIsProcessing(false);
        }
    };

    // Handle JazzCash Payment (MANUAL Verification)
    const handleJazzCashPayment = async () => {
        if (!validateJazzCashDetails()) return;
        
        setIsProcessing(true);
        setShowJazzCashModal(false);
        
        const paymentDetails = {
            jazzCashNumber: jazzCashDetails.jazzCashNumber,
            accountHolderName: jazzCashDetails.accountHolderName,
            transactionId: jazzCashDetails.transactionId,
            amountSent: jazzCashDetails.amountSent,
            mobileNumber: jazzCashDetails.mobileNumber
        };
        
        const orderData = {
            orderId: generatedOrderId,
            amount: cartTotal,
            paymentMethod: 'JazzCash',
            status: 'pending_verification',
            billId: `JAZZ-${Date.now()}`,
            paymentDetails: paymentDetails
        };
        
        const orderCreated = await createOrderInDB(orderData);
        
        if (orderCreated) {
            // Save shipping info for faster checkout
            if (saveInfo) {
                localStorage.setItem('savedCheckoutInfo', JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone
                }));
            }
            
            await sendOrderConfirmationEmail(orderData);
            await sendAdminNotification(orderData, paymentDetails);
            dispatch(clearCart());
            setShowSuccessPopup(true);
            setTimeout(() => navigate('/profile'), 3000);
        } else {
            setIsProcessing(false);
        }
    };

    // Handle EasyPaisa Payment (MANUAL Verification)
    const handleEasyPaisaPayment = async () => {
        if (!validateEasyPaisaDetails()) return;
        
        setIsProcessing(true);
        setShowEasyPaisaModal(false);
        
        const paymentDetails = {
            easyPaisaNumber: easyPaisaDetails.easyPaisaNumber,
            accountHolderName: easyPaisaDetails.accountHolderName,
            transactionId: easyPaisaDetails.transactionId,
            amountSent: easyPaisaDetails.amountSent,
            mobileNumber: easyPaisaDetails.mobileNumber
        };
        
        const orderData = {
            orderId: generatedOrderId,
            amount: cartTotal,
            paymentMethod: 'EasyPaisa',
            status: 'pending_verification',
            billId: `EASY-${Date.now()}`,
            paymentDetails: paymentDetails
        };
        
        const orderCreated = await createOrderInDB(orderData);
        
        if (orderCreated) {
            // Save shipping info for faster checkout
            if (saveInfo) {
                localStorage.setItem('savedCheckoutInfo', JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone
                }));
            }
            
            await sendOrderConfirmationEmail(orderData);
            await sendAdminNotification(orderData, paymentDetails);
            dispatch(clearCart());
            setShowSuccessPopup(true);
            setTimeout(() => navigate('/profile'), 3000);
        } else {
            setIsProcessing(false);
        }
    };

    const handlePaymentSelection = async () => {
        if (!validateForm()) return;
        if (cartTotal <= 0) {
            setError('Cart total must be greater than 0');
            return;
        }

        if (paymentMethod === 'payfast') {
            await handlePayFastPayment();
        } else if (paymentMethod === 'bank') {
            setShowBankModal(true);
        } else if (paymentMethod === 'jazzcash') {
            setShowJazzCashModal(true);
        } else if (paymentMethod === 'easypaisa') {
            setShowEasyPaisaModal(true);
        } else {
            setError('Please select a payment method');
        }
    };

    if (isCheckingAuth) {
        return (
            <div style={styles.page}>
                <div style={styles.loadingContainer}>
                    <div style={styles.loadingSpinner}></div>
                    <p style={styles.loadingText}>Verifying credentials...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div style={styles.emptyContainer}>
                <h2 style={styles.emptyTitle}>Your Cart is Empty</h2>
                <button onClick={() => navigate('/products')} style={styles.continueBtn}>
                    CONTINUE SHOPPING
                </button>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <button onClick={() => navigate('/cart')} style={styles.backBtn}>
                    ← BACK TO CART
                </button>

                <h1 style={styles.header}>CHECKOUT</h1>
                
                {error && (
                    <div style={styles.errorMessage}>
                        <strong>Error:</strong> {error}
                        <button onClick={() => setError('')} style={styles.closeError}>✕</button>
                    </div>
                )}
                
                <div style={styles.layout}>
                    <div style={styles.formSection}>
                        <h2 style={styles.subHeader}>SHIPPING DETAILS</h2>
                        <input 
                            name="fullName"
                            placeholder="Full Name" 
                            style={styles.input} 
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                        <input 
                            name="email"
                            placeholder="Email Address" 
                            type="email"
                            style={styles.input} 
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        <input 
                            name="phone"
                            placeholder="Phone Number" 
                            style={styles.input} 
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                        <input 
                            name="address"
                            placeholder="Shipping Address" 
                            style={styles.input} 
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                        <div style={styles.row}>
                            <input 
                                name="city" 
                                placeholder="City" 
                                style={styles.input} 
                                value={formData.city}
                                onChange={handleInputChange}
                                required 
                            />
                            <input 
                                name="zip" 
                                placeholder="Postal Code" 
                                style={styles.input} 
                                value={formData.zip}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>

                        <div style={styles.checkboxContainer}>
                            <label style={styles.checkboxLabel}>
                                <input 
                                    type="checkbox" 
                                    checked={saveInfo}
                                    onChange={(e) => setSaveInfo(e.target.checked)}
                                    style={styles.checkbox}
                                />
                                Save my information for faster checkout
                            </label>
                        </div>

                        <div style={styles.paymentSection}>
                            <h2 style={styles.subHeader}>PAYMENT METHOD</h2>
                            <div style={styles.paymentOptions}>
                                <div 
                                    style={{...styles.paymentOption, ...(paymentMethod === 'payfast' ? styles.paymentOptionActive : {})}} 
                                    onClick={() => setPaymentMethod('payfast')}
                                >
                                    <input type="radio" checked={paymentMethod === 'payfast'} readOnly style={styles.radio} />
                                    <span style={styles.paymentLabel}>PayFast (Credit/Debit Card) - Instant Payment</span>
                                </div>
                                
                                <div 
                                    style={{...styles.paymentOption, ...(paymentMethod === 'jazzcash' ? styles.paymentOptionActive : {})}} 
                                    onClick={() => setPaymentMethod('jazzcash')}
                                >
                                    <input type="radio" checked={paymentMethod === 'jazzcash'} readOnly style={styles.radio} />
                                    <span style={styles.paymentLabel}>JazzCash - Manual Verification</span>
                                </div>
                                
                                <div 
                                    style={{...styles.paymentOption, ...(paymentMethod === 'easypaisa' ? styles.paymentOptionActive : {})}} 
                                    onClick={() => setPaymentMethod('easypaisa')}
                                >
                                    <input type="radio" checked={paymentMethod === 'easypaisa'} readOnly style={styles.radio} />
                                    <span style={styles.paymentLabel}>EasyPaisa - Manual Verification</span>
                                </div>
                                
                                <div 
                                    style={{...styles.paymentOption, ...(paymentMethod === 'bank' ? styles.paymentOptionActive : {})}} 
                                    onClick={() => setPaymentMethod('bank')}
                                >
                                    <input type="radio" checked={paymentMethod === 'bank'} readOnly style={styles.radio} />
                                    <span style={styles.paymentLabel}>Bank Transfer - Manual Verification</span>
                                </div>
                            </div>
                            <div style={styles.paymentInfo}>
                                {paymentMethod === 'payfast' && (
                                    <>
                                        <p>💳 <strong>Instant Payment:</strong> Pay securely with credit/debit card via PayFast</p>
                                        <p>✅ <strong>Automatic Order Confirmation</strong> upon successful payment</p>
                                        <p>🔒 256-bit SSL encryption | Visa, Mastercard, American Express accepted</p>
                                    </>
                                )}
                                {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa' || paymentMethod === 'bank') && (
                                    <>
                                        <p>📱 <strong>Manual Verification Required:</strong> Send payment to our account</p>
                                        <p>⏱️ Order will be confirmed within 24-48 hours after payment verification</p>
                                        <p>📧 Confirmation email will be sent once payment is verified</p>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <button 
                            onClick={handlePaymentSelection} 
                            disabled={isProcessing || payFastProcessing}
                            style={{
                                ...styles.payBtn,
                                ...((isProcessing || payFastProcessing) ? styles.payBtnDisabled : {})
                            }}
                        >
                            {isProcessing ? 'PROCESSING...' : 
                             payFastProcessing ? 'REDIRECTING TO PAYFAST...' : 
                             `PAY PKR ${cartTotal.toFixed(2)}`}
                        </button>
                    </div>

                    <aside style={styles.summarySection}>
                        <h2 style={styles.subHeader}>ORDER SUMMARY</h2>
                        <div style={styles.scrollItems}>
                            {items.map((item) => (
                                <div key={item._id} style={styles.cartItem}>
                                    <div style={styles.itemMeta}>
                                        <span style={styles.itemName}>{item.name}</span>
                                        <span style={styles.itemQty}>Qty: {item.quantity}</span>
                                    </div>
                                    <span style={styles.itemPrice}>
                                        PKR {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div style={styles.totalLine}>
                            <span>TOTAL</span>
                            <span style={styles.goldText}>PKR {cartTotal.toFixed(2)}</span>
                        </div>
                        <div style={styles.shippingNote}>
                            <p>✓ Free shipping on all orders</p>
                            <p>✓ 30-day return policy</p>
                            <p>✓ Secure payment</p>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Success Popup */}
            {showSuccessPopup && !payFastProcessing && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popupContent}>
                        <div style={styles.successIcon}>✓</div>
                        <h3 style={styles.popupTitle}>ORDER PLACED SUCCESSFULLY!</h3>
                        <p style={styles.popupMessage}>Redirecting to your profile...</p>
                    </div>
                </div>
            )}

            {/* Error Popup */}
            {showErrorPopup && error && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popupContent}>
                        <div style={styles.errorIcon}>!</div>
                        <h3 style={styles.popupTitle}>ERROR</h3>
                        <p style={styles.popupMessage}>{error}</p>
                        <button style={styles.popupButton} onClick={() => setShowErrorPopup(false)}>TRY AGAIN</button>
                    </div>
                </div>
            )}

            {/* PayFast Processing Overlay */}
            {payFastProcessing && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popupContent}>
                        <div style={styles.loadingSpinner}></div>
                        <h3 style={styles.popupTitle}>REDIRECTING TO PAYFAST</h3>
                        <p style={styles.popupMessage}>Please wait while we redirect you to the secure payment gateway...</p>
                    </div>
                </div>
            )}

            {/* Bank Transfer Modal */}
            {showBankModal && (
                <div style={styles.modalOverlay} onClick={() => setShowBankModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button style={styles.modalClose} onClick={() => setShowBankModal(false)}>✕</button>
                        <h3 style={styles.modalTitle}>🏦 Bank Transfer Details</h3>
                        <p style={styles.modalSubtitle}>Our Bank Account Information</p>
                        
                        <div style={styles.bankInfoBox}>
                            <p><strong>Bank:</strong> Meezan Bank Limited</p>
                            <p><strong>Account Title:</strong> SCENTIA PARFUMS PVT LTD</p>
                            <p><strong>Account Number:</strong> 1234-567890-12</p>
                            <p><strong>IBAN:</strong> PK70MEZN0012345678901234</p>
                            <p><strong>Branch Code:</strong> 0123</p>
                            <p style={styles.bankNote}>⚠️ Please use your Order ID as reference: <strong>{generatedOrderId}</strong></p>
                        </div>
                        
                        <hr style={styles.divider} />
                        
                        <h3 style={styles.modalSubtitle}>Your Transfer Information</h3>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Your Bank Name *</label>
                            <input 
                                type="text" 
                                placeholder="e.g., HBL, UBL, Standard Chartered"
                                value={bankDetails.bankName}
                                onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Account Holder Name *</label>
                            <input 
                                type="text" 
                                placeholder="As per bank account"
                                value={bankDetails.accountHolderName}
                                onChange={(e) => setBankDetails({...bankDetails, accountHolderName: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Account Number *</label>
                            <input 
                                type="text" 
                                placeholder="Your account number"
                                value={bankDetails.accountNumber}
                                onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Confirm Account Number *</label>
                            <input 
                                type="text" 
                                placeholder="Re-enter account number"
                                value={bankDetails.confirmAccountNumber}
                                onChange={(e) => setBankDetails({...bankDetails, confirmAccountNumber: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Transaction Reference / ID *</label>
                            <input 
                                type="text" 
                                placeholder="From your bank receipt"
                                value={bankDetails.transactionRef}
                                onChange={(e) => setBankDetails({...bankDetails, transactionRef: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Transfer Date *</label>
                            <input 
                                type="date" 
                                value={bankDetails.transferDate}
                                onChange={(e) => setBankDetails({...bankDetails, transferDate: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Bank Branch (Optional)</label>
                            <input 
                                type="text" 
                                placeholder="Branch name or city"
                                value={bankDetails.bankBranch}
                                onChange={(e) => setBankDetails({...bankDetails, bankBranch: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.bankNoteBox}>
                            <p>📋 After submitting, your order will be marked as "Pending Verification".</p>
                            <p>⏱️ We will verify your payment within 24-48 hours.</p>
                        </div>
                        
                        <button 
                            onClick={handleBankTransfer}
                            disabled={isProcessing}
                            style={styles.modalPayBtn}
                        >
                            {isProcessing ? 'PROCESSING...' : 'SUBMIT BANK TRANSFER DETAILS'}
                        </button>
                    </div>
                </div>
            )}

            {/* JazzCash Modal */}
            {showJazzCashModal && (
                <div style={styles.modalOverlay} onClick={() => setShowJazzCashModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button style={styles.modalClose} onClick={() => setShowJazzCashModal(false)}>✕</button>
                        <h3 style={styles.modalTitle}>📱 JazzCash Payment</h3>
                        
                        <div style={styles.bankInfoBox}>
                            <p><strong>📞 JazzCash Account Number:</strong> 03XX-XXXXXXX</p>
                            <p><strong>👤 Account Holder:</strong> SCENTIA PARFUMS</p>
                            <p><strong>💰 Amount to Send:</strong> <span style={styles.goldText}>PKR {cartTotal.toFixed(2)}</span></p>
                            <p style={styles.bankNote}>⚠️ Use your Order ID as reference: <strong>{generatedOrderId}</strong></p>
                        </div>
                        
                        <hr style={styles.divider} />
                        
                        <h3 style={styles.modalSubtitle}>Your Payment Information</h3>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Your JazzCash Number *</label>
                            <input 
                                type="tel" 
                                placeholder="03XXXXXXXXX"
                                value={jazzCashDetails.jazzCashNumber}
                                onChange={(e) => setJazzCashDetails({...jazzCashDetails, jazzCashNumber: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>CNIC/Account Holder Name *</label>
                            <input 
                                type="text" 
                                placeholder="As per JazzCash account"
                                value={jazzCashDetails.accountHolderName}
                                onChange={(e) => setJazzCashDetails({...jazzCashDetails, accountHolderName: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Transaction ID / Reference *</label>
                            <input 
                                type="text" 
                                placeholder="From JazzCash app after payment"
                                value={jazzCashDetails.transactionId}
                                onChange={(e) => setJazzCashDetails({...jazzCashDetails, transactionId: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Amount Sent *</label>
                            <input 
                                type="number" 
                                placeholder={`PKR ${cartTotal.toFixed(2)}`}
                                value={jazzCashDetails.amountSent}
                                onChange={(e) => setJazzCashDetails({...jazzCashDetails, amountSent: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Mobile Number (for confirmation)</label>
                            <input 
                                type="tel" 
                                placeholder="03XXXXXXXXX"
                                value={jazzCashDetails.mobileNumber}
                                onChange={(e) => setJazzCashDetails({...jazzCashDetails, mobileNumber: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.jazzCashNote}>
                            <p>✅ Send exact amount PKR {cartTotal.toFixed(2)} to our JazzCash number</p>
                            <p>📱 Keep your transaction ID for reference</p>
                            <p>⏱️ Order will be processed after payment verification (24-48 hours)</p>
                        </div>
                        
                        <button 
                            onClick={handleJazzCashPayment}
                            disabled={isProcessing}
                            style={styles.modalPayBtn}
                        >
                            {isProcessing ? 'PROCESSING...' : 'CONFIRM JAZZCASH PAYMENT'}
                        </button>
                    </div>
                </div>
            )}

            {/* EasyPaisa Modal */}
            {showEasyPaisaModal && (
                <div style={styles.modalOverlay} onClick={() => setShowEasyPaisaModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button style={styles.modalClose} onClick={() => setShowEasyPaisaModal(false)}>✕</button>
                        <h3 style={styles.modalTitle}>📱 EasyPaisa Payment</h3>
                        
                        <div style={styles.bankInfoBox}>
                            <p><strong>📞 EasyPaisa Account Number:</strong> 03XX-XXXXXXX</p>
                            <p><strong>👤 Account Holder:</strong> SCENTIA PARFUMS</p>
                            <p><strong>💰 Amount to Send:</strong> <span style={styles.goldText}>PKR {cartTotal.toFixed(2)}</span></p>
                            <p style={styles.bankNote}>⚠️ Use your Order ID as reference: <strong>{generatedOrderId}</strong></p>
                        </div>
                        
                        <hr style={styles.divider} />
                        
                        <h3 style={styles.modalSubtitle}>Your Payment Information</h3>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Your EasyPaisa Number *</label>
                            <input 
                                type="tel" 
                                placeholder="03XXXXXXXXX"
                                value={easyPaisaDetails.easyPaisaNumber}
                                onChange={(e) => setEasyPaisaDetails({...easyPaisaDetails, easyPaisaNumber: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>CNIC/Account Holder Name *</label>
                            <input 
                                type="text" 
                                placeholder="As per EasyPaisa account"
                                value={easyPaisaDetails.accountHolderName}
                                onChange={(e) => setEasyPaisaDetails({...easyPaisaDetails, accountHolderName: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Transaction ID / Reference *</label>
                            <input 
                                type="text" 
                                placeholder="From EasyPaisa app after payment"
                                value={easyPaisaDetails.transactionId}
                                onChange={(e) => setEasyPaisaDetails({...easyPaisaDetails, transactionId: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Amount Sent *</label>
                            <input 
                                type="number" 
                                placeholder={`PKR ${cartTotal.toFixed(2)}`}
                                value={easyPaisaDetails.amountSent}
                                onChange={(e) => setEasyPaisaDetails({...easyPaisaDetails, amountSent: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.cardInputGroup}>
                            <label style={styles.cardLabel}>Mobile Number (for confirmation)</label>
                            <input 
                                type="tel" 
                                placeholder="03XXXXXXXXX"
                                value={easyPaisaDetails.mobileNumber}
                                onChange={(e) => setEasyPaisaDetails({...easyPaisaDetails, mobileNumber: e.target.value})}
                                style={styles.cardInput}
                            />
                        </div>
                        
                        <div style={styles.easyPaisaNote}>
                            <p>✅ Send exact amount PKR {cartTotal.toFixed(2)} to our EasyPaisa number</p>
                            <p>📱 Screenshot of payment is not required, but keep transaction ID</p>
                            <p>⏱️ Order will be processed after payment verification (24-48 hours)</p>
                            <p>🔔 You will receive SMS confirmation once verified</p>
                        </div>
                        
                        <button 
                            onClick={handleEasyPaisaPayment}
                            disabled={isProcessing}
                            style={styles.modalPayBtn}
                        >
                            {isProcessing ? 'PROCESSING...' : 'CONFIRM EASYPAISA PAYMENT'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '120px 5%' },
    container: { maxWidth: '1200px', margin: '0 auto' },
    backBtn: { background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '30px' },
    header: { fontSize: '2.5rem', letterSpacing: '6px', textAlign: 'center', marginBottom: '50px', fontFamily: "'Playfair Display', serif" },
    goldText: { color: '#D4AF37' },
    layout: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '50px', alignItems: 'start' },
    subHeader: { fontSize: '0.85rem', letterSpacing: '4px', marginBottom: '30px', borderBottom: '1px solid #222', paddingBottom: '10px', textTransform: 'uppercase' },
    formSection: { display: 'flex', flexDirection: 'column' },
    input: { width: '100%', padding: '15px', backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fff', marginBottom: '20px', fontSize: '0.9rem', borderRadius: '0' },
    row: { display: 'flex', gap: '20px' },
    payBtn: { width: '100%', padding: '18px', backgroundColor: '#D4AF37', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', letterSpacing: '3px', fontSize: '0.9rem', marginTop: '20px' },
    payBtnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
    summarySection: { backgroundColor: '#0a0a0a', padding: '30px', border: '1px solid #111' },
    scrollItems: { maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' },
    cartItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #151515' },
    itemMeta: { display: 'flex', flexDirection: 'column', gap: '5px' },
    itemName: { fontSize: '0.9rem' },
    itemQty: { fontSize: '0.7rem', color: '#666' },
    itemPrice: { fontWeight: 'bold', color: '#D4AF37', fontSize: '0.9rem' },
    totalLine: { marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', borderTop: '1px solid #D4AF37', paddingTop: '20px' },
    errorMessage: { backgroundColor: 'rgba(255,68,68,0.1)', border: '1px solid #ff4444', color: '#ff4444', padding: '15px', marginBottom: '20px', borderRadius: '4px', position: 'relative' },
    closeError: { position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '16px' },
    paymentSection: { marginTop: '20px' },
    paymentOptions: { marginBottom: '15px' },
    paymentOption: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', padding: '12px', border: '1px solid #1a1a1a', cursor: 'pointer', borderRadius: '4px' },
    paymentOptionActive: { borderColor: '#D4AF37', backgroundColor: '#0a0a0a' },
    radio: { width: '18px', height: '18px', cursor: 'pointer' },
    paymentLabel: { fontSize: '0.9rem', cursor: 'pointer' },
    paymentInfo: { backgroundColor: '#0a0a0a', padding: '15px', marginTop: '10px', border: '1px solid #1a1a1a', borderRadius: '4px', fontSize: '0.8rem' },
    shippingNote: { marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #222', fontSize: '0.7rem', color: '#666', textAlign: 'center' },
    loadingContainer: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
    loadingSpinner: { width: '50px', height: '50px', border: '3px solid #1a1a1a', borderTop: '3px solid #D4AF37', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    loadingText: { marginTop: '20px', color: '#888', letterSpacing: '2px' },
    emptyContainer: { height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' },
    emptyTitle: { fontSize: '2rem', marginBottom: '20px', fontFamily: "'Playfair Display', serif" },
    continueBtn: { padding: '12px 30px', backgroundColor: 'transparent', border: '2px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', fontWeight: 'bold' },
    checkboxContainer: { marginBottom: '30px' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#888', cursor: 'pointer' },
    checkbox: { width: '18px', height: '18px', cursor: 'pointer' },
    popupOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
    popupContent: { backgroundColor: '#0a0a0a', padding: '40px', textAlign: 'center', border: '1px solid #D4AF37', maxWidth: '400px', width: '90%', borderRadius: '8px' },
    successIcon: { fontSize: '60px', color: '#D4AF37', marginBottom: '20px' },
    errorIcon: { fontSize: '60px', color: '#ff4444', marginBottom: '20px' },
    popupTitle: { fontSize: '1.5rem', color: '#D4AF37', marginBottom: '20px' },
    popupMessage: { fontSize: '0.9rem', color: '#fff', marginBottom: '20px' },
    popupButton: { marginTop: '10px', padding: '12px 30px', backgroundColor: '#D4AF37', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
    
    // Modal Styles
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 },
    modalContent: { backgroundColor: '#0a0a0a', padding: '40px', border: '1px solid #D4AF37', maxWidth: '550px', width: '90%', maxHeight: '85vh', overflowY: 'auto', borderRadius: '8px', position: 'relative' },
    modalClose: { position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' },
    modalTitle: { fontSize: '1.5rem', color: '#D4AF37', marginBottom: '10px', textAlign: 'center' },
    modalSubtitle: { fontSize: '0.9rem', color: '#888', marginBottom: '20px', textAlign: 'center' },
    
    // Card Styles (reused for inputs)
    cardInputGroup: { marginBottom: '20px' },
    cardLabel: { display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' },
    cardInput: { width: '100%', padding: '12px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', fontSize: '0.9rem', borderRadius: '4px' },
    cardInputSmall: { width: '100%', padding: '12px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', fontSize: '0.9rem', borderRadius: '4px' },
    cardRow: { display: 'flex', gap: '15px', marginBottom: '20px' },
    cardSecurityNote: { backgroundColor: '#0a0a0a', padding: '15px', border: '1px solid #1a1a1a', borderRadius: '4px', marginBottom: '20px', fontSize: '0.75rem', color: '#666', textAlign: 'center' },
    
    // Bank Transfer Styles
    bankInfoBox: { backgroundColor: '#0a0a0a', padding: '15px', border: '1px solid #D4AF37', borderRadius: '4px', marginBottom: '20px' },
    bankNote: { fontSize: '0.8rem', color: '#D4AF37', marginTop: '10px' },
    bankNoteBox: { backgroundColor: '#0a0a0a', padding: '15px', border: '1px solid #1a1a1a', borderRadius: '4px', marginBottom: '20px', fontSize: '0.75rem', color: '#666' },
    divider: { borderColor: '#1a1a1a', margin: '20px 0' },
    
    // JazzCash/EasyPaisa Styles
    jazzCashNote: { backgroundColor: '#0a0a0a', padding: '15px', border: '1px solid #1a1a1a', borderRadius: '4px', marginBottom: '20px', fontSize: '0.75rem', color: '#666' },
    easyPaisaNote: { backgroundColor: '#0a0a0a', padding: '15px', border: '1px solid #1a1a1a', borderRadius: '4px', marginBottom: '20px', fontSize: '0.75rem', color: '#666' },
    
    modalPayBtn: { width: '100%', padding: '15px', backgroundColor: '#D4AF37', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '2px', marginTop: '10px' }
};

// Add animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default Checkout;