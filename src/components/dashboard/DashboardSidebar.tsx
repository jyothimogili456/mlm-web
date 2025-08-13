import React, { useState, useEffect } from "react";
import { Home, User, Box, Share2, Gift, Heart, MessageCircle, Menu, X, CreditCard, DollarSign } from "react-feather";
import { useUser } from "../../context/UserContext";
import { userApi } from "../../api";
import "./DashboardSidebar.css";

const menuItems = [
  { label: "Dashboard", key: "dashboard", icon: <Home size={20} /> },
  { label: "My Profile", key: "profile", icon: <User size={20} /> },
  { label: "My Orders", key: "orders", icon: <Box size={20} /> },
  { label: "Referrals & Network", key: "referrals", icon: <Share2 size={20} /> },
  { label: "Rewards & Offers", key: "rewards", icon: <Gift size={20} /> },
  { label: "Payments", key: "payments", icon: <CreditCard size={20} /> },
  { label: "Payouts", key: "payouts", icon: <DollarSign size={20} /> },
  { label: "Wishlist", key: "wishlist", icon: <Heart size={20} /> },
  { label: "Support & Tickets", key: "support", icon: <MessageCircle size={20} /> },
];

interface DashboardSidebarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  address?: string;
  gender?: string;
  referral_code: string;
  referralCount: number;
  reward?: string;
  referred_by_code?: string;
  payment_status: 'PENDING' | 'PAID';
  status: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardSidebar({ activePanel, onPanelChange }: DashboardSidebarProps) {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch user profile data from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('userToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await userApi.getUserById(parseInt(user.id), token);
        
        if (response.statusCode === 200 && response.data) {
          setUserProfile(response.data);
        } else {
          console.error('Failed to fetch user profile:', response.message);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const handleMenuClick = (key: string) => {
    onPanelChange(key);
    // Close mobile sidebar when menu item is clicked
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-sidebar-toggle"
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`dashboard-sidebar ${isMobileOpen ? 'mobile-open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Desktop Collapse Toggle Button */}
        <button 
          className="desktop-collapse-toggle"
          onClick={toggleCollapse}
          aria-label="Toggle sidebar collapse"
        >
          {isCollapsed ? <Menu size={16} /> : <X size={16} />}
        </button>

        {/* User Profile Section */}
        <div className="sidebar-user-section">
          <div className="sidebar-user-photo">
            <User size={40} className="sidebar-user-icon" />
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {loading ? "Loading..." : (userProfile?.name || user?.name || "User Name")}
            </div>
            <div className="sidebar-user-referral">
              Ref: {loading ? "Loading..." : (userProfile?.referral_code || user?.referralCode || "GH1234")}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`sidebar-menu-item ${activePanel === item.key ? "active" : ""}`}
              onClick={() => handleMenuClick(item.key)}
              title={item.label}
              data-tooltip={item.label}
            >
              <span className="sidebar-menu-icon">{item.icon}</span>
              <span className="sidebar-menu-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
} 