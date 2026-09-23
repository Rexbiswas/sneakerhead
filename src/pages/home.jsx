import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import '../style/home.css'; 
import { useHomeAnimations } from '../utils/HomeAnimations';

const slides = [
  { id: 1, img: 'sneaker_1.png', filter: 'hue-rotate(265deg) saturate(0.5) brightness(1.3)', title: 'Future Style', price: '₹12,499' },
  { id: 2, img: 'sneaker_1.png', filter: 'hue-rotate(180deg) brightness(1.1)', title: 'Neon Cyber', price: '₹15,999' },
  { id: 3, img: 'sneaker_1.png', filter: 'hue-rotate(16deg) saturate(1.2)', title: 'Red Fury', price: '₹13,999' }
];

const Home = (props) => {
  const { cartCount, isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity } = props;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const containerRef = useRef();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const minSwipeDistance = 50;

  // Auto-play slider
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []); // Run once on mount

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  }

  useHomeAnimations(containerRef);

  return (
    <>
      <Navbar {...props} />
      <div className="home-container" ref={containerRef} onMouseMove={(e) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 2;
        const y = (e.clientY / innerHeight - 0.5) * 2;
        setMousePos({ x, y });
      }}>
        {/* Decorative Orbs */}
        <div className="home-orb home-orb-1"></div>
        <div className="home-orb home-orb-2"></div>
        <div className="home-orb home-orb-3"></div>

        {/* Noise Overlay */}
        <div className="noise-overlay"></div>

        <div className="home-content">
          <h2>New Collection</h2>
          <h1>Step Into <br />
            <span key={currentSlide} className="slide-title-anim">{slides[currentSlide].title}</span>
          </h1>
          <p className="home-description">
            Experience the ultimate comfort and iconic design with our latest collection.
            Engineered for those who don't just walk, but make a statement.
          </p>
          <a href="/shop" className="cta-button">
            Explore Collection
          </a>
        </div>

        {/* Giant Background Text */}
        <div className="giant-bg-text" style={{ transform: `translate(calc(-50% + ${mousePos.x * -20}px), calc(-50% + ${mousePos.y * -20}px))` }}>FUTURE READY</div>

        <div
          className="home-image-container"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Spacer Image */}
          <img
            src={slides[0].img}
            alt=""
            className="hero-image"
            style={{ opacity: 0, visibility: 'hidden', position: 'relative', pointerEvents: 'none' }}
          />

          {slides.map((slide, index) => (
            <img
              key={slide.id}
              src={slide.img}
              alt="Stylish Sneaker"
              className={`hero-image ${index === currentSlide ? 'active' : ''}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: index === currentSlide
                  ? `translate(calc(-50% + ${mousePos.x * 15}px), calc(-50% + ${mousePos.y * 15}px)) rotate(${-12 + (mousePos.x * 5)}deg) rotateX(${mousePos.y * -10}deg) rotateY(${mousePos.x * 10}deg) scale(1)`
                  : 'translate(-50%, -50%) rotate(-25deg) scale(0.8)',
                opacity: index === currentSlide ? 1 : 0,
                zIndex: index === currentSlide ? 2 : 1,
                filter: `drop-shadow(${mousePos.x * -20}px ${20 + (mousePos.y * 10)}px 30px rgba(0, 0, 0, 0.3)) ${slide.filter}`,
                transition: 'opacity 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.1s linear',
                pointerEvents: index === currentSlide ? 'auto' : 'none'
              }}
            />
          ))}

          {/* Slider Dots */}
          <div style={{ position: 'absolute', bottom: '15%', display: 'flex', gap: '10px', zIndex: 10 }}>
            {slides.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: idx === currentSlide ? '30px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  backgroundColor: idx === currentSlide ? '#f9c216' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
              ></div>
            ))}
          </div>

          {/* Floating Glass Cards */}
          <div className="glass-card gc-1" style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}>
            <span>Trending</span>
          </div>
          <div className="glass-card gc-2" style={{ transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)` }}>
            <span>Air Cushion</span>
          </div>



        </div>
      </div>

      <div className="marquee-wrapper">
        <div className="marquee-content">
          <span className="marquee-item">⚡ LIMITED EDITION DROP</span>
          <span className="marquee-item">★ NEW SEASON</span>
          <span className="marquee-item">⚡ FAST SHIPPING</span>
          <span className="marquee-item">★ PREMIUM QUALITY</span>
          <span className="marquee-item">⚡ LIMITED EDITION DROP</span>
          <span className="marquee-item">★ NEW SEASON</span>
          <span className="marquee-item">⚡ FAST SHIPPING</span>
          <span className="marquee-item">★ PREMIUM QUALITY</span>
        </div>
      </div>

      <FeaturedCollection />
      <InnovationSection />
      <Footer />
    </>
  )
}

function FeaturedCollection() {
  return (
    <div className="featured-collection" style={{ position: 'relative', background: '#0a0a0a', padding: '100px 5%', zIndex: 20, overflow: 'hidden' }}>
      {/* Background Ambience */}
      <div style={{
        position: 'absolute', top: '20%', left: '-10%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, #f9c216 0%, transparent 70%)', opacity: 0.1, filter: 'blur(80px)', zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute', bottom: '20%', right: '-10%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, #4ecdc4 0%, transparent 70%)', opacity: 0.05, filter: 'blur(100px)', zIndex: 0
      }}></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: '80px', position: 'relative', zIndex: 1 }}
      >
        <h2 style={{ fontSize: '14px', letterSpacing: '4px', color: '#f9c216', textTransform: 'uppercase', marginBottom: '20px', fontWeight: 'bold' }}>
          Discover
        </h2>
        <h1 style={{ fontSize: 'clamp(40px, 5vw, 60px)', color: '#fff', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1.1' }}>
          Trending <span style={{ WebkitTextStroke: '1px #555', color: 'transparent' }}>Collections</span>
        </h1>
      </motion.div>

      <div className="featured-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', position: 'relative', zIndex: 1 }}>
        <Card3D title="Streetwear" subtitle="Urban Legends" image="sneaker_1.png" color="#f9c216" />
        <Card3D title="Performance" subtitle="Run The Future" image="sneaker_1.png" color="#4ecdc4" />
        <Card3D title="Limited" subtitle="Exclusive Drops" image="sneaker_1.png" color="#ff6b6b" />
      </div>
    </div>
  );
};

const BLUEPRINT_FEATURES = [
  {
    id: 'mesh',
    side: 'left',
    x: 37,
    y: 53,
    tag: 'SPEC 01 // UPPER',
    title: 'Ultra-Light Mesh',
    desc: '3D Breathable AeroWeave',
    delay: 0.15
  },
  {
    id: 'cushion',
    side: 'left',
    x: 27,
    y: 70,
    tag: 'SPEC 04 // DAMPING',
    title: 'Shock Absorption',
    desc: 'Dual Air-Chamber Outsole',
    delay: 0.6
  },
  {
    id: 'collar',
    side: 'right',
    x: 67,
    y: 36,
    tag: 'SPEC 02 // ERGO',
    title: 'Anatomic Fit',
    desc: 'Memory Foam Heel-Lock',
    delay: 0.3
  },
  {
    id: 'sole',
    side: 'right',
    x: 58,
    y: 69,
    tag: 'SPEC 03 // PROPULSION',
    title: 'Reactive Carbon Sole',
    desc: 'Torsional Carbon Plate',
    delay: 0.45
  },
];

function InnovationSection() {
  const sectionRef = useRef(null);
  const [activeFeature, setActiveFeature] = useState(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const blueprintY = useTransform(scrollYProgress, [0, 1], [-45, 45]);
  const shoeScale = useTransform(scrollYProgress, [0.15, 0.5], [0.94, 1]);
  const shoeRotate = useTransform(scrollYProgress, [0.2, 0.8], [-2, 2]);

  return (
    <section ref={sectionRef} className="innovation-section">
      {/* Background Cyber Grid & Ambience */}
      <div className="innovation-grid-bg" />
      <div className="innovation-radial-glow" />

      {/* Section Header */}
      <motion.div
        className="innovation-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="innovation-sub-badge">
          <span>●</span>
          <span>Precision Engineering</span>
        </div>
        <h2>Architecture & Specs</h2>
      </motion.div>

      <div className="blueprint-content">
        {/* Big Watermark Text Behind */}
        <motion.h1
          className="blueprint-text"
          style={{ y: blueprintY }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          BLUEPRINT
        </motion.h1>

        {/* Sneaker Stage */}
        <motion.div
          className="blueprint-stage"
          style={{ scale: shoeScale, rotate: shoeRotate }}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <img
            className="innovation-sneaker"
            src="sneaker_1.png"
            alt="Sneaker Anatomy Blueprint"
            loading="lazy"
          />

          {/* Precision Anchored Hotspots */}
          {BLUEPRINT_FEATURES.map((feature) => (
            <BlueprintHotspot
              key={feature.id}
              feature={feature}
              isActive={activeFeature === feature.id}
              onHover={() => setActiveFeature(feature.id)}
              onLeave={() => setActiveFeature(null)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function BlueprintHotspot({ feature, isActive, onHover, onLeave }) {
  const { side, x, y, tag, title, desc, delay } = feature;

  return (
    <div
      className={`blueprint-hotspot-anchor hotspot-${side}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Target Dot directly ON the shoe surface */}
      <motion.div
        className="hotspot-target-dot"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ delay, duration: 0.45, type: 'spring', stiffness: 260, damping: 18 }}
      >
        <div
          className="hotspot-core-dot"
          style={isActive ? { transform: 'scale(1.4)', background: '#ffffff', boxShadow: '0 0 12px #ffffff, 0 0 25px #4ecdc4' } : {}}
        />
        <div className="hotspot-ring-static" />
        <motion.div
          className="hotspot-pulse-ring"
          animate={{ scale: [1, 2.5], opacity: [0.85, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: delay * 0.4 }}
        />
      </motion.div>

      {/* Extension Arm: Line + Tech Badge */}
      <div className={`hotspot-arm hotspot-arm-${side}`}>
        {side === 'left' ? (
          <>
            {/* Tech Badge */}
            <motion.div
              className={`hotspot-badge ${isActive ? 'active' : ''}`}
              initial={{ opacity: 0, x: -16, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ delay: delay + 0.28, duration: 0.38, ease: 'easeOut' }}
            >
              <span className="hotspot-badge-tag">{tag}</span>
              <span className="hotspot-badge-title">{title}</span>
              <span className="hotspot-badge-desc">{desc}</span>
            </motion.div>

            {/* Connecting Line extending from badge to dot */}
            <motion.div
              className="hotspot-line"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ delay: delay + 0.14, duration: 0.32, ease: 'easeOut' }}
              style={{ transformOrigin: 'right center' }}
            >
              <div className="hotspot-line-node" />
            </motion.div>
          </>
        ) : (
          <>
            {/* Connecting Line extending from dot to badge */}
            <motion.div
              className="hotspot-line"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ delay: delay + 0.14, duration: 0.32, ease: 'easeOut' }}
              style={{ transformOrigin: 'left center' }}
            >
              <div className="hotspot-line-node" />
            </motion.div>

            {/* Tech Badge */}
            <motion.div
              className={`hotspot-badge ${isActive ? 'active' : ''}`}
              initial={{ opacity: 0, x: 16, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ delay: delay + 0.28, duration: 0.38, ease: 'easeOut' }}
            >
              <span className="hotspot-badge-tag">{tag}</span>
              <span className="hotspot-badge-title">{title}</span>
              <span className="hotspot-badge-desc">{desc}</span>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

function Card3D({ title, subtitle, image, color }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    x.set(offsetX);
    y.set(offsetY);
  }

  return (
    <motion.div
      className="card-3d-wrapper"
      style={{
        perspective: 1000,
        height: '450px',
        cursor: 'pointer'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '30px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          rotateX,
          rotateY,
          // z, // Removing Z directly from style to avoid conflict, relying on internal elems transformZ
          transformStyle: 'preserve-3d',
          overflow: 'hidden'
        }}
        whileHover={{ borderColor: color, boxShadow: `0 0 30px ${color}22` }}
      >
        {/* Background Gradient */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: `radial-gradient(circle at 50% 120%, ${color}33, transparent 70%)`
        }}></div>

        {/* Content Floating Elements */}
        <div style={{ position: 'absolute', top: '40px', left: '40px', transform: 'translateZ(50px)' }}>
          <h3 style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>{subtitle}</h3>
          <h2 style={{ color: '#fff', fontSize: '32px', fontWeight: '800', margin: 0 }}>{title}</h2>
        </div>

        {/* Floating Image */}
        <motion.img
          src={image}
          alt={title}
          style={{
            position: 'absolute',
            bottom: '-20px',
            right: '-20px',
            width: '120%',
            transform: 'translateZ(80px) rotate(-20deg)',
            filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.5))'
          }}
          whileHover={{ scale: 1.1, x: -20, y: -20, rotate: -25 }}
          transition={{ type: 'spring', stiffness: 100 }}
        />

        {/* View Button */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            padding: '12px 30px',
            borderRadius: '50px',
            background: '#fff',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '14px',
            transform: 'translateZ(60px)',
            opacity: 0,
            boxShadow: `0 5px 15px ${color}66`
          }}
          whileHover={{ scale: 1.05 }}
          animate={{ opacity: 1 }}
        >
          View Collection
        </motion.div>

      </motion.div>
    </motion.div>
  );
};

export default Home;
