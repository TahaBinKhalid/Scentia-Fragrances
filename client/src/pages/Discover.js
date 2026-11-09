import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Discover = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Carousel images data
  const carouselImages = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1600",
      title: "Artisan Perfumery",
      subtitle: "Handcrafted in Grasse, France"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1600",
      title: "Rare Ingredients",
      subtitle: "Sourced from around the globe"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1600",
      title: "Timeless Elegance",
      subtitle: "A signature for every personality"
    }
  ];

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Intersection Observer for animations
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

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const offers = [
    { id: 1, title: "First Purchase", discount: "20% OFF", code: "WELCOME20", description: "On your first order over $100", icon: "🎁" },
    { id: 2, title: "Referral Program", discount: "$50 CREDIT", code: "REFER50", description: "Refer a friend and get $50", icon: "👥" },
    { id: 3, title: "Birthday Month", discount: "25% OFF", code: "BDAY25", description: "Celebrate with exclusive discount", icon: "🎂" },
    { id: 4, title: "Free Shipping", discount: "FREE DELIVERY", code: "SHIPFREE", description: "On orders over $150", icon: "🚚" },
    { id: 5, title: "Student Discount", discount: "15% OFF", code: "STUDENT15", description: "Verify with student email", icon: "🎓" }
  ];

  const specialFeatures = [
    { icon: "🌿", title: "Sustainable Sourcing", description: "100% ethically sourced ingredients from sustainable farms worldwide" },
    { icon: "👃", title: "Master Perfumers", description: "Created by award-winning noses with decades of expertise" },
    { icon: "✨", title: "24K Gold Details", description: "Hand-finished bottles with genuine gold leaf accents" },
    { icon: "🔬", title: "Skin-Friendly", description: "Dermatologically tested, alcohol-free options available" },
    { icon: "♻️", title: "Eco-Luxury", description: "Refillable bottles and carbon-neutral shipping" },
    { icon: "🏆", title: "Award-Winning", description: "Recognized at International Fragrance Awards" }
  ];

  const handleLogin = () => {
    // Add your login logic here
    console.log("Login with:", email, password);
    setShowLogin(false);
  };

  const handleSignup = () => {
    // Add your signup logic here
    console.log("Signup with:", name, email, password);
    setShowSignup(false);
  };

  return (
    <div style={styles.container}>
      
      {/* Login/Signup Modal */}
      {(showLogin || showSignup) && (
        <div style={styles.modalOverlay} onClick={() => { setShowLogin(false); setShowSignup(false); }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => { setShowLogin(false); setShowSignup(false); }}>✕</button>
            
            {showLogin && (
              <div>
                <h2 style={styles.modalTitle}>Welcome Back</h2>
                <input 
                  type="email" 
                  placeholder="Email" 
                  style={styles.modalInput} 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  style={styles.modalInput} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <button onClick={handleLogin} style={styles.modalBtn}>Login</button>
                <p style={styles.modalText}>Don't have an account? <span style={styles.modalLink} onClick={() => { setShowLogin(false); setShowSignup(true); }}>Sign up</span></p>
              </div>
            )}
            
            {showSignup && (
              <div>
                <h2 style={styles.modalTitle}>Create Account</h2>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  style={styles.modalInput} 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
                <input 
                  type="email" 
                  placeholder="Email" 
                  style={styles.modalInput} 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  style={styles.modalInput} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <button onClick={handleSignup} style={styles.modalBtn}>Sign Up</button>
                <p style={styles.modalText}>Already have an account? <span style={styles.modalLink} onClick={() => { setShowSignup(false); setShowLogin(true); }}>Login</span></p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1. FULL SCREEN JUMBOTRON */}
      <section style={styles.jumbotron}>
        <div style={styles.jumbotronOverlay}>
          <div style={styles.jumbotronContent} className="fade-up">
            <span style={styles.jumbotronBadge}>DISCOVER SCENTIA</span>
            <h1 style={styles.jumbotronTitle}>The Art of <span style={styles.goldText}>Olfactory Excellence</span></h1>
            <p style={styles.jumbotronSubtitle}>Journey into a world where luxury meets craftsmanship, and every fragrance tells a unique story.</p>
            <div style={styles.jumbotronButtons}>
              <button onClick={() => navigate('/products')} style={styles.primaryBtn}>EXPLORE FRAGRANCES</button>
              <button onClick={() => setShowSignup(true)} style={styles.secondaryBtn}>JOIN THE COMMUNITY</button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DESCRIPTION + VIDEO SIDE BY SIDE */}
      <section style={styles.descriptionSection}>
        <div className="fade-left" style={styles.descriptionContent}>
          <span style={styles.sectionTag}>OUR STORY</span>
          <h2 style={styles.descriptionTitle}>A Legacy of <span style={styles.goldText}>Fragrance</span></h2>
          <p style={styles.descriptionText}>
            Founded in the heart of Paris in 2024, SCENTIA represents the pinnacle of perfumery artistry. 
            Our master perfumers combine centuries-old techniques with modern innovation to create scents 
            that transcend time and trends.
          </p>
          <p style={styles.descriptionText}>
            Each fragrance is a journey — from the sun-drenched fields of Grasse to the sophisticated 
            boulevards of Paris. We believe that perfume is not just an accessory, but an extension of 
            one's identity, a silent signature that speaks before you do.
          </p>
          <div style={styles.descriptionStats}>
            <div><strong>50+</strong><span>Exclusive Scents</span></div>
            <div><strong>15+</strong><span>Countries Sourced</span></div>
            <div><strong>10K+</strong><span>Happy Customers</span></div>
          </div>
        </div>
        <div className="fade-right" style={styles.videoWrapper}>
          <video autoPlay loop muted playsInline style={styles.videoBg}>
  <source src="/videos/cinematic-product-showcase-of-three-perfume-bottle.mp4" type="video/mp4" />
</video>
          
          <div style={styles.videoCaption}>The making of SCENTIA — Artistry in every drop</div>
        </div>
      </section>

      {/* 3. FULL SCREEN IMAGE CAROUSEL */}
      <section style={styles.carouselSection}>
        <div style={styles.carouselContainer}>
          {carouselImages.map((slide, index) => (
            <div
              key={slide.id}
              style={{
                ...styles.carouselSlide,
                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%), url(${slide.image})`,
                opacity: currentSlide === index ? 1 : 0,
                visibility: currentSlide === index ? 'visible' : 'hidden',
              }}
            >
              <div style={styles.carouselContent}>
                <h2 style={styles.carouselTitle}>{slide.title}</h2>
                <p style={styles.carouselSubtitle}>{slide.subtitle}</p>
              </div>
            </div>
          ))}
          
          {/* Carousel Controls */}
          <button style={{ ...styles.carouselArrow, left: '20px' }} onClick={prevSlide}>‹</button>
          <button style={{ ...styles.carouselArrow, right: '20px' }} onClick={nextSlide}>›</button>
          
          {/* Carousel Dots */}
          <div style={styles.carouselDots}>
            {carouselImages.map((_, idx) => (
              <button
                key={idx}
                style={{ ...styles.carouselDot, backgroundColor: currentSlide === idx ? '#D4AF37' : 'rgba(255,255,255,0.5)' }}
                onClick={() => goToSlide(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHAT MAKES THIS BRAND SPECIAL */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader} className="fade-up">
          <span style={styles.sectionTag}>WHY CHOOSE US</span>
          <h2 style={styles.sectionTitle}>What Makes <span style={styles.goldText}>SCENTIA Special</span></h2>
          <p style={styles.sectionSubtitle}>Discover the pillars of our excellence</p>
        </div>
        <div style={styles.featuresGrid}>
          {specialFeatures.map((feature, idx) => (
            <div key={idx} style={styles.featureCard} className="fade-up">
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EXCLUSIVE OFFERS */}
      <section style={styles.offersSection}>
        <div style={styles.sectionHeader} className="fade-up">
          <span style={styles.sectionTag}>EXCLUSIVE DEALS</span>
          <h2 style={styles.sectionTitle}>Limited Time <span style={styles.goldText}>Offers</span></h2>
        </div>
        <div style={styles.offersGrid}>
          {offers.map((offer, idx) => (
            <div key={offer.id} style={styles.offerCard} className="fade-up">
              <div style={styles.offerIcon}>{offer.icon}</div>
              <h3 style={styles.offerTitle}>{offer.title}</h3>
              <div style={styles.offerDiscount}>{offer.discount}</div>
              <p style={styles.offerDescription}>{offer.description}</p>
              <div style={styles.offerCodeBox}>
                <span style={styles.offerCodeLabel}>CODE:</span>
                <span style={styles.offerCode}>{offer.code}</span>
              </div>
              <button onClick={() => navigate('/products')} style={styles.offerBtn}>SHOP NOW →</button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent} className="fade-up">
          <h2 style={styles.ctaTitle}>Ready to Find Your Signature Scent?</h2>
          <p style={styles.ctaText}>Join thousands of fragrance enthusiasts who have discovered their perfect match.</p>
          <div style={styles.ctaButtons}>
            <button onClick={() => navigate('/products')} style={styles.ctaPrimaryBtn}>SHOP NOW</button>
            <button onClick={() => setShowSignup(true)} style={styles.ctaSecondaryBtn}>SIGN UP FOR UPDATES</button>
          </div>
        </div>
      </section>

      {/* Global Styles Injection */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-up {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .fade-left {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .fade-left.visible {
          opacity: 1;
          transform: translateX(0);
        }
        
        .fade-right {
          opacity: 0;
          transform: translateX(40px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .fade-right.visible {
          opacity: 1;
          transform: translateX(0);
        }
        
        @media (max-width: 968px) {
          .description-section {
            grid-template-columns: 1fr !important;
          }
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .offers-grid {
            grid-template-columns: 1fr !important;
          }
          .jumbotron-title {
            font-size: 2.5rem !important;
          }
        }
        
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr !important;
          }
          .description-stats {
            flex-direction: column;
            gap: 1rem;
          }
          .cta-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: { width: '100%', overflowX: 'hidden', backgroundColor: '#050505' },
  
  // Jumbotron
  jumbotron: { height: '100vh', position: 'relative', backgroundImage: 'url("https://images.unsplash.com/photo-1583522684482-2813bc314630?w=1600")', backgroundSize: 'cover', backgroundPosition: 'center' },
  jumbotronOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  jumbotronContent: { textAlign: 'center', maxWidth: '900px', padding: '2rem' },
  jumbotronBadge: { color: '#D4AF37', letterSpacing: '4px', fontSize: '0.8rem', display: 'block', marginBottom: '1rem' },
  jumbotronTitle: { fontSize: '4rem', fontWeight: '800', marginBottom: '1rem', color: '#fff', fontFamily: "'Playfair Display', serif" },
  goldText: { color: '#D4AF37' },
  jumbotronSubtitle: { fontSize: '1.2rem', marginBottom: '2rem', color: '#ccc' },
  jumbotronButtons: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: { padding: '14px 32px', backgroundColor: '#D4AF37', color: '#000', border: 'none', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s' },
  secondaryBtn: { padding: '14px 32px', backgroundColor: 'transparent', border: '2px solid #fff', color: '#fff', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s' },
  
  // Modal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { backgroundColor: '#1A1A1A', padding: '2rem', borderRadius: '12px', maxWidth: '400px', width: '90%', position: 'relative', border: '1px solid rgba(212,175,55,0.3)' },
  modalClose: { position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' },
  modalTitle: { fontSize: '1.8rem', marginBottom: '1.5rem', color: '#D4AF37', textAlign: 'center' },
  modalInput: { width: '100%', padding: '12px', marginBottom: '1rem', backgroundColor: '#050505', border: '1px solid #333', color: '#fff', borderRadius: '4px', outline: 'none' },
  modalBtn: { width: '100%', padding: '12px', backgroundColor: '#D4AF37', color: '#000', border: 'none', fontWeight: '600', cursor: 'pointer', borderRadius: '4px' },
  modalText: { textAlign: 'center', marginTop: '1rem', color: '#888' },
  modalLink: { color: '#D4AF37', cursor: 'pointer', textDecoration: 'underline' },
  
  // Description Section
  descriptionSection: { display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '600px', backgroundColor: '#0A0A0A' },
  descriptionContent: { padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  sectionTag: { color: '#D4AF37', letterSpacing: '3px', fontSize: '0.8rem', marginBottom: '1rem' },
  descriptionTitle: { fontSize: '2.5rem', marginBottom: '1.5rem', fontFamily: "'Playfair Display', serif", color: '#fff' },
  descriptionText: { color: '#aaa', lineHeight: '1.8', marginBottom: '1rem' },
  descriptionStats: { display: 'flex', gap: '2rem', marginTop: '2rem' },
  videoWrapper: { position: 'relative', overflow: 'hidden', height: '100%' },
  videoPlayer: { width: '100%', height: '100%', objectFit: 'cover' },
  videoCaption: { position: 'absolute', bottom: '20px', left: '20px', color: '#fff', backgroundColor: 'rgba(0,0,0,0.6)', padding: '5px 10px', fontSize: '0.8rem' },
  
  // Carousel
  carouselSection: { height: '80vh', position: 'relative' },
  carouselContainer: { position: 'relative', height: '100%', overflow: 'hidden' },
  carouselSlide: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'opacity 0.8s ease-in-out', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  carouselContent: { textAlign: 'center', color: '#fff', padding: '2rem' },
  carouselTitle: { fontSize: '3rem', fontWeight: '700', marginBottom: '1rem', fontFamily: "'Playfair Display', serif" },
  carouselSubtitle: { fontSize: '1.2rem' },
  carouselArrow: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', fontSize: '2rem', padding: '10px 20px', cursor: 'pointer', borderRadius: '50%', transition: 'all 0.3s', zIndex: 10 },
  carouselDots: { position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', zIndex: 10 },
  carouselDot: { width: '10px', height: '10px', borderRadius: '50%', border: 'none', cursor: 'pointer', transition: 'all 0.3s' },
  
  // Features
  featuresSection: { padding: '5rem 5%', backgroundColor: '#050505' },
  sectionHeader: { textAlign: 'center', marginBottom: '3rem' },
  sectionTitle: { fontSize: '2.5rem', fontWeight: '700', fontFamily: "'Playfair Display', serif", color: '#fff' },
  sectionSubtitle: { color: '#aaa', marginTop: '0.5rem' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' },
  featureCard: { backgroundColor: '#111', padding: '2rem', borderRadius: '12px', textAlign: 'center', transition: 'transform 0.3s', border: '1px solid rgba(212,175,55,0.1)' },
  featureIcon: { fontSize: '3rem', marginBottom: '1rem' },
  featureTitle: { fontSize: '1.3rem', marginBottom: '1rem', color: '#D4AF37' },
  featureDescription: { color: '#aaa', lineHeight: '1.6' },
  
  // Offers
  offersSection: { padding: '5rem 5%', backgroundColor: '#0A0A0A' },
  offersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' },
  offerCard: { backgroundColor: '#111', padding: '2rem', borderRadius: '12px', textAlign: 'center', transition: 'all 0.3s', border: '1px solid rgba(212,175,55,0.1)' },
  offerIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
  offerTitle: { fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' },
  offerDiscount: { fontSize: '1.8rem', fontWeight: '700', color: '#D4AF37', marginBottom: '0.5rem' },
  offerDescription: { color: '#aaa', marginBottom: '1rem' },
  offerCodeBox: { backgroundColor: 'rgba(212,175,55,0.1)', padding: '8px', borderRadius: '6px', marginBottom: '1.5rem' },
  offerCodeLabel: { fontSize: '0.7rem', color: '#D4AF37', marginRight: '5px' },
  offerCode: { fontWeight: '600', color: '#D4AF37' },
  offerBtn: { padding: '10px 20px', backgroundColor: 'transparent', border: '2px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' },
  
  // CTA
  ctaSection: { padding: '5rem 5%', background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)', borderTop: '1px solid rgba(212,175,55,0.2)', borderBottom: '1px solid rgba(212,175,55,0.2)' },
  ctaContent: { textAlign: 'center', maxWidth: '800px', margin: '0 auto' },
  ctaTitle: { fontSize: '2.5rem', marginBottom: '1rem', color: '#fff', fontFamily: "'Playfair Display', serif" },
  ctaText: { color: '#aaa', marginBottom: '2rem' },
  ctaButtons: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  ctaPrimaryBtn: { padding: '14px 32px', backgroundColor: '#D4AF37', color: '#000', border: 'none', fontWeight: '700', cursor: 'pointer' },
  ctaSecondaryBtn: { padding: '14px 32px', backgroundColor: 'transparent', border: '2px solid #D4AF37', color: '#D4AF37', fontWeight: '700', cursor: 'pointer' }
};

export default Discover;