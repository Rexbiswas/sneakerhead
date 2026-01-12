import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { title: "Shop", links: ["New Arrivals", "Best Sellers", "Men", "Women", "Accessories"] },
        { title: "Company", links: ["About Us", "Careers", "Press", "Sustainability"] },
        { title: "Support", links: ["FAQ", "Shipping & Returns", "Size Guide", "Contact Us"] }
    ];

    const socialLinks = ["Instagram", "Twitter", "Facebook"];

    return (
        <div className="footer-section" style={{ position: 'relative', background: '#050505', color: '#fff', overflow: 'hidden', borderTop: '1px solid #222' }}>

            {/* Background Glow */}
            <div style={{
                position: 'absolute', top: '-20%', left: '20%', width: '600px', height: '600px',
                background: 'radial-gradient(circle, #f9c216 0%, transparent 70%)', opacity: 0.05, filter: 'blur(120px)', zIndex: 0
            }}></div>

            <div className="footer-content" style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 5% 40px', position: 'relative', zIndex: 1 }}>

                {/* Giant CTA */}
                <div className="footer-cta" style={{ marginBottom: '80px', textAlign: 'center' }}>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            fontSize: 'clamp(40px, 8vw, 120px)', fontWeight: '900', textTransform: 'uppercase',
                            lineHeight: '0.9', letterSpacing: '-2px', marginBottom: '20px',
                            color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.2)'
                        }}
                    >
                        Start Your <br /> <span style={{ color: '#fff', WebkitTextStroke: '0' }}>Journey</span>
                    </motion.h1>
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: '#f9c216', color: '#000' }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '15px 40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.3)',
                            background: 'transparent', color: '#fff', fontSize: '16px', fontWeight: 'bold',
                            cursor: 'pointer', marginTop: '20px', transition: 'background-color 0.3s, color 0.3s'
                        }}
                    >
                        Join the Club
                    </motion.button>
                </div>

                <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '60px' }}>

                    {/* Logo / Brand */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>SNEAKER<span style={{ color: '#f9c216' }}>HEAD</span>.</h2>
                        <p style={{ color: '#888', lineHeight: '1.6', fontSize: '14px', maxWidth: '300px' }}>
                            Redefining sneaker culture with cutting-edge design and unparalleled comfort. Engineered for the streets.
                        </p>
                    </div>

                    {/* Links Columns */}
                    {footerLinks.map((column, idx) => (
                        <div key={idx}>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', color: '#f9c216' }}>{column.title}</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {column.links.map((link, i) => (
                                    <motion.li key={i} whileHover={{ x: 5, color: '#f9c216' }} style={{ marginBottom: '12px', cursor: 'pointer', color: '#ccc', fontSize: '14px', transition: 'color 0.2s' }}>
                                        {link}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Socials & Newsletter */}
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', color: '#f9c216' }}>Connect</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                            {socialLinks.map((social, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5, background: '#fff', color: '#000' }}
                                    style={{
                                        padding: '8px 16px', border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '20px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    {social}
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ position: 'relative' }}>
                            <input
                                placeholder="Email Address"
                                style={{
                                    width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)',
                                    border: 'none', borderRadius: '4px', color: '#fff', outline: 'none'
                                }}
                            />
                            <button style={{
                                position: 'absolute', right: '5px', top: '5px', bottom: '5px', padding: '0 20px',
                                background: '#f9c216', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
                            }}>
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom" style={{ marginTop: '80px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', color: '#666', fontSize: '12px' }}>
                    <p>&copy; {currentYear} SneakerHead Inc. All rights reserved.</p>
                    <p>Created by Rishi Biswas</p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Footer;
