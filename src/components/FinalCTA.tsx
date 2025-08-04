import React from 'react';
import './FinalCTA.css';

const FinalCTA: React.FC = () => {
  return (
    <section className="finalcta-banner-section">
      <div className="finalcta-banner-bg">
        <div className="finalcta-banner-content">
          {/* Left: QR Card */}
          <div className="finalcta-qr-card">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://your-join-link.com"
              alt="Scan to Join QR"
              className="finalcta-qr-img"
            />
            <div className="finalcta-qr-label">Scan to Join</div>
          </div>
          {/* Right: Promo Text, Button, Chart */}
          <div className="finalcta-promo-col">
            <div className="finalcta-promo-main">
              <h2 className="finalcta-promo-title">Join today<br />and earn big!</h2>
              <button className="finalcta-join-btn">Join Now</button>
            </div>
            {/* Chart/Arrow SVG as background */}
            <div className="finalcta-chart-bg" style={{ left: '20%' }}>
              <svg width="100%" height="100%" viewBox="0 0 500 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="140" width="30" height="30" rx="6" fill="#b3e0ff" />
                <rect x="60" y="120" width="30" height="50" rx="6" fill="#99cfff" />
                <rect x="100" y="100" width="30" height="70" rx="6" fill="#7fbfff" />
                <rect x="140" y="110" width="30" height="60" rx="6" fill="#66afff" />
                <rect x="180" y="80" width="30" height="90" rx="6" fill="#4c9fff" />
                <rect x="220" y="90" width="30" height="80" rx="6" fill="#338fff" />
                <rect x="260" y="60" width="30" height="110" rx="6" fill="#197fff" />
                <rect x="300" y="40" width="30" height="130" rx="6" fill="#006fff" />
                <rect x="340" y="30" width="30" height="140" rx="6" fill="#0057b3" />
                <rect x="380" y="20" width="30" height="150" rx="6" fill="#003f80" />
                {/* Upward arrow */}
                <path d="M 30 150 Q 180 60 390 30" stroke="#2ecc71" strokeWidth="10" fill="none" />
                <polygon points="390,30 410,40 400,10" fill="#2ecc71" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 

export { FinalCTA }; 