import React, { useState, useEffect } from 'react';
import { syncCartToDatabase } from '../services/cartSync';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import fallbackImage from '../assets/1775448747107.png';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("The requested fragrance could not be located in our archives.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);


const handleAddToCart = async () => {
  // Get current cart
  const currentCart = JSON.parse(localStorage.getItem('scentia_cart')) || { items: [] };
  
  // Check if product already exists
  const existingItemIndex = currentCart.items.findIndex(item => item._id === product._id);
  
  let updatedItems;
  if (existingItemIndex !== -1) {
    // Update quantity
    updatedItems = [...currentCart.items];
    updatedItems[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    updatedItems = [...currentCart.items, { 
      ...product, 
      quantity: quantity,
      _id: product._id,
      productId: product._id
    }];
  }
  
  // Update Redux
  dispatch(addToCart({ ...product, quantity, id: product._id }));
  
  // Update localStorage
  localStorage.setItem('scentia_cart', JSON.stringify({ items: updatedItems }));
  
  // If user is logged in, sync to database
  const token = localStorage.getItem('token');
  if (token) {
    await syncCartToDatabase(updatedItems);
    console.log("Cart synced to database");
  }
  
  setShowAddedMessage(true);
  setTimeout(() => setShowAddedMessage(false), 3000);
};

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, Math.min(10, quantity + delta)));
  };

  if (loading) return (
    <div style={styles.loaderContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loaderText}>DISCOVERING EXCELLENCE...</p>
    </div>
  );

  if (error || !product) return (
    <div style={styles.errorContainer}>
      <h2 style={styles.errorTitle}>404</h2>
      <p style={styles.errorText}>{error || "Product not found"}</p>
      <button style={styles.backBtn} onClick={() => navigate('/shop')}>RETURN TO COLLECTION</button>
    </div>
  );

  // Create image array from available images
  const productImages = product.images || [product.imageUrl || product.image];

  return (
    <div style={styles.pageWrapper}>
      {/* Success Toast */}
      {showAddedMessage && (
        <div style={styles.toast}>
          <span style={styles.toastIcon}>✓</span>
          <span>Added to cart successfully!</span>
        </div>
      )}

      {/* Navigation Breadcrumb */}
      <nav style={styles.breadcrumb}>
        <span onClick={() => navigate('/')} style={styles.breadcrumbLink}>HOME</span>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span onClick={() => navigate('/shop')} style={styles.breadcrumbLink}>SHOP</span>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span style={styles.breadcrumbCurrent}>{product.category || 'LUXURY'}</span>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span style={styles.breadcrumbProduct}>{product.name}</span>
      </nav>

      <div style={styles.mainGrid}>
        {/* Left: Visual Gallery */}
        <div style={styles.visualSection}>
          <div style={styles.mainImageContainer}>
            <img 
              src={productImages[selectedImage]} 
              alt={product.name} 
              style={styles.mainImage}
              onError={(e) => { e.target.src = fallbackImage; }}
            />
            {product.isNew && <div style={styles.floatingBadge}>NEW ARRIVAL</div>}
            {product.isBestseller && <div style={{...styles.floatingBadge, right: '20px', left: 'auto', backgroundColor: '#FF4444', color: '#FFF'}}>BESTSELLER</div>}
            {product.oldPrice && <div style={styles.saleBadge}>SALE</div>}
          </div>
          
          {/* Thumbnail Gallery */}
          {productImages.length > 1 && (
            <div style={styles.thumbnailContainer}>
              {productImages.map((img, idx) => (
                <div 
                  key={idx} 
                  style={{...styles.thumbnail, borderColor: selectedImage === idx ? '#D4AF37' : '#222'}}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} style={styles.thumbnailImage} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right: Product Information */}
        <div style={styles.infoSection}>
          <header style={styles.header}>
            <span style={styles.brandTag}>{product.brand || 'SCENTIA LUXE'}</span>
            <h1 style={styles.productTitle}>{product.name}</h1>
            <div style={styles.priceContainer}>
              {product.oldPrice && <span style={styles.oldPrice}>${product.oldPrice}</span>}
              <div style={styles.currentPriceWrapper}>
                <span style={styles.currency}>$</span>
                <span style={styles.amount}>{product.price}</span>
              </div>
            </div>
            
            {/* Rating Section */}
            {product.rating && (
              <div style={styles.ratingContainer}>
                <div style={styles.stars}>
                  {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                </div>
                <span style={styles.ratingValue}>{product.rating}</span>
                <span style={styles.reviewCount}>({product.reviews || 0} Reviews)</span>
              </div>
            )}
          </header>

          <div style={styles.divider}></div>

          {/* Tabs Section */}
          <div style={styles.tabs}>
            <button 
              style={{...styles.tab, borderBottom: activeTab === 'description' ? '2px solid #D4AF37' : 'none'}}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              style={{...styles.tab, borderBottom: activeTab === 'notes' ? '2px solid #D4AF37' : 'none'}}
              onClick={() => setActiveTab('notes')}
            >
              Scent Notes
            </button>
            <button 
              style={{...styles.tab, borderBottom: activeTab === 'details' ? '2px solid #D4AF37' : 'none'}}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
          </div>

          {/* Tab Content */}
          <div style={styles.tabContent}>
            {activeTab === 'description' && (
              <div style={styles.descriptionSection}>
                <p style={styles.descriptionText}>{product.description || "Experience the pinnacle of luxury fragrance craftsmanship. This exquisite scent is meticulously crafted using the finest ingredients sourced from around the world."}</p>
                {product.keyFeatures && (
                  <ul style={styles.featuresList}>
                    {product.keyFeatures.map((feature, idx) => (
                      <li key={idx} style={styles.featureItem}>{feature}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div style={styles.notesSection}>
                {product.notes && product.notes.length > 0 ? (
                  <>
                    <div style={styles.noteCategory}>
                      <h4 style={styles.noteTitle}>Top Notes</h4>
                      <div style={styles.notesGrid}>
                        {product.notes.slice(0, 3).map((note, index) => (
                          <div key={index} style={styles.noteTag}>{note}</div>
                        ))}
                      </div>
                    </div>
                    {product.notes.length > 3 && (
                      <div style={styles.noteCategory}>
                        <h4 style={styles.noteTitle}>Heart Notes</h4>
                        <div style={styles.notesGrid}>
                          {product.notes.slice(3, 6).map((note, index) => (
                            <div key={index} style={styles.noteTag}>{note}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.notes.length > 6 && (
                      <div style={styles.noteCategory}>
                        <h4 style={styles.noteTitle}>Base Notes</h4>
                        <div style={styles.notesGrid}>
                          {product.notes.slice(6, 9).map((note, index) => (
                            <div key={index} style={styles.noteTag}>{note}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p style={styles.descriptionText}>A harmonious blend of the finest ingredients, creating an unforgettable olfactory experience.</p>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div style={styles.detailsSection}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Fragrance Family</span>
                  <span style={styles.detailValue}>{product.family || 'Oriental Woody'}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Concentration</span>
                  <span style={styles.detailValue}>{product.concentration || 'Eau de Parfum'}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Size</span>
                  <span style={styles.detailValue}>{product.size || '100ml / 3.4 fl oz'}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Longevity</span>
                  <span style={styles.detailValue}>{product.longevity || '8-12 hours'}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Gender</span>
                  <span style={styles.detailValue}>{product.gender || 'Unisex'}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>SKU</span>
                  <span style={styles.detailValue}>{product._id || 'SC-' + Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div style={styles.quantitySection}>
            <span style={styles.quantityLabel}>Quantity</span>
            <div style={styles.quantitySelector}>
              <button onClick={() => handleQuantityChange(-1)} style={styles.qtyBtn}>−</button>
              <span style={styles.qtyValue}>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} style={styles.qtyBtn}>+</button>
            </div>
          </div>

          {/* CTA Section */}
          <div style={styles.ctaSection}>
            <button 
              style={styles.primaryBtn}
              onClick={handleAddToCart}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              ADD TO CART
            </button>
            
            <button 
              style={styles.secondaryBtn}
              onClick={() => navigate('/shop')}
            >
              CONTINUE SHOPPING
            </button>
          </div>

          {/* Shipping Info */}
          <div style={styles.shippingInfo}>
            <div style={styles.shippingItem}>
              <span style={styles.shippingIcon}>🚚</span>
              <span>Free shipping on orders over $150</span>
            </div>
            <div style={styles.shippingItem}>
              <span style={styles.shippingIcon}>↺</span>
              <span>30-day return policy</span>
            </div>
            <div style={styles.shippingItem}>
              <span style={styles.shippingIcon}>✨</span>
              <span>Complimentary samples with every order</span>
            </div>
          </div>

          {/* Stock Status */}
          <div style={styles.stockStatus}>
            <span style={styles.stockDot}></span>
            <span style={styles.stockText}>In Stock • Ready to Ship</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    backgroundColor: '#050505',
    color: '#ffffff',
    minHeight: '100vh',
    padding: '120px 8% 80px 8%',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  
  toast: {
    position: 'fixed',
    top: '100px',
    right: '30px',
    backgroundColor: '#D4AF37',
    color: '#000',
    padding: '12px 24px',
    borderRadius: '8px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '600',
    animation: 'slideIn 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  toastIcon: { fontSize: '1.2rem', fontWeight: 'bold' },
  
  breadcrumb: {
    marginBottom: '50px',
    fontSize: '0.7rem',
    letterSpacing: '2px',
    color: '#666',
  },
  breadcrumbLink: { 
    cursor: 'pointer', 
    transition: 'color 0.3s',
    '&:hover': { color: '#D4AF37' }
  },
  breadcrumbSeparator: { margin: '0 12px', color: '#333' },
  breadcrumbCurrent: { color: '#D4AF37' },
  breadcrumbProduct: { color: '#888' },
  
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.9fr',
    gap: '60px',
    alignItems: 'start',
  },

  // Visuals
  visualSection: { position: 'sticky', top: '120px' },
  mainImageContainer: {
    position: 'relative',
    backgroundColor: '#0A0A0A',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #1a1a1a',
  },
  mainImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  floatingBadge: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    backgroundColor: '#D4AF37',
    color: '#000',
    padding: '6px 16px',
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '2px',
    borderRadius: '30px',
    zIndex: 2,
  },
  saleBadge: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    backgroundColor: '#FF4444',
    color: '#FFF',
    padding: '6px 16px',
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '2px',
    borderRadius: '30px',
    zIndex: 2,
  },
  thumbnailContainer: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    justifyContent: 'center',
  },
  thumbnail: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '2px solid #222',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  // Info Section
  infoSection: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', flexDirection: 'column', gap: '12px' },
  brandTag: {
    color: '#D4AF37',
    fontSize: '0.75rem',
    letterSpacing: '6px',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  productTitle: {
    fontSize: '3rem',
    fontFamily: "'Playfair Display', serif",
    margin: '0',
    lineHeight: '1.2',
    fontWeight: '600',
  },
  priceContainer: { display: 'flex', alignItems: 'center', gap: '15px', marginTop: '5px' },
  oldPrice: { color: '#666', fontSize: '1.3rem', textDecoration: 'line-through' },
  currentPriceWrapper: { display: 'flex', alignItems: 'flex-start', gap: '5px' },
  currency: { color: '#D4AF37', fontSize: '1.3rem', fontWeight: '500' },
  amount: { fontSize: '2.5rem', fontWeight: '500', color: '#D4AF37' },
  
  ratingContainer: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' },
  stars: { color: '#D4AF37', fontSize: '0.9rem', letterSpacing: '2px' },
  ratingValue: { color: '#FFF', fontSize: '0.9rem', fontWeight: '500' },
  reviewCount: { color: '#666', fontSize: '0.8rem' },
  
  divider: { height: '1px', backgroundColor: '#1a1a1a', width: '100%', margin: '10px 0' },
  
  // Tabs
  tabs: { display: 'flex', gap: '30px', borderBottom: '1px solid #1a1a1a' },
  tab: { 
    background: 'none', 
    border: 'none', 
    color: '#888', 
    padding: '12px 0', 
    cursor: 'pointer', 
    fontSize: '0.8rem', 
    letterSpacing: '2px',
    fontWeight: '500',
    transition: 'all 0.3s',
    textTransform: 'uppercase',
  },
  tabContent: { minHeight: '200px' },
  
  // Description Tab
  descriptionSection: { padding: '10px 0' },
  descriptionText: {
    color: '#aaa',
    lineHeight: '1.8',
    fontSize: '0.95rem',
    fontWeight: '300',
    marginBottom: '20px',
  },
  featuresList: { listStyle: 'none', padding: 0, marginTop: '15px' },
  featureItem: { color: '#888', padding: '8px 0', borderBottom: '1px solid #1a1a1a', fontSize: '0.9rem' },
  
  // Notes Tab
  notesSection: { padding: '10px 0' },
  noteCategory: { marginBottom: '20px' },
  noteTitle: { color: '#D4AF37', fontSize: '0.7rem', letterSpacing: '3px', marginBottom: '12px', textTransform: 'uppercase' },
  notesGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  noteTag: {
    border: '1px solid #2a2a2a',
    padding: '8px 18px',
    fontSize: '0.8rem',
    color: '#aaa',
    borderRadius: '30px',
    transition: 'all 0.3s',
    backgroundColor: '#0A0A0A',
  },
  
  // Details Tab
  detailsSection: { padding: '10px 0' },
  detailRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1a1a1a' },
  detailLabel: { color: '#666', fontSize: '0.8rem', letterSpacing: '1px' },
  detailValue: { color: '#FFF', fontSize: '0.85rem', fontWeight: '500' },
  
  // Quantity
  quantitySection: { display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' },
  quantityLabel: { color: '#888', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' },
  quantitySelector: { display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '5px' },
  qtyBtn: { 
    width: '32px', 
    height: '32px', 
    backgroundColor: '#1A1A1A', 
    border: 'none', 
    color: '#FFF', 
    fontSize: '1.2rem', 
    cursor: 'pointer', 
    borderRadius: '6px',
    transition: 'all 0.3s',
  },
  qtyValue: { minWidth: '40px', textAlign: 'center', fontSize: '1rem', fontWeight: '500' },
  
  // CTA Buttons
  ctaSection: { display: 'flex', gap: '15px', marginTop: '10px' },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#D4AF37',
    color: '#000',
    border: 'none',
    padding: '16px 24px',
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '3px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#D4AF37',
    border: '1px solid #D4AF37',
    padding: '16px 24px',
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '3px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
  },
  
  // Shipping Info
  shippingInfo: { marginTop: '20px', padding: '15px', backgroundColor: '#0A0A0A', borderRadius: '12px' },
  shippingItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', color: '#888', fontSize: '0.8rem' },
  shippingIcon: { fontSize: '1.1rem' },
  
  // Stock Status
  stockStatus: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' },
  stockDot: { width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' },
  stockText: { color: '#22c55e', fontSize: '0.8rem', fontWeight: '500' },

  // Loader & Error States
  loaderContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050505',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '2px solid #1a1a1a',
    borderTop: '2px solid #D4AF37',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loaderText: { color: '#D4AF37', letterSpacing: '4px', fontSize: '0.7rem', fontWeight: '500' },
  errorContainer: {
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#050505',
  },
  errorTitle: { fontSize: '6rem', color: '#D4AF37', margin: '0', fontFamily: "'Playfair Display', serif" },
  errorText: { color: '#888', marginBottom: '30px' },
  backBtn: {
    marginTop: '20px',
    background: 'none',
    border: '2px solid #D4AF37',
    color: '#D4AF37',
    padding: '12px 32px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    letterSpacing: '3px',
    fontWeight: '600',
    transition: 'all 0.3s',
  }
};

// Add animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
  
  .breadcrumb-link:hover {
    color: #D4AF37;
  }
  
  .note-tag:hover {
    border-color: #D4AF37;
    color: #D4AF37;
    transform: translateY(-2px);
  }
  
  .thumbnail:hover {
    border-color: #D4AF37;
    transform: scale(1.05);
  }
  
  .qty-btn:hover {
    background-color: #D4AF37;
    color: #000;
  }
  
  .primary-btn:hover, .secondary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
  }
  
  .back-btn:hover {
    background-color: #D4AF37;
    color: #000;
  }
  
  @media (max-width: 1024px) {
    .main-grid {
      grid-template-columns: 1fr !important;
      gap: 40px !important;
    }
    .visual-section {
      position: relative !important;
      top: 0 !important;
    }
    .product-title {
      font-size: 2rem !important;
    }
  }
  
  @media (max-width: 768px) {
    .page-wrapper {
      padding: 100px 5% 60px 5% !important;
    }
    .cta-section {
      flex-direction: column !important;
    }
    .tabs {
      gap: 15px !important;
    }
    .tab {
      font-size: 0.7rem !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default ProductDetail;