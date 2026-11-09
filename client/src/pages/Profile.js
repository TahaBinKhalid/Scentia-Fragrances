import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: ''
  });
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Get auth token
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  // Fetch user data from backend
  const fetchUserData = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUser(response.data.user);
        setEditForm({
          name: response.data.user.name || '',
          email: response.data.user.email || '',
          phone: response.data.user.phone || '',
          birthDate: response.data.user.birthDate || ''
        });
        if (response.data.user.profileImage) {
          setImagePreview(response.data.user.profileImage);
        }
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  }, [API_URL, getAuthToken, navigate]);

  // Fetch orders from MongoDB (NOT localStorage)
  const fetchOrders = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await axios.get(`${API_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    }
  }, [API_URL, getAuthToken]);

  // Fetch wishlist from backend
  const fetchWishlist = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setWishlist(response.data.wishlist);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      // Fallback to localStorage if backend not ready
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlist(savedWishlist);
    }
  }, [API_URL, getAuthToken]);

  // Fetch addresses from backend
  const fetchAddresses = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await axios.get(`${API_URL}/api/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setAddresses(response.data.addresses);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      // Fallback to localStorage
      const savedAddresses = JSON.parse(localStorage.getItem('addresses')) || [];
      setAddresses(savedAddresses);
    }
  }, [API_URL, getAuthToken]);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await fetchUserData();
      await fetchOrders();
      await fetchWishlist();
      await fetchAddresses();
      setLoading(false);
    };

    loadAllData();
  }, [fetchUserData, fetchOrders, fetchWishlist, fetchAddresses]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to backend
      const formData = new FormData();
      formData.append('profileImage', file);

      try {
        const token = getAuthToken();
        const response = await axios.put(`${API_URL}/api/auth/update-profile-image`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success) {
          showNotification('Profile image updated successfully!');
          await fetchUserData(); // Refresh user data
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        showNotification('Failed to upload image', 'error');
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.put(`${API_URL}/api/auth/update-profile`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUser(response.data.user);
        setIsEditing(false);
        showNotification('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      showNotification('Failed to update profile', 'error');
    }
  };

  const handleAddAddress = async () => {
    if (newAddress.street && newAddress.city && newAddress.zipCode) {
      try {
        const token = getAuthToken();
        const response = await axios.post(`${API_URL}/api/addresses`, newAddress, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          await fetchAddresses(); // Refresh addresses
          setNewAddress({ type: 'home', street: '', city: '', state: '', zipCode: '', country: '' });
          setShowAddressForm(false);
          showNotification('Address added successfully!');
        }
      } catch (err) {
        console.error('Error adding address:', err);
        showNotification('Failed to add address', 'error');
      }
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const token = getAuthToken();
      const response = await axios.delete(`${API_URL}/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        await fetchAddresses();
        showNotification('Address removed', 'info');
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      showNotification('Failed to delete address', 'error');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(`${API_URL}/api/addresses/${id}/default`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        await fetchAddresses();
        showNotification('Default address updated');
      }
    } catch (err) {
      console.error('Error setting default address:', err);
      showNotification('Failed to update default address', 'error');
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = getAuthToken();
      const response = await axios.delete(`${API_URL}/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        await fetchWishlist();
        showNotification('Removed from wishlist');
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      // Fallback to localStorage
      const updatedWishlist = wishlist.filter(item => item._id !== productId && item.id !== productId);
      setWishlist(updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      showNotification('Removed from wishlist');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    navigate('/login');
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `PKR ${(amount || 0).toFixed(2)}`;
  };

  const stats = {
    totalSpent: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    totalOrders: orders.length,
    loyaltyPoints: Math.floor(orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) / 10),
    memberSince: user?.createdAt ? new Date(user.createdAt).getFullYear().toString() : '2024'
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={styles.page}>
      {/* Notification Toast */}
      {notification.show && (
        <div style={{ ...styles.toast, backgroundColor: notification.type === 'error' ? '#FF4444' : '#D4AF37' }}>
          {notification.message}
        </div>
      )}

      <div style={styles.container}>
        {/* Profile Header */}
        <header style={styles.profileHeader}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" style={styles.avatarImage} />
              ) : (
                user.name?.charAt(0) || user.email?.charAt(0) || 'U'
              )}
            </div>
            {isEditing && (
              <div style={styles.uploadSection}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={styles.fileInput}
                  id="profileImage"
                />
                <label htmlFor="profileImage" style={styles.uploadLabel}>
                  Upload Photo
                </label>
              </div>
            )}
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} style={styles.editAvatarBtn}>
                Edit Profile
              </button>
            )}
          </div>
          <div style={styles.headerText}>
            {!isEditing ? (
              <>
                <h1 style={styles.name}>{user.name || 'Scentia Member'}</h1>
                <p style={styles.email}>{user.email}</p>
                {user.phone && <p style={styles.phone}>{user.phone}</p>}
                {user.birthDate && <p style={styles.phone}>🎂 {user.birthDate}</p>}
                <span style={styles.badge}>LOYALTY MEMBER</span>
              </>
            ) : (
              <div style={styles.editForm}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={styles.editInput}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  style={styles.editInput}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  style={styles.editInput}
                />
                <input
                  type="date"
                  placeholder="Birth Date"
                  value={editForm.birthDate}
                  onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                  style={styles.editInput}
                />
                <div style={styles.editActions}>
                  <button onClick={handleUpdateProfile} style={styles.saveBtn}>Save Changes</button>
                  <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button>
                </div>
              </div>
            )}
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>LOGOUT</button>
        </header>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{stats.totalOrders}</span>
            <span style={styles.statLabel}>Total Orders</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{formatCurrency(stats.totalSpent)}</span>
            <span style={styles.statLabel}>Total Spent</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{stats.loyaltyPoints}</span>
            <span style={styles.statLabel}>Loyalty Points</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{stats.memberSince}</span>
            <span style={styles.statLabel}>Member Since</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button style={{ ...styles.tab, ...(activeTab === 'overview' && styles.activeTab) }} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
          <button style={{ ...styles.tab, ...(activeTab === 'orders' && styles.activeTab) }} onClick={() => setActiveTab('orders')}>
            Orders ({orders.length})
          </button>
          <button style={{ ...styles.tab, ...(activeTab === 'wishlist' && styles.activeTab) }} onClick={() => setActiveTab('wishlist')}>
            Wishlist ({wishlist.length})
          </button>
          <button style={{ ...styles.tab, ...(activeTab === 'addresses' && styles.activeTab) }} onClick={() => setActiveTab('addresses')}>
            Addresses ({addresses.length})
          </button>
        </div>

        {/* Tab Content */}
        <div style={styles.tabContent}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div style={styles.overviewGrid}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>RECENT ACTIVITY</h2>
                {orders.slice(0, 3).map((order) => (
                  <div key={order._id || order.orderId} style={styles.activityItem}>
                    <div>
                      <strong>Order #{order.orderId}</strong>
                      <p>{order.products?.length || 0} items • {formatCurrency(order.totalAmount)}</p>
                    </div>
                    <span style={styles.activityDate}>{formatDate(order.createdAt)}</span>
                  </div>
                ))}
                {orders.length === 0 && <p style={styles.emptyText}>No recent orders</p>}
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>PREFERENCES</h2>
                <div style={styles.prefItem}>
                  <strong>Newsletter:</strong> Subscribed
                </div>
                <div style={styles.prefItem}>
                  <strong>Communication:</strong> Email & SMS
                </div>
                <div style={styles.prefItem}>
                  <strong>Language:</strong> English
                </div>
                <div style={styles.prefItem}>
                  <strong>Currency:</strong> PKR (Rs.)
                </div>
              </section>
            </div>
          )}

          {/* Orders Tab - Fetched from MongoDB */}
          {activeTab === 'orders' && (
            <section style={styles.sectionFull}>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id || order.orderId} style={styles.orderCard}>
                    <div style={styles.orderHeader}>
                      <div>
                        <span style={styles.orderId}>Order #{order.orderId}</span>
                        <span style={styles.orderDate}>{formatDate(order.createdAt)}</span>
                      </div>

<span style={{
    ...styles.orderStatus,
    color: order.paymentStatus === 'Paid' ? '#4CAF50' : 
           order.paymentStatus === 'Pending' ? '#FFA500' : 
           order.paymentStatus === 'Failed' ? '#FF4444' : '#888'
}}>
    {order.paymentStatus === 'Pending' ? 'Awaiting Verification' : 
     order.paymentStatus === 'Paid' ? 'Payment Verified ✓' : 
     order.paymentStatus === 'Failed' ? 'Payment Failed ✗' : order.paymentStatus}
</span>
                    </div>
                    <div style={styles.orderItems}>
                      {(order.products || []).map((item, idx) => (
                        <div key={idx} style={styles.orderItem}>
                          {item.image && (
                            <img src={item.image} alt={item.name} style={styles.orderItemImg} />
                          )}
                          <div style={styles.orderItemDetails}>
                            <p style={styles.orderItemName}>{item.name}</p>
                            <p style={styles.orderItemQty}>Qty: {item.quantity || 1}</p>
                          </div>
                          <span style={styles.orderItemPrice}>
                            {formatCurrency((item.price || 0) * (item.quantity || 1))}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div style={styles.orderFooter}>
                      <div>
                        <span>Shipping to: <strong>{order.customerName || 'N/A'}</strong></span>
                        {order.shippingAddress && <p style={styles.shippingAddress}>{order.shippingAddress}</p>}
                      </div>
                      <div style={styles.orderTotal}>
                        <span>Total: <strong style={styles.goldText}>{formatCurrency(order.totalAmount)}</strong></span>
                        <button onClick={() => navigate('/products')} style={styles.reorderBtn}>
                          Shop Again
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>
                  <p>No orders yet</p>
                  <button onClick={() => navigate('/products')} style={styles.shopBtn}>
                    Start Shopping
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <section style={styles.sectionFull}>
              {wishlist.length > 0 ? (
                <div style={styles.wishlistGrid}>
                  {wishlist.map((item) => (
                    <div key={item._id || item.id} style={styles.wishlistCard}>
                      {item.image && <img src={item.image} alt={item.name} style={styles.wishlistImg} />}
                      <button onClick={() => handleRemoveFromWishlist(item._id || item.id)} style={styles.wishlistRemove}>
                        ✕
                      </button>
                      <div style={styles.wishlistInfo}>
                        <h3>{item.name}</h3>
                        <p style={styles.wishlistPrice}>{formatCurrency(item.price)}</p>
                        <button onClick={() => navigate(`/product/${item._id || item.id}`)} style={styles.wishlistViewBtn}>
                          View Product
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <p>Your wishlist is empty</p>
                  <button onClick={() => navigate('/products')} style={styles.shopBtn}>
                    Explore Products
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <section style={styles.sectionFull}>
              <div style={styles.addressHeader}>
                <h2 style={styles.sectionTitle}>Saved Addresses</h2>
                <button onClick={() => setShowAddressForm(!showAddressForm)} style={styles.addAddressBtn}>
                  + Add New Address
                </button>
              </div>

              {showAddressForm && (
                <div style={styles.addressForm}>
                  <select
                    value={newAddress.type}
                    onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                    style={styles.addressInput}
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    style={styles.addressInput}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    style={styles.addressInput}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    style={styles.addressInput}
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    style={styles.addressInput}
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    style={styles.addressInput}
                  />
                  <div style={styles.addressFormActions}>
                    <button onClick={handleAddAddress} style={styles.saveAddressBtn}>Save Address</button>
                    <button onClick={() => setShowAddressForm(false)} style={styles.cancelAddressBtn}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={styles.addressesGrid}>
                {addresses.map((address) => (
                  <div key={address._id || address.id} style={styles.addressCard}>
                    <div style={styles.addressType}>
                      <span>{address.type?.toUpperCase() || 'HOME'}</span>
                      {address.isDefault && <span style={styles.defaultBadge}>Default</span>}
                    </div>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>{address.country}</p>
                    <div style={styles.addressActions}>
                      {!address.isDefault && (
                        <button onClick={() => handleSetDefaultAddress(address._id || address.id)} style={styles.setDefaultBtn}>
                          Set as Default
                        </button>
                      )}
                      <button onClick={() => handleDeleteAddress(address._id || address.id)} style={styles.deleteAddressBtn}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {addresses.length === 0 && !showAddressForm && (
                <p style={styles.emptyText}>No saved addresses. Add one for faster checkout.</p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#050505', color: '#fff', minHeight: '100vh', padding: '140px 5% 5rem' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  
  loadingContainer: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
  loadingSpinner: { width: '50px', height: '50px', border: '3px solid #1a1a1a', borderTop: '3px solid #D4AF37', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  loadingText: { marginTop: '20px', color: '#888', letterSpacing: '2px' },
  
  toast: { position: 'fixed', top: '100px', right: '20px', padding: '12px 24px', borderRadius: '8px', color: '#000', fontWeight: '600', zIndex: 2000, animation: 'slideIn 0.3s ease' },
  
  profileHeader: { display: 'flex', alignItems: 'flex-start', gap: '30px', marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '40px', flexWrap: 'wrap' },
  avatarSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  avatar: { width: '100px', height: '100px', backgroundColor: '#D4AF37', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', color: '#000', fontWeight: 'bold', overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%', objectFit: 'cover' },
  uploadSection: { marginTop: '5px' },
  fileInput: { display: 'none' },
  uploadLabel: { backgroundColor: '#333', color: '#fff', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' },
  editAvatarBtn: { background: 'none', border: '1px solid #D4AF37', color: '#D4AF37', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
  headerText: { flex: 1 },
  name: { fontSize: '2rem', margin: '0', letterSpacing: '2px', fontFamily: 'serif' },
  email: { color: '#888', margin: '5px 0' },
  phone: { color: '#666', fontSize: '0.9rem' },
  badge: { fontSize: '0.7rem', border: '1px solid #D4AF37', color: '#D4AF37', padding: '3px 10px', letterSpacing: '1px', display: 'inline-block', marginTop: '10px' },
  logoutBtn: { background: 'none', border: '1px solid #444', color: '#fff', padding: '10px 20px', cursor: 'pointer', transition: '0.3s' },
  
  editForm: { display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' },
  editInput: { padding: '10px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#fff', borderRadius: '4px' },
  editActions: { display: 'flex', gap: '10px' },
  saveBtn: { padding: '8px 20px', backgroundColor: '#D4AF37', color: '#000', border: 'none', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { padding: '8px 20px', backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer' },
  
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' },
  statCard: { backgroundColor: '#0A0A0A', padding: '20px', textAlign: 'center', borderRadius: '8px', border: '1px solid #222' },
  statValue: { display: 'block', fontSize: '1.8rem', fontWeight: 'bold', color: '#D4AF37' },
  statLabel: { fontSize: '0.8rem', color: '#888', marginTop: '5px' },
  
  tabs: { display: 'flex', gap: '10px', borderBottom: '1px solid #222', marginBottom: '30px', flexWrap: 'wrap' },
  tab: { background: 'none', border: 'none', color: '#888', padding: '10px 20px', cursor: 'pointer', fontSize: '1rem', transition: '0.3s' },
  activeTab: { color: '#D4AF37', borderBottom: '2px solid #D4AF37' },
  
  tabContent: { minHeight: '400px' },
  overviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  section: { backgroundColor: '#0A0A0A', padding: '20px', borderRadius: '8px' },
  sectionFull: { backgroundColor: '#0A0A0A', padding: '20px', borderRadius: '8px' },
  sectionTitle: { fontSize: '0.9rem', letterSpacing: '4px', color: '#D4AF37', marginBottom: '20px' },
  
  activityItem: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #222' },
  activityDate: { color: '#666', fontSize: '0.8rem' },
  prefItem: { marginBottom: '15px', fontSize: '0.9rem', color: '#aaa' },
  
  orderCard: { backgroundColor: '#111', padding: '20px', marginBottom: '20px', borderRadius: '8px' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #222' },
  orderId: { fontWeight: 'bold', color: '#D4AF37' },
  orderDate: { marginLeft: '10px', color: '#666', fontSize: '0.8rem' },
  orderStatus: { fontSize: '0.8rem', fontWeight: 'bold' },
  orderItems: { marginBottom: '15px' },
  orderItem: { display: 'flex', gap: '15px', padding: '10px 0', borderBottom: '1px solid #222', alignItems: 'center' },
  orderItemImg: { width: '50px', height: '60px', objectFit: 'cover', borderRadius: '4px' },
  orderItemDetails: { flex: 1 },
  orderItemName: { fontWeight: '500', margin: '0 0 5px 0' },
  orderItemQty: { fontSize: '0.8rem', color: '#666', margin: '0' },
  orderItemPrice: { color: '#D4AF37', fontWeight: 'bold' },
  orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: '10px', flexWrap: 'wrap', gap: '15px' },
  shippingAddress: { fontSize: '0.8rem', color: '#666', marginTop: '5px' },
  orderTotal: { textAlign: 'right' },
  reorderBtn: { padding: '8px 20px', backgroundColor: '#D4AF37', color: '#000', border: 'none', cursor: 'pointer', fontWeight: '600', borderRadius: '4px', marginTop: '10px' },
  
  wishlistGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  wishlistCard: { position: 'relative', backgroundColor: '#111', borderRadius: '8px', overflow: 'hidden' },
  wishlistImg: { width: '100%', height: '250px', objectFit: 'cover' },
  wishlistRemove: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' },
  wishlistInfo: { padding: '15px', textAlign: 'center' },
  wishlistPrice: { color: '#D4AF37', fontSize: '1.1rem', fontWeight: 'bold', margin: '10px 0' },
  wishlistViewBtn: { marginTop: '10px', padding: '8px 15px', backgroundColor: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', borderRadius: '4px' },
  
  addressHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
  addAddressBtn: { padding: '10px 20px', backgroundColor: '#D4AF37', color: '#000', border: 'none', cursor: 'pointer', fontWeight: '600', borderRadius: '4px' },
  addressForm: { backgroundColor: '#1A1A1A', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
  addressInput: { width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#050505', border: '1px solid #333', color: '#fff', borderRadius: '4px' },
  addressFormActions: { display: 'flex', gap: '10px' },
  saveAddressBtn: { padding: '10px 20px', backgroundColor: '#D4AF37', color: '#000', border: 'none', cursor: 'pointer', fontWeight: '600' },
  cancelAddressBtn: { padding: '10px 20px', backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer' },
  addressesGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' },
  addressCard: { backgroundColor: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #222' },
  addressType: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  defaultBadge: { backgroundColor: '#D4AF37', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' },
  addressActions: { display: 'flex', gap: '10px', marginTop: '10px' },
  setDefaultBtn: { background: 'none', border: '1px solid #D4AF37', color: '#D4AF37', padding: '5px 10px', cursor: 'pointer', fontSize: '0.7rem', borderRadius: '4px' },
  deleteAddressBtn: { background: 'none', border: '1px solid #FF4444', color: '#FF4444', padding: '5px 10px', cursor: 'pointer', fontSize: '0.7rem', borderRadius: '4px' },
  
  emptyState: { textAlign: 'center', padding: '50px', color: '#888' },
  emptyText: { color: '#444', fontStyle: 'italic' },
  shopBtn: { marginTop: '15px', padding: '10px 30px', backgroundColor: '#D4AF37', color: '#000', border: 'none', cursor: 'pointer', fontWeight: '600' },
  goldText: { color: '#D4AF37' }
};

// Add animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  button:hover {
    opacity: 0.8;
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
  @media (max-width: 768px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .overview-grid { grid-template-columns: 1fr !important; }
    .wishlist-grid { grid-template-columns: 1fr !important; }
    .addresses-grid { grid-template-columns: 1fr !important; }
    .profile-header { flex-direction: column; align-items: center; text-align: center; }
  }
`;
document.head.appendChild(styleSheet);

export default Profile;