import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../services/api';
import { addToCart } from '../redux/cartSlice';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading perfumes:", error);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={styles.tagline}>THE ART OF ESSENCE</span>
        <h1 style={styles.title}>Our Perfume Collection</h1>
        <div style={styles.underline}></div>
      </header>

      <div style={styles.grid}>
        {products.map(product => (
          <div key={product._id} style={styles.card} className="product-card">
            <div style={styles.imageContainer}>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={styles.image} 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500'; }}
              />
              <div style={styles.overlay}>
                <button 
                  onClick={() => dispatch(addToCart(product))}
                  style={styles.quickAdd}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
            
            <div style={styles.info}>
              <p style={styles.brand}>{product.brand}</p>
              <h3 style={styles.name}>{product.name}</h3>
              <p style={styles.price}>${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0A0A0A',
    minHeight: '100vh',
    padding: '4rem 5%',
    color: '#FFFFFF',
    fontFamily: "'Playfair Display', serif",
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  tagline: {
    color: '#D4AF37',
    letterSpacing: '4px',
    fontSize: '0.8rem',
    display: 'block',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '700',
    margin: 0,
  },
  underline: {
    width: '60px',
    height: '2px',
    backgroundColor: '#D4AF37',
    margin: '1.5rem auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '3rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#111',
    borderRadius: '4px',
    overflow: 'hidden',
    transition: 'transform 0.4s ease',
    cursor: 'pointer',
  },
  imageContainer: {
    position: 'relative',
    height: '350px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  quickAdd: {
    backgroundColor: '#D4AF37',
    color: '#000',
    border: 'none',
    padding: '12px 24px',
    fontWeight: '700',
    letterSpacing: '1px',
    cursor: 'pointer',
  },
  info: {
    padding: '1.5rem',
    textAlign: 'center',
  },
  brand: {
    color: '#D4AF37',
    fontSize: '0.75rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
  },
  name: {
    fontSize: '1.2rem',
    margin: '0 0 0.5rem 0',
    fontWeight: '500',
  },
  price: {
    fontSize: '1.1rem',
    color: '#D4AF37',
    fontWeight: '600',
  },
};

// Add hover effects via small style tag
const styleTag = document.createElement("style");
styleTag.textContent = `
  .product-card:hover { transform: translateY(-10px); }
  .product-card:hover img { transform: scale(1.1); }
  .product-card:hover .overlay { opacity: 1; }
`;
document.head.appendChild(styleTag);

export default ProductList;