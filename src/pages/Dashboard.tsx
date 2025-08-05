import React, { useState, useEffect } from "react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import UserProfilePanel from "../components/dashboard/UserProfilePanel";
import MyOrdersPanel from "../components/dashboard/MyOrdersPanel";
import RewardsPanel from "../components/dashboard/RewardsPanel";
import ReferralsPanel from "../components/dashboard/ReferralsPanel";
import PaymentsPanel from "../components/dashboard/PaymentsPanel";
import PayoutsPanel from "../components/dashboard/PayoutsPanel";
import WishlistPanel from "../components/dashboard/WishlistPanel";
import WalletPanel from "../components/dashboard/WalletPanel";
import SecurityPanel from "../components/dashboard/SecurityPanel";
import AddressBookPanel from "../components/dashboard/AddressBookPanel";
import SupportPanel from "../components/dashboard/SupportPanel";
import InvoicesPanel from "../components/dashboard/InvoicesPanel";
import SpecialOffersPanel from "../components/dashboard/SpecialOffersPanel";
import { Package, DollarSign, Users, Star, Loader } from "react-feather";
import { apiUtils, userApi } from "../api";
import "./Dashboard.css";

function DashboardHome() {
  const [copied, setCopied] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState<string | null>(null);
  const referralLink = "https://giftshero.com/ref/GH1234";

  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        setWalletLoading(true);
        const userData = apiUtils.getUserData();
        const token = apiUtils.getToken();
        
        if (!userData || !token) {
          setWalletError('Please login to view wallet balance');
          return;
        }

        const result = await userApi.getWalletBalance(userData.id, token);
        console.log('Wallet Balance API Response:', result);
        
        if (result.data && result.data.currentWalletBalance !== undefined) {
          setWalletBalance(result.data.currentWalletBalance);
        } else {
          setWalletError('Failed to load wallet balance');
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        setWalletError('Failed to load wallet balance');
      } finally {
        setWalletLoading(false);
      }
    };

    fetchWalletBalance();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="gh-dashboard-home">
      <div className="gh-dashboard-welcome">
        Welcome back, <b>User</b>! Here’s your GiftsHero dashboard overview.
      </div>
      <div className="gh-dashboard-summary-grid">
        <div className="gh-summary-card gh-animate">
          <div className="gh-summary-icon"><Package size={28} /></div>
          <div className="gh-summary-value">24</div>
          <div className="gh-summary-label">Orders</div>
        </div>
        <div className="gh-summary-card gh-animate">
          <div className="gh-summary-icon"><DollarSign size={28} /></div>
          <div className="gh-summary-value">
            {walletLoading ? (
              <Loader size={20} className="animate-spin" />
            ) : walletError ? (
              <span style={{ color: '#ef4444', fontSize: '14px' }}>Error</span>
            ) : walletBalance !== null ? (
              `₹${walletBalance.toLocaleString()}`
            ) : (
              '₹0'
            )}
          </div>
          <div className="gh-summary-label">Wallet Balance</div>
        </div>
        <div className="gh-summary-card gh-animate">
          <div className="gh-summary-icon"><Users size={28} /></div>
          <div className="gh-summary-value">₹800</div>
          <div className="gh-summary-label">Referral Earnings</div>
        </div>
        <div className="gh-summary-card gh-animate">
          <div className="gh-summary-icon"><Star size={28} /></div>
          <div className="gh-summary-value">Silver</div>
          <div className="gh-summary-label">Rank</div>
        </div>
      </div>
      <div className="gh-dashboard-main-widgets">
        <div className="gh-recent-orders-card gh-animate">
          <div className="gh-widget-title">Recent Orders</div>
          <ul className="gh-orders-list">
            <li className="gh-order-item">
              <span className="gh-order-id">#ORD1234</span>
              <span className="gh-order-product">Wireless Earbuds</span>
              <span className="gh-order-status gh-status-delivered">Delivered</span>
              <span className="gh-order-date">2024-05-01</span>
            </li>
            <li className="gh-order-item">
              <span className="gh-order-id">#ORD1235</span>
              <span className="gh-order-product">Smart Watch</span>
              <span className="gh-order-status gh-status-shipped">Shipped</span>
              <span className="gh-order-date">2024-04-28</span>
            </li>
            <li className="gh-order-item">
              <span className="gh-order-id">#ORD1236</span>
              <span className="gh-order-product">Gift Card</span>
              <span className="gh-order-status gh-status-processing">Processing</span>
              <span className="gh-order-date">2024-04-20</span>
            </li>
          </ul>
        </div>
        <div className="gh-referral-widget gh-animate">
          <div className="gh-widget-title">Quick Referral Stats</div>
          <div className="gh-referral-stats-row">
            <div className="gh-referral-stat">
              <div className="gh-referral-icon"><Users size={22} /></div>
              <div className="gh-referral-value">12</div>
              <div className="gh-referral-label">Direct Referrals</div>
            </div>
          </div>
          <div className="gh-referral-link-row">
            <input className="gh-referral-link" value={referralLink} readOnly />
            <button className="gh-copy-btn" onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const panelComponents: { [key: string]: React.ReactNode } = {
  profile: <UserProfilePanel />,
  orders: <MyOrdersPanel />,
  rewards: <RewardsPanel />,
  referrals: <ReferralsPanel />,
  payments: <PaymentsPanel />,
  payouts: <PayoutsPanel />,
  wishlist: <WishlistPanel />,
  wallet: <WalletPanel />,
  security: <SecurityPanel />,
  address: <AddressBookPanel />,
  invoices: <InvoicesPanel />,
  offers: <SpecialOffersPanel />,
  // Add placeholders for new panels
  dashboard: <DashboardHome />,
  "new-registration": <div className="dashboard-panel">[New Registration Panel]</div>,
  "my-sponsors": <div className="dashboard-panel">[My Sponsors Panel]</div>,
  "sponsor-level-tree": <div className="dashboard-panel">[Sponsor Level Tree Panel]</div>,
  "network-tree": <div className="dashboard-panel">[Network Tree Panel]</div>,
  "team-list": <div className="dashboard-panel">[Team List Panel]</div>,
  "matching-status": <div className="dashboard-panel">[Matching Status Panel]</div>,
  "team-bv-report": <div className="dashboard-panel">[Team BV Report Panel]</div>,
  "rising-stars": <div className="dashboard-panel">[Rising Stars Panel]</div>,
  materials: <div className="dashboard-panel">[Materials Panel]</div>,
  "dispatch-details": <div className="dashboard-panel">[Dispatch Details Panel]</div>,
  subscriptions: <div className="dashboard-panel">[Subscriptions Panel]</div>,
  "id-card": <div className="dashboard-panel">[ID Card Panel]</div>,
  "welcome-letter": <div className="dashboard-panel">[Welcome Letter Panel]</div>,
  "change-password": <div className="dashboard-panel">[Change Password Panel]</div>,
  "change-wallet-password": <div className="dashboard-panel">[Change Wallet Password Panel]</div>,
  banner: <div className="dashboard-panel">[Banner Panel]</div>,
  "pop-up": <div className="dashboard-panel">[Pop-up Panel]</div>,
  "my-products": <div className="dashboard-panel">[My Products Panel]</div>,
  "my-coupons": <div className="dashboard-panel">[My Coupons Panel]</div>,
  "product-combo": <div className="dashboard-panel">[Product Combo Panel]</div>,
  "updated-info": <div className="dashboard-panel">[Updated Info Panel]</div>,
  inquiries: <div className="dashboard-panel">[Inquiries Panel]</div>,
  "income-pc": <div className="dashboard-panel">[Income from PC Panel]</div>,
  "b2c-bonus": <div className="dashboard-panel">[B2C Bonus Panel]</div>,
  "affiliate-bonus": <div className="dashboard-panel">[Affiliate Bonus Panel]</div>,
  "matching-club-bonus": <div className="dashboard-panel">[Matching Club Bonus Panel]</div>,
  "achiever-bonus": <div className="dashboard-panel">[Achiever Bonus Panel]</div>,
  "super-achieve-bonus": <div className="dashboard-panel">[Super Achieve Bonus Panel]</div>,
  "associate-club-income": <div className="dashboard-panel">[Associate Club Income Panel]</div>,
  "developer-club-income": <div className="dashboard-panel">[Developer Club Income Panel]</div>,
  "manager-club-income": <div className="dashboard-panel">[Manager Club Income Panel]</div>,
  "leader-club-income": <div className="dashboard-panel">[Leader Club Income Panel]</div>,
  "executive-club-income": <div className="dashboard-panel">[Executive Club Income Panel]</div>,
  "ambassador-club-income": <div className="dashboard-panel">[Ambassador Club Income Panel]</div>,
  "consistency-club-income": <div className="dashboard-panel">[Consistency Club Income Panel]</div>,
  "shopping-transactions": <div className="dashboard-panel">[Shopping Wallet Transactions Panel]</div>,
  "shopping-make-request": <div className="dashboard-panel">[Shopping Wallet Make Request Panel]</div>,
  "loyalty-transactions": <div className="dashboard-panel">[Loyalty Redeem Transactions Panel]</div>,
  "loyalty-make-request": <div className="dashboard-panel">[Loyalty Redeem Make Request Panel]</div>,
  "payout-view": <div className="dashboard-panel">[Payout View Panel]</div>,
  "payout-monthly-income": <div className="dashboard-panel">[Payout Monthly Income Panel]</div>,
  "events-view": <div className="dashboard-panel">[Events View Panel]</div>,
  "events-participants": <div className="dashboard-panel">[Events Participants Panel]</div>,
  downloads: <div className="dashboard-panel">[Downloads Panel]</div>,
  support: <SupportPanel />,
};

export default function Dashboard() {
  const [activePanel, setActivePanel] = useState("dashboard");

  return (
    <div className="dashboard-container">
      <DashboardSidebar
        activePanel={activePanel}
        onPanelChange={setActivePanel}
      />
      <div className="dashboard-content">
        {panelComponents[activePanel] || <div className="dashboard-panel">Panel not found.</div>}
      </div>
    </div>
  );
} 