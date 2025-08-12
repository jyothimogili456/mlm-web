import React, { useState, useEffect } from 'react';
import { termsApi } from '../api';
import './TermsConditionsPage.css';

const TermsConditionsPage = () => {
  const [termsData, setTermsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTermsConditions = async () => {
      try {
        setLoading(true);
        const response = await termsApi.getAllTerms();
        if (response.data) {
          setTermsData(response.data);
        }
      } catch (error) {
        console.error('Error fetching terms and conditions:', error);
        setError('Failed to load terms and conditions. Please try again later.');
        // Set fallback content
        setTermsData([
          {
            title: 'Terms & Conditions',
            content: `
              <h3>Acceptance of Terms</h3>
              <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <h3>Use License</h3>
              <p>Permission is granted to temporarily download one copy of the materials on CamelQ Software Solutions's website for personal, non-commercial transitory viewing only.</p>
              
              <h3>Disclaimer</h3>
              <p>The materials on CamelQ Software Solutions's website are provided on an 'as is' basis. CamelQ Software Solutions makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              
              <h3>Limitations</h3>
              <p>In no event shall CamelQ Software Solutions or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CamelQ Software Solutions's website.</p>
              
              <h3>Accuracy of Materials</h3>
              <p>The materials appearing on CamelQ Software Solutions's website could include technical, typographical, or photographic errors. CamelQ Software Solutions does not warrant that any of the materials on its website are accurate, complete or current.</p>
              
              <h3>Links</h3>
              <p>CamelQ Software Solutions has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by CamelQ Software Solutions of the site.</p>
              
              <h3>Modifications</h3>
              <p>CamelQ Software Solutions may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.</p>
              
              <h3>Governing Law</h3>
              <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
            `
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTermsConditions();
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
      <div className="terms-page">
        <div className="terms-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading Terms & Conditions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="terms-page">
        <div className="terms-container">
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
    <div className="terms-page">
      <div className="terms-container">
        {/* <div className="terms-header">
          <h1>Terms & Conditions</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div> */}

        <div className="terms-content">
          {termsData.length > 0 ? (
            termsData.map((terms, index) => {
              const listItems = formatContentToList(terms.content || terms.description || '');
              
              return (
                <div key={index} className="terms-section">
                  <h2>{terms.title || 'Terms & Conditions'}</h2>
                  
                  {listItems.length > 0 ? (
                    <ul className="terms-list">
                      {listItems.map((item, itemIndex) => (
                        <li key={itemIndex} className="terms-list-item">
                          <h3>{item.title}</h3>
                          <div 
                            className="terms-text"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div 
                      className="terms-text"
                      dangerouslySetInnerHTML={{ __html: terms.content || terms.description || 'Terms and conditions content will be displayed here.' }}
                    />
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-content">
              <p>No terms and conditions content available.</p>
            </div>
          )}
        </div>

        <div className="terms-footer">
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

export default TermsConditionsPage;
