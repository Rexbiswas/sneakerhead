import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Sneaker3D from './Sneaker3D';
import '../style/quickview.css';

const colorways = [
  { id: 'yellow', name: 'Solar Gold', hex: '#f9c216', glow: 'rgba(249, 194, 22, 0.35)', filter: 'hue-rotate(65deg)' },
  { id: 'cyan', name: 'Cyber Cyan', hex: '#00f2fe', glow: 'rgba(0, 242, 254, 0.35)', filter: 'hue-rotate(180deg) brightness(1.1)' },
  { id: 'red', name: 'Crimson Rush', hex: '#ff416c', glow: 'rgba(255, 65, 108, 0.35)', filter: 'hue-rotate(16deg) saturate(1.2)' },
  { id: 'green', name: 'Neon Emerald', hex: '#10b981', glow: 'rgba(16, 185, 129, 0.35)', filter: 'hue-rotate(100deg) saturate(1.1)' },
  { id: 'phantom', name: 'Phantom Dark', hex: '#52525b', glow: 'rgba(113, 113, 122, 0.25)', filter: 'grayscale(0.9) brightness(0.85)' },
];

const sizeCharts = {
  US: ['7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0', '11.5', '12.0'],
  EU: ['40', '41', '42', '42.5', '43', '44', '44.5', '45', '45.5', '46'],
  UK: ['6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0']
};

const anglePresets = [
  { id: 'side', label: 'Side', rotate: -15, scale: 1 },
  { id: 'perspective', label: 'Angle', rotate: -25, scale: 1.05 },
  { id: 'top', label: 'Top', rotate: 8, scale: 0.95 },
  { id: 'dynamic', label: 'Dynamic', rotate: 18, scale: 1.08 },
];

const QuickViewModal = ({
  isOpen,
  onClose,
  product,
  onNext,
  onPrev,
  addToCart,
  wishlistItems = [],
  toggleWishlist
}) => {
  const [viewMode, setViewMode] = useState('2D'); // '2D' | '3D'
  const [selectedColor, setSelectedColor] = useState(colorways[0]);
  const [unit, setUnit] = useState('US');
  const [selectedSize, setSelectedSize] = useState('9.5');
  const [quantity, setQuantity] = useState(1);
  const [selectedAngle, setSelectedAngle] = useState(anglePresets[1]);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isWishlisted = product ? wishlistItems.some(item => item.id === product.id) : false;

  // 3D Parallax Tilt for 2D mode
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-180, 180], [12, -12]), { stiffness: 220, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-180, 180], [-12, 12]), { stiffness: 220, damping: 25 });

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setAddedAnimation(false);
    }
  }, [product?.id]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !product) return null;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      color: selectedColor.id,
      colorName: selectedColor.name,
      size: `${unit} ${selectedSize}`,
      quantity: quantity
    });

    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 1500);
  };

  const basePrice = parseInt(product.price.replace('$', '')) || 120;
  const originalPrice = basePrice + 45;

  return (
    <AnimatePresence>
      <motion.div
        className="qv-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Next / Prev Navigation Arrows */}
        {onPrev && (
          <button
            className="qv-nav-arrow prev"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            title="Previous Sneaker (←)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}

        {onNext && (
          <button
            className="qv-nav-arrow next"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            title="Next Sneaker (→)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}

        <motion.div
          className="qv-modal-container"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Ambient Orb */}
          <div
            className="qv-orb qv-orb-ambient"
            style={{ background: `radial-gradient(circle, ${selectedColor.glow} 0%, transparent 70%)` }}
          />

          {/* Close Button - Clean & Isolated */}
          <button className="qv-close-btn" onClick={onClose} title="Close (Esc)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* ================= LEFT: VISUALIZER STAGE ================= */}
          <div className="qv-visual-section">
            <div className="qv-badge-bar">
              <span className="qv-category-pill">
                {product.category || 'Footwear'}
              </span>

              {/* Clean 2D / 3D Mode Toggle */}
              <div className="qv-mode-switch">
                <button
                  className={`qv-mode-btn ${viewMode === '2D' ? 'active' : ''}`}
                  onClick={() => setViewMode('2D')}
                >
                  2D Studio
                </button>
                <button
                  className={`qv-mode-btn ${viewMode === '3D' ? 'active' : ''}`}
                  onClick={() => setViewMode('3D')}
                >
                  3D Orbit
                </button>
              </div>
            </div>

            {/* Visual Stage */}
            <div className="qv-stage">
              <div
                className="qv-aura-circle"
                style={{ background: `radial-gradient(circle, ${selectedColor.glow} 0%, transparent 68%)` }}
              />

              {viewMode === '2D' ? (
                <motion.div
                  className="qv-shoe-card"
                  style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <motion.img
                    key={`${product.id}-${selectedAngle.id}`}
                    src={product.img || 'sneaker_1.png'}
                    alt={product.name}
                    className="qv-shoe-image"
                    style={{
                      transform: `rotate(${selectedAngle.rotate}deg) scale(${selectedAngle.scale})`,
                      filter: `drop-shadow(0 25px 25px rgba(0, 0, 0, 0.45)) ${selectedColor.filter}`,
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: selectedAngle.scale }}
                    transition={{ duration: 0.35 }}
                  />
                </motion.div>
              ) : (
                <div className="qv-3d-container">
                  <Sneaker3D selectedColor={selectedColor.id} />
                  <div className="qv-3d-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                      <path d="M3 3v5h5"></path>
                    </svg>
                    Drag to rotate 360°
                  </div>
                </div>
              )}
            </div>

            {/* Angle Bar (in 2D mode) */}
            {viewMode === '2D' ? (
              <div className="qv-angles-bar">
                {anglePresets.map((preset) => (
                  <button
                    key={preset.id}
                    className={`qv-angle-pill ${selectedAngle.id === preset.id ? 'active' : ''}`}
                    onClick={() => setSelectedAngle(preset)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ height: '28px' }} />
            )}
          </div>

          {/* ================= RIGHT: CLEAN PRODUCT DETAILS ================= */}
          <div className="qv-info-section">
            <div className="qv-info-top">
              {/* Clean Title & Price Header */}
              <div className="qv-header">
                <div className="qv-meta-row">
                  <span className="qv-meta-tag">{product.category || 'Sneaker'} Collection</span>
                  <div className="qv-rating-wrap">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#f9c216" stroke="#f9c216">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>4.9</span>
                    <span className="qv-reviews-count">(148)</span>
                  </div>
                </div>

                <h2 className="qv-title">{product.name}</h2>

                <div className="qv-price-row">
                  <span className="qv-price">{product.price}</span>
                  <span className="qv-original-price">${originalPrice}</span>
                  <span className="qv-discount-pill">Save $45</span>
                </div>

                {/* Clean Urgency Indicator */}
                <div className="qv-urgency-clean">
                  <span className="qv-urgency-dot"></span>
                  <span><strong>14 viewing</strong> • Only 2 pairs remaining in selected size</span>
                </div>
              </div>

              {/* Colorway Row */}
              <div className="qv-section-block">
                <div className="qv-block-label">
                  <span>Colorway</span>
                  <span className="qv-selected-text">{selectedColor.name}</span>
                </div>
                <div className="qv-colors-row">
                  {colorways.map((c) => (
                    <button
                      key={c.id}
                      className={`qv-swatch-btn ${selectedColor.id === c.id ? 'active' : ''}`}
                      onClick={() => setSelectedColor(c)}
                      title={c.name}
                    >
                      <span className="qv-swatch-circle" style={{ background: c.hex }}></span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="qv-section-block">
                <div className="qv-block-label">
                  <span>Select Size ({unit})</span>
                  <div className="qv-unit-toggle">
                    {['US', 'EU', 'UK'].map((u) => (
                      <button
                        key={u}
                        className={`qv-unit-chip ${unit === u ? 'active' : ''}`}
                        onClick={() => setUnit(u)}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="qv-sizes-row">
                  {sizeCharts[unit].map((size) => (
                    <button
                      key={size}
                      className={`qv-size-chip ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clean Minimal Perks Strip */}
              <div className="qv-perks-strip">
                <div className="qv-perk-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <span>100% Authentic</span>
                </div>
                <div className="qv-perk-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                  <span>Express Delivery</span>
                </div>
                <div className="qv-perk-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row - Always Visible & Pinned */}
            <div className="qv-actions-row">
              {/* Stepper */}
              <div className="qv-stepper">
                <button
                  className="qv-stepper-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="qv-stepper-val">{quantity}</span>
                <button
                  className="qv-stepper-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <motion.button
                className="qv-main-cta"
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
              >
                {addedAnimation ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Added to Bag
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add to Cart • ${basePrice * quantity}
                  </>
                )}
              </motion.button>

              {/* Wishlist Heart */}
              <button
                className={`qv-fav-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => {
                  if (toggleWishlist && product) {
                    toggleWishlist(product);
                  }
                }}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={isWishlisted ? '#ff4b4b' : 'none'}
                  stroke={isWishlisted ? '#ff4b4b' : 'currentColor'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
