import React, { useState, useEffect, useCallback } from "react";
import { Gift, Target, TrendingUp, X, AlertCircle, CheckCircle } from "react-feather";
import { apiUtils, userApi, bankDetailsApi } from "../../api";
import "./RewardsPanel.css";

// ReferralStats interface removed as it was unused

interface UserData {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  referral_code: string;
  referralCount: number;
  wallet_balance?: number;
  payment_status: string;
  created_at: string;
  address?: string;
  gender?: string;
  reward?: string;
  referred_by_code?: string;
  status?: string;
  updated_at?: string;
  token?: string;
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



export default function RewardsPanel() {

  const [showBankModal, setShowBankModal] = useState<number | string | null>(null);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
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
  const [redeemAmount, setRedeemAmount] = useState<number>(250);
  const [redeemAmountError, setRedeemAmountError] = useState<string>("");
  const [referralPackages, setReferralPackages] = useState<ReferralPackage[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeemHistory, setRedeemHistory] = useState<any[]>([]);
  const [showWalletZeroNotification, setShowWalletZeroNotification] = useState(false);

  // Function to refresh user data and redeem history
  const refreshUserData = useCallback(async () => {
    try {
      const currentUserData = apiUtils.getUserData();
      const token = apiUtils.getToken();
      
      if (!currentUserData || !token) {
        return;
      }

      // Store current wallet balance before fetching new data
      const currentWalletBalance = userData?.wallet_balance || 0;

      // Fetch updated user data to get current wallet balance
      const userResult = await userApi.getUserById(currentUserData.id, token);
      console.log('Updated User Data API Response:', userResult);
      
      setUserData(userResult.data);

      // Check if wallet balance became zero and show notification
      if (currentWalletBalance > 0 && userResult.data.wallet_balance === 0) {
        setShowWalletZeroNotification(true);
        // Auto-hide notification after 5 seconds
        setTimeout(() => setShowWalletZeroNotification(false), 5000);
      }

      // Fetch updated redeem history
      try {
        const historyResponse = await bankDetailsApi.getRedeemHistory(currentUserData.id, token);
        if (historyResponse.data) {
          setRedeemHistory(historyResponse.data);
        }
      } catch (error) {
        console.log('Error fetching updated redeem history:', error);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  }, [userData?.wallet_balance]); // Include wallet_balance dependency

  // Fetch referral stats and user data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUserData = apiUtils.getUserData();
        const token = apiUtils.getToken();
        
        if (!currentUserData || !token) {
          setError('Please login to view referral stats');
          return;
        }

        // Fetch user data to get wallet balance
        const userResult = await userApi.getUserById(currentUserData.id, token);
        console.log('User Data API Response:', userResult);
        setUserData(userResult.data);

        // Fetch user's redeem status and history
        try {
          const bankResponse = await bankDetailsApi.getBankDetails(currentUserData.id, token);
          if (bankResponse.data && bankResponse.data.redeemAmount > 0) {
            // Redeem status handling removed as userRedeemStatus state was unused
          }

          // Fetch redeem history
          const historyResponse = await bankDetailsApi.getRedeemHistory(currentUserData.id, token);
          if (historyResponse.data) {
            setRedeemHistory(historyResponse.data);
          }
        } catch (error) {
          console.log('No bank details found or error fetching:', error);
        }

        // Fetch referral stats
        const result = await userApi.getReferralStats(currentUserData.referral_code, token);
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
            color: "#10b981"
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
            current: Math.min(stats.monthReferrals, 100),
            timeframe: "in a month",
            icon: "📱",
            color: "#8b5cf6"
          }
        ];
        
        setReferralPackages(packages);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(refreshUserData, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [refreshUserData]); // Include refreshUserData dependency

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

  const handleClaim = (id: number | string) => {
    // When a reward is claimed, open the redeem modal
    // This will allow users to redeem their earned rewards
    handleRedeem(id);
  };

  const handleRedeem = async (id: number | string) => {
    setBankFormErrors({});
    setRedeemAmountError("");
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
        // User has bank details - fetch and show them with redeem amount input
        const bankResponse = await bankDetailsApi.getBankDetails(userData.id, token);
        setExistingBankDetails(bankResponse.data);
        
        // Set redeem amount based on existing data or default
        if (bankResponse.data.redeemAmount > 0) {
          setRedeemAmount(bankResponse.data.redeemAmount);
        } else {
          setRedeemAmount(250); // Set default minimum amount
        }
        
        setShowBankModal(id);
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
        setRedeemAmount(250); // Set default minimum amount
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

  const validateRedeemAmount = () => {
    if (redeemAmount < 250) {
      setRedeemAmountError("Minimum redeem amount is ₹250");
      return false;
    }
    if (redeemAmount > (userData?.wallet_balance || 0)) {
      setRedeemAmountError(`Maximum redeem amount is ₹${userData?.wallet_balance || 0}`);
      return false;
    }
    setRedeemAmountError("");
    return true;
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

    if (!validateRedeemAmount()) {
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

      // Prepare bank details data with redeem amount and status
      const bankDetailsData = {
        ...bankFormData,
        redeemAmount: redeemAmount,
        redeemStatus: 'processing' as const
      };

      // If user doesn't have bank details, create them first
      if (!existingBankDetails) {
        // Validate bank details with API first
        const validationResponse = await bankDetailsApi.validateBankDetails(bankFormData, token);
        
        if (!validationResponse.data.isValid) {
          throw new Error("Invalid bank details. Please check your information.");
        }

        // Create bank details with redeem amount and status
        const response = await bankDetailsApi.createOrUpdateBankDetails(userData.id, bankDetailsData, token);
        console.log("Bank details saved successfully:", response);
      } else {
        // Update existing bank details with redeem amount and status
        const response = await bankDetailsApi.createOrUpdateBankDetails(userData.id, bankDetailsData, token);
        console.log("Bank details updated successfully:", response);
      }
      
      closeModal();
      setShowThankYouModal(true);
      
      // Add the current reward to pending list (removed as pendingRewards state was unused)
      if (showBankModal) {
        // Pending rewards tracking removed as state was unused
      }
      
      // Update user redeem status (removed as userRedeemStatus state was unused)
      
      // Refresh redeem history
      try {
        const historyResponse = await bankDetailsApi.getRedeemHistory(userData.id, token);
        if (historyResponse.data) {
          setRedeemHistory(historyResponse.data);
        }
      } catch (error) {
        console.log('Error refreshing redeem history:', error);
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

  const handleUpdateRedeemAmount = async () => {
    if (!validateRedeemAmount()) {
      return;
    }

    setIsSubmitting(true);
    setRedeemAmountError("");

    try {
      const token = apiUtils.getToken();
      const userData = apiUtils.getUserData();
      
      if (!token || !userData) {
        throw new Error("Authentication required");
      }

      // Update redeem amount
      const response = await bankDetailsApi.updateRedeemAmount(userData.id, redeemAmount, token);
      console.log("Redeem amount updated successfully:", response);
      
      closeModal();
      setShowThankYouModal(true);
      
      // Update user redeem status (removed as userRedeemStatus state was unused)
      
      // Refresh redeem history
      try {
        const historyResponse = await bankDetailsApi.getRedeemHistory(userData.id, token);
        if (historyResponse.data) {
          setRedeemHistory(historyResponse.data);
        }
      } catch (error) {
        console.log('Error refreshing redeem history:', error);
      }
      
    } catch (error: any) {
      console.error("Error updating redeem amount:", error);
      setRedeemAmountError(error.message || "Failed to update redeem amount. Please try again.");
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
    return `${remaining} more referrals to go`;
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


  return (
    <div className="rewards-dashboard-panel">
      {/* Wallet Zero Notification */}
      {showWalletZeroNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#10b981',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>✅</span>
            <span>Wallet balance has been updated to ₹0 after successful deposit!</span>
          </div>
          <button 
            onClick={() => setShowWalletZeroNotification(false)}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        </div>
      )}
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
                      {remainingText}
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
                    <button 
                      className="rewards-package-claim-btn"
                      onClick={() => handleClaim(pkg.id)}
                    >
                      Claim {pkg.description}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Wallet Balance Section - Show only if there's balance */}
      {userData && userData.wallet_balance && userData.wallet_balance > 0 && (
        <div className="rewards-referral-packages rewards-card">
          <div className="rewards-packages-title">
            <TrendingUp size={18} /> Available Wallet Balance
          </div>
          <div className="rewards-packages-subtitle">
            You have money in your wallet ready to redeem!
          </div>
          <div className="rewards-packages-grid">
            <div className="rewards-package-card">
              <div className="rewards-package-header">
                <span className="rewards-package-icon" style={{ color: "#10b981" }}>
                  💰
                </span>
                <div className="rewards-package-info">
                  <h3 className="rewards-package-title">Wallet Balance</h3>
                  <p className="rewards-package-description">₹{userData.wallet_balance?.toLocaleString()}</p>
                  <p className="rewards-package-timeframe">Available for redemption</p>
                </div>
              </div>
              
              <div className="rewards-package-progress-section">
                <div className="rewards-package-progress-header">
                  <span className="rewards-package-current">
                    Current Balance: ₹{userData.wallet_balance?.toLocaleString()}
                  </span>
                  <span className="rewards-package-remaining">
                    Ready to redeem
                  </span>
                </div>
                
                <div className="rewards-package-progress-bar-bg">
                  <div 
                    className="rewards-package-progress-bar"
                    style={{ 
                      width: "100%",
                      backgroundColor: "#10b981"
                    }}
                  />
                </div>
                
                <div className="rewards-package-progress-text">
                  100% Available
                </div>
              </div>

              <div className="rewards-package-completed">
                <span className="rewards-package-completed-badge">💰 Balance Available!</span>
                <button 
                  className="rewards-package-claim-btn"
                  onClick={() => handleClaim('wallet')}
                >
                  Redeem ₹{userData.wallet_balance?.toLocaleString()}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      <div className="rewards-history-section rewards-card">
        <div className="rewards-history-title">
          <Gift size={18} /> Redeem History
          <button 
            onClick={refreshUserData}
            style={{
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.3rem 0.8rem',
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginLeft: '1rem'
            }}
          >
            🔄 Refresh
          </button>
        </div>
        
        {/* Summary Section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0'
        }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.3rem' }}>
              Current Wallet Balance
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#10b981' }}>
              ₹{userData?.wallet_balance?.toLocaleString() || '0'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.3rem' }}>
              Total Redeemed
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#7c3aed' }}>
              ₹{redeemHistory
                .filter(item => item.status === 'deposited')
                .reduce((sum, item) => sum + (item.redeemAmount || 0), 0)
                .toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.3rem' }}>
              Pending Requests
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f59e0b' }}>
              {redeemHistory.filter(item => item.status === 'processing').length}
            </div>
          </div>
        </div>
        
        <table className="rewards-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Bank Details</th>
            </tr>
          </thead>
          <tbody>
            {redeemHistory.length > 0 ? (
              redeemHistory.map((redeem, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ fontWeight: '600' }}>
                      {new Date(redeem.redeemedAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {new Date(redeem.redeemedAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>Redeem Request</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      ID: {redeem.id}
                    </div>
                  </td>
                  <td>
                    <span className="wallet-balance">
                      ₹{redeem.redeemAmount?.toLocaleString() || '0'}
                    </span>
                  </td>
                  <td>
                    {redeem.status === 'processing' ? (
                      <button className="rewards-pending-btn" disabled>
                        Processing
                      </button>
                    ) : redeem.status === 'deposited' ? (
                      <button className="rewards-completed-btn" disabled>
                        Completed
                      </button>
                    ) : (
                    <button 
                      className="rewards-redeem-btn"
                        onClick={() => handleRedeem(redeem.id)}
                    >
                      Redeem Now
                    </button>
                    )}
                  </td>
                  <td>
                    {redeem.bankDetails ? (
                      <div style={{ fontSize: '0.85rem' }}>
                        <div><strong>{redeem.bankDetails.bankName}</strong></div>
                        <div style={{ color: '#6b7280' }}>
                          A/C: {redeem.bankDetails.accountNumber}
                        </div>
                        <div style={{ color: '#6b7280' }}>
                          IFSC: {redeem.bankDetails.ifscCode}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                        Not available
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    No redeem history found. Start earning rewards by referring friends!
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bank Details Modal */}
      {showBankModal && (
        <div className="bank-modal-overlay" onClick={closeModal}>
          <div className="bank-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bank-modal-header">
              <h3>
                {showBankModal === -1 ? "Edit Bank Details" : 
                 existingBankDetails ? "Redeem Rewards" : "Enter Bank Details"} for Transfer
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
                      <span>Your existing bank details will be used for the transfer.</span>
                    </div>
                  )}
                  
                  {bankFormErrors.general && (
                    <div className="bank-error-banner">
                      <AlertCircle size={16} />
                      <span>{bankFormErrors.general}</span>
                    </div>
                  )}

                  {/* Show existing bank details if available */}
                  {existingBankDetails && (
                    <div className="existing-bank-details">
                      <h4 className="existing-bank-title">Bank Details</h4>
                      <div className="existing-bank-grid">
                        <div className="existing-bank-item">
                          <span className="existing-bank-label">Bank Name:</span>
                          <span className="existing-bank-value">{existingBankDetails.bankName}</span>
                        </div>
                        <div className="existing-bank-item">
                          <span className="existing-bank-label">Account Number:</span>
                          <span className="existing-bank-value">{existingBankDetails.accountNumber}</span>
                        </div>
                        <div className="existing-bank-item">
                          <span className="existing-bank-label">IFSC Code:</span>
                          <span className="existing-bank-value">{existingBankDetails.ifscCode}</span>
                        </div>
                        <div className="existing-bank-item">
                          <span className="existing-bank-label">Account Holder:</span>
                          <span className="existing-bank-value">{existingBankDetails.accountHolderName}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Redeem Amount Input */}
                  <div className="redeem-amount-section">
                    <h4 className="redeem-amount-title">Redeem Amount</h4>
                    <div className="redeem-amount-input-container">
                      <label className="redeem-amount-label">Amount (₹):</label>
                      <input
                        type="number"
                        className={`redeem-amount-input ${redeemAmountError ? 'error' : ''}`}
                        placeholder="Enter amount (minimum ₹250)"
                        value={redeemAmount}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setRedeemAmount(value);
                          if (redeemAmountError) {
                            setRedeemAmountError("");
                          }
                        }}
                        min={250}
                        max={userData?.wallet_balance || 250}
                      />
                      {redeemAmountError && (
                        <span className="redeem-amount-error">{redeemAmountError}</span>
                      )}
                      <div className="redeem-amount-info">
                        <span>Available Balance: ₹{userData?.wallet_balance?.toLocaleString() || '0'}</span>
                        <span>Minimum Amount: ₹250</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bank Details Form (only if no existing details) */}
                  {!existingBankDetails && (
                    <>
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
                    </>
                  )}
                  
                  <div className="bank-modal-actions">
                    {existingBankDetails ? (
                      <div className="bank-modal-actions-row">
                        <button 
                          className="bank-update-amount-btn"
                          onClick={handleUpdateRedeemAmount}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="loading-spinner-small"></div>
                              "Updating..."
                            </>
                          ) : (
                            "Update Redeem Amount"
                          )}
                        </button>
                        <button 
                          className="bank-submit-btn"
                          onClick={handleSubmitBankDetails}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="loading-spinner-small"></div>
                              "Processing..."
                            </>
                          ) : (
                            "Redeem ₹" + redeemAmount.toLocaleString()
                          )}
                        </button>
                      </div>
                    ) : (
                            <button 
                        className="bank-submit-btn"
                              onClick={handleSubmitBankDetails}
                        disabled={isSubmitting || (!bankFormData.bankName || !bankFormData.accountNumber || !bankFormData.ifscCode || !bankFormData.accountHolderName)}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="loading-spinner-small"></div>
                            "Saving..."
                          </>
                        ) : (
                          "Save Bank Details"
                        )}
                      </button>
                    )}
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
                ₹{redeemAmount.toLocaleString()} will be deposited to your account within 24 hours.
              </p>
              
              {/* Show bank details in thank you modal */}
              {existingBankDetails && (
                <div className="thank-you-bank-details">
                  <h4 className="thank-you-bank-title">Transfer Details</h4>
                  <div className="thank-you-bank-grid">
                    <div className="thank-you-bank-item">
                      <span className="thank-you-bank-label">Bank:</span>
                      <span className="thank-you-bank-value">{existingBankDetails.bankName}</span>
                    </div>
                    <div className="thank-you-bank-item">
                      <span className="thank-you-bank-label">Account:</span>
                      <span className="thank-you-bank-value">{existingBankDetails.accountNumber}</span>
                    </div>
                    <div className="thank-you-bank-item">
                      <span className="thank-you-bank-label">IFSC:</span>
                      <span className="thank-you-bank-value">{existingBankDetails.ifscCode}</span>
                    </div>
                    <div className="thank-you-bank-item">
                      <span className="thank-you-bank-label">Account Holder:</span>
                      <span className="thank-you-bank-value">{existingBankDetails.accountHolderName}</span>
                    </div>
                  </div>
                </div>
              )}
              
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