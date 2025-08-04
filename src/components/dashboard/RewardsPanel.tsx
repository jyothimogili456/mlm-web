import React, { useState, useEffect } from "react";
import { Gift, Award, Target, TrendingUp, X } from "react-feather";
import { apiUtils, userApi } from "../../api";
import "./RewardsPanel.css";

interface ReferralStats {
  todayReferrals: number;
  monthReferrals: number;
  reward?: string;
  todayNextGoal?: string;
  monthNextGoal?: string;
}

interface ReferralPackage {
  id: number;
  title: string;
  description: string;
  target: number;
  current: number;
  timeframe: string;
  icon: string;
  color: string;
  nextGoal?: string;
}

const rewardHistory = [
  { 
    id: 1,
    date: "2024-05-01", 
    source: "Referral Bonus", 
    amount: 50, 
    referralsCount: 20,
    status: "Available",
    bankDetails: {
      bankName: "HDFC Bank",
      accountNumber: "1234567890",
      ifscCode: "HDFC0001234",
      accountHolder: "John Doe"
    }
  },
  { 
    id: 2,
    date: "2024-04-28", 
    source: "Level Up", 
    amount: 100, 
    referralsCount: 25,
    status: "Available",
    bankDetails: {
      bankName: "HDFC Bank",
      accountNumber: "1234567890",
      ifscCode: "HDFC0001234",
      accountHolder: "John Doe"
    }
  },
  { 
    id: 3,
    date: "2024-04-20", 
    source: "Purchase Cashback", 
    amount: 30, 
    referralsCount: 10,
    status: "Available",
    bankDetails: {
      bankName: "HDFC Bank",
      accountNumber: "1234567890",
      ifscCode: "HDFC0001234",
      accountHolder: "John Doe"
    }
  },
  { 
    id: 4,
    date: "2024-04-15", 
    source: "Referral Bonus", 
    amount: 50, 
    referralsCount: 15,
    status: "Available",
    bankDetails: {
      bankName: "HDFC Bank",
      accountNumber: "1234567890",
      ifscCode: "HDFC0001234",
      accountHolder: "John Doe"
    }
  },
];

export default function RewardsPanel() {
  const [claimed, setClaimed] = useState<number[]>([]);
  const [showBankModal, setShowBankModal] = useState<number | null>(null);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [pendingRewards, setPendingRewards] = useState<number[]>([]);
  const [bankFormData, setBankFormData] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolder: ""
  });
  const [referralPackages, setReferralPackages] = useState<ReferralPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch referral stats from API
  useEffect(() => {
    const fetchReferralStats = async () => {
      try {
        setLoading(true);
        const userData = apiUtils.getUserData();
        const token = apiUtils.getToken();
        
        if (!userData || !token) {
          setError('Please login to view referral stats');
          return;
        }

        const result = await userApi.getReferralStats(userData.referral_code, token);
        console.log('Referral Stats API Response:', result);
        
        // Transform API data to match component structure
        const stats = result.data;
        const packages: ReferralPackage[] = [
          {
            id: 1,
            title: "Daily Cashback",
            description: "₹500 Cashback",
            target: 5,
            current: stats.todayReferrals,
            timeframe: "in a day",
            icon: "💰",
            color: "#10b981",
            nextGoal: stats.todayNextGoal
          },
          {
            id: 2,
            title: "Weekly Smartwatch",
            description: "Smart Watch",
            target: 25,
            current: Math.min(stats.monthReferrals, 25), // Weekly target
            timeframe: "in a week",
            icon: "⌚",
            color: "#3b82f6"
          },
          {
            id: 3,
            title: "Monthly Smartphone",
            description: "Smart Phone",
            target: 100,
            current: stats.monthReferrals,
            timeframe: "in a month",
            icon: "📱",
            color: "#8b5cf6",
            nextGoal: stats.monthNextGoal
          }
        ];
        
        setReferralPackages(packages);
      } catch (error) {
        console.error('Error fetching referral stats:', error);
        setError('Failed to load referral stats');
      } finally {
        setLoading(false);
      }
    };

    fetchReferralStats();
  }, []);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (showBankModal || showThankYouModal) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scrolling
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
    } else {
      // Restore scrolling
      const scrollY = document.body.style.top;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [showBankModal, showThankYouModal]);

  const handleClaim = (id: number) => {
    setClaimed((prev) => [...prev, id]);
  };

  const handleRedeem = (id: number) => {
    setShowBankModal(id);
    // Reset form data when opening modal
    setBankFormData({
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountHolder: ""
    });
  };

  const closeModal = () => {
    setShowBankModal(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setBankFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitBankDetails = () => {
    // Here you would typically send the bank details to your backend
    console.log("Bank details submitted:", bankFormData);
    closeModal();
    setShowThankYouModal(true);
    // Add the current reward to pending list
    if (showBankModal) {
      setPendingRewards(prev => [...prev, showBankModal]);
    }
  };

  const closeThankYouModal = () => {
    setShowThankYouModal(false);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getRemainingText = (current: number, target: number) => {
    const remaining = target - current;
    if (remaining <= 0) return "Target Achieved! 🎉";
    return `${remaining} more to go`;
  };

  if (loading) {
    return (
      <div className="rewards-dashboard-panel">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '2rem',
          minHeight: '200px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p>Loading referral stats...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rewards-dashboard-panel">
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: '#ef4444'
        }}>
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              background: '#7c3aed',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  const selectedReward = rewardHistory.find(reward => reward.id === showBankModal);

  return (
    <div className="rewards-dashboard-panel">
      {/* Referral Packages Section */}
      <div className="rewards-referral-packages rewards-card">
        <div className="rewards-packages-title">
          <Target size={18} /> Referral Rewards & Offers
        </div>
        <div className="rewards-packages-subtitle">
          Complete referral targets to unlock amazing rewards!
        </div>
        <div className="rewards-packages-grid">
          {referralPackages.map((pkg) => {
            const progressPercent = calculateProgress(pkg.current, pkg.target);
            const remainingText = getRemainingText(pkg.current, pkg.target);
            const isCompleted = pkg.current >= pkg.target;
            
            return (
              <div className="rewards-package-card" key={pkg.id}>
                <div className="rewards-package-header">
                  <span className="rewards-package-icon" style={{ color: pkg.color }}>
                    {pkg.icon}
                  </span>
                  <div className="rewards-package-info">
                    <h3 className="rewards-package-title">{pkg.title}</h3>
                    <p className="rewards-package-description">{pkg.description}</p>
                    <p className="rewards-package-timeframe">{pkg.target} referrals {pkg.timeframe}</p>
                  </div>
                </div>
                
                <div className="rewards-package-progress-section">
                  <div className="rewards-package-progress-header">
                    <span className="rewards-package-current">
                      {pkg.current}/{pkg.target} referrals
                    </span>
                    <span className="rewards-package-remaining">
                      {pkg.nextGoal || remainingText}
                    </span>
                  </div>
                  
                  <div className="rewards-package-progress-bar-bg">
                    <div 
                      className="rewards-package-progress-bar"
                      style={{ 
                        width: `${progressPercent}%`,
                        backgroundColor: pkg.color
                      }}
                    />
                  </div>
                  
                  <div className="rewards-package-progress-text">
                    {progressPercent.toFixed(0)}% Complete
                  </div>
                </div>

                {isCompleted && (
                  <div className="rewards-package-completed">
                    <span className="rewards-package-completed-badge">🎉 Target Achieved!</span>
                    <button className="rewards-package-claim-btn">
                      Claim {pkg.description}
                    </button>
      </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="rewards-history-section rewards-card">
        <div className="rewards-history-title"><Gift size={18} /> Reward History</div>
        <table className="rewards-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Referrals Count</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rewardHistory.map((reward, i) => (
              <tr key={i}>
                <td>{reward.date}</td>
                <td>{reward.source}</td>
                <td>{reward.referralsCount}</td>
                <td>
                  {pendingRewards.includes(reward.id) ? (
                    <button className="rewards-pending-btn" disabled>
                      Pending
                    </button>
                  ) : (
                    <button 
                      className="rewards-redeem-btn"
                      onClick={() => handleRedeem(reward.id)}
                    >
                      Redeem Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bank Details Modal */}
      {showBankModal && selectedReward && (
        <div className="bank-modal-overlay" onClick={closeModal}>
          <div className="bank-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bank-modal-header">
              <h3>Enter Bank Details for Transfer</h3>
              <button className="bank-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="bank-modal-content">
              <div className="bank-details-grid">
                <div className="bank-detail-item">
                  <label className="bank-detail-label">Bank Name:</label>
                  <input
                    type="text"
                    className="bank-detail-input"
                    placeholder="Enter bank name"
                    value={bankFormData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                  />
                </div>
                <div className="bank-detail-item">
                  <label className="bank-detail-label">Account Number:</label>
                  <input
                    type="text"
                    className="bank-detail-input"
                    placeholder="Enter account number"
                    value={bankFormData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  />
                </div>
                <div className="bank-detail-item">
                  <label className="bank-detail-label">IFSC Code:</label>
                  <input
                    type="text"
                    className="bank-detail-input"
                    placeholder="Enter IFSC code"
                    value={bankFormData.ifscCode}
                    onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                  />
                </div>
                <div className="bank-detail-item">
                  <label className="bank-detail-label">Account Holder:</label>
                  <input
                    type="text"
                    className="bank-detail-input"
                    placeholder="Enter account holder name"
                    value={bankFormData.accountHolder}
                    onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                  />
                </div>
              </div>
              <div className="bank-modal-actions">
                <button 
                  className="bank-submit-btn"
                  onClick={handleSubmitBankDetails}
                  disabled={!bankFormData.bankName || !bankFormData.accountNumber || !bankFormData.ifscCode || !bankFormData.accountHolder}
                >
                  Submit Bank Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      {showThankYouModal && (
        <div className="bank-modal-overlay" onClick={closeThankYouModal}>
          <div className="thank-you-modal" onClick={(e) => e.stopPropagation()}>
            <div className="thank-you-content">
              <div className="thank-you-icon">✓</div>
              <h2 className="thank-you-title">Thank You!</h2>
              <p className="thank-you-message">
                Money will be deposited to your account within 24 hours.
              </p>
              <button className="thank-you-close-btn" onClick={closeThankYouModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 