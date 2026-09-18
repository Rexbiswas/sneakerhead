import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const WishlistSidebar = ({
  isWishlistOpen,
  setIsWishlistOpen,
  wishlistItems = [],
  removeFromWishlist,
  moveToCart,
  moveAllToCart,
  clearWishlist
}) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    setIsWishlistOpen(false);
    navigate('/shop');
  };

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsWishlistOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(10, 10, 15, 0.65)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 9999
            }}
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '420px',
              maxWidth: '100vw',
              height: '100vh',
              background: 'rgba(18, 19, 26, 0.96)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '-15px 0 50px rgba(0, 0, 0, 0.5)',
              zIndex: 10000,
              display: 'flex',
              flexDirection: 'column',
              padding: '28px 24px',
              color: '#ffffff',
              boxSizing: 'border-box'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 75, 75, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff4b4b'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff4b4b" stroke="#ff4b4b" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#fff', letterSpacing: '-0.3px' }}>Your Wishlist</h2>
                  <span style={{ fontSize: '12px', color: '#8e8e99', fontWeight: '500' }}>
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'saved item' : 'saved items'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsWishlistOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ccc',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
                title="Close Wishlist"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Items Container */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
              {wishlistItems.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto 0', padding: '40px 10px' }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'rgba(255, 75, 75, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 18px auto',
                    border: '1px dashed rgba(255, 75, 75, 0.3)'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff4b4b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Your wishlist is empty</h3>
                  <p style={{ fontSize: '13px', color: '#8e8e99', lineHeight: '1.5', maxWidth: '280px', margin: '0 auto 24px auto' }}>
                    Save your favorite kicks to track them, pick your size, or cop them later.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleExplore}
                    style={{
                      background: 'linear-gradient(135deg, #f9c216 0%, #ff9f00 100%)',
                      color: '#000',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '30px',
                      fontWeight: '800',
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: '0 6px 20px rgba(249, 194, 22, 0.3)'
                    }}
                  >
                    Explore Drops
                  </motion.button>
                </div>
              ) : (
                wishlistItems.map((item) => (
                  <motion.div
                    key={item.wishId || item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      borderRadius: '16px',
                      padding: '12px 14px',
                      position: 'relative'
                    }}
                  >
                    {/* Sneaker Thumbnail */}
                    <div style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '12px',
                      background: 'radial-gradient(circle, rgba(249, 194, 22, 0.2) 0%, rgba(0, 0, 0, 0.3) 70%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden'
                    }}>
                      <img
                        src={item.img || 'sneaker_1.png'}
                        alt={item.name}
                        style={{ width: '85%', transform: 'rotate(-15deg)', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.4))' }}
                      />
                    </div>

                    {/* Sneaker Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#8e8e99', fontWeight: '700' }}>
                        {item.category || 'Sneaker'}
                      </span>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#fff',
                        margin: '2px 0 4px 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.name}
                      </h4>
                      <span style={{ fontSize: '15px', fontWeight: '900', color: '#f9c216' }}>
                        {item.price}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#666',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ff4b4b'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; }}
                        title="Remove from Wishlist"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => moveToCart(item)}
                        style={{
                          background: 'rgba(249, 194, 22, 0.15)',
                          border: '1px solid rgba(249, 194, 22, 0.4)',
                          color: '#f9c216',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="9" cy="21" r="1"></circle>
                          <circle cx="20" cy="21" r="1"></circle>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Move to Bag
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {wishlistItems.length > 0 && (
              <div style={{ paddingTop: '18px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={moveAllToCart}
                  style={{
                    background: 'linear-gradient(135deg, #f9c216 0%, #ff9f00 100%)',
                    color: '#000',
                    border: 'none',
                    padding: '13px',
                    borderRadius: '30px',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 20px rgba(249, 194, 22, 0.3)'
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Move All ({wishlistItems.length}) to Bag
                </motion.button>

                {clearWishlist && (
                  <button
                    onClick={clearWishlist}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#71717a',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'center',
                      padding: '4px'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ff4b4b'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#71717a'; }}
                  >
                    Clear All
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistSidebar;
