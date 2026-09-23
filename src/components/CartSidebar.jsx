import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CartSidebar = ({ isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity }) => {
    const navigate = useNavigate();
    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const calculateTotal = () => {
        const total = cartItems.reduce((acc, item) => {
            const price = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
            return acc + (price * (item.quantity || 1));
        }, 0);
        return Math.round(total).toLocaleString('en-IN');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 9999
                        }}
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            width: '400px',
                            maxWidth: '100vw',
                            height: '100vh',
                            background: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(20px)',
                            borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.1)',
                            zIndex: 10000,
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '30px 20px',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>Your Cart</h2>
                            <button onClick={toggleCart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a', padding: '5px' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {cartItems.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1" style={{ margin: '0 auto 20px auto', display: 'block' }}>
                                        <path d="M9 6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6H9ZM7 6H4C3.44772 6 3 6.44772 3 7V21C3 21.5523 3.44772 22 4 22H20C20.5523 22 21 21.5523 21 21V7C21 6.44772 20.5523 6 20 6H17C17 3.23858 14.7614 1 12 1C9.23858 1 7 3.23858 7 6ZM9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10H17C17 12.7614 14.7614 15 12 15C9.23858 15 7 12.7614 7 10H9Z"></path>
                                    </svg>
                                    <p>Your cart is empty.</p>
                                </div>
                            ) : (
                                cartItems.map(item => (
                                    <motion.div 
                                        key={item.cartId} 
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        style={{ display: 'flex', gap: '15px', background: '#fff', padding: '15px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}
                                    >
                                        <div style={{ width: '80px', height: '80px', background: '#f5f5f5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={item.img} alt={item.name} style={{ width: '90%', height: '90%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#1a1a1a', fontWeight: 'bold' }}>{item.name}</h4>
                                            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                                                {item.size && <span>Size: {item.size} </span>}
                                                {item.color && <span style={{ marginLeft: '5px' }}>Color: <span style={{display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: item.color, verticalAlign: 'middle'}}></span></span>}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: '800', color: '#f9c216', fontSize: '16px' }}>
                                                    {String(item.price).startsWith('₹') ? item.price : `₹${String(item.price).replace('$', '')}`}
                                                </span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f5f5f5', borderRadius: '20px', padding: '2px 8px' }}>
                                                    <button onClick={() => updateQuantity(item.cartId, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>-</button>
                                                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.cartId, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFromCart(item.cartId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4f', padding: '0 5px', height: 'fit-content' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M18 6L6 18M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px dashed #eee' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                                    <span>Total</span>
                                    <span style={{ color: '#f9c216' }}>₹{calculateTotal()}</span>
                                </div>
                                <motion.button 
                                    whileHover={{ scale: 1.02, background: '#1a1a1a', color: '#f9c216' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setIsCartOpen(false);
                                        navigate('/checkout');
                                    }}
                                    style={{ 
                                        width: '100%', 
                                        padding: '15px', 
                                        background: '#f9c216', 
                                        color: '#1a1a1a', 
                                        border: 'none', 
                                        borderRadius: '15px', 
                                        fontSize: '16px', 
                                        fontWeight: '800', 
                                        cursor: 'pointer',
                                        boxShadow: '0 10px 20px rgba(249, 194, 22, 0.3)'
                                    }}
                                >
                                    Proceed to Checkout
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
