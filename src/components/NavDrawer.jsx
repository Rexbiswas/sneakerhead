import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

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
    path: '/'
  },
  {
    num: '02',
    title: 'Shop Catalog',
    desc: 'Explore all 200+ silhouettes & editions',
    path: '/shop'
  },
  {
    num: '03',
    title: 'Editorial & Blogs',
    desc: 'Culture, styling guides & drop calendars',
    path: '/blogs'
  }
];

const NavDrawer = ({ isOpen, onClose, openAuth }) => {
  const { user, isAuthenticated, logout } = useAuth();
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
                whileHover={{ rotate: 90, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="drawer-close-btn"
                onClick={onClose}
                aria-label="Close drawer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>
            </div>

            {/* Drawer Body */}
            <div className="drawer-body">

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
                          <span className="drawer-link-title">{item.title}</span>
                          <span className="drawer-link-desc">{item.desc}</span>
                        </div>
                        <div className="drawer-link-arrow">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Footer */}
            <div className="drawer-footer">
              {isAuthenticated ? (
                <div className="drawer-logged-user">
                  <div className="drawer-user-info">
                    <div className="drawer-avatar">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="drawer-username">{user?.username}</div>
                      <div className="drawer-email">{user?.email}</div>
                    </div>
                  </div>
                  <button
                    className="drawer-auth-btn drawer-logout-btn"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
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
              )}

              {/* Social Links */}
              <div className="drawer-socials">
                <a href="#instagram" className="social-chip" title="Instagram" aria-label="Instagram" onClick={(e) => e.preventDefault()}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#discord" className="social-chip" title="Discord" aria-label="Discord" onClick={(e) => e.preventDefault()}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
                <a href="#x" className="social-chip" title="X (Twitter)" aria-label="X (Twitter)" onClick={(e) => e.preventDefault()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
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
