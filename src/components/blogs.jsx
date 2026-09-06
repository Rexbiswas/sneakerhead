import React, { useRef } from 'react';
import Navbar from './navbar';
import Footer from './footer';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from 'framer-motion';

const blogsData = [
  {
    id: 1,
    title: "The Future of Sneaker Tech",
    date: "Oct 24, 2025",
    image: "sneaker_1.png",
    desc: "How 3D printing and auto-lacing are reshaping the footwear industry for the next generation of athletes."
  },
  {
    id: 2,
    title: "Sustainable Soles",
    date: "Nov 11, 2025",
    image: "sneaker_1.png",
    desc: "Eco-friendly materials are the new trend. Discover how recycled plastics are becoming premium sneakers."
  },
  {
    id: 3,
    title: "Retro Revival: 90s Style",
    date: "Dec 05, 2025",
    image: "sneaker_1.png",
    desc: "Why the chunky dad shoe aesthetic is back and bigger than ever in the modern fashion landscape."
  },
  {
    id: 4,
    title: "Color Theory in Design",
    date: "Jan 15, 2026",
    image: "sneaker_1.png",
    desc: "Understanding the psychology behind the colorways that drop and why you feel the need to cop them."
  },
  {
    id: 5,
    title: "Streetwear Culture 101",
    date: "Feb 02, 2026",
    image: "sneaker_1.png",
    desc: "From the underground to the runway: A look at how streetwear conquered the luxury fashion world."
  },
  {
    id: 6,
    title: "Collector's Guide 2026",
    date: "Feb 28, 2026",
    image: "sneaker_1.png",
    desc: "Tips and tricks for maintaining the value of your grail collection in an ever-changing market."
  },
];

const Blogs = ({ cartCount }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const xHead = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const yOrb = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", position: "relative", overflow: "hidden" }} ref={containerRef}>
      <Navbar cartCount={cartCount} />

      {/* Dynamic Background Elements */}
      <motion.div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-10%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(249, 194, 22, 0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          zIndex: 0,
          y: yOrb
        }}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-5%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(255, 107, 107, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
          zIndex: 0,
          y: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])
        }}
      />

      {/* Hero / Header Section */}
      <div style={{ height: "40vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <motion.h1
          style={{
            fontSize: "12vw",
            fontWeight: "900",
            color: "transparent",
            WebkitTextStroke: "2px #e0e0e0",
            position: "absolute",
            x: xHead,
            whiteSpace: "nowrap",
            opacity: 0.5
          }}
        >
          INSIGHTS & STORIES
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ fontSize: "4vw", color: "#333", fontWeight: "800", zIndex: 2, textTransform: "uppercase", letterSpacing: "5px" }}
        >
          The Blog
        </motion.h2>
      </div>

      {/* Blog Grid */}
      <div className="blogs-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px 100px", position: "relative", zIndex: 2 }}>
        <div className="blogs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "40px" }}>
          {blogsData.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 100, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 50 }}
              whileHover={{ y: -15, rotateY: 5, zIndex: 10 }}
              style={{
                background: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(10px)",
                borderRadius: "30px",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer"
              }}
            >
              <div style={{ height: "250px", overflow: "hidden", position: "relative", background: "#f0f0f0" }}>
                <motion.img
                  src={blog.image}
                  alt={blog.title}
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: "20px" }}
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.5 }}
                />
                <div style={{ position: "absolute", top: "20px", right: "20px", background: "#f9c216", padding: "5px 15px", borderRadius: "20px", fontWeight: "bold", fontSize: "14px", color: "#333" }}>
                  {blog.date}
                </div>
              </div>
              <div style={{ padding: "30px" }}>
                <h3 style={{ fontSize: "24px", marginBottom: "15px", color: "#333" }}>{blog.title}</h3>
                <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "25px" }}>{blog.desc}</p>
                <motion.button
                  style={{
                    border: "2px solid #333",
                    background: "transparent",
                    padding: "10px 25px",
                    borderRadius: "50px",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                  whileHover={{ background: "#333", color: "#fff" }}
                >
                  READ MORE
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blogs;
