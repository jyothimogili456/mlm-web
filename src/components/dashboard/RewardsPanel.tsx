import React, { useState, useEffect } from "react";
import { Gift, Award, Target, TrendingUp, X, AlertCircle, CheckCircle } from "react-feather";
import { apiUtils, userApi, bankDetailsApi } from "../../api";
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
    accountHolderName: ""
  });
  const [bankFormErrors, setBankFormErrors] = useState<{[key: string]: string}>({});
  const [existingBankDetails, setExistingBankDetails] = useState<any>(null);
  const [isLoadingBankDetails, setIsLoadingBankDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleRedeem = async (id: number) => {
    setBankFormErrors({});
    setIsLoadingBankDetails(true);
    
    try {
      const token = apiUtils.getToken();
      const userData = apiUtils.getUserData();
      
      if (!token || !userData) {
        throw new Error("Authentication required");
      }

      // Check if user has existing bank details
      const checkResponse = await bankDetailsApi.checkBankDetails(userData.id, token);
      
      if (checkResponse.data.hasBankDetails) {
        // User has bank details - directly mark as pending
        setPendingRewards(prev => [...prev, id]);
        // Show success message
        setShowThankYouModal(true);
      } else {
        // User doesn't have bank details - show the form
        setShowBankModal(id);
        setExistingBankDetails(null);
        setBankFormData({
          bankName: "",
          accountNumber: "",
          ifscCode: "",
          accountHolderName: ""
        });
      }
    } catch (error) {
      console.error("Error checking bank details:", error);
      // If there's an error checking, show the form as fallback
      setShowBankModal(id);
      setBankFormErrors({ general: "Failed to check bank details. Please enter your details." });
    } finally {
      setIsLoadingBankDetails(false);
    }
  };

  const closeModal = () => {
    setShowBankModal(null);
  };

  const handleEditBankDetails = async () => {
    // Close the thank you modal first
    setShowThankYouModal(false);
    setBankFormErrors({});
    setIsLoadingBankDetails(true);
    
    try {
      const token = apiUtils.getToken();
      const userData = apiUtils.getUserData();
      
      if (!token || !userData) {
        throw new Error("Authentication required");
      }

      // Get existing bank details
      const bankResponse = await bankDetailsApi.getBankDetails(userData.id, token);
      setExistingBankDetails(bankResponse.data);
      setBankFormData({
        bankName: bankResponse.data.bankName,
        accountNumber: bankResponse.data.accountNumber,
        ifscCode: bankResponse.data.ifscCode,
        accountHolderName: bankResponse.data.accountHolderName
      });
      
      // Show modal for editing
      setShowBankModal(-1); // Use -1 to indicate edit mode
    } catch (error) {
      console.error("Error loading bank details:", error);
      setBankFormErrors({ general: "Failed to load bank details. Please try again." });
    } finally {
      setIsLoadingBankDetails(false);
    }
  };

  const validateBankForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!bankFormData.bankName.trim()) {
      errors.bankName = "Bank name is required";
    } else if (bankFormData.bankName.trim().length > 255) {
      errors.bankName = "Bank name must be less than 255 characters";
    }
    
    if (!bankFormData.accountNumber.trim()) {
      errors.accountNumber = "Account number is required";
    } else if (!/^\d{9,18}$/.test(bankFormData.accountNumber.trim())) {
      errors.accountNumber = "Account number must be 9-18 digits only";
    }
    
    if (!bankFormData.ifscCode.trim()) {
      errors.ifscCode = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankFormData.ifscCode.trim())) {
      errors.ifscCode = "Invalid IFSC code format (e.g., SBIN0001234)";
    }
    
    if (!bankFormData.accountHolderName.trim()) {
      errors.accountHolderName = "Account holder name is required";
    } else if (bankFormData.accountHolderName.trim().length < 2) {
      errors.accountHolderName = "Account holder name must be at least 2 characters";
    } else if (bankFormData.accountHolderName.trim().length > 255) {
      errors.accountHolderName = "Account holder name must be less than 255 characters";
    }
    
    setBankFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setBankFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (bankFormErrors[field]) {
      setBankFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleSubmitBankDetails = async () => {
    if (!validateBankForm()) {
      return;
    }

    setIsSubmitting(true);
    setBankFormErrors({});

    try {
      const token = apiUtils.getToken();
      const userData = apiUtils.getUserData();
      
      if (!token || !userData) {
        throw new Error("Authentication required");
      }

      // Validate bank details with API first
      const validationResponse = await bankDetailsApi.validateBankDetails(bankFormData, token);
      
      if (!validationResponse.data.isValid) {
        throw new Error("Invalid bank details. Please check your information.");
      }

      // Create or update bank details
      const response = await bankDetailsApi.createOrUpdateBankDetails(userData.id, bankFormData, token);
      
      console.log("Bank details saved successfully:", response);
      closeModal();
      setShowThankYouModal(true);
      
      // Add the current reward to pending list
      if (showBankModal) {
        setPendingRewards(prev => [...prev, showBankModal]);
      }
      
    } catch (error: any) {
      console.error("Error submitting bank details:", error);
      setBankFormErrors({ 
        general: error.message || "Failed to save bank details. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
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
      {showBankModal && (selectedReward || showBankModal === -1) && (
        <div className="bank-modal-overlay" onClick={closeModal}>
          <div className="bank-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bank-modal-header">
              <h3>
                {showBankModal === -1 ? "Edit Bank Details" : 
                 existingBankDetails ? "Update Bank Details" : "Enter Bank Details"} for Transfer
              </h3>
              <button className="bank-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="bank-modal-content">
              {isLoadingBankDetails ? (
                <div className="bank-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading bank details...</p>
                </div>
              ) : (
                <>
                  {existingBankDetails && (
                    <div className="bank-info-banner">
                      <CheckCircle size={16} />
                      <span>You have existing bank details. You can update them below.</span>
                    </div>
                  )}
                  
                  {bankFormErrors.general && (
                    <div className="bank-error-banner">
                      <AlertCircle size={16} />
                      <span>{bankFormErrors.general}</span>
                    </div>
                  )}
                  
                  <div className="bank-details-grid">
                    <div className="bank-detail-item">
                      <label className="bank-detail-label">Bank Name:</label>
                      <input
                        type="text"
                        className={`bank-detail-input ${bankFormErrors.bankName ? 'error' : ''}`}
                        placeholder="Enter bank name (e.g., State Bank of India)"
                        value={bankFormData.bankName}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                      />
                      {bankFormErrors.bankName && (
                        <span className="bank-error-text">{bankFormErrors.bankName}</span>
                      )}
                    </div>
                    
                    <div className="bank-detail-item">
                      <label className="bank-detail-label">Account Number:</label>
                      <input
                        type="text"
                        className={`bank-detail-input ${bankFormErrors.accountNumber ? 'error' : ''}`}
                        placeholder="Enter account number (9-18 digits)"
                        value={bankFormData.accountNumber}
                        onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                        maxLength={18}
                      />
                      {bankFormErrors.accountNumber && (
                        <span className="bank-error-text">{bankFormErrors.accountNumber}</span>
                      )}
                    </div>
                    
                    <div className="bank-detail-item">
                      <label className="bank-detail-label">IFSC Code:</label>
                      <input
                        type="text"
                        className={`bank-detail-input ${bankFormErrors.ifscCode ? 'error' : ''}`}
                        placeholder="Enter IFSC code (e.g., SBIN0001234)"
                        value={bankFormData.ifscCode}
                        onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                        maxLength={11}
                      />
                      {bankFormErrors.ifscCode && (
                        <span className="bank-error-text">{bankFormErrors.ifscCode}</span>
                      )}
                    </div>
                    
                    <div className="bank-detail-item">
                      <label className="bank-detail-label">Account Holder Name:</label>
                      <input
                        type="text"
                        className={`bank-detail-input ${bankFormErrors.accountHolderName ? 'error' : ''}`}
                        placeholder="Enter account holder name"
                        value={bankFormData.accountHolderName}
                        onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                      />
                      {bankFormErrors.accountHolderName && (
                        <span className="bank-error-text">{bankFormErrors.accountHolderName}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="bank-modal-actions">
                    <button 
                      className="bank-submit-btn"
                      onClick={handleSubmitBankDetails}
                      disabled={isSubmitting || !bankFormData.bankName || !bankFormData.accountNumber || !bankFormData.ifscCode || !bankFormData.accountHolderName}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="loading-spinner-small"></div>
                          {showBankModal === -1 || existingBankDetails ? "Updating..." : "Saving..."}
                        </>
                      ) : (
                        showBankModal === -1 || existingBankDetails ? "Update Bank Details" : "Save Bank Details"
                      )}
                    </button>
                  </div>
                </>
              )}
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
              <div className="thank-you-actions">
                <button className="edit-bank-details-btn" onClick={handleEditBankDetails}>
                  Edit Bank Details
                </button>
                <button className="thank-you-close-btn" onClick={closeThankYouModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 