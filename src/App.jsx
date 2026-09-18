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
    const [wishlistItems, setWishlistItems] = useState([
        { id: 1, name: "Air Max 97", price: "$180", img: "sneaker_1.png", category: "Running", wishId: 1 }
    ]);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);

    const toggleWishlist = (product) => {
        setWishlistItems(prevItems => {
            const exists = prevItems.some(item => item.id === product.id);
            if (exists) {
                return prevItems.filter(item => item.id !== product.id);
            } else {
                return [...prevItems, { ...product, wishId: Date.now() + Math.random() }];
            }
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const moveToCart = (product) => {
        addToCart(product);
        removeFromWishlist(product.id);
    };

    const moveAllToCart = () => {
        wishlistItems.forEach(item => addToCart(item));
        setWishlistItems([]);
        setIsWishlistOpen(false);
        setIsCartOpen(true);
    };

    const clearWishlist = () => {
        setWishlistItems([]);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const wishlistCount = wishlistItems.length;

    const sharedProps = {
        cartItems,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        wishlistItems,
        wishlistCount,
        isWishlistOpen,
        setIsWishlistOpen,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        moveAllToCart,
        clearWishlist
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home {...sharedProps} />} />
                <Route path="/shop" element={<Shop {...sharedProps} />} />
                <Route path="/blogs" element={<Blogs {...sharedProps} />} />
            </Routes>
        </Router>
    );
}


export default App