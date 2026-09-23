import React, { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import CartSidebar from './CartSidebar'
import WishlistSidebar from './WishlistSidebar'
import NavDrawer from './NavDrawer'
import { useAuth } from '../context/AuthContext'

function Navbar({
  cartCount,
  isCartOpen,
  setIsCartOpen,
  cartItems = [],
  removeFromCart,
  updateQuantity,
  wishlistCount = 0,
  isWishlistOpen = false,
  setIsWishlistOpen,
  wishlistItems = [],
  removeFromWishlist,
  moveToCart,
  moveAllToCart,
  clearWishlist
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setShowAuth(true);
    setIsDrawerOpen(false);
  };


  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Blogs', path: '/blogs' }
  ];

  return (
    <>
      <header className="navbar-wrapper">
        <div className="navbar">
          {/* Logo Section */}
          <Link to="/" className="logo" aria-label="SneakerHub Home">
            <div className="logo-container">
              <div className="logo-image-container">
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
              <div className="logo-image-container">
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
            </div>
            <div className="logo-text">
              <h1>SneakerHub</h1>
              <span className="logo-badge">PRO</span>
            </div>
          </Link>

          {/* Desktop Center Nav Pill Bar */}
          <nav className="nav-center-pill" aria-label="Main Navigation">
            <ul className="nav-pill-list">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path} className="nav-pill-item">
                    <NavLink
                      to={link.path}
                      className={({ isActive }) => `nav-pill-link ${isActive ? 'active' : ''}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNavCapsule"
                          className="nav-active-bg"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="nav-pill-text">{link.name}</span>
                    </NavLink>
                  </li>
                );
              })}


            </ul>
          </nav>

          {/* Right Action Component */}
          <div className="nav-component">
            {/* User Login / Profile Button */}
            {!isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuth('login')}
                className="nav-login-btn"
                aria-label="Account Login"
                title="Account / Login"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </motion.button>
            ) : (
              <div className="user-profile-wrapper" ref={profileDropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileDropdown((prev) => !prev)}
                  className="nav-profile-btn"
                  aria-label="User Account Profile"
                  title="Your Profile"
                >
                  <div className="nav-profile-avatar">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="nav-profile-name">{user?.username || 'Profile'}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`nav-profile-chevron ${showProfileDropdown ? 'open' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </motion.button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="nav-profile-dropdown"
                    >
                      <div className="profile-dropdown-header">
                        <div className="dropdown-avatar">
                          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="dropdown-user-details">
                          <span className="dropdown-username">{user?.username}</span>
                          <span className="dropdown-email">{user?.email}</span>
                          <span className="dropdown-badge">⚡ VIP SNEAKERHEAD</span>
                        </div>
                      </div>
                      <div className="dropdown-divider" />
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setShowProfileDropdown(false);
                        }}
                        className="dropdown-logout-btn"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>Log Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}


            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className={`nav-component-wishlist ${(wishlistCount || 0) > 0 ? 'has-items' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (setIsWishlistOpen) setIsWishlistOpen(true);
              }}
              aria-label={`Wishlist with ${wishlistCount || 0} items`}
              title="View Wishlist"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={(wishlistCount || 0) > 0 ? '#ff4b4b' : 'none'} stroke={(wishlistCount || 0) > 0 ? '#ff4b4b' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <AnimatePresence mode="wait">
                {(wishlistCount || 0) > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="wishlist-badge-count"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="nav-component-cart"
              onClick={(e) => {
                e.stopPropagation();
                setIsCartOpen(true);
              }}
              aria-label={`Shopping cart with ${cartCount || 0} items`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={19} width={19}>
                <path d="M9 6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6H9ZM7 6H4C3.44772 6 3 6.44772 3 7V21C3 21.5523 3.44772 22 4 22H20C20.5523 22 21 21.5523 21 21V7C21 6.44772 20.5523 6 20 6H17C17 3.23858 14.7614 1 12 1C9.23858 1 7 3.23858 7 6ZM9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10H17C17 12.7614 14.7614 15 12 15C9.23858 15 7 12.7614 7 10H9Z"></path>
              </svg>
              <AnimatePresence mode="wait">
                <motion.span
                  key={cartCount || 0}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="cart-badge-count"
                >
                  {cartCount || 0}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Menu Drawer Toggle Button (Hamburger / Grid) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`menu-drawer-toggle ${isDrawerOpen ? 'is-open' : ''}`}
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label="Toggle link drawer menu"
              title="Open Navigation Drawer"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
                <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
                <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
                <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
              </svg>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Visible in Mobile View) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
        <NavLink
          to="/"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span>Home</span>
        </NavLink>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="mobile-nav-item mobile-cart-btn"
          aria-label="Open Cart"
        >
          <div className="mobile-nav-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6H9ZM7 6H4C3.44772 6 3 6.44772 3 7V21C3 21.5523 3.44772 22 4 22H20C20.5523 22 21 21.5523 21 21V7C21 6.44772 20.5523 6 20 6H17C17 3.23858 14.7614 1 12 1C9.23858 1 7 3.23858 7 6ZM9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10H17C17 12.7614 14.7614 15 12 15C9.23858 15 7 12.7614 7 10H9Z"></path>
            </svg>
            {(cartCount || 0) > 0 && (
              <span className="mobile-cart-badge">{cartCount}</span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className={`mobile-nav-item mobile-menu-btn ${isDrawerOpen ? 'active' : ''}`}
          aria-label="Open Directory Menu"
        >
          <div className="mobile-nav-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
              <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
              <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
              <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
            </svg>
          </div>
          <span>Menu</span>
        </button>
      </nav>

      {/* Next-Level Link Drawer */}
      <NavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        openAuth={openAuth}
      />

      <AnimatePresence>
        {showAuth && (
          <AuthModal mode={authMode} onClose={() => setShowAuth(false)} setMode={setAuthMode} />
        )}
      </AnimatePresence>

      <CartSidebar 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
      />

      <WishlistSidebar
        isWishlistOpen={isWishlistOpen}
        setIsWishlistOpen={setIsWishlistOpen}
        wishlistItems={wishlistItems}
        removeFromWishlist={removeFromWishlist}
        moveToCart={moveToCart}
        moveAllToCart={moveAllToCart}
        clearWishlist={clearWishlist}
      />
    </>
  )
}

const AuthModal = ({ mode, onClose, setMode }) => {
  const isLogin = mode === 'login';
  const { login, signup } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear messages when flipping modes
  const handleSwitchMode = (newMode) => {
    setErrorMessage('');
    setSuccessMessage('');
    setMode(newMode);
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(loginEmail.trim(), loginPassword);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setSuccessMessage('Welcome back! Logging you in...');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  // Handle Signup Submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signupUsername.trim() || !signupEmail.trim() || !signupPassword || !signupConfirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (signupPassword.length !== 6) {
      setErrorMessage('Password must be exactly 6 characters long.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your confirm password.');
      return;
    }

    setIsLoading(true);
    const result = await signup(signupUsername.trim(), signupEmail.trim(), signupPassword);
    setIsLoading(false);

    if (result.alreadyExists) {
      // User already exists -> prefill login email and switch to login directly
      setLoginEmail(signupEmail.trim());
      setErrorMessage(result.message);
      setTimeout(() => {
        setMode('login');
      }, 1000);
      return;
    }

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setSuccessMessage('Account created successfully! Welcome to SneakerHub.');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="auth-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backdropFilter: 'blur(10px)',
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1500px'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, rotateX: 20 }}
        animate={{
          scale: 1,
          rotateX: 0,
          rotateY: isLogin ? 0 : 180
        }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 60, damping: 12 }}
        onClick={(e) => e.stopPropagation()}
        className="auth-card"
        style={{
          width: '420px',
          minHeight: '620px',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isLogin ? '#000' : '#fff'
          }}
        >
          ✕
        </button>

        {/* --- FRONT FACE (LOGIN) --- */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '30px',
          padding: '36px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          pointerEvents: isLogin ? 'auto' : 'none',
          zIndex: isLogin ? 2 : 1
        }}>
          <div style={orbStyle}></div>

          <h2 style={headingStyle}>Welcome Back.</h2>

          {/* Feedback messages */}
          {errorMessage && isLogin && (
            <div style={alertErrorStyle}>
              {errorMessage}
            </div>
          )}
          {successMessage && isLogin && (
            <div style={alertSuccessStyle}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 1 }}>
            <input
              type="email"
              placeholder="Email Address"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={inputStyle}
            />

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02, backgroundColor: '#f9c216', color: '#000' }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              style={{
                ...buttonStyle,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Signing In...' : 'Log In'}
            </motion.button>
          </form>

          <div style={footerStyle}>
            Don't have an account?
            <button type="button" onClick={() => handleSwitchMode('signup')} style={linkStyle}> Sign Up</button>
          </div>
        </div>

        {/* --- BACK FACE (SIGNUP) --- */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'rgba(20, 20, 20, 0.96)',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          padding: '36px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          color: '#fff',
          pointerEvents: !isLogin ? 'auto' : 'none',
          zIndex: !isLogin ? 2 : 1
        }}>
          <div style={{ ...orbStyle, background: '#4ecdc4', left: '-50px', right: 'auto' }}></div>

          <h2 style={{ ...headingStyle, color: '#f9c216', marginBottom: '16px' }}>Join the Hub.</h2>

          {/* Feedback messages */}
          {errorMessage && !isLogin && (
            <div style={alertErrorDarkStyle}>
              {errorMessage}
            </div>
          )}
          {successMessage && !isLogin && (
            <div style={alertSuccessStyle}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 1 }}>
            <input
              type="text"
              placeholder="Username"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              required
              autoComplete="username"
              style={inputStyleDark}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyleDark}
            />
            <input
              type="password"
              placeholder="Create Password (6 chars)"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value.slice(0, 6))}
              required
              minLength={6}
              maxLength={6}
              autoComplete="new-password"
              style={inputStyleDark}
            />
            <input
              type="password"
              placeholder="Confirm Password (6 chars)"
              value={signupConfirmPassword}
              onChange={(e) => setSignupConfirmPassword(e.target.value.slice(0, 6))}
              required
              minLength={6}
              maxLength={6}
              autoComplete="new-password"
              style={inputStyleDark}
            />

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02, backgroundColor: '#fff', color: '#000' }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              style={{
                ...buttonStyle,
                background: '#f9c216',
                color: '#1a1a1a',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </motion.button>
          </form>

          <div style={{ ...footerStyle, color: '#aaa', marginTop: '16px' }}>
            Already have an account?
            <button type="button" onClick={() => handleSwitchMode('login')} style={linkStyle}> Log In</button>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
};

// Styles
const buttonStyle = {
  padding: '13px',
  borderRadius: '13px',
  border: 'none',
  background: '#1a1a1a',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '15px',
  cursor: 'pointer',
  marginTop: '4px',
  transition: 'all 0.2s ease'
};

const headingStyle = {
  marginBottom: '20px',
  fontSize: '28px',
  fontWeight: '800',
  color: '#1a1a1a',
  position: 'relative',
  zIndex: 1
};

const footerStyle = {
  marginTop: '18px',
  textAlign: 'center',
  fontSize: '14px',
  color: '#666',
  position: 'relative',
  zIndex: 1
};

const linkStyle = {
  background: 'none',
  border: 'none',
  color: '#f9c216',
  fontWeight: 'bold',
  cursor: 'pointer',
  textDecoration: 'underline'
};

const orbStyle = {
  position: 'absolute',
  top: '-50px',
  right: '-50px',
  width: '180px',
  height: '180px',
  background: '#f9c216',
  borderRadius: '50%',
  filter: 'blur(50px)',
  opacity: 0.6,
  pointerEvents: 'none'
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  background: '#f8fafc',
  color: '#1e293b',
  fontSize: '14px',
  outline: 'none',
  transition: '0.2s',
  boxSizing: 'border-box'
};

const inputStyleDark = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  background: 'rgba(255, 255, 255, 0.07)',
  color: '#ffffff',
  fontSize: '14px',
  outline: 'none',
  transition: '0.2s',
  boxSizing: 'border-box'
};

const alertErrorStyle = {
  padding: '10px 14px',
  borderRadius: '10px',
  background: '#fef2f2',
  border: '1px solid #fecaca',
  color: '#dc2626',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '14px',
  zIndex: 2,
  position: 'relative'
};

const alertErrorDarkStyle = {
  padding: '10px 14px',
  borderRadius: '10px',
  background: 'rgba(239, 68, 68, 0.2)',
  border: '1px solid rgba(239, 68, 68, 0.4)',
  color: '#fca5a5',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '14px',
  zIndex: 2,
  position: 'relative'
};

const alertSuccessStyle = {
  padding: '10px 14px',
  borderRadius: '10px',
  background: '#f0fdf4',
  border: '1px solid #bbf7d0',
  color: '#16a34a',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '14px',
  zIndex: 2,
  position: 'relative'
};

export default Navbar;