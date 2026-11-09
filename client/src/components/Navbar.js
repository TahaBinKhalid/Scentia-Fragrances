import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartItemsCount = useSelector(state => state.cart?.items?.length || 0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setSearchOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/collections' },
    { name: 'Luxury Editions', path: '/luxury' },
    { name: 'Discover', path: '/discover' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{
        ...styles.navbar,
        backgroundColor: scrolled ? '#0A0A0A' : 'rgba(10, 10, 10, 0.95)',
        padding: scrolled ? '0.9rem 5%' : '1.5rem 5%',
        borderBottom: scrolled ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}>
        <div style={styles.container}>
          {/* Logo Section */}
          <div style={styles.logoGroup} onClick={() => navigate('/')}>
            <div className="logo-icon-wrapper" style={styles.logoIcon}>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15 9H9L12 2Z" fill="#D4AF37" />
                <path d="M12 22L9 15H15L12 22Z" fill="#D4AF37" />
                <path d="M5 10L11 12L5 14V10Z" fill="#D4AF37" />
                <path d="M19 10L13 12L19 14V10Z" fill="#D4AF37" />
              </svg>
            </div>
            <div style={styles.logoTextContainer}>
              <span style={styles.logoText}>SCENTIA</span>
              <span style={styles.logoTagline}>PARFUMERIE DE LUXE</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div style={styles.navLinks} className="desktop-only">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="nav-item"
                style={{
                  ...styles.navLink,
                  color: isActive(link.path) ? '#D4AF37' : '#FFFFFF',
                }}
              >
                {link.name}
                <span className={`nav-underline ${isActive(link.path) ? 'active' : ''}`}></span>
              </Link>
            ))}
          </div>

          {/* Utility Icons */}
          <div style={styles.actions}>
            <button onClick={() => setSearchOpen(!searchOpen)} style={styles.iconBtn} className="hover-gold" aria-label="Search">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            <button style={styles.iconBtn} className="hover-gold desktop-only" aria-label="Wishlist">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 00 0-7.78z" />
              </svg>
            </button>

            {/* Auth Section - Shows different UI based on login state */}
            {user ? (
              // Logged In - Show Profile Dropdown
              <div style={styles.profileDropdown} className="profile-container">
                <button style={styles.profileBtn} className="hover-gold" aria-label="Profile">
                  <div style={styles.avatar}>
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                </button>
                <div style={styles.dropdownMenu} className="dropdown-menu">
                  <div style={styles.dropdownHeader}>
                    <strong style={{ color: '#D4AF37' }}>{user.name || 'Member'}</strong>
                    <span style={styles.dropdownEmail}>{user.email}</span>
                  </div>
                  <Link to="/profile" style={styles.dropdownItem} onClick={() => setMobileMenuOpen(false)}>
                    <span style={styles.dropdownIcon}>👤</span> My Profile
                  </Link>
                  
<Link to="/order-history" style={styles.dropdownItem} onClick={() => setMobileMenuOpen(false)}>
   <span style={styles.dropdownIcon}>🛒</span>MY ARCHIVE
</Link>
                  <Link to="/orders" style={styles.dropdownItem} onClick={() => setMobileMenuOpen(false)}>
                    <span style={styles.dropdownIcon}>📦</span> My Orders
                  </Link>
                  <Link to="/wishlist" style={styles.dropdownItem} onClick={() => setMobileMenuOpen(false)}>
                    <span style={styles.dropdownIcon}>❤️</span> Wishlist
                  </Link>
                  <div style={styles.dropdownDivider}></div>
                  <button onClick={handleLogout} style={styles.dropdownItemLogout}>
                    <span style={styles.dropdownIcon}>🚪</span> Logout
                  </button>
                </div>
              </div>
            ) : (
              // Logged Out - Show Login & Signup Buttons
              <div style={styles.authButtons}>
                <Link to="/login">
                  <button style={styles.loginBtn} className="hover-gold">LOGIN</button>
                </Link>
                <Link to="/signup">
                  <button style={styles.signupBtn}>SIGN UP</button>
                </Link>
              </div>
            )}

            {/* Cart Button */}
            <button onClick={() => navigate('/cart')} style={styles.cartBtn} className="hover-gold" aria-label="Cart">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && <span style={styles.badge}>{cartItemsCount}</span>}
            </button>

            {/* Hamburger for Mobile */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={styles.menuToggle} className="mobile-toggle" aria-label="Menu">
              <div style={{ ...styles.bar, transform: mobileMenuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }} />
              <div style={{ ...styles.bar, opacity: mobileMenuOpen ? 0 : 1 }} />
              <div style={{ ...styles.bar, transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Search Expansion */}
        {searchOpen && (
          <div style={styles.searchBar}>
            <input 
              type="text" 
              placeholder="What scent are you looking for?" 
              style={styles.searchInput} 
              autoFocus 
            />
            <button onClick={() => setSearchOpen(false)} style={styles.closeBtn}>CLOSE</button>
          </div>
        )}
      </nav>

      {/* Mobile Sidebar */}
      <div style={{ ...styles.sidebar, right: mobileMenuOpen ? 0 : '-100%' }}>
        <div style={styles.sidebarHeader}>
          <span style={styles.sidebarLogo}>SCENTIA</span>
          <button onClick={() => setMobileMenuOpen(false)} style={styles.sidebarClose}>✕</button>
        </div>
        <div style={styles.sidebarLinks}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              style={{ ...styles.sidebarLink, color: isActive(link.path) ? '#D4AF37' : '#FFF' }} 
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div style={styles.sidebarDivider}></div>
        <div style={styles.sidebarAuth}>
          {user ? (
            // Logged In - Mobile View
            <>
              <div style={styles.sidebarUserInfo}>
                <div style={styles.sidebarAvatar}>
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={styles.sidebarUserName}>{user.name || 'Member'}</div>
                  <div style={styles.sidebarUserEmail}>{user.email}</div>
                </div>
              </div>
              <Link to="/profile" style={styles.sidebarAction} onClick={() => setMobileMenuOpen(false)}>
                👤 My Profile
              </Link>
              <Link to="/orders" style={styles.sidebarAction} onClick={() => setMobileMenuOpen(false)}>
                📦 My Orders
              </Link>
              <Link to="/wishlist" style={styles.sidebarAction} onClick={() => setMobileMenuOpen(false)}>
                ❤️ Wishlist
              </Link>
              <button onClick={handleLogout} style={styles.sidebarActionLogout}>
                🚪 Logout
              </button>
            </>
          ) : (
            // Logged Out - Mobile View
            <>
              <Link to="/login" style={styles.sidebarActionGold} onClick={() => setMobileMenuOpen(false)}>
                LOGIN
              </Link>
              <Link to="/signup" style={styles.sidebarAction} onClick={() => setMobileMenuOpen(false)}>
                SIGN UP
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div style={styles.overlay} onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Spacer */}
      <div style={{ height: scrolled ? '85px' : '110px' }} />
    </>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: 'all 0.4s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1440px',
    margin: '0 auto',
    width: '100%',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoText: {
    fontSize: '1.9rem',
    fontWeight: '800',
    letterSpacing: '6px',
    color: '#D4AF37',
    fontFamily: "'Playfair Display', serif",
    lineHeight: 1.1,
  },
  logoTagline: {
    fontSize: '0.7rem',
    letterSpacing: '3.5px',
    color: '#999',
    marginTop: '5px',
  },
  navLinks: {
    display: 'flex',
    gap: '3rem',
  },
  navLink: {
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '600',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    position: 'relative',
    paddingBottom: '6px',
    transition: 'color 0.3s ease',
  },
  actions: {
    display: 'flex',
    gap: '0.9rem',
    alignItems: 'center',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: '#FFF',
    cursor: 'pointer',
    padding: '10px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  authButtons: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  loginBtn: {
    background: 'transparent',
    border: '1px solid rgba(212, 175, 55, 0.5)',
    color: '#D4AF37',
    padding: '8px 20px',
    borderRadius: '30px',
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  signupBtn: {
    background: '#D4AF37',
    border: 'none',
    color: '#000',
    padding: '8px 20px',
    borderRadius: '30px',
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  profileBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    transition: 'all 0.3s ease',
  },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #D4AF37, #F3E5AB)',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: 'transform 0.3s ease',
  },
  cartBtn: {
    background: 'none',
    border: 'none',
    color: '#FFF',
    cursor: 'pointer',
    padding: '10px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    borderRadius: '50%',
  },
  badge: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    backgroundColor: '#D4AF37',
    color: '#000',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 8px rgba(212,175,55,0.6)',
  },
  menuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    flexDirection: 'column',
    gap: '6px',
    padding: '10px',
  },
  bar: {
    width: '24px',
    height: '2px',
    backgroundColor: '#D4AF37',
    transition: '0.3s',
  },
  searchBar: {
    padding: '1.5rem 5%',
    backgroundColor: '#0A0A0A',
    display: 'flex',
    gap: '20px',
    animation: 'slideDown 0.4s ease',
    borderTop: '1px solid rgba(212,175,55,0.3)',
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #D4AF37',
    color: '#FFF',
    fontSize: '1.3rem',
    outline: 'none',
    fontFamily: 'serif',
    padding: '12px 0',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#D4AF37',
    cursor: 'pointer',
    letterSpacing: '2px',
    fontWeight: '600',
  },

  // Profile Dropdown
  profileDropdown: {
    position: 'relative',
    display: 'inline-block',
  },
  dropdownMenu: {
    display: 'block',
    position: 'absolute',
    top: '55px',
    right: '0',
    backgroundColor: '#121212',
    minWidth: '260px',
    borderRadius: '12px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.3s ease',
    zIndex: 100,
    border: '1px solid rgba(212,175,55,0.25)',
  },
  dropdownHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #222',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  dropdownEmail: {
    fontSize: '0.75rem',
    color: '#888',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    color: '#FFF',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.25s ease',
  },
  dropdownIcon: {
    fontSize: '1.1rem',
    width: '24px',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: '#222',
    margin: '8px 0',
  },
  dropdownItemLogout: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 20px',
    background: 'none',
    border: 'none',
    color: '#FF5555',
    textAlign: 'left',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },

  // Sidebar
  sidebar: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    width: '340px',
    backgroundColor: '#0A0A0A',
    zIndex: 1001,
    transition: '0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-10px 0 30px rgba(0,0,0,0.6)',
    borderLeft: '1px solid rgba(212,175,55,0.3)',
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.8rem',
    borderBottom: '1px solid #222',
  },
  sidebarLogo: {
    fontSize: '1.7rem',
    fontWeight: '700',
    color: '#D4AF37',
    fontFamily: "'Playfair Display', serif",
    letterSpacing: '4px',
  },
  sidebarClose: {
    background: 'none',
    border: 'none',
    color: '#FFF',
    fontSize: '1.4rem',
    cursor: 'pointer',
  },
  sidebarLinks: {
    flex: 1,
    padding: '1rem 0',
  },
  sidebarLink: {
    display: 'block',
    textDecoration: 'none',
    padding: '1.2rem 1.8rem',
    fontSize: '1.05rem',
    fontWeight: '500',
    letterSpacing: '1px',
    transition: 'all 0.3s',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  sidebarDivider: {
    height: '1px',
    backgroundColor: '#222',
    margin: '1rem 0',
  },
  sidebarAuth: {
    padding: '1rem 0 2rem',
  },
  sidebarUserInfo: {
    padding: '0.5rem 1.8rem 1.2rem',
    borderBottom: '1px solid #222',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  sidebarAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #D4AF37, #F3E5AB)',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },
  sidebarUserName: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: '1rem',
  },
  sidebarUserEmail: {
    color: '#888',
    fontSize: '0.8rem',
  },
  sidebarAction: {
    display: 'block',
    padding: '0.85rem 1.8rem',
    color: '#FFF',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'all 0.3s',
  },
  sidebarActionGold: {
    display: 'block',
    padding: '0.85rem 1.8rem',
    color: '#D4AF37',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'all 0.3s',
  },
  sidebarActionLogout: {
    display: 'block',
    width: '100%',
    padding: '0.85rem 1.8rem',
    background: 'none',
    border: 'none',
    color: '#FF5555',
    textAlign: 'left',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1000,
  },
};

// Global CSS Injection with enhanced hover animations
const injectCSS = () => {
  const style = document.createElement("style");
  style.textContent = `
    /* Hover animation for nav links */
    .nav-item {
      position: relative;
    }
    
    .nav-underline {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #D4AF37, #F3E5AB);
      transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .nav-item:hover .nav-underline {
      width: 100%;
    }
    
    .nav-underline.active {
      width: 100%;
      background: #D4AF37;
    }
    
    /* Hover gold effect for icons */
    .hover-gold:hover {
      color: #D4AF37 !important;
      transform: scale(1.05);
      transition: all 0.3s ease;
    }
    
    /* Logo hover effect */
    .logo-group:hover {
      transform: scale(1.02);
    }
    
    /* Profile dropdown hover */
    .profile-container:hover .dropdown-menu {
      opacity: 1 !important;
      visibility: visible !important;
      top: 55px !important;
    }
    
    /* Dropdown item hover */
    .dropdown-item:hover {
      background-color: rgba(212, 175, 55, 0.1);
      color: #D4AF37 !important;
      padding-left: 25px;
    }
    
    .dropdown-item-logout:hover {
      background-color: rgba(255, 68, 68, 0.1);
      color: #FF8888 !important;
      padding-left: 25px;
    }
    
    /* Sidebar link hover */
    .sidebar-link:hover {
      background-color: rgba(212, 175, 55, 0.08);
      color: #D4AF37 !important;
      padding-left: 2rem;
    }
    
    /* Auth button hovers */
    .login-btn:hover {
      background: rgba(212, 175, 55, 0.1);
      border-color: #D4AF37;
    }
    
    .signup-btn:hover {
      background: #F3E5AB;
      transform: translateY(-2px);
    }
    
    /* Avatar hover */
    .avatar:hover {
      transform: scale(1.05);
    }
    
    /* Slide down animation for search */
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Responsive styles */
    @media (max-width: 968px) {
      .desktop-only {
        display: none !important;
      }
      .mobile-toggle {
        display: flex !important;
      }
    }
    
    @media (min-width: 969px) {
      .mobile-toggle {
        display: none !important;
      }
    }
    
    /* Additional polish */
    .nav-item {
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }
    
    button {
      cursor: pointer;
    }
    
    * {
      box-sizing: border-box;
    }
  `;
  document.head.appendChild(style);
};
injectCSS();

export default Navbar;