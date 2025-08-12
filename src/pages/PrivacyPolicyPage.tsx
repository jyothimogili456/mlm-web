import React, { useState, useEffect } from 'react';
import { privacyApi } from '../api';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
  console.log('PrivacyPolicyPage component rendered');
  const [privacyData, setPrivacyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        setLoading(true);
        const response = await privacyApi.getAllPrivacy();
        if (response.data) {
          setPrivacyData(response.data);
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        setError('Failed to load privacy policy. Please try again later.');
        // Set fallback content
        setPrivacyData([
          {
            title: 'Privacy Policy',
            content: `
              <h3>Information We Collect</h3>
              <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
              
              <h3>How We Use Your Information</h3>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
              
              <h3>Information Sharing</h3>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
              
              <h3>Data Security</h3>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              
              <h3>Your Rights</h3>
              <p>You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us.</p>
              
              <h3>Contact Us</h3>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@camelq.com</p>
            `
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  const formatContentToList = (content: string) => {
    // Split content by headers and create list items
    const sections = content.split(/<h3>(.*?)<\/h3>/);
    const listItems = [];
    
    for (let i = 1; i < sections.length; i += 2) {
      const title = sections[i];
      const content = sections[i + 1] || '';
      
      if (title && content.trim()) {
        listItems.push({
          title: title.trim(),
          content: content.trim()
        });
      }
    }
    
    return listItems;
  };

  if (loading) {
  return (
    <div className="privacy-page">
        <div className="privacy-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading Privacy Policy...</p>
          </div>
              </div>
            </div>
          );
  }

  if (error) {
    return (
      <div className="privacy-page">
        <div className="privacy-container">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Try Again
            </button>
          </div>
      </div>
    </div>
  );
} 

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        {/* <div className="privacy-header">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div> */}

        <div className="privacy-content">
          {privacyData.length > 0 ? (
            privacyData.map((policy, index) => {
              const listItems = formatContentToList(policy.content || policy.description || '');
              
              return (
                <div key={index} className="policy-section">
                  <h2>{policy.title || 'Privacy Policy'}</h2>
                  
                  {listItems.length > 0 ? (
                    <ul className="policy-list">
                      {listItems.map((item, itemIndex) => (
                        <li key={itemIndex} className="policy-list-item">
                          <h3>{item.title}</h3>
                          <div 
                            className="policy-text"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div 
                      className="policy-text"
                      dangerouslySetInnerHTML={{ __html: policy.content || policy.description || 'Privacy policy content will be displayed here.' }}
                    />
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-content">
              <p>No privacy policy content available.</p>
            </div>
          )}
        </div>

        <div className="privacy-footer">
          <button 
            onClick={() => window.history.back()} 
            className="back-button"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 