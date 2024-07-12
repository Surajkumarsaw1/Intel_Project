import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section contact-info">
                    <h3>Contact Us</h3>
                    <p>Email: random@example.com</p>
                    <p>Phone: +324 546 1234</p>
                    <p>Address: 21 old street, Delhi,India</p>
                </div>
                <div className="footer-section about">
                    <h3>About Us</h3>
                    <p>We are committed to providing the best services to our customers. Learn more about our mission and values.</p>
                </div>
                <div className="footer-section social">
                    <h3>Follow Us</h3>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">X</a> {/* Changed Twitter to X */}
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Utility Navigator. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
