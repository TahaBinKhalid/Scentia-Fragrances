import { useLocation } from 'react-router-dom';
import { syncCartToDatabase } from '../services/cartSync';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux'; // Removed useSelector since it's not used
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { addToCart } from '../redux/cartSlice';
import fallbackImage from '../assets/1775448747107.png';

const Shop = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeGender, setActiveGender] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Removed unused cartItems variable

  const priceRanges = [
    { label: 'All', min: 0, max: 1000 },
    { label: 'Under $100', min: 0, max: 100 },
    { label: '$100 - $250', min: 100, max: 250 },
    { label: '$250 - $500', min: 250, max: 500 },
    { label: '$500+', min: 500, max: 1000 },
  ];

  // 1. Optimized Data Fetching
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // 2. Optimized Filter & Sort Logic
  const filterAndSortProducts = useCallback(() => {
    let filtered = [...products];

    // 1. Get Scent Category from URL (?category=floral)
    const queryParams = new URLSearchParams(location.search);
    const urlCategory = queryParams.get('category');

    // 2. Filter by Scent Family (from URL)
    if (urlCategory) {
      filtered = filtered.filter(p => 
        p.category?.toLowerCase() === urlCategory.toLowerCase()
      );
    }

    // 3. Category/Collection Filter (from UI State)
    if (activeCategory !== 'All') {
      filtered = filtered.filter(p => 
        p.category === activeCategory || 
        p.gender === activeCategory ||
        p.collection === activeCategory
      );
    }

    // 4. Gender Filter
    if (activeGender !== 'All') {
      filtered = filtered.filter(p => p.gender === activeGender);
    }

    // 5. Price Filter
    filtered = filtered.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // 6. Sorting
    switch(sortBy) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'newest': filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      default: break;
    }

    setFilteredProducts(filtered);
  }, [activeCategory, activeGender, priceRange, sortBy, products, location.search]);

  useEffect(() => {
    filterAndSortProducts();
  }, [filterAndSortProducts, location.search]);

  // Single handleAddToCart function
  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    
    // Get current cart from localStorage
    const currentCart = JSON.parse(localStorage.getItem('scentia_cart')) || { items: [] };
    
    // Check if product already exists
    const existingItemIndex = currentCart.items.findIndex(item => item._id === product._id);
    
    let updatedItems;
    if (existingItemIndex !== -1) {
      // Update quantity
      updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex].quantity += 1;
    } else {
      // Add new item
      updatedItems = [...currentCart.items, { 
        ...product, 
        quantity: 1,
        _id: product._id,
        productId: product._id
      }];
    }
    
    // Update Redux
    dispatch(addToCart({ ...product, quantity: 1 }));
    
    // Update localStorage
    localStorage.setItem('scentia_cart', JSON.stringify({ items: updatedItems }));
    
    // If user is logged in, sync to database
    const token = localStorage.getItem('token');
    if (token) {
      await syncCartToDatabase(updatedItems);
      console.log("Cart synced to database");
    }
  };
  
  const handleProductClick = (productId) => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.shopHero}>
        <div style={styles.heroContent}>
          <span style={styles.heroBadge}>SCENTIA PARFUMS</span>
          <h1 style={styles.pageTitle}>The Collection</h1>
          <p style={styles.pageSubtitle}>Explore our curated world of olfactory excellence.</p>
        </div>
      </div>

      <div style={styles.circularNav}>
        <div style={styles.circularContainer}>
          {[
            { name: 'All', icon: '✨', color: '#D4AF37' },
            { name: 'Men', icon: '👔', color: '#1E90FF' },
            { name: 'Women', icon: '💐', color: '#FF69B4' },
            { name: 'Unisex', icon: '♾️', color: '#9370DB' },
            { name: 'Luxury', icon: '💎', color: '#D4AF37' }
          ].map((cat) => (
            <div 
              key={cat.name}
              className={`circular-item ${activeCategory === cat.name ? 'active' : ''}`}
              style={styles.circularItem}
              onClick={() => setActiveCategory(cat.name)}
            >
              <div style={{
                ...styles.circularIcon,
                borderColor: activeCategory === cat.name ? cat.color : '#333',
                backgroundColor: activeCategory === cat.name ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
              }}>
                <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
              </div>
              <span style={styles.circularLabel}>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.mainContent}>
        <aside style={styles.sidebar}>
          <div style={styles.filterSection}>
            <h3 style={styles.filterTitle}>Gender</h3>
            <div style={styles.filterList}>
              {['All', 'Men', 'Women', 'Unisex'].map(gender => (
                <button
                  key={gender}
                  onClick={() => setActiveGender(gender)}
                  style={{
                    ...styles.filterBtn,
                    color: activeGender === gender ? '#D4AF37' : '#888',
                    borderLeft: activeGender === gender ? '2px solid #D4AF37' : '2px solid transparent'
                  }}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.filterSection}>
            <h3 style={styles.filterTitle}>Price Range</h3>
            <div style={styles.filterList}>
              {priceRanges.map(range => (
                <button
                  key={range.label}
                  onClick={() => setPriceRange([range.min, range.max])}
                  style={{
                    ...styles.filterBtn,
                    color: priceRange[0] === range.min && priceRange[1] === range.max ? '#D4AF37' : '#888',
                    borderLeft: priceRange[0] === range.min && priceRange[1] === range.max ? '2px solid #D4AF37' : '2px solid transparent'
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            style={styles.resetBtn}
            onClick={() => {
              setActiveCategory('All');
              setActiveGender('All');
              setPriceRange([0, 1000]);
              setSortBy('default');
            }}
          >
            Reset All Filters
          </button>
        </aside>

        <div style={styles.gridContainer}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loader}></div>
              <p>Loading luxurious fragrances...</p>
            </div>
          ) : (
            <>
              <div style={styles.resultsCount}>
                <span>{filteredProducts.length} Products Found</span>
              </div>
              <div style={styles.grid}>
                {filteredProducts.map((product) => (
                 
<div 
  key={product._id || product.id} 
  style={styles.card} 
  className="shop-card"
  onClick={() => handleProductClick(product._id || product.id)}
>
  <div style={styles.imageWrapper}>
    <img 
      src={product.imageUrl || product.image || fallbackImage} 
      alt={product.name} 
      style={styles.image} 
      onError={(e) => { 
        console.log(`Image failed for ${product.name}, using fallback.`);
        e.target.onerror = null; 
        e.target.src = fallbackImage; 
      }}
    />
    {product.isNew && <div style={styles.newBadge}>NEW</div>}
   
                      <div className="card-actions" style={styles.cardActions}>
                        <button 
                          style={styles.actionBtn} 
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          ADD TO BAG
                        </button>
                      </div>
                    </div>
                    <div style={styles.info}>
                      <span style={styles.brandName}>{product.brand || 'SCENTIA'}</span>
                      <h2 style={styles.productName}>{product.name}</h2>
                      <div style={styles.priceRow}>
                        <span style={styles.price}>${product.price}</span>
                        <span style={styles.ml}>100ml</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


const styles = {
    page: { backgroundColor: '#050505', minHeight: '100vh', color: '#FFF' },
    shopHero: { textAlign: 'center', padding: '6rem 0 4rem', background: '#0A0A0A', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' },
    heroContent: { maxWidth: '800px', margin: '0 auto' },
    heroBadge: { color: '#D4AF37', letterSpacing: '4px', fontSize: '0.8rem', textTransform: 'uppercase' },
    pageTitle: { fontSize: '4rem', fontFamily: "serif", letterSpacing: '4px', margin: '1rem 0' },
    pageSubtitle: { color: '#888', fontSize: '1rem', letterSpacing: '2px' },
    circularNav: { padding: '3rem 5%', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' },
    circularContainer: { display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' },
    circularItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: '0.3s' },
    circularIcon: { width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #333' },
    circularLabel: { fontSize: '0.9rem', letterSpacing: '2px', color: '#888' },
    mainContent: { display: 'flex', maxWidth: '1440px', margin: '0 auto', padding: '3rem 5%', gap: '50px' },
    sidebar: { width: '250px', flexShrink: 0, position: 'sticky', top: '100px', height: 'fit-content' },
    filterSection: { marginBottom: '2.5rem' },
    filterTitle: { fontSize: '0.9rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem', color: '#D4AF37' },
    filterList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    filterBtn: { background: 'none', border: 'none', textAlign: 'left', fontSize: '0.9rem', cursor: 'pointer', padding: '8px 15px', color: '#888' },
    resetBtn: { width: '100%', padding: '12px', background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer' },
    gridContainer: { flex: 1 },
    resultsCount: { marginBottom: '2rem', textAlign: 'right', color: '#888' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' },
    card: { backgroundColor: 'transparent', cursor: 'pointer' },
    imageWrapper: { position: 'relative', height: '400px', backgroundColor: '#111', overflow: 'hidden', borderRadius: '8px' },
    image: { width: '100%', height: '100%', objectFit: 'cover', transition: '0.6s' },
    newBadge: { position: 'absolute', top: '15px', left: '15px', backgroundColor: '#D4AF37', color: '#000', padding: '4px 12px', fontSize: '0.7rem' },
    cardActions: { position: 'absolute', bottom: '-80px', left: 0, right: 0, transition: '0.4s', padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', display: 'flex' },
    actionBtn: { flex: 1, padding: '12px', backgroundColor: '#D4AF37', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
    info: { padding: '20px 0' },
    brandName: { color: '#D4AF37', fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase' },
    productName: { fontSize: '1.3rem', margin: '10px 0' },
    priceRow: { display: 'flex', justifyContent: 'space-between' },
    price: { fontSize: '1.2rem', color: '#D4AF37' },
    ml: { color: '#555', fontSize: '0.8rem' },
    loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '400px', justifyContent: 'center' },
    loader: { width: '40px', height: '40px', border: '3px solid #333', borderTopColor: '#D4AF37', borderRadius: '50%', animation: 'spin 1s linear infinite' }
};

// Global CSS for hover effects
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .shop-card:hover .image { transform: scale(1.05); }
    .shop-card:hover .card-actions { bottom: 0 !important; }
    .circular-item:hover .circular-icon { border-color: #D4AF37 !important; }
    .circular-item.active .circular-icon { border-color: #D4AF37 !important; box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }
  `;
  document.head.appendChild(styleSheet);
}

export default Shop;

