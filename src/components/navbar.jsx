import React, { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import CartSidebar from './CartSidebar'
import WishlistSidebar from './WishlistSidebar'
import NavDrawer from './NavDrawer'

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
  const location = useLocation();

  const openAuth = (mode) => {
    setAuthMode(mode);
    setShowAuth(true);
    setIsDrawerOpen(false);
  };

  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return '0.00';
    return cartItems.reduce((total, item) => {
      const price = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
      return total + (price * (item.quantity || 1));
    }, 0).toFixed(2);
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
            {/* User Login Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openAuth('login')}
              className="nav-login-btn"
              aria-label="Account Login"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Login</span>
            </motion.button>

            {/* Price Pill */}
            <div className="nav-component-pay" onClick={() => setIsCartOpen(true)} title="View cart total">
              <span className="currency-symbol">&#x24;</span>
              <span className="currency-amount">{calculateTotal()}</span>
            </div>

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
              <span className="bar bar-1"></span>
              <span className="bar bar-2"></span>
              <span className="bar bar-3"></span>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
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
          width: '400px',
          height: '550px',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* --- FRONT FACE (LOGIN) --- */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '30px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}>
          <div style={orbStyle}></div>

          <h2 style={headingStyle}>Welcome Back.</h2>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
            <input type="email" placeholder="Email Address" style={inputStyle} />
            <input type="password" placeholder="Password" style={inputStyle} />

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#f9c216', color: '#000' }}
              whileTap={{ scale: 0.98 }}
              style={buttonStyle}
            >
              Log In
            </motion.button>
          </form>

          <div style={footerStyle}>
            Don't have an account?
            <button onClick={() => setMode('signup')} style={linkStyle}> Sign Up</button>
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
          background: 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          color: '#fff'
        }}>
          <div style={{ ...orbStyle, background: '#4ecdc4', left: '-50px', right: 'auto' }}></div>

          <h2 style={{ ...headingStyle, color: '#f9c216' }}>Join the Hub.</h2>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
            <input type="text" placeholder="Username" style={inputStyle} />
            <input type="email" placeholder="Email Address" style={inputStyle} />
            <input type="password" placeholder="Create Password" style={inputStyle} />

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#fff', color: '#000' }}
              whileTap={{ scale: 0.98 }}
              style={{ ...buttonStyle, background: '#f9c216', color: '#333' }}
            >
              Sign Up
            </motion.button>
          </form>

          <div style={{ ...footerStyle, color: '#aaa' }}>
            Already have an account?
            <button onClick={() => setMode('login')} style={linkStyle}> Log In</button>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
};

// Styles
const buttonStyle = {
  padding: '15px',
  borderRadius: '15px',
  border: 'none',
  background: '#1a1a1a',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px'
};

const headingStyle = {
  marginBottom: '30px',
  fontSize: '32px',
  fontWeight: '800',
  color: '#1a1a1a',
  position: 'relative',
  zIndex: 1
};

const footerStyle = {
  marginTop: '30px',
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
  opacity: 0.6
};

const inputStyle = {
  width: '100%',
  padding: '15px',
  borderRadius: '12px',
  border: '1px solid #ddd',
  background: '#fff',
  fontSize: '15px',
  outline: 'none',
  transition: '0.3s'
}

export default Navbar