import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import ScrollToTop from './components/ScrollToTop';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductLists';
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import Collections from './pages/Collections';
import ProductDetail from './pages/ProductDetail';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Discover from './pages/Discover';
import Luxury from './pages/Luxury';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import ShippingReturns from './pages/ShippingReturns';
import OrderHistory from './pages/OrderHistory';
import OrderSuccess from './pages/OrderSuccess';
import PayFastRedirect from './components/PayFastRedirect';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';
import ContactUs from './pages/ContactUs';
import PaymentStatus from './components/PaymentStatus';


function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Navbar />
          <ScrollToTop /> 
          <Routes>
            <Route path="/productlists" element={<ProductList />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/" element={<Home />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/Discover" element={<Discover />} />
            <Route path="/luxury" element={<Luxury />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shipping-returns" element={<ShippingReturns />} />
            <Route path="/order-history" element={<OrderHistory />} /> 
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/payfast-redirect" element={<PayFastRedirect />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
  <Route path="/terms" element={<TermsConditions />} />
  <Route path="/refund-policy" element={<RefundPolicy />} />
  <Route path="/contact" element={<ContactUs />} />
  <Route path="/payment-status" element={<PaymentStatus />} />
<Route path="/payment-success" element={<PaymentStatus />} />
<Route path="/payment-cancelled" element={<PaymentStatus />} />
          </Routes>
          <Footer />
          <ToastContainer 
    position="top-center"
    autoClose={3000}
    theme="dark"
    toastStyle={{
        backgroundColor: '#000',
        border: '1px solid #D4AF37',
        color: '#D4AF37'
    }}
/>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;