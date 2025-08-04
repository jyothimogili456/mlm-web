import React from 'react';
import './Footer.css';
import giftsHeroLogo from '../assets/logo.jpg';

const Footer = () => (
  <footer className="footer-section">
    <div className="footer-newsletter">
      <h2 className="newsletter-title">Get The Latest Updates.</h2>
      <p className="newsletter-desc">Signup for offers & exclusive discounts.</p>
      <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
        <input type="email" placeholder="Enter your email" className="newsletter-input" required />
        <button type="submit" className="newsletter-btn">Subscribe</button>
      </form>
    </div>
    <div className="footer-divider" />
    <div className="footer-columns">
      <div className="footer-col footer-logo-col">
        <img src={giftsHeroLogo} alt="GiftsHero Logo" className="footer-logo" />
        {/* <span className="footer-company">GiftsHero</span> */}
        <div>Phone: 011-12345678</div>
        <div>Toll Free: 1800-123-4567</div>
        <div className="footer-social-row">
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Instagram">
            <svg width="24" height="24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
          </a>
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Facebook">
            <svg width="24" height="24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a4 4 0 00-4 4v3H7v4h4v8h4v-8h3l1-4h-4V6a1 1 0 011-1h3z"/></svg>
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="X (Twitter)">
            <svg width="24" height="24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 6.5L6.5 17.5M6.5 6.5l11 11"/></svg>
          </a>
          <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="YouTube">
            <svg width="24" height="24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><polygon points="10,8 16,12 10,16"/></svg>
          </a>
        </div>
      </div>
      <div className="footer-col">
        <h4 className="footer-heading">Company</h4>
        <ul className="footer-list">
          <li><a href="/about" className="footer-link">About GiftsHero</a></li>
          <li><a href="/careers" className="footer-link">Careers</a></li>
          <li><a href="/contact" className="footer-link">Contact Us</a></li>
          <li><a href="/branches" className="footer-link">Branches</a></li>
          <li><a href="/faqs" className="footer-link">FAQs</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4 className="footer-heading">Policy</h4>
        <ul className="footer-list">
          <li><a href="/cancellation-policy" className="footer-link">Cancellation & Refund</a></li>
          <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
          <li><a href="/shipping" className="footer-link">Shipping Policy</a></li>
          <li><a href="/terms" className="footer-link">T&amp;C</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4 className="footer-heading">Our Corporate Office</h4>
        <address className="footer-address">
          GiftsHero Pvt. Ltd.<br />
          1234 Main Street, Business Park<br />
          New Delhi 110020
        </address>
       
      </div>
    </div>
    <div className="footer-bottom">
      &copy; {new Date().getFullYear()} GiftsHero. All rights reserved.
    </div>
  </footer>
);

export default Footer; 