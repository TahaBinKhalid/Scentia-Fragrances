// import React, { useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { addToCart } from '../redux/cartSlice';



// const Home = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const scrollRef = useRef(null);

//   // Modern Intersection Observer for optimized fading on i5
//   useEffect(() => {
//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         entry.target.classList.add('visible');
//       }
//     });
//   }, { threshold: 0.1 }); // Trigger when 10% is visible

//   // Make sure it's selecting the right class
//   document.querySelectorAll('.fade-scroll, .story-img-reveal').forEach(el => observer.observe(el));
  
//   return () => observer.disconnect();
// }, []);

//   const scrollCategories = (direction) => {
//     if (scrollRef.current) {
//       const amount = direction === 'left' ? -400 : 400;
//       scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
//     }
//   };

//   return (
//     <div style={styles.page}>
      
//       {/* 1. CINEMATIC HERO VIDEO */}
//       <section style={styles.hero}>
//         <video autoPlay loop muted playsInline style={styles.videoBg}>
//           <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4" />
//         </video>
//         <div style={styles.heroOverlay}>
//           <div className="fade-scroll" style={styles.heroContent}>
//             <span style={styles.heroTag}>EST. 2026 / PARIS</span>
//             <h1 style={styles.heroTitle}>BE YOUR OWN <span style={styles.goldText}>SIGNATURE</span></h1>
//             <p style={styles.heroSubtitle}>Sophistication in every note. Discover olfactory excellence.</p>
//             <div style={styles.heroBtns}>
//               <button onClick={() => navigate('/products')} style={styles.btnWhite}>SHOP MEN</button>
//               <button onClick={() => navigate('/products')} style={styles.btnWhite}>SHOP WOMEN</button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 2. THE MOMENT SCROLLER (HORIZONTAL) */}
//       <section style={styles.sectionPadding}>
//         <div style={styles.sectionHeader} className="fade-scroll">
//           <h2 style={styles.sectionTitle}>SHOP BY MOMENT</h2>
//           <div style={styles.controls}>
//             <button onClick={() => scrollCategories('left')} style={styles.circleBtn}>←</button>
//             <button onClick={() => scrollCategories('right')} style={styles.circleBtn}>→</button>
//           </div>
//         </div>
//         <div ref={scrollRef} className="no-scrollbar" style={styles.categoryScroll}>
//           {[
//             { name: "Date Night", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000" },
//             { name: "The Boardroom", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
//             { name: "Weekend Escape", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600" },
//             { name: "Gala & Formal", img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600" },
//             { name: "Gym & Sport", img: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=600" }
//           ].map((cat, i) => (
//             <div key={i} className="moment-card" style={styles.catCard}>
//               <img src={cat.img} alt={cat.name} style={styles.catImg} />
//               <div style={styles.catLabel}>{cat.name}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//      {/* 3. BRAND STORY (EDITORIAL LAYOUT) */}
// <section style={styles.storySection}>
//   <div className="fade-scroll story-content-wrapper" style={styles.storyContent}>
//       <span style={styles.storyTag}>THE ESSENCE</span>
//       <h2 style={styles.storyTitle}>OLFACTORY CRAFTSMANSHIP</h2>
//       <div style={styles.storyText}>
//           <p>Founded in the heart of Paris, SCENTIA is more than a perfume house; it is a philosophy of silent declaration. Our nose, Élisabeth Dupré, spent years sourcing the rarest oils in Grasse, creating compositions that don't just fade, but evolve.</p>
//           <p>Each bottle is a testament to confidence, hand-finished with 24k gold leaf and curated for those who understand that true power doesn't shout. It lingers.</p>
//       </div>
//       <button style={styles.textActionBtn} onClick={() => navigate('/discover')}>OUR HERITAGE →</button>
//   </div>
  
//   {/* --- UPDATED REVEAL WRAPPER & IMAGE JSX --- */}
//   <div className="story-img-reveal" style={styles.storyImgWrapper}>
//       <img 
//         src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000" 
//         alt="Scentia Story" 
//         style={{
//           ...styles.storyImg, 
//           paddingBlockEnd: '47px', /* New Padding on the image itself */
//           backgroundColor: '#111' /* Optional: Matches card bg if preferred, or leave transparent */
//         }} 
//       />
//   </div>
// </section>

//       {/* 4. THREE-IMAGE EDITORIAL CAROUSEL */}
//       <section style={styles.carouselSection} className="fade-scroll">
//         <div style={styles.editorialGrid}>
//           {[
//             { tag: "PRIVÉE EDITION", name: "Amber Nuit", img: "https://images.unsplash.com/photo-1590736961148-8b7cb9e6de55?w=800" },
//             { tag: "MEN'S COLLECTION", name: "Executive Oud", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800" },
//             { tag: "SUMMER HEIRLOOMS", name: "Azure Bloom", img: "https://images.unsplash.com/photo-1615485242231-f92606550974?w=800" }
//           ].map((item, i) => (
//             <div key={i} className="editorial-card" style={styles.edCard}>
//               <div className="img-scale-wrapper" style={styles.edImgWrapper}>
//                   <img src={item.img} alt={item.name} style={styles.edImg} />
//               </div>
//               <div style={styles.edInfo}>
//                 <span style={styles.edTag}>{item.tag}</span>
//                 <h3 style={styles.edTitle}>{item.name}</h3>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 5. FEATURED (SIGNATURE LINE) */}
//       <section style={styles.sectionBgPadding}>
//         <div className="fade-scroll" style={styles.centeredHeader}>
//             <span style={styles.momentTag}>CURATED FOR YOU</span>
//             <h2 style={styles.sectionTitleBold}>THE SIGNATURE LINE</h2>
//         </div>
//         <div style={styles.bossGrid}>
//           {[
//             { id: 1, name: "Noir Intense", price: 290, brand: "SCENTIA", img: "https://images.unsplash.com/photo-1583522684482-2813bc314630?w=800" },
//             { id: 2, name: "Oud Gold", price: 340, brand: "SCENTIA", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800" },
//             { id: 3, name: "Rose Royale", price: 310, brand: "SCENTIA", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800" },
//             { id: 4, name: "Velvet Hour", price: 280, brand: "SCENTIA", img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800" }
//           ].map((p) => (
//             <div key={p.id} className="fade-scroll product-card" style={styles.productCard}>
//               <div className="img-box" style={styles.productImgBox}>
//                 <img src={p.img} alt={p.name} style={styles.productImg} onError={(e) => {e.target.src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800"}} />
//                 <button onClick={() => dispatch(addToCart(p))} style={styles.quickAddBtn}>ADD TO BAG</button>
//               </div>
//               <div style={styles.productInfo}>
//                 <span style={styles.momentTag}>{p.brand}</span>
//                 <h3 style={styles.pName}>{p.name}</h3>
//                 <p style={styles.pPrice}>${p.price}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 6. SECONDARY VIDEO (THE MAKING OF) */}
//       <section style={styles.videoSection} className="fade-scroll">
//         <video autoPlay loop muted playsInline style={styles.videoBgSmall}>
//           <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4" /> {/* Standard fallback */}
//         </video>
//         <div style={styles.overlaySmall}>
//             <div style={styles.videoContent}>
//                 <h2 style={styles.videoTitle}>THE ART OF ESSENCE</h2>
//                 <p style={styles.videoDesc}>Experience the precision behind every composition in our Grasse ateliers.</p>
//                 <button style={styles.btnOutlineWhite}>WATCH THE JOURNEY</button>
//             </div>
//         </div>
//       </section>

//       {/* 7. MASSIVE FOOTER */}
//       <footer style={styles.footer}>
//         <div style={styles.footerGrid}>
//           {/* Brand Info */}
//           <div style={styles.footerColumnLarge}>
//             <h3 style={styles.fLogo}>SCENTIA</h3>
//             <p style={styles.fText}>Olfactory excellence from Paris since 2026. Defining luxury one scent at a time.</p>
//             <p style={styles.fContact}>support@scentia.fr / +33 1 45 67 89 12</p>
//             <div style={styles.socialIconsGrid}>
//                 <span>Instagram</span> <span>Facebook</span> <span>YouTube</span> <span>X</span>
//             </div>
//           </div>
          
//           {/* Detailed Links */}
//           <div style={styles.footerColumn}>
//             <h4 style={styles.fHeading}>COLLECTIONS</h4>
//             {["Noir Series", "Privée Ed.", "Summer Heirlooms", "Body & Home"].map(link => (
//                 <span key={link} className="footer-link" style={styles.fLink}>{link}</span>
//             ))}
//           </div>

//           <div style={styles.footerColumn}>
//             <h4 style={styles.fHeading}>CLIENT CARE</h4>
//             {["Track Order", "Returns", "Size Guide", "Store Locator", "FAQ"].map(link => (
//                 <span key={link} className="footer-link" style={styles.fLink}>{link}</span>
//             ))}
//           </div>

//           {/* Newsletter */}
//           <div style={styles.footerColumn}>
//             <h4 style={styles.fHeading}>NEWSLETTER</h4>
//             <p style={styles.fTextSmall}>Join the elite for exclusive launches.</p>
//             <div style={styles.subscribeBox}>
//                 <input type="email" placeholder="Your Email Address" style={styles.input} />
//                 <button style={styles.btnSmallGold}>JOIN</button>
//             </div>
//           </div>
//         </div>
        
//         {/* Fine Print */}
//         <div style={styles.footerBottom}>
//           <p>© 2026 SCENTIA PARFUMS INTERNATIONAL. Paris / London / Tokyo. ALL RIGHTS RESERVED.</p>
//           <p style={styles.fContact}>Terms of Use / Privacy Policy / Cookie Settings</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// const styles = {
//   page: { backgroundColor: '#050505', color: '#fff', overflowX: 'hidden', fontFamily: "Helvetica, sans-serif" },
  
//   // Video Hero
//   hero: { height: '100vh', position: 'relative', width: '100%', overflow: 'hidden' },
//   videoBg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 },
//   heroOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8%' },
//   heroContent: { textAlign: 'center', maxWidth: '1000px' },
//   heroTag: { color: '#D4AF37', letterSpacing: '5px', fontSize: '0.8rem' },
//   heroTitle: { color: '#fff', fontSize: '6rem', fontWeight: '900', fontFamily: 'Impact, sans-serif', margin: '15px 0', textTransform: 'uppercase', letterSpacing: '-2px' },
//   goldText: { color: '#D4AF37' },
//   heroSubtitle: { color: '#ccc', fontSize: '1.2rem', fontWeight: '300', maxWidth: '600px', margin: '1.5rem auto 3rem auto' },
//   heroBtns: { display: 'flex', gap: '20px', justifyContent: 'center' },
//   btnWhite: { padding: '16px 45px', backgroundColor: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '2px' },

//   sectionPadding: { padding: '8rem 5%' },
//   sectionBgPadding: { padding: '8rem 5%', backgroundColor: '#000' },
//   sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' },
//   sectionTitle: { fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase' },
//   centeredHeader: { textAlign: 'center', marginBottom: '5rem' },
//   sectionTitleBold: { fontSize: '3rem', fontWeight: '900', textTransform: 'uppercase', fontFamily: "'Playfair Display', serif", letterSpacing: '-1px' },
  
//   // Controls
//   controls: { display: 'flex', gap: '15px' },
//   circleBtn: { background: '#111', border: '1px solid #333', color: '#D4AF37', padding: '10px 15px', cursor: 'pointer', borderRadius: '4px' },
  
//   // Category Scroll
//   categoryScroll: { display: 'flex', gap: '25px', overflowX: 'auto', paddingBottom: '30px' },
//   catCard: { flex: '0 0 320px', height: '450px', position: 'relative', cursor: 'pointer', overflow: 'hidden', borderRadius: '4px' },
//   catImg: { width: '100%', height: '100%', objectFit: 'cover', transition: '1s transform cubic-bezier(0,0,0,1)' },
//   catLabel: { position: 'absolute', bottom: '25px', left: '25px', color: '#fff', fontSize: '1.4rem', fontWeight: 'bold' },

//   // Story Section
//   storySection: { display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', backgroundColor: '#0A0A0A', alignItems: 'center' },
//   storyContent: { padding: '10%', textAlign: 'left' },
//   storyTag: { fontSize: '0.8rem', letterSpacing: '4px', color: '#D4AF37', textTransform: 'uppercase' },
//   storyTitle: { fontSize: '3.5rem', fontWeight: '900', margin: '1.5rem 0', textTransform: 'uppercase', fontFamily: "Impact, sans-serif" },
//   storyText: { fontSize: '1.1rem', color: '#AAA', lineHeight: '1.8', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '15px' },
//   textActionBtn: { background: 'none', border: 'none', color: '#fff', textDecoration: 'underline', cursor: 'pointer', letterSpacing: '2px', marginTop: '2.5rem', fontSize: '1rem' },
//   storyImgWrapper: { height: '800px' },
//   storyImg: { width: '100%', height: '100%', objectFit: 'cover' },

//   // Editorial Carousel Section
//   carouselSection: { padding: '8rem 5%' },
//   editorialGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' },
//   edCard: { backgroundColor: '#111', cursor: 'pointer', overflow: 'hidden' },
//   edImgWrapper: { height: '500px', overflow: 'hidden' },
//   edImg: { width: '100%', height: '100%', objectFit: 'cover', transition: '1.2s transform cubic-bezier(0,0,0,1)' },
//   edInfo: { padding: '20px' },
//   edTag: { color: '#D4AF37', fontSize: '0.7rem', letterSpacing: '3px' },
//   edTitle: { fontSize: '1.3rem', marginTop: '10px' },

//   // Featured Grid (Modified for 4 Items)
//   bossGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' },
//   productCard: { backgroundColor: '#050505', paddingBottom: '20px', position: 'relative' },
//   productImgBox: { position: 'relative', height: '400px', overflow: 'hidden', backgroundColor: '#111' },
//   productImg: { width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s transform' },
//   quickAddBtn: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', backgroundColor: '#D4AF37', color: '#000', border: 'none', transform: 'translateY(100%)', transition: '0.4s cubic-bezier(0,0,0,1)', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '2px' },
//   productInfo: { textAlign: 'center', marginTop: '20px' },
//   momentTag: { fontSize: '0.7rem', color: '#D4AF37', letterSpacing: '3px', textTransform: 'uppercase' },
//   pName: { fontSize: '1.2rem', margin: '8px 0', fontFamily: "'Playfair Display', serif" },
//   pPrice: { color: '#888', fontWeight: '300' },

//   // Secondary Video
//   videoSection: { height: '70vh', position: 'relative', overflow: 'hidden' },
//   videoBgSmall: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 },
//   overlaySmall: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' },
//   videoContent: { textAlign: 'center' },
//   videoTitle: { fontSize: '3rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase' },
//   videoDesc: { color: '#ccc', margin: '1rem 0 2rem 0', maxWidth: '500px' },
//   btnOutlineWhite: { padding: '14px 35px', backgroundColor: 'transparent', border: '1px solid #fff', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },

//   // Footer Massive
//   footer: { backgroundColor: '#000', color: '#fff', padding: '8rem 5% 3rem 5%', borderTop: '1px solid #111' },
//   footerGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '60px', marginBottom: '6rem' },
//   footerColumnLarge: { display: 'flex', flexDirection: 'column', gap: '15px' },
//   footerColumn: { display: 'flex', flexDirection: 'column', gap: '12px' },
//   fLogo: { fontSize: '2rem', fontWeight: '900', letterSpacing: '6px', color: '#D4AF37', margin: 0, fontFamily: 'Impact' },
//   fText: { color: '#888', fontSize: '0.95rem', lineHeight: '1.6' },
//   fTextSmall: { color: '#666', fontSize: '0.85rem' },
//   fContact: { color: '#AAA', fontSize: '0.9rem', marginTop: '10px' },
//   socialIconsGrid: { display: 'flex', gap: '20px', color: '#888', marginTop: '20px', fontSize: '0.8rem', letterSpacing: '2px' },
//   fHeading: { fontSize: '0.85rem', letterSpacing: '4px', marginBottom: '20px', textTransform: 'uppercase' },
//   fLink: { color: '#999', textDecoration: 'none', cursor: 'pointer', transition: '0.3s' },
//   subscribeBox: { display: 'flex', borderBottom: '1px solid #444', paddingBottom: '12px', marginTop: '10px' },
//   input: { background: 'none', border: 'none', color: '#fff', flex: 1, outline: 'none' },
//   btnSmallGold: { background: 'none', border: 'none', color: '#D4AF37', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' },
//   footerBottom: { textAlign: 'center', borderTop: '1px solid #111', paddingTop: '3rem', color: '#333', fontSize: '0.75rem', letterSpacing: '2px', display: 'flex', flexDirection: 'column', gap: '10px' }
// };

// // Injection of fixed CSS for Animations & optimization
// const styleSheet = document.createElement("style");
// styleSheet.textContent = `
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400&display=swap');

//   .fade-scroll { opacity: 0; transform: translateY(30px); transition: all 1s ease-out; will-change: opacity, transform; }
//   .fade-scroll.visible { opacity: 1; transform: translateY(0); }
  
//   /* Change the clip-path from 100% to 0% to "reveal" it */

// /* --- Optimized Story Image Reveal (Gentle Fade & Style) --- */

// .story-img-reveal { 
//   opacity: 0; 
//   transform: translateY(15px); /* Lighter move-up distance */
//   transition: opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1), 
//               transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
//   will-change: opacity, transform; /* Hardware optimization for i5 */
// }

// .story-img-reveal.visible { 
//   opacity: 1 !important; 
//   transform: translateY(0) !important;
// }

// /* Add specialized styling to the IMG within the reveal wrapper */
// .story-img-reveal img {
//   border-radius: 12px; /* Smooth Rounded Corners */
//   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); /* Premium Depth */
//   transition: transform 0.6s ease; /* Hover effect transition */
// }

// /* Subtle Hover Effect for the Image */
// .story-img-reveal:hover img {
//   transform: translateY(-5px);
// }

//   .no-scrollbar::-webkit-scrollbar { display: none; }
  
//   /* Micro Interactions */
//   .btnWhite:hover { background-color: #D4AF37 !important; transform: translateY(-3px); }
//   .circleBtn:hover { border-color: #D4AF37; }
//   .catCard:hover .catImg { transform: scale(1.08); }
//   .edCard:hover .edImg { transform: scale(1.08); }
//   .product-card:hover img { transform: scale(1.05); }
//   .product-card:hover .quickAddBtn { transform: translateY(0); }
//   .footer-link:hover { color: #D4AF37 !important; transform: translateX(5px); display: inline-block; }

//   @media (max-width: 992px) {
//     .bossGrid { grid-template-columns: 1fr 1fr; }
//     .editorialGrid { grid-template-columns: 1fr; }
//     .storySection { grid-template-columns: 1fr; }
//     .footerGrid { grid-template-columns: 1fr 1fr; }
//     .heroTitle { fontSize: 3.5rem; }
//   }
// `;
// document.head.appendChild(styleSheet);

// export default Home;







// import React, { useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { addToCart } from '../redux/cartSlice';

// const Home = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const scrollRef = useRef(null);

//   // Modern Intersection Observer for optimized fading
//   useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add('visible');
//         }
//       });
//     }, { threshold: 0.1 });

//     document.querySelectorAll('.fade-scroll, .story-img-reveal').forEach(el => observer.observe(el));
    
//     return () => observer.disconnect();
//   }, []);

//   const scrollCategories = (direction) => {
//     if (scrollRef.current) {
//       const amount = direction === 'left' ? -400 : 400;
//       scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
//     }
//   };

//   const handleAddToCart = (product) => {
//     dispatch(addToCart({ ...product, quantity: 1 }));
//   };

//   return (
//     <div style={styles.page}>
      
//       {/* 1. CINEMATIC HERO VIDEO */}
//       <section style={styles.hero}>
//         <video autoPlay loop muted playsInline style={styles.videoBg}>
//           <source src="https://filmora.wondershare.com/videos/ai-prompt/ai-perfume-ad/water-splash-perfume.mp4" type="video/mp4" />
//         </video>
//         <div style={styles.heroOverlay}>
//           <div className="fade-scroll" style={styles.heroContent}>
//             <span style={styles.heroTag}>EST. 2026 / PARIS</span>
//             <h1 style={styles.heroTitle}>BE YOUR OWN <span style={styles.goldText}>SIGNATURE</span></h1>
//             <p style={styles.heroSubtitle}>Sophistication in every note. Discover olfactory excellence.</p>
//             <div style={styles.heroBtns}>
//               <button onClick={() => navigate('/products')} style={styles.btnWhite}>SHOP MEN</button>
//               <button onClick={() => navigate('/products')} style={styles.btnWhite}>SHOP WOMEN</button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 2. THE MOMENT SCROLLER (HORIZONTAL) */}
//       <section style={styles.sectionPadding}>
//         <div style={styles.sectionHeader} className="fade-scroll">
//           <h2 style={styles.sectionTitle}>SHOP BY MOMENT</h2>
//           <div style={styles.controls}>
//             <button onClick={() => scrollCategories('left')} style={styles.circleBtn}>←</button>
//             <button onClick={() => scrollCategories('right')} style={styles.circleBtn}>→</button>
//           </div>
//         </div>
//         <div ref={scrollRef} className="no-scrollbar" style={styles.categoryScroll}>
//           {[
//             { name: "Date Night", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000" },
//             { name: "The Boardroom", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
//             { name: "Weekend Escape", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600" },
//             { name: "Gala & Formal", img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600" },
//             { name: "Gym & Sport", img: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=600" }
//           ].map((cat, i) => (
//             <div key={i} className="moment-card" style={styles.catCard}>
//               <img src={cat.img} alt={cat.name} style={styles.catImg} />
//               <div style={styles.catLabel}>{cat.name}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 3. BRAND STORY (EDITORIAL LAYOUT) */}
//       <section style={styles.storySection}>
//         <div className="fade-scroll story-content-wrapper" style={styles.storyContent}>
//           <span style={styles.storyTag}>THE ESSENCE</span>
//           <h2 style={styles.storyTitle}>OLFACTORY CRAFTSMANSHIP</h2>
//           <div style={styles.storyText}>
//             <p>Founded in the heart of Paris, SCENTIA is more than a perfume house; it is a philosophy of silent declaration. Our nose, Élisabeth Dupré, spent years sourcing the rarest oils in Grasse, creating compositions that don't just fade, but evolve.</p>
//             <p>Each bottle is a testament to confidence, hand-finished with 24k gold leaf and curated for those who understand that true power doesn't shout. It lingers.</p>
//           </div>
//           <button style={styles.textActionBtn} onClick={() => navigate('/discover')}>OUR HERITAGE →</button>
//         </div>
        
//         <div className="story-img-reveal" style={styles.storyImgWrapper}>
//           <img 
//             src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000" 
//             alt="Scentia Story" 
//             style={styles.storyImg}
//           />
//         </div>
//       </section>

//       {/* 4. THREE-IMAGE EDITORIAL CAROUSEL */}
//       <section style={styles.carouselSection} className="fade-scroll">
//         <div style={styles.editorialGrid}>
//           {[
//             { tag: "PRIVÉE EDITION", name: "Amber Nuit", img: "https://www.myperfumeshop.ae/cdn/shop/files/christian-dior-ambre-nuit-extrait-de-parfum-perfume-cologne-861191.webp?v=1733350240&width=1850" },
//             { tag: "MEN'S COLLECTION", name: "Executive Oud", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800" },
//             { tag: "SUMMER HEIRLOOMS", name: "Azure Bloom", img: "https://stylo.pk/cdn/shop/products/PR004912_3.jpg?v=1705398000" }
//           ].map((item, i) => (
//             <div key={i} className="editorial-card" style={styles.edCard}>
//               <div className="img-scale-wrapper" style={styles.edImgWrapper}>
//                 <img src={item.img} alt={item.name} style={styles.edImg} />
//               </div>
//               <div style={styles.edInfo}>
//                 <span style={styles.edTag}>{item.tag}</span>
//                 <h3 style={styles.edTitle}>{item.name}</h3>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 5. FEATURED (SIGNATURE LINE) */}
//       <section style={styles.sectionBgPadding}>
//         <div className="fade-scroll" style={styles.centeredHeader}>
//           <span style={styles.momentTag}>CURATED FOR YOU</span>
//           <h2 style={styles.sectionTitleBold}>THE SIGNATURE LINE</h2>
//         </div>
//         <div style={styles.bossGrid}>
//           {[
//             { id: 1, name: "Noir Intense", price: 290, brand: "SCENTIA", img: "https://images.unsplash.com/photo-1583522684482-2813bc314630?w=800" },
//             { id: 2, name: "Oud Gold", price: 340, brand: "SCENTIA", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800" },
//             { id: 3, name: "Rose Royale", price: 310, brand: "SCENTIA", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800" },
//             { id: 4, name: "Velvet Hour", price: 280, brand: "SCENTIA", img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800" }
//           ].map((p) => (
//             <div key={p.id} className="fade-scroll product-card" style={styles.productCard}>
//               <div className="img-box" style={styles.productImgBox}>
//                 <img 
//                   src={p.img} 
//                   alt={p.name} 
//                   style={styles.productImg} 
//                   onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800"}} 
//                 />
//                 <button onClick={() => handleAddToCart(p)} style={styles.quickAddBtn}>ADD TO BAG</button>
//               </div>
//               <div style={styles.productInfo}>
//                 <span style={styles.momentTag}>{p.brand}</span>
//                 <h3 style={styles.pName}>{p.name}</h3>
//                 <p style={styles.pPrice}>${p.price}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 6. SECONDARY VIDEO (THE MAKING OF) */}
//       <section style={styles.videoSection} className="fade-scroll">
//         <video autoPlay loop muted playsInline style={styles.videoBgSmall}>
//           <source src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/amazing-perfume-spray-design-template-8b5dd66574a5b8be9e290b706a31b011.mp4?ts=1634288631" type="video/mp4" />
//         </video>
//         <div style={styles.overlaySmall}>
//           <div style={styles.videoContent}>
//             <h2 style={styles.videoTitle}>THE ART OF ESSENCE</h2>
//             <p style={styles.videoDesc}>Experience the precision behind every composition in our Grasse ateliers.</p>
//             <button style={styles.btnOutlineWhite}>WATCH THE JOURNEY</button>
//           </div>
//         </div>
//       </section>


// {/* FOOTER REMOVED - COMMENTED OUT
//       <footer style={styles.footer}>
//         ... all footer content ...
//       </footer>
//       */}
      
//     </div>
//   );
// };

// const styles = {
//   page: { backgroundColor: '#050505', color: '#fff', overflowX: 'hidden', fontFamily: "Helvetica, sans-serif" },
  
//   // Video Hero
//   hero: { height: '100vh', position: 'relative', width: '100%', overflow: 'hidden' },
//   videoBg: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 },
//   heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8%' },
//   heroContent: { textAlign: 'center', maxWidth: '1000px' },
//   heroTag: { color: '#D4AF37', letterSpacing: '5px', fontSize: '0.8rem' },
//   heroTitle: { color: '#fff', fontSize: '6rem', fontWeight: '900', fontFamily: 'Impact, sans-serif', margin: '15px 0', textTransform: 'uppercase', letterSpacing: '-2px' },
//   goldText: { color: '#D4AF37' },
//   heroSubtitle: { color: '#ccc', fontSize: '1.2rem', fontWeight: '300', maxWidth: '600px', margin: '1.5rem auto 3rem auto' },
//   heroBtns: { display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' },
//   btnWhite: { padding: '16px 45px', backgroundColor: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '2px', transition: 'all 0.3s ease' },

//   sectionPadding: { padding: '8rem 5%' },
//   sectionBgPadding: { padding: '8rem 5%', backgroundColor: '#000' },
//   sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' },
//   sectionTitle: { fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase' },
//   centeredHeader: { textAlign: 'center', marginBottom: '5rem' },
//   sectionTitleBold: { fontSize: '3rem', fontWeight: '900', textTransform: 'uppercase', fontFamily: "'Playfair Display', serif", letterSpacing: '-1px' },
  
//   // Controls
//   controls: { display: 'flex', gap: '15px' },
//   circleBtn: { background: '#111', border: '1px solid #333', color: '#D4AF37', padding: '10px 15px', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.3s ease' },
  
//   // Category Scroll
//   categoryScroll: { display: 'flex', gap: '25px', overflowX: 'auto', paddingBottom: '30px' },
//   catCard: { flex: '0 0 320px', height: '450px', position: 'relative', cursor: 'pointer', overflow: 'hidden', borderRadius: '4px' },
//   catImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s cubic-bezier(0,0,0,1)' },
//   catLabel: { position: 'absolute', bottom: '25px', left: '25px', color: '#fff', fontSize: '1.4rem', fontWeight: 'bold' },

//   // Story Section
//   storySection: { display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', backgroundColor: '#0A0A0A', alignItems: 'center' },
//   storyContent: { padding: '10%', textAlign: 'left' },
//   storyTag: { fontSize: '0.8rem', letterSpacing: '4px', color: '#D4AF37', textTransform: 'uppercase' },
//   storyTitle: { fontSize: '3.5rem', fontWeight: '900', margin: '1.5rem 0', textTransform: 'uppercase', fontFamily: "Impact, sans-serif" },
//   storyText: { fontSize: '1.1rem', color: '#AAA', lineHeight: '1.8', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '15px' },
//   textActionBtn: { background: 'none', border: 'none', color: '#fff', textDecoration: 'underline', cursor: 'pointer', letterSpacing: '2px', marginTop: '2.5rem', fontSize: '1rem', transition: 'all 0.3s ease' },
//   storyImgWrapper: { height: '800px', overflow: 'hidden' },
//   storyImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)', transition: 'transform 0.6s ease' },

//   // Editorial Carousel Section
//   carouselSection: { padding: '8rem 5%' },
//   editorialGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' },
//   edCard: { backgroundColor: '#111', cursor: 'pointer', overflow: 'hidden' },
//   edImgWrapper: { height: '500px', overflow: 'hidden' },
//   edImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.2s cubic-bezier(0,0,0,1)' },
//   edInfo: { padding: '20px' },
//   edTag: { color: '#D4AF37', fontSize: '0.7rem', letterSpacing: '3px' },
//   edTitle: { fontSize: '1.3rem', marginTop: '10px' },

//   // Featured Grid
//   bossGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' },
//   productCard: { backgroundColor: '#050505', paddingBottom: '20px', position: 'relative' },
//   productImgBox: { position: 'relative', height: '400px', overflow: 'hidden', backgroundColor: '#111' },
//   productImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },
//   quickAddBtn: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', backgroundColor: '#D4AF37', color: '#000', border: 'none', transform: 'translateY(100%)', transition: 'transform 0.4s cubic-bezier(0,0,0,1)', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '2px' },
//   productInfo: { textAlign: 'center', marginTop: '20px' },
//   momentTag: { fontSize: '0.7rem', color: '#D4AF37', letterSpacing: '3px', textTransform: 'uppercase' },
//   pName: { fontSize: '1.2rem', margin: '8px 0', fontFamily: "'Playfair Display', serif" },
//   pPrice: { color: '#888', fontWeight: '300' },

//   // Secondary Video
//   videoSection: { height: '70vh', position: 'relative', overflow: 'hidden' },
//   videoBgSmall: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 },
//   overlaySmall: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' },
//   videoContent: { textAlign: 'center' },
//   videoTitle: { fontSize: '3rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase' },
//   videoDesc: { color: '#ccc', margin: '1rem 0 2rem 0', maxWidth: '500px' },
//   btnOutlineWhite: { padding: '14px 35px', backgroundColor: 'transparent', border: '1px solid #fff', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' },

//   // Footer
//   footer: { backgroundColor: '#000', color: '#fff', padding: '8rem 5% 3rem 5%', borderTop: '1px solid #111' },
//   footerGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '60px', marginBottom: '6rem' },
//   footerColumnLarge: { display: 'flex', flexDirection: 'column', gap: '15px' },
//   footerColumn: { display: 'flex', flexDirection: 'column', gap: '12px' },
//   fLogo: { fontSize: '2rem', fontWeight: '900', letterSpacing: '6px', color: '#D4AF37', margin: 0, fontFamily: 'Impact' },
//   fText: { color: '#888', fontSize: '0.95rem', lineHeight: '1.6' },
//   fTextSmall: { color: '#666', fontSize: '0.85rem' },
//   fContact: { color: '#AAA', fontSize: '0.9rem', marginTop: '10px' },
//   socialIconsGrid: { display: 'flex', gap: '20px', color: '#888', marginTop: '20px', fontSize: '0.8rem', letterSpacing: '2px', cursor: 'pointer' },
//   fHeading: { fontSize: '0.85rem', letterSpacing: '4px', marginBottom: '20px', textTransform: 'uppercase' },
//   fLink: { color: '#999', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.3s ease' },
//   subscribeBox: { display: 'flex', borderBottom: '1px solid #444', paddingBottom: '12px', marginTop: '10px' },
//   input: { background: 'none', border: 'none', color: '#fff', flex: 1, outline: 'none' },
//   btnSmallGold: { background: 'none', border: 'none', color: '#D4AF37', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.3s ease' },
//   footerBottom: { textAlign: 'center', borderTop: '1px solid #111', paddingTop: '3rem', color: '#333', fontSize: '0.75rem', letterSpacing: '2px', display: 'flex', flexDirection: 'column', gap: '10px' }
// };

// // Injection of fixed CSS for Animations & optimization
// const styleSheet = document.createElement("style");
// styleSheet.textContent = `
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400&display=swap');

//   .fade-scroll { 
//     opacity: 0; 
//     transform: translateY(30px); 
//     transition: opacity 1s ease-out, transform 1s ease-out; 
//     will-change: opacity, transform; 
//   }
  
//   .fade-scroll.visible { 
//     opacity: 1; 
//     transform: translateY(0); 
//   }
  
//   .story-img-reveal { 
//     opacity: 0; 
//     transform: translateY(15px);
//     transition: opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1), 
//                 transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
//     will-change: opacity, transform;
//   }
  
//   .story-img-reveal.visible { 
//     opacity: 1; 
//     transform: translateY(0);
//   }
  
//   .story-img-reveal:hover img {
//     transform: translateY(-5px);
//   }
  
//   .no-scrollbar::-webkit-scrollbar { 
//     display: none; 
//   }
  
//   /* Micro Interactions */
//   .btnWhite:hover { 
//     background-color: #D4AF37; 
//     transform: translateY(-3px); 
//   }
  
//   .circleBtn:hover { 
//     border-color: #D4AF37; 
//   }
  
//   .catCard:hover .catImg { 
//     transform: scale(1.08); 
//   }
  
//   .edCard:hover .edImg { 
//     transform: scale(1.08); 
//   }
  
//   .product-card:hover img { 
//     transform: scale(1.05); 
//   }
  
//   .product-card:hover .quickAddBtn { 
//     transform: translateY(0); 
//   }
  
//   .footer-link:hover { 
//     color: #D4AF37; 
//     transform: translateX(5px); 
//     display: inline-block; 
//   }
  
//   .textActionBtn:hover,
//   .btnOutlineWhite:hover,
//   .btnSmallGold:hover {
//     opacity: 0.8;
//     transform: translateY(-2px);
//   }

//   @media (max-width: 1200px) {
//     .bossGrid { 
//       grid-template-columns: repeat(2, 1fr); 
//     }
//     .editorialGrid { 
//       grid-template-columns: repeat(2, 1fr); 
//     }
//     .footerGrid { 
//       grid-template-columns: repeat(2, 1fr); 
//     }
//   }

//   @media (max-width: 992px) {
//     .storySection { 
//       grid-template-columns: 1fr; 
//     }
//     .heroTitle { 
//       font-size: 3.5rem !important; 
//     }
//     .storyTitle {
//       font-size: 2.5rem !important;
//     }
//   }
  
//   @media (max-width: 768px) {
//     .editorialGrid { 
//       grid-template-columns: 1fr; 
//     }
//     .bossGrid { 
//       grid-template-columns: 1fr; 
//     }
//     .footerGrid { 
//       grid-template-columns: 1fr; 
//     }
//     .heroBtns {
//       flex-direction: column;
//       align-items: center;
//     }
//     .sectionTitle {
//       font-size: 1.8rem !important;
//     }
//     .videoTitle {
//       font-size: 2rem !important;
//     }
//   }
// `;
// document.head.appendChild(styleSheet);

// export default Home;





import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  // Modern Intersection Observer for optimized fading
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-scroll, .story-img-reveal').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const scrollCategories = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  // Data arrays with unique keys
  const momentCategories = [
    { id: 1, name: "Date Night", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000" },
    { id: 2, name: "The Boardroom", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
    { id: 3, name: "Weekend Escape", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600" },
    { id: 4, name: "Gala & Formal", img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600" },
    { id: 5, name: "Gym & Sport", img: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=600" }
  ];

  const editorialItems = [
    { id: 1, tag: "PRIVÉE EDITION", name: "Amber Nuit", img: "https://www.myperfumeshop.ae/cdn/shop/files/christian-dior-ambre-nuit-extrait-de-parfum-perfume-cologne-861191.webp?v=1733350240&width=1850" },
    { id: 2, tag: "MEN'S COLLECTION", name: "Executive Oud", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800" },
    { id: 3, tag: "SUMMER HEIRLOOMS", name: "Azure Bloom", img: "https://stylo.pk/cdn/shop/products/PR004912_3.jpg?v=1705398000" }
  ];

  const featuredProducts = [
    { id: 1, name: "Noir Intense", price: 290, brand: "SCENTIA", img: "https://images.unsplash.com/photo-1583522684482-2813bc314630?w=800" },
    { id: 2, name: "Oud Gold", price: 340, brand: "SCENTIA", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800" },
    { id: 3, name: "Rose Royale", price: 310, brand: "SCENTIA", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800" },
    { id: 4, name: "Velvet Hour", price: 280, brand: "SCENTIA", img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800" }
  ];

  return (
    <div style={styles.page}>
      
      {/* 1. CINEMATIC HERO VIDEO */}
      <section style={styles.hero}>
        <video autoPlay loop muted playsInline style={styles.videoBg}>
  <source src="/videos/a-cinematic-slow-motion-product-advertisement-for-.mp4" type="video/mp4" />
</video>
        <div style={styles.heroOverlay}>
          <div className="fade-scroll" style={styles.heroContent}>
            <span style={styles.heroTag}>EST. 2026 / PARIS</span>
            <h1 style={styles.heroTitle}>BE YOUR OWN <span style={styles.goldText}>SIGNATURE</span></h1>
            <p style={styles.heroSubtitle}>Sophistication in every note. Discover olfactory excellence.</p>
            <div style={styles.heroBtns}>
              <button onClick={() => navigate('/shop')} style={styles.btnWhite}>SHOP MEN</button>
              <button onClick={() => navigate('/shop')} style={styles.btnWhite}>SHOP WOMEN</button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE MOMENT SCROLLER (HORIZONTAL) */}
      <section style={styles.sectionPadding}>
        <div style={styles.sectionHeader} className="fade-scroll">
          <h2 style={styles.sectionTitle}>SHOP BY MOMENT</h2>
          <div style={styles.controls}>
            <button onClick={() => scrollCategories('left')} style={styles.circleBtn} aria-label="Scroll left">←</button>
            <button onClick={() => scrollCategories('right')} style={styles.circleBtn} aria-label="Scroll right">→</button>
          </div>
        </div>
        <div ref={scrollRef} className="no-scrollbar" style={styles.categoryScroll}>
          {momentCategories.map((cat) => (
            <div key={cat.id} className="moment-card" style={styles.catCard}>
              <img src={cat.img} alt={cat.name} style={styles.catImg} loading="lazy" />
              <div style={styles.catLabel}>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BRAND STORY (EDITORIAL LAYOUT) */}
      <section style={styles.storySection}>
        <div className="fade-scroll story-content-wrapper" style={styles.storyContent}>
          <span style={styles.storyTag}>THE ESSENCE</span>
          <h2 style={styles.storyTitle}>OLFACTORY CRAFTSMANSHIP</h2>
          <div style={styles.storyText}>
            <p>Founded in the heart of Paris, SCENTIA is more than a perfume house; it is a philosophy of silent declaration. Our nose, Élisabeth Dupré, spent years sourcing the rarest oils in Grasse, creating compositions that don't just fade, but evolve.</p>
            <p>Each bottle is a testament to confidence, hand-finished with 24k gold leaf and curated for those who understand that true power doesn't shout. It lingers.</p>
          </div>
          <button style={styles.textActionBtn} onClick={() => navigate('/discover')}>OUR HERITAGE →</button>
        </div>
        
        <div className="story-img-reveal" style={styles.storyImgWrapper}>
          <img 
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000" 
            alt="Scentia Story" 
            style={styles.storyImg}
            loading="lazy"
          />
        </div>
      </section>

      {/* 4. THREE-IMAGE EDITORIAL CAROUSEL */}
      <section style={styles.carouselSection} className="fade-scroll">
        <div style={styles.editorialGrid}>
          {editorialItems.map((item) => (
            <div key={item.id} className="editorial-card" style={styles.edCard}>
              <div className="img-scale-wrapper" style={styles.edImgWrapper}>
                <img 
                  src={item.img} 
                  alt={item.name} 
                  style={styles.edImg} 
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800";
                  }}
                />
              </div>
              <div style={styles.edInfo}>
                <span style={styles.edTag}>{item.tag}</span>
                <h3 style={styles.edTitle}>{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED (SIGNATURE LINE) */}
      <section style={styles.sectionBgPadding}>
        <div className="fade-scroll" style={styles.centeredHeader}>
          <span style={styles.momentTag}>CURATED FOR YOU</span>
          <h2 style={styles.sectionTitleBold}>THE SIGNATURE LINE</h2>
        </div>
        <div style={styles.bossGrid}>
          {featuredProducts.map((p) => (
            <div key={p.id} className="fade-scroll product-card" style={styles.productCard}>
              <div className="img-box" style={styles.productImgBox}>
                <img 
                  src={p.img} 
                  alt={p.name} 
                  style={styles.productImg} 
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800";
                  }} 
                />
                <button onClick={() => handleAddToCart(p)} style={styles.quickAddBtn}>ADD TO BAG</button>
              </div>
              <div style={styles.productInfo}>
                <span style={styles.momentTag}>{p.brand}</span>
                <h3 style={styles.pName}>{p.name}</h3>
                <p style={styles.pPrice}>${p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SECONDARY VIDEO (THE MAKING OF) */}
      <section style={styles.videoSection} className="fade-scroll">
        <video autoPlay loop muted playsInline style={styles.videoBg}>
  <source src="/videos/a-high-end-slow-motion-advertisement-a-womans-hand.mp4" type="video/mp4" />
</video>
        <div style={styles.overlaySmall}>
          <div style={styles.videoContent}>
            <h2 style={styles.videoTitle}>THE ART OF ESSENCE</h2>
            <p style={styles.videoDesc}>Experience the precision behind every composition in our Grasse ateliers.</p>
            <button style={styles.btnOutlineWhite}>WATCH THE JOURNEY</button>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: { 
    backgroundColor: '#050505', 
    color: '#fff',  
    fontFamily: "Helvetica, sans-serif" 
  },
  
  // Video Hero
  hero: { 
    height: '100vh', 
    position: 'relative', 
    width: '100%', 
    overflow: 'hidden' 
  },
  videoBg: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover', 
    zIndex: 1 
  },
  heroOverlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    zIndex: 2, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '0 8%' 
  },
  heroContent: { 
    textAlign: 'center', 
    maxWidth: '1000px' 
  },
  heroTag: { 
    color: '#D4AF37', 
    letterSpacing: '5px', 
    fontSize: '0.8rem' 
  },
  heroTitle: { 
    color: '#fff', 
    fontSize: '6rem', 
    fontWeight: '900', 
    fontFamily: 'Impact, sans-serif', 
    margin: '15px 0', 
    textTransform: 'uppercase', 
    letterSpacing: '-2px' 
  },
  goldText: { 
    color: '#D4AF37' 
  },
  heroSubtitle: { 
    color: '#ccc', 
    fontSize: '1.2rem', 
    fontWeight: '300', 
    maxWidth: '600px', 
    margin: '1.5rem auto 3rem auto' 
  },
  heroBtns: { 
    display: 'flex', 
    gap: '20px', 
    justifyContent: 'center', 
    flexWrap: 'wrap' 
  },
  btnWhite: { 
    padding: '16px 45px', 
    backgroundColor: '#fff', 
    border: 'none', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    fontSize: '0.8rem', 
    letterSpacing: '2px', 
    transition: 'all 0.3s ease' 
  },

  sectionPadding: { 
    padding: '8rem 5%' 
  },
  sectionBgPadding: { 
    padding: '8rem 5%', 
    backgroundColor: '#000' 
  },
  sectionHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '3rem', 
    flexWrap: 'wrap', 
    gap: '1rem' 
  },
  sectionTitle: { 
    fontSize: '2.5rem', 
    fontWeight: '900', 
    textTransform: 'uppercase' 
  },
  centeredHeader: { 
    textAlign: 'center', 
    marginBottom: '5rem' 
  },
  sectionTitleBold: { 
    fontSize: '3rem', 
    fontWeight: '900', 
    textTransform: 'uppercase', 
    fontFamily: "'Playfair Display', serif", 
    letterSpacing: '-1px' 
  },
  
  // Controls
  controls: { 
    display: 'flex', 
    gap: '15px' 
  },
  circleBtn: { 
    background: '#111', 
    border: '1px solid #333', 
    color: '#D4AF37', 
    padding: '10px 15px', 
    cursor: 'pointer', 
    borderRadius: '4px', 
    transition: 'all 0.3s ease' 
  },
  
  // Category Scroll
  categoryScroll: { 
    display: 'flex', 
    gap: '25px', 
    overflowX: 'auto', 
    paddingBottom: '30px' 
  },
  catCard: { 
    flex: '0 0 320px', 
    height: '450px', 
    position: 'relative', 
    cursor: 'pointer', 
    overflow: 'hidden', 
    borderRadius: '4px' 
  },
  catImg: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover', 
    transition: 'transform 1s cubic-bezier(0,0,0,1)' 
  },
  catLabel: { 
    position: 'absolute', 
    bottom: '25px', 
    left: '25px', 
    color: '#fff', 
    fontSize: '1.4rem', 
    fontWeight: 'bold' 
  },

  // Story Section
  storySection: { 
    display: 'grid', 
    gridTemplateColumns: '1.3fr 0.7fr', 
    backgroundColor: '#0A0A0A', 
    alignItems: 'center' 
  },
  storyContent: { 
    padding: '10%', 
    textAlign: 'left' 
  },
  storyTag: { 
    fontSize: '0.8rem', 
    letterSpacing: '4px', 
    color: '#D4AF37', 
    textTransform: 'uppercase' 
  },
  storyTitle: { 
    fontSize: '3.5rem', 
    fontWeight: '900', 
    margin: '1.5rem 0', 
    textTransform: 'uppercase', 
    fontFamily: "Impact, sans-serif" 
  },
  storyText: { 
    fontSize: '1.1rem', 
    color: '#AAA', 
    lineHeight: '1.8', 
    maxWidth: '600px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px' 
  },
  textActionBtn: { 
    background: 'none', 
    border: 'none', 
    color: '#fff', 
    textDecoration: 'underline', 
    cursor: 'pointer', 
    letterSpacing: '2px', 
    marginTop: '2.5rem', 
    fontSize: '1rem', 
    transition: 'all 0.3s ease' 
  },
  storyImgWrapper: { 
    height: '800px', 
    overflow: 'hidden' 
  },
  storyImg: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover', 
    borderRadius: '12px', 
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)', 
    transition: 'transform 0.6s ease' 
  },

  // Editorial Carousel Section
  carouselSection: { 
    padding: '8rem 5%' 
  },
  editorialGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(3, 1fr)', 
    gap: '30px' 
  },
  edCard: { 
    backgroundColor: '#111', 
    cursor: 'pointer', 
    overflow: 'hidden' 
  },
  edImgWrapper: { 
    height: '500px', 
    overflow: 'hidden' 
  },
  edImg: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover', 
    transition: 'transform 1.2s cubic-bezier(0,0,0,1)' 
  },
  edInfo: { 
    padding: '20px' 
  },
  edTag: { 
    color: '#D4AF37', 
    fontSize: '0.7rem', 
    letterSpacing: '3px' 
  },
  edTitle: { 
    fontSize: '1.3rem', 
    marginTop: '10px' 
  },

  // Featured Grid
  bossGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(4, 1fr)', 
    gap: '30px' 
  },
  productCard: { 
    backgroundColor: '#050505', 
    paddingBottom: '20px', 
    position: 'relative' 
  },
  productImgBox: { 
    position: 'relative', 
    height: '400px', 
    overflow: 'hidden', 
    backgroundColor: '#111' 
  },
  productImg: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover', 
    transition: 'transform 0.5s ease' 
  },
  quickAddBtn: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    padding: '15px', 
    backgroundColor: '#D4AF37', 
    color: '#000', 
    border: 'none', 
    transform: 'translateY(100%)', 
    transition: 'transform 0.4s cubic-bezier(0,0,0,1)', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    letterSpacing: '2px' 
  },
  productInfo: { 
    textAlign: 'center', 
    marginTop: '20px' 
  },
  momentTag: { 
    fontSize: '0.7rem', 
    color: '#D4AF37', 
    letterSpacing: '3px', 
    textTransform: 'uppercase' 
  },
  pName: { 
    fontSize: '1.2rem', 
    margin: '8px 0', 
    fontFamily: "'Playfair Display', serif" 
  },
  pPrice: { 
    color: '#888', 
    fontWeight: '300' 
  },

  // Secondary Video
  videoSection: { 
    height: '70vh', 
    position: 'relative', 
    overflow: 'hidden' 
  },
  videoBgSmall: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover', 
    zIndex: 1 
  },
  overlaySmall: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    zIndex: 2, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  videoContent: { 
    textAlign: 'center' 
  },
  videoTitle: { 
    fontSize: '3rem', 
    fontWeight: '900', 
    color: '#fff', 
    textTransform: 'uppercase' 
  },
  videoDesc: { 
    color: '#ccc', 
    margin: '1rem 0 2rem 0', 
    maxWidth: '500px' 
  },
  btnOutlineWhite: { 
    padding: '14px 35px', 
    backgroundColor: 'transparent', 
    border: '1px solid #fff', 
    color: '#fff', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    transition: 'all 0.3s ease' 
  }
};

// Injection of fixed CSS for Animations & optimization
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    
  }

  .fade-scroll { 
    opacity: 0; 
    transform: translateY(30px); 
    transition: opacity 1s ease-out, transform 1s ease-out; 
    will-change: opacity, transform; 
  }
  
  .fade-scroll.visible { 
    opacity: 1; 
    transform: translateY(0); 
  }
  
  .story-img-reveal { 
    opacity: 0; 
    transform: translateY(15px);
    transition: opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1), 
                transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: opacity, transform;
  }
  
  .story-img-reveal.visible { 
    opacity: 1; 
    transform: translateY(0);
  }
  
  .story-img-reveal:hover img {
    transform: translateY(-5px);
  }
  
  .no-scrollbar::-webkit-scrollbar { 
    display: none; 
  }
  
  
  /* Micro Interactions */
  .btnWhite:hover { 
    background-color: #D4AF37; 
    transform: translateY(-3px); 
  }
  
  .circleBtn:hover { 
    border-color: #D4AF37;
    background-color: rgba(212, 175, 55, 0.1);
  }
  
  .catCard:hover .catImg { 
    transform: scale(1.08); 
  }
  
  .edCard:hover .edImg { 
    transform: scale(1.08); 
  }
  
  .product-card:hover img { 
    transform: scale(1.05); 
  }
  
  .product-card:hover .quickAddBtn { 
    transform: translateY(0); 
  }
  
  .textActionBtn:hover,
  .btnOutlineWhite:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }

  @media (max-width: 1200px) {
    .bossGrid { 
      grid-template-columns: repeat(2, 1fr) !important; 
    }
    .editorialGrid { 
      grid-template-columns: repeat(2, 1fr) !important; 
    }
  }

  @media (max-width: 992px) {
    .storySection { 
      grid-template-columns: 1fr !important; 
    }
    .heroTitle { 
      font-size: 3.5rem !important; 
    }
    .storyTitle {
      font-size: 2.5rem !important;
    }
  }
  
  @media (max-width: 768px) {
    .editorialGrid { 
      grid-template-columns: 1fr !important; 
    }
    .bossGrid { 
      grid-template-columns: 1fr !important; 
    }
    .heroBtns {
      flex-direction: column;
      align-items: center;
    }
    .sectionTitle {
      font-size: 1.8rem !important;
    }
    .videoTitle {
      font-size: 2rem !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Home;