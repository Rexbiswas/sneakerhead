import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Navbar from './navbar';
import Footer from './footer';
import '../home.css'; // Import the styles
import { useHomeAnimations } from './HomeAnimations';

const Home = ({ cartCount }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const containerRef = useRef();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const slides = [
    { id: 1, img: 'sneaker_1.png', filter: 'hue-rotate(265deg) saturate(0.5) brightness(1.3)', title: 'Future Style', price: '$149.00' },
    { id: 2, img: 'sneaker_1.png', filter: 'hue-rotate(180deg) brightness(1.1)', title: 'Neon Cyber', price: '$189.00' },
    { id: 3, img: 'sneaker_1.png', filter: 'hue-rotate(16deg) saturate(1.2)', title: 'Red Fury', price: '$169.00' }
  ];

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
      <Navbar cartCount={cartCount} />
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

          <div className="scroll-indicator">
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
            <span>SCROLL</span>
          </div>

          <div className="marquee-wrapper" style={{ left: "0", width: "100%", position: "relative" }}>
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

          {/* Holographic Price Tag */}
          <div className="holo-price" style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`, transformOrigin: 'center' }}>
            <span className="label">Start from</span>
            <span className="currency">{slides[currentSlide].price}</span>
          </div>

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

function InnovationSection() {
  return (
    <div className="innovation-section" style={{
      position: 'relative',
      minHeight: '100vh',
      background: '#050505',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderTop: '1px solid #222'
    }}>
      {/* Grid Background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.5
      }}></div>

      <div className="innovation-content" style={{ position: 'relative', width: '100%', maxWidth: '1200px', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Big Text Behind */}
        <motion.h1
          className="blueprint-text"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            fontSize: '20vw', fontWeight: '900', color: '#0f0f0f', whiteSpace: 'nowrap', zIndex: 0,
            userSelect: 'none'
          }}>
          BLUEPRINT
        </motion.h1>

        {/* Sneaker */}
        <motion.img
          className="innovation-sneaker"
          src="sneaker_1.png"
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -15 }}
          transition={{ duration: 0.8, type: 'spring' }}
          style={{
            width: '60%', maxWidth: '700px', zIndex: 2,
            filter: 'drop-shadow(0 0 50px rgba(78, 205, 196, 0.15)) grayscale(100%) contrast(1.1) brightness(0.8)'
          }}
        />

        {/* Hotspots */}
        <Hotspot top="20%" left="15%" label="Ultra-Light Mesh" delay={0.2} />
        <Hotspot top="70%" left="75%" label="Reactive Carbon Sole" delay={0.4} />
        <Hotspot top="40%" left="80%" label="Anatomic Fit" delay={0.6} />
        <Hotspot top="85%" left="30%" label="Shock Absorption" delay={0.8} />

      </div>
    </div>
  )
}

function Hotspot({ top, left, label, delay }) {
  return (
    <motion.div
      className="hotspot"
      initial={{ opacity: 0, width: 0 }}
      whileInView={{ opacity: 1, width: 'auto' }}
      transition={{ delay, duration: 0.5 }}
      style={{ position: 'absolute', top, left, zIndex: 10, display: 'flex', alignItems: 'center', gap: '15px' }}
    >
      <div style={{ position: 'relative', width: '12px', height: '12px' }}>
        <div style={{ width: '100%', height: '100%', background: '#4ecdc4', borderRadius: '50%', boxShadow: '0 0 10px #4ecdc4', position: 'relative', zIndex: 2 }}></div>
        <motion.div
          animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: 'absolute', inset: 0, background: '#4ecdc4', borderRadius: '50%', zIndex: 1 }}
        />
      </div>

      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: '50px' }}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
        style={{ height: '1px', background: '#4ecdc4' }}
      />

      <motion.span
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.4 }}
        style={{
          color: '#4ecdc4', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px',
          fontSize: '12px', background: 'rgba(0,0,0,0.8)', padding: '5px 12px', borderRadius: '4px',
          border: '1px solid rgba(78, 205, 196, 0.3)', whiteSpace: 'nowrap'
        }}>
        {label}
      </motion.span>
    </motion.div>
  )
}

function Card3D({ title, subtitle, image, color }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 150, damping: 20 });
  const z = useSpring(useTransform(x, [-100, 100], [0, 50]), { stiffness: 150, damping: 20 }); // Added subtle Z lift

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
