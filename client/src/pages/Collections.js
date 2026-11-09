import React from 'react'; // Removed useState and useEffect
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../redux/cartSlice';

// Category data - based on fragrance families (smell categories)
const CATEGORY_DATA = [
  { id: 1, name: "FLORAL", description: "Blooming & Romantic", smell: "Rose, Jasmine, Tuberose", img: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800", color: "#2a1b3d" },
  { id: 2, name: "WOODY", description: "Warm & Earthy", smell: "Sandalwood, Cedar, Vetiver", img: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800", color: "#3d2b1a" },
  { id: 3, name: "ORIENTAL", description: "Rich & Spicy", smell: "Vanilla, Amber, Patchouli", img: "https://images.unsplash.com/photo-1590736961148-8b7cb9e6de55?w=800", color: "#4a2a2a" },
  { id: 4, name: "FRESH", description: "Clean & Aquatic", smell: "Citrus, Marine, Green", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800", color: "#1a3d3d" },
  { id: 5, name: "GOURMAND", description: "Sweet & Edible", smell: "Chocolate, Coffee, Honey", img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800", color: "#3d2a1a" },
  { id: 6, name: "LEATHER", description: "Bold & Smoky", smell: "Leather, Tobacco, Birch", img: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=800", color: "#2a2a2a" },
  { id: 7, name: "AROMATIC", description: "Herbal & Fougère", smell: "Lavender, Sage, Rosemary", img: "https://images.unsplash.com/photo-1583522684482-2813bc314630?w=800", color: "#2a3d2a" },
  { id: 8, name: "CHYPRE", description: "Sophisticated & Elegant", smell: "Oakmoss, Bergamot, Labdanum", img: "https://images.unsplash.com/photo-1615485242231-f92606550974?w=800", color: "#3d2a35" },
];

const BEST_SELLERS = [
  { id: 101, name: "Noir Absolu", price: 280, rating: 4.9, img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id: 102, name: "Oud Royale", price: 350, rating: 4.8, img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600" },
  { id: 103, name: "Velvet Hour", price: 240, rating: 4.7, img: "https://images.unsplash.com/photo-1583522684482-2813bc314630?w=600" },
  { id: 104, name: "Amber Nuit", price: 390, rating: 4.9, img: "https://images.unsplash.com/photo-1590736961148-8b7cb9e6de55?w=600" },
];

const NEW_ARRIVALS = [
  { id: 201, name: "Azure Bloom", price: 210, category: "Floral", img: "https://images.unsplash.com/photo-1615485242231-f92606550974?w=600" },
  { id: 202, name: "Executive Oud", price: 310, category: "Woody", img: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=600" },
  { id: 203, name: "Santal Royal", price: 420, category: "Woody", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600" },
  { id: 204, name: "Musk Imperial", price: 260, category: "Oriental", img: "https://images.unsplash.com/photo-1547881338-649ef208bfdd?w=600" },
  { id: 205, name: "Rose Noire", price: 230, category: "Floral", img: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600" },
  { id: 206, name: "Tobacco Vanille", price: 380, category: "Gourmand", img: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600" },
  { id: 207, name: "Bergamot 22", price: 195, category: "Fresh", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id: 208, name: "Cedar & Cypress", price: 275, category: "Aromatic", img: "https://images.unsplash.com/photo-1583522684482-2813bc314630?w=600" },
];

const Collection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${category.name.toLowerCase()}`);
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.heroTagline}>DISCOVER YOUR SIGNATURE</span>
          <h1 style={styles.heroTitle}>Fragrance Families</h1>
          <p style={styles.heroDesc}>Explore our curated collection of olfactory masterpieces,<br />organized by scent profiles to help you find your perfect match.</p>
        </div>
      </section>

      <div style={styles.mainContent}>
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>BY OLFACTIVE FAMILY</h2>
            <span style={styles.sectionLine}></span>
            <p style={styles.sectionSubtitle}>Discover perfumes by their scent profile</p>
          </div>
          <div style={styles.categoryGrid}>
            {CATEGORY_DATA.map((category) => (
              <div 
                key={category.id} 
                style={styles.categoryCard}
                className="category-card"
                onClick={() => handleCategoryClick(category)}
              >
                <div style={{...styles.categoryImageWrapper, backgroundColor: category.color}}>
                  <img src={category.img} alt={category.name} style={styles.categoryImage} />
                  <div style={styles.categoryOverlay}>
                    <div style={styles.smellBadge}>{category.smell}</div>
                  </div>
                </div>
                <div style={styles.categoryInfo}>
                  <h3 style={styles.categoryName}>{category.name}</h3>
                  <p style={styles.categoryDesc}>{category.description}</p>
                  <span style={styles.smellNote}>{category.smell}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>BEST SELLERS</h2>
            <span style={styles.sectionLine}></span>
            <p style={styles.sectionSubtitle}>Our community's most loved scents</p>
          </div>
          <div style={styles.bestSellerGrid}>
            {BEST_SELLERS.map((product) => (
              <div 
                key={product.id} 
                style={styles.productCard}
                className="product-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div style={styles.productImageWrapper}>
                  <img src={product.img} alt={product.name} style={styles.productImage} />
                  <div style={styles.ratingBadge}>★ {product.rating}</div>
                  <div style={styles.productActions}>
                    <button 
                      style={styles.quickAddBtn}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
                <div style={styles.productInfo}>
                  <h4 style={styles.productName}>{product.name}</h4>
                  <div style={styles.productPriceRow}>
                    <span style={styles.productPrice}>${product.price}</span>
                    <span style={styles.productMl}>100ml</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>NEW ARRIVALS</h2>
            <span style={styles.sectionLine}></span>
            <p style={styles.sectionSubtitle}>Fresh drops for the modern connoisseur</p>
          </div>
          <div style={styles.rectangularGrid}>
            {NEW_ARRIVALS.map((product) => (
              <div 
                key={product.id} 
                style={styles.rectangularCard}
                className="rectangular-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div style={styles.rectangularImageWrapper}>
                  <img src={product.img} alt={product.name} style={styles.rectangularImage} />
                  <div style={styles.categoryTag}>{product.category}</div>
                  <div style={styles.rectangularActions}>
                    <button 
                      style={styles.rectangularAddBtn}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      ADD TO BAG
                    </button>
                  </div>
                </div>
                <div style={styles.rectangularInfo}>
                  <div>
                    <h4 style={styles.rectangularName}>{product.name}</h4>
                    <span style={styles.rectangularCategory}>{product.category}</span>
                  </div>
                  <span style={styles.rectangularPrice}>${product.price}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.discoverBanner}>
          <div style={styles.discoverContent}>
            <span style={styles.discoverTag}>CURATED FOR YOU</span>
            <h2 style={styles.discoverTitle}>Find Your Signature Scent</h2>
            <p style={styles.discoverText}>Take our fragrance quiz and get personalized recommendations<br />based on your preferences and personality.</p>
            <button style={styles.discoverBtn} onClick={() => navigate('/discover')}>
              TAKE THE QUIZ
            </button>
          </div>
        </section>
      </div>

      <style>{`
        .category-card { transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1); }
        .category-card:hover { transform: translateY(-10px); }
        .category-card:hover .category-image { transform: scale(1.08); }
        .category-card:hover .category-overlay { opacity: 1; }
        .product-card { transition: all 0.3s ease; }
        .product-card:hover { transform: translateY(-5px); }
        .product-card:hover .product-actions { opacity: 1; bottom: 20px; }
        .rectangular-card { transition: all 0.3s ease; }
        .rectangular-card:hover { transform: translateY(-5px); }
        .rectangular-card:hover .rectangular-actions { opacity: 1; bottom: 15px; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .section { animation: fadeInUp 0.6s ease forwards; }
        @media (max-width: 768px) {
          .category-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important; gap: 20px !important; }
          .rectangular-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important; }
          .hero-title { font-size: 2.5rem !important; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#050505', minHeight: '100vh', color: '#FFF', fontFamily: "'Inter', 'Segoe UI', sans-serif" },
  hero: {
    height: '50vh',
    backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.85) 100%), url("https://images.unsplash.com/photo-1590736961148-8b7cb9e6de55?w=1600")',
    backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '60px'
  },
  heroContent: { maxWidth: '800px', padding: '0 20px' },
  heroTagline: { color: '#D4AF37', letterSpacing: '6px', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '20px', display: 'inline-block' },
  heroTitle: { fontSize: '4rem', fontFamily: "'Playfair Display', serif", fontWeight: '700', letterSpacing: '2px', marginBottom: '20px', background: 'linear-gradient(135deg, #FFF 0%, #D4AF37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroDesc: { color: '#aaa', fontSize: '1rem', lineHeight: '1.6' },
  mainContent: { maxWidth: '1440px', margin: '0 auto', padding: '0 5% 80px' },
  section: { marginBottom: '80px' },
  sectionHeader: { textAlign: 'center', marginBottom: '50px' },
  sectionTitle: { fontSize: '1.8rem', letterSpacing: '4px', color: '#FFF', fontFamily: "'Playfair Display', serif", fontWeight: '500', marginBottom: '15px' },
  sectionLine: { display: 'block', width: '60px', height: '2px', backgroundColor: '#D4AF37', margin: '0 auto 15px' },
  sectionSubtitle: { color: '#888', fontSize: '0.9rem', letterSpacing: '1px' },
  categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' },
  categoryCard: { cursor: 'pointer', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#111', transition: 'all 0.4s ease' },
  categoryImageWrapper: { position: 'relative', height: '280px', overflow: 'hidden' },
  categoryImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' },
  categoryOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', opacity: 0, transition: 'opacity 0.3s ease' },
  smellBadge: { display: 'inline-block', backgroundColor: 'rgba(212, 175, 55, 0.9)', color: '#000', padding: '5px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '1px' },
  categoryInfo: { padding: '20px' },
  categoryName: { fontSize: '1.3rem', fontWeight: '600', letterSpacing: '2px', marginBottom: '8px', color: '#D4AF37' },
  categoryDesc: { fontSize: '0.85rem', color: '#aaa', marginBottom: '8px' },
  smellNote: { fontSize: '0.7rem', color: '#666', letterSpacing: '0.5px' },
  bestSellerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '35px' },
  productCard: { cursor: 'pointer', backgroundColor: '#0A0A0A', borderRadius: '8px', overflow: 'hidden', transition: 'all 0.3s ease' },
  productImageWrapper: { position: 'relative', height: '320px', overflow: 'hidden', backgroundColor: '#111' },
  productImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },
  ratingBadge: { position: 'absolute', top: '15px', right: '15px', backgroundColor: '#D4AF37', color: '#000', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' },
  productActions: { position: 'absolute', bottom: '-60px', left: 0, right: 0, padding: '15px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', transition: '0.3s ease', opacity: 0 },
  quickAddBtn: { width: '100%', padding: '12px', backgroundColor: '#D4AF37', border: 'none', color: '#000', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px', fontSize: '0.8rem', transition: '0.3s' },
  productInfo: { padding: '18px' },
  productName: { fontSize: '1rem', fontWeight: '500', marginBottom: '10px', letterSpacing: '0.5px' },
  productPriceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { color: '#D4AF37', fontSize: '1.1rem', fontWeight: '600' },
  productMl: { color: '#666', fontSize: '0.7rem' },
  rectangularGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px' },
  rectangularCard: { cursor: 'pointer', backgroundColor: '#0A0A0A', borderRadius: '8px', overflow: 'hidden', transition: 'all 0.3s ease' },
  rectangularImageWrapper: { position: 'relative', height: '250px', overflow: 'hidden', backgroundColor: '#111' },
  rectangularImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },
  categoryTag: { position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(212, 175, 55, 0.9)', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '600', letterSpacing: '1px' },
  rectangularActions: { position: 'absolute', bottom: '-60px', left: 0, right: 0, padding: '12px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', transition: '0.3s ease', opacity: 0 },
  rectangularAddBtn: { width: '100%', padding: '10px', backgroundColor: '#D4AF37', border: 'none', color: '#000', fontWeight: '600', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '1px' },
  rectangularInfo: { padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  rectangularName: { fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' },
  rectangularCategory: { fontSize: '0.7rem', color: '#888' },
  rectangularPrice: { color: '#D4AF37', fontSize: '1rem', fontWeight: '600' },
  discoverBanner: { marginTop: '80px', padding: '60px', background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(212, 175, 55, 0.2)' },
  discoverContent: {},
  discoverTag: { color: '#D4AF37', letterSpacing: '4px', fontSize: '0.7rem', textTransform: 'uppercase', display: 'inline-block', marginBottom: '15px' },
  discoverTitle: { fontSize: '2rem', fontFamily: "'Playfair Display', serif", marginBottom: '15px' },
  discoverText: { color: '#aaa', marginBottom: '30px', lineHeight: '1.6' },
  discoverBtn: { backgroundColor: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', padding: '14px 40px', fontSize: '0.8rem', letterSpacing: '3px', cursor: 'pointer', transition: '0.3s', fontWeight: '600' }
};

export default Collection;