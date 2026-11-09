import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const LuxuryEdition = () => {
  const dispatch = useDispatch();
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState('');
  const [showNotify, setShowNotify] = useState(false);

  // Luxury collection data
  const luxuryPerfumes = [
    {
      id: 101,
      name: "Noir Absolu",
      collection: "La Collection Privée",
      price: 589,
      oldPrice: 789,
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800",
      badge: "Best Seller",
      rating: 4.9,
      reviews: 234,
      description: "A masterpiece of rare oud, saffron, and amber. Noir Absolu captures the essence of midnight in Paris—mysterious, seductive, and unforgettable. Handcrafted with the finest ingredients sourced from the mountains of Northern India.",
      notes: {
        top: ["Bergamot", "Saffron", "Cardamom"],
        heart: ["Oud", "Rose", "Jasmine"],
        base: ["Amber", "Musk", "Vanilla", "Leather"]
      },
      perfumer: "Élisabeth Dupré",
      concentration: "Extrait de Parfum (28%)",
      longevity: "12+ hours",
      size: "100ml",
      limited: false,
      year: 2024
    },
    {
      id: 102,
      name: "Rose Royale",
      collection: "La Collection Privée",
      price: 629,
      oldPrice: 829,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
      badge: "Limited Edition",
      rating: 4.8,
      reviews: 189,
      description: "An opulent bouquet of Centifolia rose, combined with rare Turkish rose absolute and a touch of saffron. This regal fragrance is a tribute to royalty, encased in a crystal bottle adorned with 24k gold accents.",
      notes: {
        top: ["Raspberry", "Saffron", "Lychee"],
        heart: ["Damascus Rose", "Jasmine", "Peony"],
        base: ["Oud", "Sandalwood", "Musk", "Patchouli"]
      },
      perfumer: "Jean-Baptiste Rivière",
      concentration: "Extrait de Parfum (25%)",
      longevity: "10+ hours",
      size: "100ml",
      limited: true,
      year: 2024
    },
    {
      id: 103,
      name: "Oud Mystique",
      collection: "Oud Collection",
      price: 699,
      oldPrice: 899,
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800",
      badge: "Masterpiece",
      rating: 4.9,
      reviews: 312,
      description: "The rarest Agarwood from Bangladesh, aged for 15 years, creates this mystical composition. Blended with smoky leather and warm vanilla, Oud Mystique is a journey through ancient trade routes.",
      notes: {
        top: ["Saffron", "Cinnamon", "Nutmeg"],
        heart: ["Agarwood (Oud)", "Leather", "Tobacco"],
        base: ["Ambergris", "Vanilla", "Cedarwood", "Musk"]
      },
      perfumer: "Mohammed Al-Rashid",
      concentration: "Extrait de Parfum (30%)",
      longevity: "15+ hours",
      size: "100ml",
      limited: false,
      year: 2023
    },
    {
      id: 104,
      name: "Crystal Saffron",
      collection: "Precious Gems",
      price: 749,
      oldPrice: 949,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
      badge: "Exclusive",
      rating: 4.7,
      reviews: 156,
      description: "Pure Kashmiri saffron meets sparkling bergamot and delicate jasmine. This luminous fragrance captures the golden hour—radiant, warm, and utterly captivating.",
      notes: {
        top: ["Saffron", "Bergamot", "Bitter Orange"],
        heart: ["Jasmine", "Rose", "Iris"],
        base: ["Leather", "Amber", "Oud", "Musk"]
      },
      perfumer: "Claire Delacroix",
      concentration: "Extrait de Parfum (27%)",
      longevity: "11+ hours",
      size: "100ml",
      limited: true,
      year: 2024
    },
    {
      id: 105,
      name: "Midnight Amber",
      collection: "Nocturnal Series",
      price: 549,
      oldPrice: 699,
      image: "https://images.unsplash.com/photo-1590736961148-8b7cb9e6de55?w=800",
      badge: "New",
      rating: 4.8,
      reviews: 98,
      description: "A warm embrace of golden amber, vanilla, and tonka bean. Midnight Amber is comfort and luxury combined—perfect for cool evenings and intimate moments.",
      notes: {
        top: ["Cinnamon", "Orange", "Clove"],
        heart: ["Amber", "Vanilla", "Tobacco"],
        base: ["Tonka Bean", "Benzoin", "Musk"]
      },
      perfumer: "Sophie Laurent",
      concentration: "Eau de Parfum (22%)",
      longevity: "8+ hours",
      size: "100ml",
      limited: false,
      year: 2024
    },
    {
      id: 106,
      name: "Imperial Vetiver",
      collection: "Les Exclusifs",
      price: 519,
      oldPrice: 669,
      image: "https://images.unsplash.com/photo-1615485242231-f92606550974?w=800",
      badge: "Classic",
      rating: 4.7,
      reviews: 145,
      description: "Haitian vetiver, Indonesian patchouli, and Sicilian bergamot create this aristocratic fragrance. Fresh yet profound, green yet earthy—a true gentleman's scent.",
      notes: {
        top: ["Bergamot", "Grapefruit", "Lemon"],
        heart: ["Vetiver", "Patchouli", "Cedar"],
        base: ["Oakmoss", "Musk", "Amber"]
      },
      perfumer: "Pierre Montaigne",
      concentration: "Eau de Parfum (20%)",
      longevity: "9+ hours",
      size: "100ml",
      limited: false,
      year: 2023
    }
  ];

  const bestSellers = luxuryPerfumes.filter(p => p.badge === "Best Seller" || p.badge === "Masterpiece");

  // Gift sets data
  const giftSets = [
    {
      id: 201,
      name: "The Discovery Set",
      price: 189,
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800",
      includes: "6 x 10ml vials",
      description: "Sample our entire luxury collection"
    },
    {
      id: 202,
      name: "The Ultimate Collection",
      price: 2499,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
      includes: "6 x 100ml bottles",
      description: "Complete luxury set in leather case"
    },
    {
      id: 203,
      name: "His & Hers Duo",
      price: 999,
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800",
      includes: "2 x 100ml bottles",
      description: "Noir Absolu + Rose Royale"
    }
  ];

  // Luxury services
  const luxuryServices = [
    { icon: "🎨", title: "Personalized Engraving", description: "Add up to 3 lines of text on your bottle" },
    { icon: "📦", title: "Luxury Gift Wrapping", description: "Handcrafted paper and silk ribbon" },
    { icon: "🚚", title: "White Glove Delivery", description: "Concierge delivery service" },
    { icon: "🔁", title: "Lifetime Refills", description: "30% off all refills" },
    { icon: "🎁", title: "Complimentary Samples", description: "3 samples with every order" },
    { icon: "👤", title: "Personal Stylist", description: "One-on-one consultation" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleQuickView = (perfume) => {
    setSelectedPerfume(perfume);
    setShowModal(true);
    setActiveTab('description');
    setQuantity(1);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity }));
    setShowModal(false);
  };

  const handleNotify = () => {
    if (email) {
      setShowNotify(true);
      setTimeout(() => setShowNotify(false), 3000);
      setEmail('');
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Notification Toast */}
      <div style={{ ...styles.toast, transform: showNotify ? 'translateX(0)' : 'translateX(400px)', opacity: showNotify ? 1 : 0 }}>
        ✓ Thank you! You'll be notified when available.
      </div>

      {/* Quick View Modal */}
      {showModal && selectedPerfume && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
            <div style={styles.modalGrid}>
              <img src={selectedPerfume.image} alt={selectedPerfume.name} style={styles.modalImage} />
              <div style={styles.modalContent}>
                <span style={styles.modalCollection}>{selectedPerfume.collection}</span>
                <h2 style={styles.modalTitle}>{selectedPerfume.name}</h2>
                <div style={styles.modalPrice}>
                  <span style={styles.modalCurrent}>${selectedPerfume.price}</span>
                  <span style={styles.modalOld}>${selectedPerfume.oldPrice}</span>
                </div>
                
                {/* Tabs */}
                <div style={styles.modalTabs}>
                  <button style={{ ...styles.modalTab, borderBottom: activeTab === 'description' ? '2px solid #D4AF37' : 'none' }} onClick={() => setActiveTab('description')}>Description</button>
                  <button style={{ ...styles.modalTab, borderBottom: activeTab === 'notes' ? '2px solid #D4AF37' : 'none' }} onClick={() => setActiveTab('notes')}>Notes</button>
                  <button style={{ ...styles.modalTab, borderBottom: activeTab === 'details' ? '2px solid #D4AF37' : 'none' }} onClick={() => setActiveTab('details')}>Details</button>
                </div>
                
                <div style={styles.modalTabContent}>
                  {activeTab === 'description' && <p>{selectedPerfume.description}</p>}
                  {activeTab === 'notes' && (
                    <div>
                      <div><strong>Top Notes:</strong> {selectedPerfume.notes.top.join(', ')}</div>
                      <div><strong>Heart Notes:</strong> {selectedPerfume.notes.heart.join(', ')}</div>
                      <div><strong>Base Notes:</strong> {selectedPerfume.notes.base.join(', ')}</div>
                    </div>
                  )}
                  {activeTab === 'details' && (
                    <div>
                      <div><strong>Perfumer:</strong> {selectedPerfume.perfumer}</div>
                      <div><strong>Concentration:</strong> {selectedPerfume.concentration}</div>
                      <div><strong>Longevity:</strong> {selectedPerfume.longevity}</div>
                      <div><strong>Size:</strong> {selectedPerfume.size}</div>
                      <div><strong>Year:</strong> {selectedPerfume.year}</div>
                    </div>
                  )}
                </div>
                
                <div style={styles.modalQuantity}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>-</button>
                  <span style={styles.qtyValue}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>+</button>
                </div>
                
                <button onClick={() => handleAddToCart(selectedPerfume)} style={styles.modalAddBtn}>ADD TO CART</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroContent} className="fade-up">
            <span style={styles.heroBadge}>LA COLLECTION PRIVÉE</span>
            <h1 style={styles.heroTitle}>Luxury <span style={styles.goldText}>Editions</span></h1>
            <p style={styles.heroSubtitle}>Discover our most exclusive creations, crafted for the discerning few</p>
            <div style={styles.heroStats}>
              <div><strong>6</strong><span>Exclusive Scents</span></div>
              <div><strong>28%</strong><span>Highest Concentration</span></div>
              <div><strong>15+</strong><span>Hours Longevity</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Limited Edition Banner */}
      <section style={styles.limitedBanner}>
        <div style={styles.limitedContent} className="fade-left">
          <span style={styles.limitedBadge}>HIGHLY EXCLUSIVE</span>
          <h2 style={styles.limitedTitle}>Limited Edition <span style={styles.goldText}>Collection</span></h2>
          <p style={styles.limitedText}>Only 500 bottles of each fragrance will ever be created. Each bottle is individually numbered and presented in a handcrafted wooden chest.</p>
          <button style={styles.limitedBtn}>VIEW COLLECTION →</button>
        </div>
        <div style={styles.limitedImage} className="fade-right">
          <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800" alt="Limited Edition" style={styles.limitedImg} />
        </div>
      </section>

      {/* Luxury Perfumes Grid */}
      <section style={styles.productsSection}>
        <div style={styles.sectionHeader} className="fade-up">
          <span style={styles.sectionTag}>THE COLLECTION</span>
          <h2 style={styles.sectionTitle}>Our <span style={styles.goldText}>Masterpieces</span></h2>
          <p style={styles.sectionSubtitle}>Each bottle tells a story of craftsmanship and passion</p>
        </div>
        <div style={styles.productsGrid}>
          {luxuryPerfumes.map((perfume, idx) => (
            <div key={perfume.id} style={styles.productCard} className="fade-up">
              <div style={styles.productImageWrapper}>
                <img src={perfume.image} alt={perfume.name} style={styles.productImage} />
                <div style={styles.productBadge}>{perfume.badge}</div>
                <div style={styles.productOverlay}>
                  <button onClick={() => handleQuickView(perfume)} style={styles.quickViewBtn}>Quick View</button>
                  <button onClick={() => dispatch(addToCart({ ...perfume, quantity: 1 }))} style={styles.quickAddBtn}>Add to Cart</button>
                </div>
              </div>
              <div style={styles.productInfo}>
                <span style={styles.productCollection}>{perfume.collection}</span>
                <h3 style={styles.productName}>{perfume.name}</h3>
                <div style={styles.productRating}>
                  <span style={styles.stars}>★</span>
                  <span>{perfume.rating}</span>
                  <span style={styles.reviews}>({perfume.reviews})</span>
                </div>
                <div style={styles.productPrice}>
                  <span style={styles.currentPrice}>${perfume.price}</span>
                  <span style={styles.oldPrice}>${perfume.oldPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers Carousel */}
      <section style={styles.bestSellersSection}>
        <div style={styles.sectionHeader} className="fade-up">
          <span style={styles.sectionTag}>CUSTOMER FAVORITES</span>
          <h2 style={styles.sectionTitle}>Best Selling <span style={styles.goldText}>Luxury Scents</span></h2>
        </div>
        <div style={styles.bestSellersGrid}>
          {bestSellers.map((perfume, idx) => (
            <div key={perfume.id} style={styles.bestSellerCard} className="fade-up">
              <img src={perfume.image} alt={perfume.name} style={styles.bestSellerImage} />
              <div style={styles.bestSellerInfo}>
                <h4>{perfume.name}</h4>
                <p>${perfume.price}</p>
                <button onClick={() => handleQuickView(perfume)} style={styles.bestSellerBtn}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gift Sets */}
      <section style={styles.giftSection}>
        <div style={styles.giftContent} className="fade-left">
          <span style={styles.giftBadge}>PERFECT GIFT</span>
          <h2 style={styles.giftTitle}>Luxury <span style={styles.goldText}>Gift Sets</span></h2>
          <p style={styles.giftText}>Presented in our signature leather cases, these curated sets make the perfect gift for the fragrance connoisseur.</p>
          <div style={styles.giftSets}>
            {giftSets.map(set => (
              <div key={set.id} style={styles.giftSetCard}>
                <img src={set.image} alt={set.name} style={styles.giftSetImage} />
                <div>
                  <h4>{set.name}</h4>
                  <p>{set.includes}</p>
                  <p style={styles.giftPrice}>${set.price}</p>
                </div>
              </div>
            ))}
          </div>
          <button style={styles.giftBtn}>SHOP GIFT SETS →</button>
        </div>
        <div className="fade-right" style={styles.giftImageWrapper}>
          <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=800" alt="Gift Set" style={styles.giftMainImage} />
        </div>
      </section>

      {/* Luxury Services */}
      <section style={styles.servicesSection}>
        <div style={styles.sectionHeader} className="fade-up">
          <span style={styles.sectionTag}>CONCIERGE SERVICES</span>
          <h2 style={styles.sectionTitle}>The <span style={styles.goldText}>SCENTIA Experience</span></h2>
        </div>
        <div style={styles.servicesGrid}>
          {luxuryServices.map((service, idx) => (
            <div key={idx} style={styles.serviceCard} className="fade-up">
              <div style={styles.serviceIcon}>{service.icon}</div>
              <h3 style={styles.serviceTitle}>{service.title}</h3>
              <p style={styles.serviceDesc}>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist Section */}
      <section style={styles.waitlistSection}>
        <div style={styles.waitlistContent} className="fade-up">
          <h2 style={styles.waitlistTitle}>Join the <span style={styles.goldText}>Waitlist</span></h2>
          <p style={styles.waitlistText}>Be the first to know about new luxury releases, exclusive previews, and private events.</p>
          <div style={styles.waitlistForm}>
            <input 
              type="email" 
              placeholder="Your email address" 
              style={styles.waitlistInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleNotify} style={styles.waitlistBtn}>NOTIFY ME</button>
          </div>
          <p style={styles.waitlistNote}>By subscribing, you agree to receive exclusive offers and updates.</p>
        </div>
      </section>

      {/* Style Injection */}
      <style>{`
        .fade-up { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .fade-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
        .fade-left.visible { opacity: 1; transform: translateX(0); }
        .fade-right { opacity: 0; transform: translateX(40px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
        .fade-right.visible { opacity: 1; transform: translateX(0); }
        
        .product-card:hover .product-overlay { opacity: 1; }
        .product-card:hover .product-image { transform: scale(1.05); }
        .service-card:hover { transform: translateY(-10px); }
        
        @media (max-width: 1200px) {
          .products-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .best-sellers-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        
        @media (max-width: 992px) {
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .limited-banner, .gift-section { grid-template-columns: 1fr !important; }
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        
        @media (max-width: 768px) {
          .products-grid { grid-template-columns: 1fr !important; }
          .best-sellers-grid { grid-template-columns: 1fr !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .hero-stats { flex-direction: column; gap: 1rem; }
          .modal-grid { grid-template-columns: 1fr !important; }
          .gift-sets { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: { width: '100%', overflowX: 'hidden', backgroundColor: '#050505' },
  
  toast: { position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#D4AF37', color: '#000', padding: '12px 24px', borderRadius: '8px', zIndex: 2001, transition: 'all 0.3s ease', fontWeight: '600' },
  
  // Hero Section
  hero: { height: '90vh', position: 'relative', backgroundImage: 'url("https://images.unsplash.com/photo-1583522684482-2813bc314630?w=1600")', backgroundSize: 'cover', backgroundPosition: 'center' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroContent: { textAlign: 'center', maxWidth: '900px', padding: '2rem' },
  heroBadge: { color: '#D4AF37', letterSpacing: '4px', fontSize: '0.8rem', display: 'block', marginBottom: '1rem' },
  heroTitle: { fontSize: '4.5rem', fontWeight: '800', marginBottom: '1rem', color: '#fff', fontFamily: "'Playfair Display', serif" },
  goldText: { color: '#D4AF37' },
  heroSubtitle: { fontSize: '1.2rem', marginBottom: '3rem', color: '#ccc' },
  heroStats: { display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '2rem' },
  
  // Limited Banner
  limitedBanner: { display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#0A0A0A', minHeight: '500px' },
  limitedContent: { padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  limitedBadge: { color: '#D4AF37', letterSpacing: '3px', fontSize: '0.8rem', marginBottom: '1rem' },
  limitedTitle: { fontSize: '2.5rem', marginBottom: '1rem', fontFamily: "'Playfair Display', serif", color: '#fff' },
  limitedText: { color: '#aaa', lineHeight: '1.8', marginBottom: '2rem' },
  limitedBtn: { padding: '12px 28px', backgroundColor: 'transparent', border: '2px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', fontWeight: '600', width: 'fit-content' },
  limitedImage: { overflow: 'hidden' },
  limitedImg: { width: '100%', height: '100%', objectFit: 'cover' },
  
  // Products Section
  productsSection: { padding: '5rem 5%', backgroundColor: '#050505' },
  sectionHeader: { textAlign: 'center', marginBottom: '3rem' },
  sectionTag: { color: '#D4AF37', letterSpacing: '3px', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' },
  sectionTitle: { fontSize: '2.5rem', fontWeight: '700', fontFamily: "'Playfair Display', serif", color: '#fff' },
  sectionSubtitle: { color: '#aaa', marginTop: '0.5rem' },
  productsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' },
  
  productCard: { backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.3s' },
  productImageWrapper: { position: 'relative', overflow: 'hidden', height: '400px' },
  productImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' },
  productBadge: { position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#D4AF37', color: '#000', padding: '5px 12px', fontSize: '0.75rem', fontWeight: '600', borderRadius: '20px', zIndex: 2 },
  productOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', opacity: 0, transition: '0.3s', zIndex: 3 },
  quickViewBtn: { padding: '10px 20px', backgroundColor: 'transparent', border: '2px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', fontWeight: '600' },
  quickAddBtn: { padding: '10px 20px', backgroundColor: '#D4AF37', border: 'none', cursor: 'pointer', fontWeight: '600' },
  productInfo: { padding: '1.5rem' },
  productCollection: { color: '#D4AF37', fontSize: '0.7rem', letterSpacing: '2px' },
  productName: { fontSize: '1.2rem', margin: '8px 0', color: '#fff' },
  productRating: { display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' },
  stars: { color: '#D4AF37' },
  reviews: { color: '#666', fontSize: '0.8rem' },
  productPrice: { display: 'flex', alignItems: 'center', gap: '10px' },
  currentPrice: { color: '#D4AF37', fontSize: '1.2rem', fontWeight: '600' },
  oldPrice: { textDecoration: 'line-through', color: '#666', fontSize: '0.9rem' },
  
  // Best Sellers
  bestSellersSection: { padding: '5rem 5%', backgroundColor: '#0A0A0A' },
  bestSellersGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', maxWidth: '1000px', margin: '0 auto' },
  bestSellerCard: { display: 'flex', backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.3s' },
  bestSellerImage: { width: '150px', height: '150px', objectFit: 'cover' },
  bestSellerInfo: { padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  bestSellerBtn: { marginTop: '0.5rem', padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer' },
  
  // Gift Section
  giftSection: { display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#050505', minHeight: '600px' },
  giftContent: { padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  giftBadge: { color: '#D4AF37', letterSpacing: '3px', fontSize: '0.8rem', marginBottom: '1rem' },
  giftTitle: { fontSize: '2.5rem', marginBottom: '1rem', fontFamily: "'Playfair Display', serif", color: '#fff' },
  giftText: { color: '#aaa', lineHeight: '1.8', marginBottom: '2rem' },
  giftSets: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' },
  giftSetCard: { display: 'flex', gap: '1rem', backgroundColor: '#111', padding: '1rem', borderRadius: '8px' },
  giftSetImage: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' },
  giftPrice: { color: '#D4AF37', fontWeight: '600' },
  giftBtn: { padding: '12px 28px', backgroundColor: '#D4AF37', color: '#000', border: 'none', cursor: 'pointer', fontWeight: '600', width: 'fit-content' },
  giftImageWrapper: { overflow: 'hidden' },
  giftMainImage: { width: '100%', height: '100%', objectFit: 'cover' },
  
  // Services
  servicesSection: { padding: '5rem 5%', backgroundColor: '#0A0A0A' },
  servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' },
  serviceCard: { backgroundColor: '#111', padding: '2rem', borderRadius: '12px', textAlign: 'center', transition: 'transform 0.3s', border: '1px solid rgba(212,175,55,0.1)' },
  serviceIcon: { fontSize: '3rem', marginBottom: '1rem' },
  serviceTitle: { fontSize: '1.2rem', marginBottom: '0.5rem', color: '#D4AF37' },
  serviceDesc: { color: '#aaa', lineHeight: '1.6' },
  
  // Waitlist
  waitlistSection: { padding: '5rem 5%', background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)' },
  waitlistContent: { textAlign: 'center', maxWidth: '600px', margin: '0 auto' },
  waitlistTitle: { fontSize: '2.5rem', marginBottom: '1rem', fontFamily: "'Playfair Display', serif", color: '#fff' },
  waitlistText: { color: '#aaa', marginBottom: '2rem' },
  waitlistForm: { display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', justifyContent: 'center' },
  waitlistInput: { flex: 1, minWidth: '250px', padding: '14px 20px', backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none' },
  waitlistBtn: { padding: '14px 32px', backgroundColor: '#D4AF37', color: '#000', border: 'none', cursor: 'pointer', fontWeight: '600', borderRadius: '8px' },
  waitlistNote: { fontSize: '0.7rem', color: '#666' },
  
  // Modal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { backgroundColor: '#1A1A1A', borderRadius: '16px', maxWidth: '1000px', width: '90%', maxHeight: '90vh', overflow: 'auto', position: 'relative' },
  modalClose: { position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 },
  modalGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem' },
  modalImage: { width: '100%', height: '500px', objectFit: 'cover', borderRadius: '12px' },
  modalCollection: { color: '#D4AF37', fontSize: '0.8rem', letterSpacing: '2px' },
  modalTitle: { fontSize: '2rem', margin: '10px 0', color: '#fff' },
  modalPrice: { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' },
  modalCurrent: { fontSize: '1.8rem', color: '#D4AF37', fontWeight: '700' },
  modalOld: { fontSize: '1.2rem', color: '#666', textDecoration: 'line-through' },
  modalTabs: { display: 'flex', gap: '2rem', borderBottom: '1px solid #333', marginBottom: '1rem' },
  modalTab: { background: 'none', border: 'none', color: '#fff', padding: '10px 0', cursor: 'pointer', fontSize: '1rem' },
  modalTabContent: { padding: '1rem 0', color: '#aaa', lineHeight: '1.8' },
  modalQuantity: { display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' },
  qtyBtn: { padding: '10px 15px', backgroundColor: '#333', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' },
  qtyValue: { fontSize: '1.2rem', minWidth: '40px', textAlign: 'center' },
  modalAddBtn: { width: '100%', padding: '14px', backgroundColor: '#D4AF37', color: '#000', border: 'none', fontWeight: '700', cursor: 'pointer', borderRadius: '8px', fontSize: '1rem' }
};

export default LuxuryEdition;