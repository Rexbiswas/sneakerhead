import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const drawerVariants = {
  hidden: { x: '100%', opacity: 0.8 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 28,
      stiffness: 260,
      mass: 0.9,
      when: 'beforeChildren',
      staggerChildren: 0.08
    }
  },
  exit: {
    x: '100%',
    opacity: 0.5,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300
    }
  }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: 40, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', damping: 20, stiffness: 200 }
  }
};

const navItems = [
  {
    num: '01',
    title: 'Home',
    desc: '3D Interactive Showcase & Hero Drops',
    path: '/',
    badge: 'NEW'
  },
  {
    num: '02',
    title: 'Shop Catalog',
    desc: 'Explore all 200+ silhouettes & editions',
    path: '/shop',
    badge: 'POPULAR'
  },
  {
    num: '03',
    title: 'Editorial & Blogs',
    desc: 'Culture, styling guides & drop calendars',
    path: '/blogs',
    badge: null
  }
];

const categoryPills = [
  { name: '🔥 Trending', cat: 'Lifestyle' },
  { name: 'Air Jordan', cat: 'Basketball' },
  { name: 'Dunk Low', cat: 'Lifestyle' },
  { name: 'Running', cat: 'Running' },
  { name: 'Basketball', cat: 'Basketball' }
];

const NavDrawer = ({ isOpen, onClose, openAuth }) => {
  const navigate = useNavigate();

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCategoryClick = () => {
    navigate('/shop');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            className="drawer-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Slide-out Drawer */}
          <motion.aside
            className="link-drawer-panel"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            {/* Ambient Background Glow Orbs */}
            <div className="drawer-glow-orb drawer-glow-1" />
            <div className="drawer-glow-orb drawer-glow-2" />

            {/* Header */}
            <div className="drawer-header">
              <div className="drawer-brand">
                <div className="drawer-logo-badge">
                  <span className="drawer-logo-dot"></span>
                  <span className="drawer-logo-dot"></span>
                  <span className="drawer-logo-dot"></span>
                  <span className="drawer-logo-dot"></span>
                </div>
                <div>
                  <h3 className="drawer-brand-title">SneakerHub</h3>
                  <div className="drawer-live-pill">
                    <span className="live-ping"></span>
                    <span>SPRING '26 DROP LIVE</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="drawer-close-btn"
                onClick={onClose}
                aria-label="Close drawer"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>
            </div>

            {/* Drawer Body */}
            <div className="drawer-body">
              {/* Category Quick Pills */}
              <motion.div variants={itemVariants} className="drawer-section-categories">
                <span className="drawer-section-label">QUICK SILHOUETTES</span>
                <div className="drawer-categories-wrap">
                  {categoryPills.map((pill, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="category-pill-btn"
                      onClick={handleCategoryClick}
                    >
                      {pill.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Main Nav Links */}
              <div className="drawer-nav-section">
                <span className="drawer-section-label">NAVIGATION DIRECTORY</span>
                <ul className="drawer-nav-list">
                  {navItems.map((item) => (
                    <motion.li key={item.path} variants={itemVariants} className="drawer-nav-item">
                      <NavLink
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `drawer-link-card ${isActive ? 'active-link' : ''}`
                        }
                      >
                        <div className="drawer-link-number">{item.num}</div>
                        <div className="drawer-link-text">
                          <div className="drawer-link-title-row">
                            <span className="drawer-link-title">{item.title}</span>
                            {item.badge && (
                              <span className={`drawer-item-badge ${item.badge.toLowerCase()}`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="drawer-link-desc">{item.desc}</span>
                        </div>
                        <div className="drawer-link-arrow">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Weekly Spotlight Card */}
              <motion.div variants={itemVariants} className="drawer-spotlight-card">
                <div className="spotlight-tag">
                  <span>★</span> WEEKLY SPOTLIGHT
                </div>
                <div className="spotlight-content">
                  <div className="spotlight-image-container">
                    <img src="/sneaker_1.png" alt="Nike Air Max 270" className="spotlight-img" />
                    <div className="spotlight-glow"></div>
                  </div>
                  <div className="spotlight-details">
                    <h4>Air Max 270 Special</h4>
                    <p className="spotlight-price">$150.00 <span className="spotlight-old-price">$180.00</span></p>
                    <div className="spotlight-stars">
                      ★★★★★ <span className="reviews">(4.9/5)</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="spotlight-cta"
                      onClick={() => {
                        navigate('/shop');
                        onClose();
                      }}
                    >
                      Shop Exclusive Drop →
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Express Perks Banner */}
              <motion.div variants={itemVariants} className="drawer-perk-banner">
                <div className="perk-icon">⚡</div>
                <div className="perk-info">
                  <strong>Free Worldwide Priority Shipping</strong>
                  <span>On all orders over $150 • 100% Verified Authentic</span>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="drawer-footer">
              <div className="drawer-auth-actions">
                <button
                  className="drawer-auth-btn drawer-login-btn"
                  onClick={() => openAuth('login')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Member Sign In
                </button>
                <button
                  className="drawer-auth-btn drawer-vip-btn"
                  onClick={() => openAuth('signup')}
                >
                  Join VIP Hub
                </button>
              </div>

              {/* Social Links */}
              <div className="drawer-socials">
                <a href="#instagram" className="social-chip" title="Instagram" onClick={(e) => e.preventDefault()}>
                  IG
                </a>
                <a href="#discord" className="social-chip" title="Discord" onClick={(e) => e.preventDefault()}>
                  DC
                </a>
                <a href="#x" className="social-chip" title="Twitter / X" onClick={(e) => e.preventDefault()}>
                  X
                </a>
                <a href="#tiktok" className="social-chip" title="TikTok" onClick={(e) => e.preventDefault()}>
                  TT
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default NavDrawer;
