import React from 'react';
import './HeroSection.css';
import personImg from '../assets/shopping-removebg-preview.png';

const HeroSection = () => {

  return (
    <section className="hero-section">
      <div className="hero-wrapper hero-two-column-layout">
        {/* Left: Animated Circles as background accent + Text Content */}
        <div className="hero-left-content">
          {/* <div className="hero-circles-bg">
            {smallCircleImages.map((img, idx) => {
              const angle = (idx / smallCircleImages.length) * 2 * Math.PI;
              const radius = 180;
              return (
                <motion.div
                  key={idx}
                  className="hero-small-circle"
                  initial={{ scale: 0.5, x: 0, y: 0, opacity: 0 }}
                  animate={{
                    scale: [0.5, 1.2, 1.5],
                    x: [0, 0.5 * radius * Math.cos(angle), radius * Math.cos(angle)],
                    y: [0, 0.5 * radius * Math.sin(angle), radius * Math.sin(angle)],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    delay: 0.5 + idx * 0.5,
                    duration: 2.5,
                    times: [0, 0.6, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  style={{ position: "absolute" }}
                >
                  <img src={img} alt={`Circle ${idx}`} className="hero-small-circle-img" />
                </motion.div>
              );
            })}
          </div> */}
          <div className="hero-left-foreground">
            <h1 className="hero-title">Shop. Refer. <span>Win Big.</span></h1>
            <p className="hero-description">
              Enjoy great products, refer friends, and unlock life-changing rewards.
              Earn cash, gadgets, and more with every referral!
            </p>
          
            <div className="hero-stats">
              <div className="hero-stat">
                <h2>₹1Cr+</h2>
                <p>Rewards Distributed</p>
              </div>
              <div className="hero-stat">
                <h2>10K+</h2>
                <p>Happy Shoppers</p>
              </div>
            </div>
            <div className="hero-action-row">
              <div className="hero-promo-card">
                {/* <div className="hero-promo-icon">
                  <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="6" fill="#7c3aed" />
                    <polygon points="9,7 17,12 9,17" fill="#fff" />
                  </svg>
                </div> */}
                <div>
                  <div className="hero-promo-title">know More</div>
                  
                </div>
              </div>
              <div className="hero-action-btn-wrapper">
                <a href="/products" className="hero-button">Start Shopping</a>
              </div>
            </div>
           
          </div>

        </div>
        {/* Right: Person Illustration */}
        <div className="hero-right-image">
          <img src={personImg} alt="Boy Illustration" className="hero-person-img" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

