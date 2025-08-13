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
import { DollarSign, Users, Loader } from "react-feather";
import { apiUtils, userApi, productApi, bankDetailsApi } from "../api";
import "./Dashboard.css";

function DashboardHome() {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState<number>(0);
  const [referralCountLoading, setReferralCountLoading] = useState(true);
  const [referralCountError, setReferralCountError] = useState<string | null>(null);
  // userData state removed as it was unused
  const [totalRedeemedAmount, setTotalRedeemedAmount] = useState<number>(0);
  const [redeemHistoryLoading, setRedeemHistoryLoading] = useState(true);
  // referralLink removed as it was unused (commented out in UI)

  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        setWalletLoading(true);
        const currentUserData = apiUtils.getUserData();
        const token = apiUtils.getToken();
        
        if (!currentUserData || !token) {
          setWalletError('Please login to view wallet balance');
          return;
        }

        const result = await userApi.getWalletBalance(currentUserData.id, token);
        console.log('Wallet Balance API Response:', result);
        
        if (result.data && result.data.currentWalletBalance !== undefined) {
          setWalletBalance(result.data.currentWalletBalance);
          if (result.data.userName) {
            setUserName(result.data.userName);
          }
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

  // Fetch redeem history to calculate total redeemed amount
  useEffect(() => {
    const fetchRedeemHistory = async () => {
      try {
        setRedeemHistoryLoading(true);
        const currentUserData = apiUtils.getUserData();
        const token = apiUtils.getToken();
        
        if (!currentUserData || !token) {
          return;
        }

        const historyResponse = await bankDetailsApi.getRedeemHistory(currentUserData.id, token);
        if (historyResponse.data) {
          const totalRedeemed = historyResponse.data
            .filter((item: any) => item.status === 'deposited')
            .reduce((sum: number, item: any) => sum + (item.redeemAmount || 0), 0);
          setTotalRedeemedAmount(totalRedeemed);
        }
      } catch (error) {
        console.log('Error fetching redeem history:', error);
        setTotalRedeemedAmount(0);
      } finally {
        setRedeemHistoryLoading(false);
      }
    };

    fetchRedeemHistory();
  }, []);

  // Fetch user data and referral count
  useEffect(() => {
    const fetchUserDataAndReferrals = async () => {
      try {
        setReferralCountLoading(true);
        setReferralCountError(null);
        
        const user = apiUtils.getUserData();
        const token = apiUtils.getToken();
        
        if (!user || !token) {
          setReferralCountError('Please login to view referral stats');
          setReferralCountLoading(false);
          return;
        }

        // setUserData call removed as state was unused
        
        if (user.referral_code) {
          const result = await userApi.getUsersReferredBy(user.referral_code, token);
          console.log('Referral Count API Response:', result);
          
          if (result.data) {
            setReferralCount(result.data.length);
          } else {
            setReferralCount(0);
          }
        } else {
          setReferralCount(0);
        }
      } catch (error) {
        console.error('Error fetching referral count:', error);
        setReferralCountError('Failed to load referral count');
        setReferralCount(0);
      } finally {
        setReferralCountLoading(false);
      }
    };

    fetchUserDataAndReferrals();
  }, []);

  // Fetch recent orders
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError(null);
        
        const currentUserData = apiUtils.getUserData();
        const token = apiUtils.getToken();
        
        if (!currentUserData || !token) {
          setOrdersError('Please login to view recent orders');
          setOrdersLoading(false);
          return;
        }

        const result = await productApi.getOrderHistory(currentUserData.id, token);
        console.log('Recent Orders API Response:', result);
        
        if (result.data) {
          // Transform API data and take only the first 3 orders
          const transformedOrders = result.data.map((order: any) => ({
            id: order.id?.toString() || order.orderId?.toString() || `ORD${Math.random().toString(36).substr(2, 9)}`,
            product: order.productName || order.product || 'Product',
            date: order.created_at || order.orderDate || new Date().toISOString().split('T')[0],
            status: order.status || 'Processing',
            amount: order.amount || order.totalAmount || 0
          }));
          
          // Take only the first 3 orders for recent orders
          setRecentOrders(transformedOrders.slice(0, 3));
        } else {
          setRecentOrders([]);
        }
      } catch (error) {
        console.error('Error fetching recent orders:', error);
        setOrdersError('Failed to load recent orders');
        setRecentOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);



  return (
    <div className="gh-dashboard-home">
      <div className="gh-dashboard-welcome">
        Welcome back, <b>{userName || "User"}</b>!
      </div>
      <div className="gh-dashboard-summary-grid">
        {/* <div className="gh-summary-card gh-animate">
          <div className="gh-summary-icon"><Package size={28} /></div>
          <div className="gh-summary-value">24</div>
          <div className="gh-summary-label">Orders</div>
        </div> */}
        <div className="gh-summary-card gh-animate">
          <div className="gh-summary-icon"><DollarSign size={28} /></div>
          <div className="gh-summary-value">
            {walletLoading ? (
              <Loader size={20} className="animate-spin" />
            ) : walletError && (walletError.toLowerCase().includes('token') || walletError.toLowerCase().includes('login') || walletError.toLowerCase().includes('expired')) ? (
              <div className="gh-login-prompt">
                <span style={{ color: '#7c3aed', fontWeight: 600 }}>Please login to view wallet balance</span>
              </div>
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
          <div className="gh-summary-value">
            {redeemHistoryLoading ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              `₹${totalRedeemedAmount.toLocaleString()}`
            )}
          </div>
          <div className="gh-summary-label">Referral Earnings</div>
        </div>
        {/* <div className="gh-summary-card gh-animate">
          <div className="gh-summary-icon"><Star size={28} /></div>
          <div className="gh-summary-value">Silver</div>
          <div className="gh-summary-label">Rank</div>
        </div> */}
      </div>
      <div className="gh-dashboard-main-widgets">
        <div className="gh-recent-orders-card gh-animate">
          <div className="gh-widget-title">Recent Orders</div>
          {ordersLoading ? (
            <div className="gh-orders-loading">
              <Loader size={20} className="animate-spin" />
              <span>Loading recent orders...</span>
            </div>
          ) : ordersError && (ordersError.toLowerCase().includes('token') || ordersError.toLowerCase().includes('login') || ordersError.toLowerCase().includes('expired')) ? (
            <div className="gh-login-prompt">
              <span style={{ color: '#7c3aed', fontWeight: 600 }}>Please login to view recent orders</span>
            </div>
          ) : ordersError ? (
            <div className="gh-orders-error">
              <span>{ordersError}</span>
            </div>
          ) : recentOrders.length > 0 ? (
            <ul className="gh-orders-list">
              {recentOrders.map((order) => (
                <li key={order.id} className="gh-order-item">
                  <span className="gh-order-id">#{order.id}</span>
                  <span className="gh-order-product">{order.product}</span>
                  <span className={`gh-order-status gh-status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <span className="gh-order-date">{order.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="gh-orders-empty">
              <span>No recent orders found</span>
            </div>
          )}
        </div>
        <div className="gh-referral-widget gh-animate">
          <div className="gh-widget-title">Quick Referral Stats</div>
          <div className="gh-referral-stats-row">
            <div className="gh-referral-stat">
              <div className="gh-referral-icon"><Users size={22} /></div>
              <div className="gh-referral-value">
                {referralCountLoading ? (
                  <Loader size={16} className="animate-spin" />
                ) : referralCountError && (referralCountError.toLowerCase().includes('token') || referralCountError.toLowerCase().includes('login') || referralCountError.toLowerCase().includes('expired')) ? (
                  <span style={{ color: '#7c3aed', fontWeight: 600 }}>Please login to view referral stats</span>
                ) : referralCountError ? (
                  <span style={{ color: '#ef4444', fontSize: '14px' }}>Error</span>
                ) : (
                  referralCount
                )}
              </div>
              <div className="gh-referral-label">Direct Referrals</div>
            </div>
          </div>
          {/* <div className="gh-referral-link-row">
            <input className="gh-referral-link" value={referralLink} readOnly />
            <button className="gh-copy-btn" onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
          </div> */}
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