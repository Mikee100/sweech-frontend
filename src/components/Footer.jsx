import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h2 className="logo-text" style={{ color: '#fff', marginBottom: '25px' }}>CASEPROZ</h2>
                        <p>Kenya's coolest online shop for premium electronics, gadgets, and tech accessories. Experience same-day delivery and unbeatable service.</p>
                        <div className="social-links" style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <a href="#" style={{ color: '#fff', fontSize: '20px' }}><i className="fab fa-facebook"></i></a>
                            <a href="#" style={{ color: '#fff', fontSize: '20px' }}><i className="fab fa-instagram"></i></a>
                            <a href="#" style={{ color: '#fff', fontSize: '20px' }}><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h3>Shop Categories</h3>
                        <ul>
                            <li><a href="/category/smartphones">Smartphones</a></li>
                            <li><a href="/category/laptops">Laptops</a></li>
                            <li><a href="/category/audio">Audio & Headphones</a></li>
                            <li><a href="/category/accessories">Accessories</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h3>Customer Care</h3>
                        <ul>
                            <li><a href="/customer-support">Customer Support</a></li>
                            <li><a href="/contact">Contact Us</a></li>
                            <li><a href="/delivery">Delivery Information</a></li>
                            <li><a href="/returns">Returns & Refunds</a></li>
                            <li><a href="/faq">FAQs</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h3>Newsletter</h3>
                        <p>Subscribe to get the latest tech deals and updates.</p>
                        <div className="newsletter-form" style={{ marginTop: '20px' }}>
                            <input type="email" placeholder="Email Address" style={{ padding: '12px', width: '100%', border: 'none', borderRadius: '4px', marginBottom: '10px' }} />
                            <button className="btn-primary" style={{ width: '100%', padding: '10px' }}>SUBSCRIBE</button>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} CASEPROZ. All rights reserved. | Design inspired by CaseProz.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
