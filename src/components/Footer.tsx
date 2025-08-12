import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';
import giftsHeroLogo from '../assets/logo.jpg';
const Footer = () => {
  const navigate = useNavigate();

  // Function to navigate to privacy policy page
  const handlePrivacyClick = () => {
    console.log('Privacy button clicked, navigating to /privacy');
    try {
      navigate('/privacy');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if navigate fails
      window.location.href = '/privacy';
    }
  };

  // Function to navigate to terms and conditions page
  const handleTermsClick = () => {
    console.log('Terms button clicked, navigating to /terms');
    try {
      navigate('/terms');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if navigate fails
      window.location.href = '/terms';
    }
  };

  return (
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
          {/* <div className='footer-address'>
            <a href="tel:011-12345678" className="footer-social-icon phone-icon" aria-label="Phone">
              <div className="social-icon-bg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.21 2.2z" fill="currentColor" />
                </svg> 
              </div>
            </a>011-12345678</div> */}
          
          {/* <div className='footer-address'>Toll Free: 1800-123-4567</div> */}
          <div className="footer-address">
            {/* Landline Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79a15.534 15.534 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V21c0 .55-.45 1-1 
             1C10.07 22 2 13.93 2 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 
             1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 
             2.2z" />
            </svg>

            <span className="phone-number">1800-123-4567</span>
          </div>


          <div className="footer-social-row">
            <a href="https://www.instagram.com/camelqsoftwaresolutions?igsh=aHU3eXl6b2EwcGti" target="_blank" rel="noopener noreferrer" className="footer-social-icon instagram-icon" aria-label="Instagram">
              <div className="social-icon-bg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.796 0 1.441-.645 1.441-1.44s-.645-1.44-1.441-1.44z" fill="currentColor" />
                </svg>
              </div>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61563781927395" target="_blank" rel="noopener noreferrer" className="footer-social-icon facebook-icon" aria-label="Facebook">
              <div className="social-icon-bg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor" />
                </svg>
              </div>
            </a>
            <a href="https://x.com/camel_q31616" target="_blank" rel="noopener noreferrer" className="footer-social-icon twitter-icon" aria-label="X (Twitter)">
              <div className="social-icon-bg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
                </svg>
              </div>
            </a>
            <a href="https://youtu.be/tXHdjscvhsg?si=xvENLfE2ZneCDlix" target="_blank" rel="noopener noreferrer" className="footer-social-icon youtube-icon" aria-label="YouTube">
              <div className="social-icon-bg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor" />
                </svg>
              </div>
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-list">
            <li><a href="/about" className="footer-link">About Us</a></li>
            <li><a href="/contact" className="footer-link">Contact Us</a></li>
            <li><a href="/faqs" className="footer-link">FAQs</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">Policy</h4>
          <ul className="footer-list">
            <li><button onClick={handlePrivacyClick} className="footer-link-button">Privacy Policy</button></li>
            <li><button onClick={handleTermsClick} className="footer-link-button">T&amp;C</button></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">Our Corporate Office</h4>
          <address className="footer-address">
            CamelQ software Solutions Pvt. Ltd.<br />
            100 Feet Road,Madhapur,Hyderabad<br />
            Telangana,India
          </address>

        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} CamelQ Software Solutions. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 