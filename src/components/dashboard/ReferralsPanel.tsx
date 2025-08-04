import React, { useState, useEffect } from "react";
import { Copy, Share2, Link } from "react-feather";
import { apiUtils, userApi } from "../../api";
import "./ReferralsPanel.css";

interface Referral {
  id: number;
  name: string;
  email: string;
  referral_code: string;
  payment_status: 'PENDING' | 'PAID';
  status: string;
  created_at: string;
}

export default function ReferralsPanel() {
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  // Get user data and referral code
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = apiUtils.getUserData();
        setUserData(user);
        
        if (user && user.referral_code) {
          const token = apiUtils.getToken();
          if (token) {
            const result = await userApi.getUsersReferredBy(user.referral_code, token);
            setReferrals(result.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching referrals:', error);
        setError('Failed to load referrals');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const referralLink = userData?.referral_code 
    ? `https://giftshero.com/ref/${userData.referral_code}`
    : "https://giftshero.com/ref/GH1234";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Join GiftsHero!", url: referralLink });
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  const totalEarnings = referrals.reduce((sum, r) => sum + (r.payment_status === 'PAID' ? 100 : 0), 0);

  if (loading) {
    return (
      <div className="referral-dashboard-panel">
        <div className="referral-loading">
          <div className="loading-spinner"></div>
          <p>Loading your referral data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="referral-dashboard-panel">
        <div className="referral-error">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()} className="referral-retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="referral-dashboard-panel">
      <div className="referral-top-row">
        <div className="referral-link-box">
          <div className="referral-link-label"><Link size={18} /> Your Referral Link</div>
          <div className="referral-link-row">
            <input className="referral-link-input" value={referralLink} readOnly />
            <button className="referral-copy-btn" onClick={handleCopy}><Copy size={16} /> {copied ? "Copied!" : "Copy"}</button>
            <button className="referral-share-btn" onClick={handleShare}><Share2 size={16} /> Share</button>
          </div>
        </div>
      </div>
      
      <div className="referral-stats-box">
        <div className="referral-stats-title">Referral Statistics</div>
        <div className="referral-stats-grid">
          <div className="referral-stat-item">
            <div className="referral-stat-value">{referrals.length}</div>
            <div className="referral-stat-label">Total Referrals</div>
          </div>
          <div className="referral-stat-item">
            <div className="referral-stat-value">₹{totalEarnings}</div>
            <div className="referral-stat-label">Total Earnings</div>
          </div>
          <div className="referral-stat-item">
            <div className="referral-stat-value">{referrals.filter(r => r.payment_status === 'PAID').length}</div>
            <div className="referral-stat-label">Paid Referrals</div>
          </div>
        </div>
      </div>

      <div className="referral-list-section">
        <div className="referral-list-title">Your Referrals</div>
        {referrals.length === 0 ? (
          <div className="referral-empty">
            <p>No referrals yet. Share your referral link to start earning!</p>
          </div>
        ) : (
          <div className="referral-list">
            {referrals.map((referral) => (
              <div key={referral.id} className="referral-item">
                <div className="referral-item-info">
                  <div className="referral-item-name">{referral.name}</div>
                  <div className="referral-item-email">{referral.email}</div>
                  <div className="referral-item-date">Joined: {new Date(referral.created_at).toLocaleDateString()}</div>
                </div>
                <div className="referral-item-status">
                  <span className={`status-badge status-${referral.payment_status.toLowerCase()}`}>
                    {referral.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 