import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Check for successful payment return and clear cart
  useEffect(() => {
    // Check URL parameters for payment success
    const searchParams = new URLSearchParams(location.search);
    const paymentStatus = searchParams.get('payment_status');
    const orderSuccess = searchParams.get('order_success');
    const billId = searchParams.get('bill_id');
    
    // If returning from successful payment
    if ((paymentStatus === 'success' || orderSuccess === 'true') && billId && !paymentSuccess) {
      setPaymentSuccess(true);
      
      // Clear the cart after successful payment
      dispatch(clearCart());
      
      // Show success message (optional)
      const successMsg = document.createElement('div');
      successMsg.textContent = 'Payment successful! Cart cleared.';
      successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #D4AF37;
        color: #000;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: bold;
        animation: slideIn 0.5s ease-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(successMsg);
      
      // Remove success message after 3 seconds
      setTimeout(() => {
        if (successMsg && successMsg.remove) {
          successMsg.remove();
        }
      }, 3000);
      
      // Clean up URL by removing payment parameters without refreshing
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
    
    // Also check localStorage for pending payment confirmation
    const pendingPayment = localStorage.getItem('pending_payment_confirmation');
    if (pendingPayment && !paymentSuccess) {
      const paymentData = JSON.parse(pendingPayment);
      if (paymentData.status === 'completed') {
        setPaymentSuccess(true);
        dispatch(clearCart());
        localStorage.removeItem('pending_payment_confirmation');
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.textContent = 'Payment confirmed! Your cart has been cleared.';
        successMsg.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #D4AF37;
          color: #000;
          padding: 12px 24px;
          border-radius: 8px;
          z-index: 10000;
          font-weight: bold;
          animation: slideIn 0.5s ease-out;
        `;
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
      }
    }
  }, [location.search, dispatch, paymentSuccess]);

  const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return !!(user && token);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const shipping = subtotal > 0 ? 20 : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (isAuthenticated()) {
      navigate('/checkout');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setLoginError('');
      setShowLoginModal(false);
      navigate('/checkout');
    } else {
      setLoginError('Please enter both email and password');
    }
  };

  const handleGuestCheckout = () => {
    setShowLoginModal(false);
    navigate('/checkout?guest=true');
  };

  // Navigate to Product Detail
  const goToDetail = (id) => {
    navigate(`/product/${id}`);
  };

  if (items.length === 0) {
    return (
      <div style={styles.emptyContainer} className="fade-in">
        <h2 style={styles.emptyTitle}>Your Cart is Empty</h2>
        <p style={styles.emptyText}>Discover your next signature scent in our collection.</p>
        <button onClick={() => navigate('/products')} style={styles.continueBtn} className="continue-btn">
          EXPLORE SHOP
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page} className="fade-in">
      {/* Login Modal */}
      {showLoginModal && (
        <div style={styles.modalOverlay} onClick={() => setShowLoginModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()} className="slide-up">
            <button style={styles.modalClose} onClick={() => setShowLoginModal(false)}>✕</button>
            <h2 style={styles.modalTitle}>Login to Checkout</h2>
            <p style={styles.modalText}>Please login to your account to proceed with checkout</p>
            {loginError && <div style={styles.errorMessage}>{loginError}</div>}
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email Address"
                style={styles.modalInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                style={styles.modalInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" style={styles.modalBtn} className="modal-btn">LOGIN & CHECKOUT</button>
            </form>
            <div style={styles.modalDivider}><span>or</span></div>
            <button onClick={handleGuestCheckout} style={styles.guestBtn} className="guest-btn">
              CONTINUE AS GUEST
            </button>
          </div>
        </div>
      )}

      <div style={styles.container}>
        <h1 style={styles.title}>Shopping Bag</h1>
        
        <div style={styles.layout}>
          <div style={styles.itemsSection}>
            {items.map((item) => {
              const itemId = item._id || item.id;
              return (
                <div key={itemId} style={styles.cartItem} className="cart-item-card">
                  <img 
                    src={item.imageUrl || item.image} 
                    alt={item.name} 
                    style={{...styles.itemImg, cursor: 'pointer'}} 
                    onClick={() => goToDetail(itemId)}
                  />
                  <div style={styles.itemDetails}>
                    <div style={styles.itemHeader}>
                      <h3 
                        style={{...styles.itemName, cursor: 'pointer'}} 
                        onClick={() => goToDetail(itemId)}
                      >
                        {item.name}
                      </h3>
                      <button 
                        onClick={() => dispatch(removeFromCart(itemId))} 
                        style={styles.removeBtn}
                        className="remove-btn"
                      >
                        ✕
                      </button>
                    </div>
                    <p style={styles.itemBrand}>{item.brand || 'SCENTIA'}</p>
                    
                    <div style={styles.controls}>
                      <div style={styles.quantityBox}>
                        <button 
                          onClick={() => dispatch(updateQuantity({id: itemId, amount: -1}))} 
                          style={styles.qBtn}
                          className="q-btn"
                          disabled={item.quantity <= 1}
                        >-</button>
                        <span style={styles.qVal}>{item.quantity || 1}</span>
                        <button 
                          onClick={() => dispatch(updateQuantity({id: itemId, amount: 1}))} 
                          style={styles.qBtn}
                          className="q-btn"
                        >+</button>
                      </div>
                      <span style={styles.itemPrice}>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside style={styles.summaryBox}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
              <span>Total</span>
              <span style={{color: '#D4AF37'}}>${total.toFixed(2)}</span>
            </div>
            
            <div style={styles.promoSection}>
              <input type="text" placeholder="Promo Code" style={styles.promoInput} />
              <button style={styles.promoBtn} className="promo-btn">APPLY</button>
            </div>
            
            <button onClick={handleCheckout} style={styles.checkoutBtn} className="checkout-btn">
              PROCEED TO CHECKOUT
            </button>
            <p style={styles.secureText}>🔒 Secure Checkout via Scentia Pay</p>
          </aside>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#050505', minHeight: '100vh', color: '#FFF', padding: '120px 5% 5rem 5%' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', letterSpacing: '3px', marginBottom: '3rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '50px' },
  itemsSection: { display: 'flex', flexDirection: 'column', gap: '20px' },
  cartItem: { display: 'flex', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #222', transition: 'transform 0.3s ease' },
  itemImg: { width: '120px', height: '150px', objectFit: 'cover', borderRadius: '4px', transition: 'opacity 0.3s' },
  itemDetails: { flex: 1, display: 'flex', flexDirection: 'column' },
  itemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { fontSize: '1.2rem', margin: '0', fontWeight: '500', transition: 'color 0.3s' },
  itemBrand: { color: '#D4AF37', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '5px' },
  removeBtn: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem' },
  controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  quantityBox: { display: 'flex', alignItems: 'center', border: '1px solid #333', borderRadius: '4px' },
  qBtn: { background: 'none', border: 'none', color: '#FFF', padding: '5px 12px', cursor: 'pointer' },
  qVal: { padding: '0 10px', fontSize: '0.9rem', minWidth: '30px', textAlign: 'center' },
  itemPrice: { fontSize: '1.1rem', fontWeight: '600', color: '#D4AF37' },
  summaryBox: { backgroundColor: '#0A0A0A', padding: '2rem', borderRadius: '8px', height: 'fit-content', border: '1px solid #111' },
  summaryTitle: { fontSize: '1.2rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: '1px solid #222', paddingBottom: '10px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', margin: '15px 0', color: '#888' },
  totalRow: { borderTop: '1px solid #222', paddingTop: '15px', color: '#FFF', fontWeight: '700', fontSize: '1.2rem' },
  promoSection: { display: 'flex', gap: '10px', margin: '20px 0' },
  promoInput: { flex: 1, padding: '10px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '4px' },
  promoBtn: { padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', fontWeight: '600' },
  checkoutBtn: { width: '100%', padding: '15px', backgroundColor: '#D4AF37', border: 'none', fontWeight: '700', letterSpacing: '2px', cursor: 'pointer', marginTop: '20px' },
  secureText: { textAlign: 'center', fontSize: '0.7rem', color: '#555', marginTop: '15px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { backgroundColor: '#1A1A1A', padding: '2rem', borderRadius: '12px', maxWidth: '450px', width: '90%', position: 'relative', border: '1px solid rgba(212,175,55,0.3)' },
  modalClose: { position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' },
  modalTitle: { fontSize: '1.8rem', marginBottom: '0.5rem', color: '#D4AF37', textAlign: 'center' },
  modalText: { textAlign: 'center', color: '#aaa', marginBottom: '1.5rem' },
  errorMessage: { backgroundColor: 'rgba(255,0,0,0.1)', color: '#FF4444', padding: '10px', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' },
  modalInput: { width: '100%', padding: '12px', marginBottom: '1rem', backgroundColor: '#050505', border: '1px solid #333', color: '#fff', borderRadius: '4px', outline: 'none' },
  modalBtn: { width: '100%', padding: '12px', backgroundColor: '#D4AF37', color: '#000', border: 'none', fontWeight: '600', cursor: 'pointer', borderRadius: '4px', marginBottom: '1rem' },
  modalDivider: { textAlign: 'center', color: '#555', margin: '1rem 0' },
  guestBtn: { width: '100%', padding: '12px', backgroundColor: 'transparent', border: '2px solid #D4AF37', color: '#D4AF37', fontWeight: '600', cursor: 'pointer', borderRadius: '4px' },
  emptyContainer: { height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050505', color: '#FFF' },
  emptyTitle: { fontFamily: "'Playfair Display', serif", fontSize: '3rem', marginBottom: '1rem' },
  emptyText: { color: '#888', letterSpacing: '1px', marginBottom: '2rem' },
  continueBtn: { padding: '12px 30px', backgroundColor: 'transparent', border: '2px solid #D4AF37', color: '#D4AF37', fontWeight: '700', cursor: 'pointer' }
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .fade-in { animation: fadeIn 0.8s ease-out; }
  .slide-up { animation: slideUp 0.5s ease-out; }
  .cart-item-card:hover { transform: translateX(10px); }
  .cart-item-card:hover img { opacity: 0.8; }
  .cart-item-card h3:hover { color: #D4AF37; }
  .remove-btn:hover { color: #ff4444 !important; }
  .q-btn:hover:not(:disabled) { color: #D4AF37 !important; }
  .checkout-btn:hover { background-color: #C09E2B !important; letter-spacing: 4px !important; }
  .continue-btn:hover, .guest-btn:hover, .promo-btn:hover { background-color: #D4AF37 !important; color: #000 !important; }
`;
document.head.appendChild(styleSheet);

export default Cart;