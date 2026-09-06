import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Shop from './pages/shops';
import Blogs from './pages/blogs';
import Footer from './components/footer';
function App() {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            // Check if item already exists with same id, size, and color
            const existingItemIndex = prevItems.findIndex(
                item => item.id === product.id && item.size === product.size && item.color === product.color
            );

            if (existingItemIndex >= 0) {
                // Update quantity of existing item
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += (product.quantity || 1);
                return newItems;
            } else {
                // Add new item
                return [...prevItems, { ...product, quantity: product.quantity || 1, cartId: Date.now() + Math.random() }];
            }
        });
        setIsCartOpen(true); // Open cart when adding item
    };

    const removeFromCart = (cartId) => {
        setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
    };

    const updateQuantity = (cartId, change) => {
        setCartItems(prevItems => prevItems.map(item => {
            if (item.cartId === cartId) {
                const newQuantity = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    // Calculate total count for the badge
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const cartProps = {
        cartItems,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home {...cartProps} />} />
                <Route path="/shop" element={<Shop {...cartProps} />} />
                <Route path="/blogs" element={<Blogs {...cartProps} />} />
            </Routes>
        </Router>
    );
}


export default App