import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'

function Navbar({ cartCount }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setShowAuth(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav>
        <div className='navbar'>
          <div className='logo'>
            <div className='logo-container'>
              <div className='logo-image-container'>
                <div className='circle'></div>
                <div className='circle'></div>
              </div>
              <div className='logo-image-container'>
                <div className='circle'></div>
                <div className='circle'></div>
              </div>
            </div>
            <div className='logo-text'>
              <h1>SneakerHub</h1>
            </div>
          </div>

          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <ul>
              <li><NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
              <li><NavLink to="/shop" onClick={() => setIsMenuOpen(false)}>Shop</NavLink></li>
              <li><NavLink to="/blogs" onClick={() => setIsMenuOpen(false)}>Blogs</NavLink></li>

            </ul>
          </div>
          <div className='nav-component'>
            <div className='nav-component-pay'>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openAuth('login');
                }}
                style={{
                  color: '#333',
                  fontWeight: '700',
                  fontSize: '14px',
                  textDecoration: 'none',
                  marginRight: '10px',
                  cursor: 'pointer'
                }}
              >
                Login
              </a>
              <span>&#x24;</span>
              &nbsp;
              <span>0.00</span>
            </div>
            <div className='nav-component-cart'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={20} width={20}>
                <path d="M9 6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6H9ZM7 6H4C3.44772 6 3 6.44772 3 7V21C3 21.5523 3.44772 22 4 22H20C20.5523 22 21 21.5523 21 21V7C21 6.44772 20.5523 6 20 6H17C17 3.23858 14.7614 1 12 1C9.23858 1 7 3.23858 7 6ZM9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10H17C17 12.7614 14.7614 15 12 15C9.23858 15 7 12.7614 7 10H9Z"></path>
              </svg>
              <span>{cartCount || 0}</span>
            </div>
            <div className='menu-icon' onClick={toggleMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={30} width={30}>
                {isMenuOpen ? (
                  <path d="M19.07 4.93L17.66 3.52L12 9.17L6.34 3.52L4.93 4.93L10.59 10.59L4.93 16.24L6.34 17.66L12 12L17.66 17.66L19.07 16.24L13.41 10.59L19.07 4.93Z" />
                ) : (
                  <path d="M3 6H21V8H3V6ZM3 11H21V13H3V11ZM3 16H21V18H3V16Z" />
                )}
              </svg>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showAuth && (
          <AuthModal mode={authMode} onClose={() => setShowAuth(false)} setMode={setAuthMode} />
        )}
      </AnimatePresence>
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
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
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