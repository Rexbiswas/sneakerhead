import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './component/home';
import Shop from './component/shop';
import Blogs from './component/blogs';
import Footer from './component/footer';
function App() {
    const [cartCount, setCartCount] = useState(0);

    const handleAddToCart = () => {
        setCartCount(prevCount => prevCount + 1);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home cartCount={cartCount} />} />
                <Route path="/shop" element={<Shop cartCount={cartCount} handleAddToCart={handleAddToCart} />} />
                <Route path="/blogs" element={<Blogs cartCount={cartCount} />} />
            </Routes>
        </Router>
    );
}


export default App