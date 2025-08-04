import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYou.css';

const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGetDirections = () => {
    const address = encodeURIComponent('CamelQ software solutions,madhapur,matrix stride, Hyderabad, Telangana');
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  const handleShare = (platform: string) => {
    const message = encodeURIComponent('Hey! I just bought something cool from CamelQ. Check them out!');
    const url = encodeURIComponent('https://camelq.com');
    
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${message}%20${url}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${message}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${message}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="thank-you-page">
      {/* Background Animation */}
      <div className="floating-icons">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`floating-icon icon-${i + 1}`}>🎉</div>
        ))}
      </div>

      <div className="container">


        {/* Success Animation */}
        <div className={`success-animation ${isVisible ? 'fade-in' : ''}`}>
          <div className="checkmark-container">
            <div className="checkmark">
              <div className="checkmark-stem"></div>
              <div className="checkmark-kick"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`main-content ${isVisible ? 'slide-up' : ''}`}>
          <h1 className="thank-you-title">Thank You for Your Purchase!</h1>
          <p className="thank-you-subtitle">
            Please collect your order from our CamelQ office location.
          </p>
        </div>

        {/* Get Directions Button */}
        <div className={`directions-section ${isVisible ? 'fade-in-delay' : ''}`}>
          <button 
            className="directions-btn"
            onClick={handleGetDirections}
          >
            <span className="map-icon">📍</span>
            <span>Get Directions to CamelQ Office</span>
          </button>
        </div>

        {/* Refer a Friend Section */}
        <div className={`refer-section ${isVisible ? 'fade-in-delay-2' : ''}`}>
          <h2 className="refer-title">Want to refer a friend?</h2>
          <div className="share-buttons">
            <button 
              className="share-btn whatsapp-btn"
              onClick={() => handleShare('whatsapp')}
            >
              <span className="share-icon">📱</span>
              <span>WhatsApp</span>
            </button>
            <button 
              className="share-btn telegram-btn"
              onClick={() => handleShare('telegram')}
            >
              <span className="share-icon">✈️</span>
              <span>Telegram</span>
            </button>
            <button 
              className="share-btn facebook-btn"
              onClick={() => handleShare('facebook')}
            >
              <span className="share-icon">📘</span>
              <span>Facebook</span>
            </button>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className={`home-section ${isVisible ? 'fade-in-delay-3' : ''}`}>
          <button 
            className="home-btn"
            onClick={handleBackToHome}
          >
            <span className="home-icon">🏠</span>
            <span>Back to Home</span>
          </button>
        </div>

        {/* Footer */}
        <div className={`footer ${isVisible ? 'fade-in-delay-4' : ''}`}>
          <p className="footer-text">
            Need help? Contact <a href="mailto:support@camelq.com">support@camelq.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou; 