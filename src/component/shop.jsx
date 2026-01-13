import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Navbar from './navbar'
import Sneaker3D from './Sneaker3D'

const Shop = ({ cartCount, handleAddToCart }) => {
  const [rating, setRating] = useState(4);
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [selectedSize, setSelectedSize] = useState(40);
  const [addedItems, setAddedItems] = useState({});

  // Filter Logic
  const [activeFilter, setActiveFilter] = useState('All');

  const productsData = [
    { id: 1, name: "Air Max 97", price: "$180", img: "sneaker_1.png", category: "Running" },
    { id: 2, name: "Force 1 Shadow", price: "$140", img: "sneaker_1.png", category: "Lifestyle" },
    { id: 3, name: "Zoom Pegasus", price: "$120", img: "sneaker_1.png", category: "Running" },
    { id: 4, name: "Jordan Retro", price: "$200", img: "sneaker_1.png", category: "Basketball" },
    { id: 5, name: "Dunk Low", price: "$110", img: "sneaker_1.png", category: "Lifestyle" },
    { id: 6, name: "Kyrie Flytrap", price: "$130", img: "sneaker_1.png", category: "Basketball" },
    { id: 7, name: "LeBron Witness", price: "$160", img: "sneaker_1.png", category: "Basketball" },
    { id: 8, name: "Blazer Mid", price: "$105", img: "sneaker_1.png", category: "Lifestyle" },
    { id: 9, name: "Air Huarache", price: "$150", img: "sneaker_1.png", category: "Running" },
  ];

  const filteredProducts = activeFilter === 'All'
    ? productsData
    : productsData.filter(item => item.category === activeFilter);

  const filters = ['All', 'Running', 'Lifestyle', 'Basketball'];

  // 3D Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-300, 300], [5, -5]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-5, 5]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    x.set(offsetX);
    y.set(offsetY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main>
        {/* shops */}
        <motion.div
          className='products-container'
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className='product-circle'></div>
          <div className='outer-product-circle'></div>
          <div className='outer-product-circle-1'></div>
          <div className='outer-product-circle-2'></div>
          <div className='outer-product-circle-3'></div>
        </motion.div>
        <div className='product-circle-container'>
          <div className='product-circle-1'></div>
        </div>
        <div className='product-circle-reflect-container'>
          <div className='product-circle-2'></div>
        </div>
        <motion.div
          className='product-details'
          initial={{ opacity: 0, x: "-50%", y: -30 }}
          animate={{ opacity: 1, x: "-50%", y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className='product-details-content'>
            <a href='/' className='product-details-home'>Home</a>
            &nbsp;
            <span className='breadcrumb-separator'>&#47;</span>
            &nbsp;
            <span className='span-product-details'>Product details</span>
          </div>
          <div className='product-heading'>
            <h1>Trending Product Details</h1>
          </div>
          <div className='product-details-next'>
            <span>Next Product</span>
            <div className='product-svg-icon'>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              &nbsp; &nbsp;
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </motion.div>
        <motion.div
          className='second-product-container'
          initial={{ opacity: 0, x: "-50%", y: "-20%" }}
          animate={{ opacity: 1, x: "-50%", y: "-50%" }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 60, damping: 15 }}
          style={{ rotateX, rotateY, perspective: 1000, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className='second-product-content'>
            <div className='second-product-heading'>
              <h1 style={{ fontSize: "30px", marginBottom: "10px", textTransform: "uppercase" }}>Product Details</h1>
              <h1>
                {"Nike Air Max 270 to Chuck Taylor".split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    style={{ display: "inline-block", marginRight: "8px" }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
              >
                Nike's Air Force 1s were among the most popular sneaker this year
              </motion.p>
            </div>
            <div className='second-product-small-cards'>
              <motion.div whileHover={{ scale: 1.1, rotate: -5 }} className='first-small-card small-card'>
                <img
                  src="sneaker_1.png"
                  alt=""
                  className={`shoe-${selectedColor} `}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, rotate: 0 }} className='second-small-card small-card'>
                <img
                  src="sneaker_1.png"
                  alt=""
                  className={`shoe-${selectedColor} `}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className='third-small-card small-card'>
                <img
                  src="sneaker_1.png"
                  alt=""
                  className={`shoe-${selectedColor} `}
                />
              </motion.div>
            </div>
          </div>
          <div className='second-product-container-2'>
            <div className='second-product-img'>
              <Sneaker3D selectedColor={selectedColor} />
            </div>
          </div>
          <div className='second-product-container-3'>
            <div className='second-product-reviews-container'>
              <div className='second-product-reviews'>
                <span>Reviews: </span>
              </div>
              <div className='second-product-reviews-icons'>

                {/* SVG Definitions for gradients */}
                <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
                  <defs>
                    <linearGradient id="half-star">
                      <stop offset="50%" stopColor="#f2c02a" />
                      <stop offset="50%" stopColor="#e4e5e9" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  let fill = "none";
                  if (rating >= starValue) {
                    fill = "#f2c02a";
                  } else if (rating >= starValue - 0.5) {
                    fill = "url(#half-star)";
                  }

                  return (
                    <motion.svg
                      key={index}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={(e) => {
                        const { left, width } = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - left;
                        const isHalf = clickX < width / 2;
                        setRating(index + (isHalf ? 0.5 : 1));
                      }}
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill={fill}
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ cursor: 'pointer' }}
                    >
                      <path d="M11.2827 3.45332C11.5131 2.98638 11.6284 2.75291 11.7848 2.67831C11.9209 2.61341 12.0791 2.61341 12.2152 2.67831C12.3717 2.75291 12.4869 2.98638 12.7174 3.45332L14.9041 7.88328C14.9721 8.02113 15.0061 8.09006 15.0558 8.14358C15.0999 8.19096 15.1527 8.22935 15.2113 8.25662C15.2776 8.28742 15.3536 8.29854 15.5057 8.32077L20.397 9.03571C20.9121 9.11099 21.1696 9.14863 21.2888 9.27444C21.3925 9.38389 21.4412 9.5343 21.4215 9.68377C21.3988 9.85558 21.2124 10.0372 20.8395 10.4004L17.3014 13.8464C17.1912 13.9538 17.136 14.0076 17.1004 14.0715C17.0689 14.128 17.0487 14.1902 17.0409 14.2545C17.0321 14.3271 17.0451 14.403 17.0711 14.5547L17.906 19.4221C17.994 19.9355 18.038 20.1922 17.9553 20.3445C17.8833 20.477 17.7554 20.57 17.6071 20.5975C17.4366 20.6291 17.2061 20.5078 16.7451 20.2654L12.3724 17.9658C12.2361 17.8942 12.168 17.8584 12.0962 17.8443C12.0327 17.8318 11.9673 17.8318 11.9038 17.8443C11.832 17.8584 11.7639 17.8942 11.6277 17.9658L7.25492 20.2654C6.79392 20.5078 6.56341 20.6291 6.39297 20.5975C6.24468 20.57 6.11672 20.477 6.04474 20.3445C5.962 20.1922 6.00603 19.9355 6.09407 19.4221L6.92889 14.5547C6.95491 14.403 6.96793 14.3271 6.95912 14.2545C6.95132 14.1902 6.93111 14.128 6.89961 14.0715C6.86402 14.0076 6.80888 13.9538 6.69859 13.8464L3.16056 10.4004C2.78766 10.0372 2.60121 9.85558 2.57853 9.68377C2.55879 9.5343 2.60755 9.38389 2.71125 9.27444C2.83044 9.14863 3.08797 9.11099 3.60304 9.03571L8.49431 8.32077C8.64642 8.29854 8.72248 8.28742 8.78872 8.25662C8.84736 8.22935 8.90016 8.19096 8.94419 8.14358C8.99391 8.09006 9.02793 8.02113 9.09597 7.88328L11.2827 3.45332Z" stroke="#f2c02a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  );
                })}
              </div>
              <div className='second-product-rating'>
                <span>{rating}</span>
                &nbsp;
                &#47;
                &nbsp;
                <span>&#40;5&#41;</span>
              </div>
              <div className='second-product-color-selection'>
                <span>Color:</span>
                <div className='color-selection'>
                  <div
                    className={`color-boxes cyan-border ${selectedColor === 'cyan' ? 'active' : ''}`}
                    onClick={() => setSelectedColor('cyan')}
                  >
                    <div className='color-box cyan-color'></div>
                  </div>
                  <div
                    className={`color-boxes red-border ${selectedColor === 'red' ? 'active' : ''}`}
                    onClick={() => setSelectedColor('red')}
                  >
                    <div className='color-box red-color'></div>
                  </div>
                  <div
                    className={`color-boxes yellow-border ${selectedColor === 'yellow' ? 'active' : ''}`}
                    onClick={() => setSelectedColor('yellow')}
                  >
                    <div className='color-box yellow-color'></div>
                  </div>
                  <div
                    className={`color-boxes green-border ${selectedColor === 'green' ? 'active' : ''}`}
                    onClick={() => setSelectedColor('green')}
                  >
                    <div className='color-box green-color'></div>
                  </div>
                </div>
              </div>
              <div className='second-product-size-selection'>
                <span style={{ marginBottom: "12px" }}>Size:</span>
                <div className='size-selection-container'>
                  <div className='size-selection'>
                    <div
                      className={`size-box ${selectedSize === 37 ? 'active' : ''}`}
                      onClick={() => setSelectedSize(37)}
                    >
                      <span>37</span>
                    </div>
                    <div
                      className={`size-box ${selectedSize === 38 ? 'active' : ''}`}
                      onClick={() => setSelectedSize(38)}
                    >
                      <span>38</span>
                    </div>
                    <div
                      className={`size-box ${selectedSize === 39 ? 'active' : ''}`}
                      onClick={() => setSelectedSize(39)}
                    >
                      <span>39</span>
                    </div>
                  </div>
                  <div className='size-selection'>
                    <div
                      className={`size-box ${selectedSize === 40 ? 'active' : ''}`}
                      onClick={() => setSelectedSize(40)}
                    >
                      <span>40</span>
                    </div>
                    <div
                      className={`size-box ${selectedSize === 41 ? 'active' : ''}`}
                      onClick={() => setSelectedSize(41)}
                    >
                      <span>41</span>
                    </div>
                    <div
                      className={`size-box ${selectedSize === 42 ? 'active' : ''}`}
                      onClick={() => setSelectedSize(42)}
                    >
                      <span>42</span>
                    </div>
                  </div>
                </div>
                <div className='button-container' style={{ marginTop: "12px" }}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAddToCart}>
                    <span>Add To Cart</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className='product-search'
          style={{ position: "absolute", top: "750px", left: "45%", transform: "translateX(-50%)", zIndex: "10", textAlign: "center" }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "backOut" }}
        >
          <h1>Related Products</h1>
          <motion.div
            className="search-line"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "circOut" }}
          ></motion.div>
        </motion.div>

        <motion.div
          className='social-connect'
          style={{ position: "absolute", top: "800px", right: "1%", zIndex: "10" }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="social-icons">
            <a href="#" className="social-icon fb" title="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50975H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50975H7.19795L6.80206 13.4901H9.19795V21.5Z" />
              </svg>
            </a>
            <a href="#" className="social-icon insta" title="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </motion.div>

        <motion.div
          className='cards-wrapper'
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px',
            placeItems: 'center',
            position: 'absolute',
            top: '870px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            padding: '60px 60px 100px 60px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '40px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            zIndex: '5',
            boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
            minHeight: '800px',
            alignItems: 'start'
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >

          {/* -- Dynamic Filter UI -- */}
          <div style={{
            gridColumn: '1 / -1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '60px',
            width: '100%',
          }}>
            <motion.div
              style={{
                display: 'flex',
                gap: '10px',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(15px)',
                padding: '8px',
                borderRadius: '60px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                position: 'relative'
              }}
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span style={{
                color: '#f9c216',
                fontWeight: '900',
                fontSize: '12px',
                letterSpacing: '1px',
                padding: '0 20px',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                marginRight: '5px',
                alignSelf: 'center',
                textTransform: 'uppercase'
              }}>
                Filter
              </span>

              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    position: 'relative',
                    padding: '10px 25px',
                    borderRadius: '40px',
                    border: 'none',
                    background: 'transparent',
                    color: activeFilter === filter ? '#000' : '#888',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'color 0.3s',
                    overflow: 'hidden',
                    zIndex: 1
                  }}
                >
                  {activeFilter === filter && (
                    <motion.div
                      layoutId="filter-pill"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: '#f9c216',
                        borderRadius: '40px',
                        zIndex: -1
                      }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {filter}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Decorative Background Orbs */}
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>

          <AnimatePresence mode="popLayout">
            {filteredProducts.map((item) => (
              <motion.div
                layout
                className='cards'
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 100, damping: 12 }}
                whileHover={{ scale: 1.05, rotateY: 5, zIndex: 10 }}
              >
                <div className='cards-products'>
                  <div className="card-circle"></div>
                  <img src={item.img} alt={item.name} className="card-img" />
                </div>
                <div className='cards-info'>
                  <h3>{item.name}</h3>
                  <div className="card-footer">
                    <span className="card-price">{item.price}</span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 6px 15px rgba(249, 194, 22, 0.5)' }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          marginRight: '10px',
                          padding: '8px 16px',
                          background: 'linear-gradient(45deg, #f9c216, #ff9f00)',
                          borderRadius: '20px',
                          border: 'none',
                          color: '#000',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 10px rgba(249, 194, 22, 0.3)'
                        }}
                      >
                        Buy Now
                      </motion.button>
                      <button
                        className={`card-add-btn ${addedItems[item.id] ? 'added' : ''}`}
                        onClick={() => {
                          handleAddToCart();
                          setAddedItems(prev => ({ ...prev, [item.id]: true }));
                          setTimeout(() => {
                            setAddedItems(prev => ({ ...prev, [item.id]: false }));
                          }, 1500);
                        }}
                      >
                        {addedItems[item.id] ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#333' }}>
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>
    </>
  )
}

export default Shop