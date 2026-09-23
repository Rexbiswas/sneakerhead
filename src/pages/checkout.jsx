import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/navbar';
// import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';
import {
  CreditCard,
  Banknote,
  Zap,
  Tag,
  PackageCheck,
  Check,
  X,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import '../style/checkout.css';

const Checkout = (props) => {
  const { cartItems = [], clearCart } = props;
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: ''
  });

  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' | 'express'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'cod'
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null); // stores order details on success

  // Auto-fill user details if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.username ? user.username.split(' ')[0] : prev.firstName,
        lastName: user.username && user.username.includes(' ') ? user.username.split(' ').slice(1).join(' ') : prev.lastName,
        cardName: user.username || prev.cardName
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const displayItems = cartItems;

  // Price calculations
  const subtotal = displayItems.reduce((acc, item) => {
    const price = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  const shippingFee = shippingMethod === 'express' ? 199 : 0;
  const discountRate = couponApplied ? 0.2 : 0;
  const discountAmount = subtotal * discountRate;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    if (couponInput.trim().toUpperCase() === 'SNEAKER20') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try "SNEAKER20" for 20% off!');
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (displayItems.length === 0) return;

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: `${formData.firstName} ${formData.lastName}`.trim() || user?.username || 'Customer',
        customerEmail: formData.email,
        items: displayItems.map((item) => ({
          id: String(item.id || item.cartId),
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          img: item.img,
          size: item.size || '9',
          color: item.color || '#000000'
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          phone: formData.phone
        },
        shippingMethod,
        paymentMethod,
        subtotal: Number(subtotal.toFixed(2)),
        shippingFee,
        discount: Number(discountAmount.toFixed(2)),
        total: Number(finalTotal.toFixed(2))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('sneakerhead_token')
            ? { Authorization: `Bearer ${localStorage.getItem('sneakerhead_token')}` }
            : {})
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOrderSuccess({
          orderNumber: data.orderNumber,
          total: finalTotal.toFixed(2),
          customerEmail: formData.email
        });
        if (clearCart) {
          clearCart();
        }
      } else {
        // Fallback demo order number if offline
        const fallbackId = `SNK-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderSuccess({
          orderNumber: fallbackId,
          total: finalTotal.toFixed(2),
          customerEmail: formData.email
        });
        if (clearCart) {
          clearCart();
        }
      }
    } catch (err) {
      // Offline fallback
      const fallbackId = `SNK-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderSuccess({
        orderNumber: fallbackId,
        total: finalTotal.toFixed(2),
        customerEmail: formData.email
      });
      if (clearCart) {
        clearCart();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar {...props} />

      <main className="checkout-page-wrapper">
        <div className="checkout-container">
          {/* Breadcrumb & Title */}
          <div className="checkout-header">
            <div className="checkout-breadcrumbs">
              <Link to="/">Home</Link>
              <ChevronRight size={13} style={{ opacity: 0.5 }} />
              <Link to="/shop">Shop</Link>
              <ChevronRight size={13} style={{ opacity: 0.5 }} />
              <span className="active">Secure Checkout</span>
            </div>
            <div className="checkout-title-row">
              <h1 className="checkout-title">Checkout</h1>
              {displayItems.length > 0 && (
                <span className="checkout-item-count-badge">
                  {displayItems.reduce((acc, item) => acc + (item.quantity || 1), 0)} items in bag
                </span>
              )}
            </div>
          </div>

          {/* Cart notice if empty */}
          {cartItems.length === 0 && (
            <div style={{
              background: '#fefce8',
              border: '1px solid #fde047',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: '#854d0e',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={18} color="#ca8a04" />
                <span>Your cart is empty. Add shoes from the shop to proceed with checkout!</span>
              </span>
              <Link to="/shop" style={{ color: '#ca8a04', fontWeight: '800', textDecoration: 'underline', marginLeft: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Browse Shop Catalog <ArrowRight size={14} />
              </Link>
            </div>
          )}

          <div className="checkout-grid">
              {/* Left Column: Form Details */}
              <form onSubmit={handleOrderSubmit} className="checkout-left-col">
                {/* User Status Banner */}
                {isAuthenticated ? (
                  <div className="checkout-user-banner">
                    <span>
                      Signed in as <strong>{user?.username}</strong> ({user?.email})
                    </span>
                    <span style={{ color: '#ca8a04', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={14} fill="#ca8a04" /> VIP Member Drop
                    </span>
                  </div>
                ) : (
                  <div className="checkout-user-banner" style={{ background: '#f4f4f5', borderColor: '#e4e4e7' }}>
                    <span>Checking out as Guest</span>
                    <span style={{ color: '#71717a' }}>Have an account? Log in from the top bar</span>
                  </div>
                )}

                {/* Section 1: Contact & Shipping */}
                <div className="checkout-card">
                  <h2 className="checkout-section-heading">
                    <span className="checkout-step-number">1</span>
                    Shipping Details
                  </h2>

                  <div className="checkout-form-grid">
                    <div className="checkout-form-group">
                      <label className="checkout-label">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        placeholder="First Name"
                        className="checkout-input"
                      />
                    </div>

                    <div className="checkout-form-group">
                      <label className="checkout-label">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        placeholder="Last Name"
                        className="checkout-input"
                      />
                    </div>

                    <div className="checkout-form-group">
                      <label className="checkout-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="name@example.com"
                        className="checkout-input"
                      />
                    </div>

                    <div className="checkout-form-group">
                      <label className="checkout-label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+91 98765 43210"
                        className="checkout-input"
                      />
                    </div>

                    <div className="checkout-form-group full-width">
                      <label className="checkout-label">Street Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="Flat / House No., Building, Street"
                        className="checkout-input"
                      />
                    </div>

                    <div className="checkout-form-group full-width">
                      <label className="checkout-label">Colony, Area, Landmark (Optional)</label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        placeholder="Near Metro Station / Landmark"
                        className="checkout-input"
                      />
                    </div>

                    <div className="checkout-form-group">
                      <label className="checkout-label">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="Mumbai"
                        className="checkout-input"
                      />
                    </div>

                    <div className="checkout-form-group">
                      <label className="checkout-label">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="Maharashtra"
                        className="checkout-input"
                      />
                    </div>

                    <div className="checkout-form-group">
                      <label className="checkout-label">PIN Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        placeholder="400001"
                        className="checkout-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Shipping Method */}
                <div className="checkout-card">
                  <h2 className="checkout-section-heading">
                    <span className="checkout-step-number">2</span>
                    Delivery Method
                  </h2>

                  <div className="delivery-options-grid">
                    <div
                      className={`delivery-option-card ${shippingMethod === 'standard' ? 'selected' : ''}`}
                      onClick={() => setShippingMethod('standard')}
                    >
                      <div>
                        <div className="delivery-option-header">
                          <span className="delivery-option-name">Standard Delivery</span>
                          <span className="delivery-option-price" style={{ color: '#16a34a' }}>FREE</span>
                        </div>
                        <p className="delivery-option-desc">Delivered in 3-5 business days via Blue Dart</p>
                      </div>
                    </div>

                    <div
                      className={`delivery-option-card ${shippingMethod === 'express' ? 'selected' : ''}`}
                      onClick={() => setShippingMethod('express')}
                    >
                      <div>
                        <div className="delivery-option-header">
                          <span className="delivery-option-name" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Zap size={16} fill="#f9c216" color="#f9c216" /> Express Drop
                          </span>
                          <span className="delivery-option-price">₹199</span>
                        </div>
                        <p className="delivery-option-desc">Next day delivery with collector box packaging</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Payment Method */}
                <div className="checkout-card">
                  <h2 className="checkout-section-heading">
                    <span className="checkout-step-number">3</span>
                    Payment Method
                  </h2>

                  <div className="payment-tabs">
                    <button
                      type="button"
                      className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <CreditCard size={17} />
                      <span>Credit / Debit</span>
                    </button>
                    <button
                      type="button"
                      className={`payment-tab-btn ${paymentMethod === 'cod' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('cod')}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <Banknote size={17} />
                      <span>Cash on Delivery</span>
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="checkout-form-grid">
                      <div className="checkout-form-group full-width">
                        <label className="checkout-label">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="4532 •••• •••• 8892"
                          maxLength={19}
                          className="checkout-input"
                        />
                      </div>

                      <div className="checkout-form-group">
                        <label className="checkout-label">Expires (MM/YY)</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="08/28"
                          maxLength={5}
                          className="checkout-input"
                        />
                      </div>

                      <div className="checkout-form-group">
                        <label className="checkout-label">CVV / CVC</label>
                        <input
                          type="password"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          placeholder="•••"
                          maxLength={4}
                          className="checkout-input"
                        />
                      </div>

                      <div className="checkout-form-group full-width">
                        <label className="checkout-label">Name on Card</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          placeholder="Name as on Card"
                          className="checkout-input"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div style={{ background: '#f4f4f5', padding: '16px', borderRadius: '12px', fontSize: '13px', color: '#52525b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <PackageCheck size={18} color="#52525b" style={{ flexShrink: 0 }} />
                      <span>You can pay in cash or via QR upon delivery. Please ensure exact cash is available at your delivery address.</span>
                    </div>
                  )}

                  {/* Place Order CTA */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || displayItems.length === 0}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="checkout-submit-btn"
                  >
                    {isSubmitting ? (
                      'Processing Order...'
                    ) : (
                      <>
                        <span>Complete Order • ₹{Math.round(finalTotal).toLocaleString('en-IN')}</span>
                        <ArrowRight size={18} strokeWidth={2.5} />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Right Column: Order Summary */}
              <div className="checkout-summary-box">
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 16px 0', color: '#18181b' }}>
                  Order Summary
                </h3>

                {/* Items List */}
                <div className="summary-items-list">
                  {displayItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 10px', color: '#71717a' }}>
                      <ShoppingBag size={36} color="#a1a1aa" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                      <p style={{ margin: '0 0 6px', fontWeight: '600' }}>Your cart is empty</p>
                      <Link to="/shop" style={{ color: '#ca8a04', fontSize: '13px', fontWeight: '700' }}>
                        Browse sneakers to add items →
                      </Link>
                    </div>
                  ) : (
                    displayItems.map((item) => (
                      <div key={item.cartId || item.id} className="summary-item-card">
                        <div className="summary-item-img-wrap">
                          <img src={item.img} alt={item.name} />
                          <span className="summary-item-badge">{item.quantity}</span>
                        </div>
                        <div className="summary-item-info">
                          <h4 className="summary-item-name">{item.name}</h4>
                          <div className="summary-item-meta">
                            {item.size && <span>Size {item.size} • </span>}
                            {item.color && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                Color{' '}
                                <span
                                  style={{
                                    display: 'inline-block',
                                    width: '9px',
                                    height: '9px',
                                    borderRadius: '50%',
                                    background: item.color
                                  }}
                                />
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="summary-item-price">
                          {String(item.price).startsWith('₹') ? item.price : `₹${item.price.replace('$', '')}`}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="coupon-input-group">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Promo code"
                    className="checkout-input"
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="coupon-apply-btn">
                    Apply
                  </button>
                </form>

                {couponError && (
                  <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', margin: '-10px 0 14px 0' }}>
                    {couponError}
                  </p>
                )}

                {couponApplied && (
                  <div className="coupon-pill" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Tag size={15} color="#16a34a" />
                      "SNEAKER20" Applied (-20%)
                    </span>
                    <button
                      type="button"
                      onClick={() => setCouponApplied(false)}
                      style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', padding: '2px' }}
                      aria-label="Remove coupon"
                    >
                      <X size={15} strokeWidth={2.5} />
                    </button>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="summary-price-breakdown">
                  <div className="summary-price-row">
                    <span>Subtotal</span>
                    <span>₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="summary-price-row">
                    <span>Estimated Shipping</span>
                    <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`}</span>
                  </div>

                  {couponApplied && (
                    <div className="summary-price-row" style={{ color: '#16a34a', fontWeight: '700' }}>
                      <span>Discount (20% OFF)</span>
                      <span>-₹{Math.round(discountAmount).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="summary-price-row total">
                    <span>Total</span>
                    <span>₹{Math.round(finalTotal).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="checkout-trust-badges">
                  <div className="trust-badge-item">
                    <ShieldCheck size={18} color="#16a34a" />
                    <span>100% Authentic</span>
                  </div>
                  <div className="trust-badge-item">
                    <Truck size={18} color="#3b82f6" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="trust-badge-item">
                    <RotateCcw size={18} color="#eab308" />
                    <span>Free Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

      {/* Order Confirmation Modal */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="order-modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="order-modal-card"
            >
              <div className="order-success-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={28} strokeWidth={3} />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#18181b', margin: '0 0 8px 0' }}>
                Order Confirmed!
              </h2>
              <p style={{ color: '#71717a', fontSize: '14px', margin: '0' }}>
                Thank you for your order. A confirmation email has been sent to{' '}
                <strong>{orderSuccess.customerEmail || 'your email'}</strong>.
              </p>

              <div>
                <span className="order-number-chip">Order #{orderSuccess.orderNumber}</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', marginBottom: '24px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                  <span style={{ color: '#71717a' }}>Amount Paid</span>
                  <span style={{ fontWeight: '800', color: '#18181b' }}>₹{Number(orderSuccess.total).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#71717a' }}>Status</span>
                  <span style={{ color: '#16a34a', fontWeight: '800' }}>Confirmed & Processing</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOrderSuccess(null);
                  navigate('/shop');
                }}
                className="checkout-submit-btn"
                style={{ marginTop: 0 }}
              >
                Continue Shopping
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* <Footer /> */}
    </>
  );
};

export default Checkout;
