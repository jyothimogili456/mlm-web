import React, { useState, useEffect, useCallback } from "react";
import { userApi } from "../../api";
import { useUser } from "../../context/UserContext";
import "./UserProfilePanel.css";

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

export default function UserProfilePanel() {
  const { user, loading: userLoading, refreshUser } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Initialize form with default values to ensure fields are visible
  const [form, setForm] = useState({
    name: "Loading...",
    email: "Loading...",
    mobileNumber: "Loading...",
    address: "",
    gender: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Get token from localStorage
  const getToken = () => {
    // Check for both user and admin tokens
    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');
    
    console.log('Token check:', { userToken: !!userToken, adminToken: !!adminToken });
    
    return userToken || adminToken;
  };

  // Load user profile data
  const loadProfile = useCallback(async () => {
    console.log("loadProfile called", { user, userLoading });
    
    // If user context is still loading, wait
    if (userLoading) {
      console.log("User context still loading, waiting...");
      return;
    }

    // If no user data, try to refresh and show error
    if (!user?.id) {
      console.log("No user ID found", { user });
      console.log("Attempting to refresh user data...");
      refreshUser();
      setError("No user data found. Please log in again.");
      setLoading(false);
      return;
    }
    
    // If this is an admin user, we might need different handling
    if (user.id === 'admin') {
      console.log("Admin user detected, showing admin profile");
      setError("Admin profile management is not available in this interface. Please use the admin panel.");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setError("No authentication token found. Please log in again.");
        setLoading(false);
        return;
      }

      console.log("Fetching profile for user ID:", user.id);
      const response = await userApi.getUserById(parseInt(user.id), token);
      console.log("Profile API response:", response);
      
      if (response.statusCode === 200 && response.data) {
        setProfile(response.data);
        setForm({
          name: response.data.name || "",
          email: response.data.email || "",
          mobileNumber: response.data.mobileNumber || "",
          address: response.data.address || "",
          gender: response.data.gender || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(response.message || "Failed to load profile");
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [user, userLoading, refreshUser]);

  // Load profile when user context is ready
  useEffect(() => {
    console.log("UserProfilePanel useEffect", { user, userLoading, loading });
    if (!userLoading) {
      loadProfile();
    }
  }, [user?.id, userLoading, loadProfile, loading, user]);

  // Debug form data
  useEffect(() => {
    console.log("Form data debug:", form);
  }, [form]);

  // Debug profile data
  useEffect(() => {
    console.log("Profile data debug:", profile);
  }, [profile]);

  // Add a manual refresh function
  const handleRetry = () => {
    console.log("Manual retry clicked");
    setError(null);
    refreshUser();
    setTimeout(() => {
      loadProfile();
    }, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id || !profile) return;

    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);
      
      const token = getToken();
      if (!token) {
        setError("No authentication token found");
        return;
      }

      // Check if password change is requested
      const isPasswordChange = form.newPassword && form.confirmPassword;
      
      if (isPasswordChange) {
        // Validate password change
        if (!form.currentPassword) {
          setError("Current password is required to change password");
          setUpdating(false);
          return;
        }
        
        if (form.newPassword !== form.confirmPassword) {
          setError("New password and confirm password do not match");
          setUpdating(false);
          return;
        }
        
        if (form.newPassword.length < 6) {
          setError("New password must be at least 6 characters long");
          setUpdating(false);
          return;
        }

        // Update password
        try {
          const passwordResponse = await userApi.updatePassword(parseInt(user.id), form.newPassword, token);
          if (passwordResponse.statusCode === 200) {
            setSuccess("Password updated successfully!");
            // Clear password fields
            setForm(prev => ({
              ...prev,
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            }));
          } else {
            setError(passwordResponse.message || "Failed to update password");
          }
        } catch (err) {
          console.error("Error updating password:", err);
          setError(err instanceof Error ? err.message : "Failed to update password");
          setUpdating(false);
          return;
        }
      }

      // Update profile data (only if address or gender changed)
      const hasProfileChanges = form.address !== profile.address || form.gender !== profile.gender;
      
      if (hasProfileChanges) {
        const updateData = {
          address: form.address,
          gender: form.gender,
        };

        const response = await userApi.updateUser(parseInt(user.id), updateData, token);
        
        if (response.statusCode === 200) {
          setSuccess(isPasswordChange ? "Profile and password updated successfully!" : "Profile updated successfully!");
          // Reload profile to get updated data
          await loadProfile();
        } else {
          setError(response.message || "Failed to update profile");
        }
      } else if (!isPasswordChange) {
        setError("No changes detected");
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show loading if user context is still loading
  if (userLoading) {
    return (
      <div className="profile-settings-panel">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-settings-panel">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-settings-panel">
        <div className="profile-error">
          <p>Error: {error}</p>
          <button onClick={handleRetry} className="profile-retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-settings-panel">
      {error && (
        <div className="profile-error-message">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="profile-success-message">
          <p>{success}</p>
        </div>
      )}

      <form className="profile-settings-form" onSubmit={handleSubmit}>
        <div className="profile-settings-left">
          <div className="profile-photo-large">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="profile-photo-img" />
          </div>
          <div className="profile-referral-box">
            <div className="profile-referral-label">Referral Code</div>
            <div className="profile-referral-row">
              <span className="profile-referral-code">{profile?.referral_code || "N/A"}</span>
              <button type="button" className="copy-btn" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <div className="profile-created-date">
            Account Created: {profile?.created_at ? formatDate(profile.created_at) : "N/A"}
          </div>
          <div className="profile-referral-count">
            Total Referrals: {profile?.referralCount || 0}
          </div>
          <div className="profile-payment-status">
            Payment Status: <span className={`status-${profile?.payment_status?.toLowerCase()}`}>
              {profile?.payment_status || "N/A"}
            </span>
          </div>
        </div>
        
        <div className="profile-settings-right">
          {/* Read-only fields (collected during registration but not editable) */}
          <div className="profile-field-group">
            <label>Name</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              className="profile-input" 
              disabled 
              title="Name cannot be changed after registration"
            />
            <small className="field-note">Name cannot be changed after registration</small>
          </div>
          
          <div className="profile-field-group">
            <label>Email</label>
            <input 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              className="profile-input" 
              type="email" 
              disabled 
              title="Email cannot be changed after registration"
            />
            <small className="field-note">Email cannot be changed after registration</small>
          </div>
          
          <div className="profile-field-group">
            <label>Mobile Number</label>
            <input 
              name="mobileNumber" 
              value={form.mobileNumber} 
              onChange={handleChange} 
              className="profile-input" 
              disabled 
              title="Mobile number cannot be changed after registration"
            />
            <small className="field-note">Mobile number cannot be changed after registration</small>
          </div>

          {/* Editable fields */}
          <div className="profile-field-group">
            <label>Address</label>
            <textarea 
              name="address" 
              value={form.address} 
              onChange={handleChange} 
              className="profile-input" 
              rows={3}
              placeholder="Enter your address"
            />
          </div>
          
          <div className="profile-field-group">
            <label>Gender</label>
            <select 
              name="gender" 
              value={form.gender} 
              onChange={handleChange} 
              className="profile-input"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Password Change Section */}
          <div className="profile-section-divider">
            <h3>Security Settings</h3>
          </div>
          
          <div className="profile-field-group">
            <label>Current Password</label>
            <input 
              name="currentPassword" 
              type="password" 
              value={form.currentPassword}
              onChange={handleChange}
              className="profile-input" 
              placeholder="Enter current password"
              disabled={updating}
            />
          </div>
          
          <div className="profile-field-group">
            <label>New Password</label>
            <input 
              name="newPassword" 
              type="password" 
              value={form.newPassword}
              onChange={handleChange}
              className="profile-input" 
              placeholder="Enter new password"
              disabled={updating}
            />
          </div>
          
          <div className="profile-field-group">
            <label>Confirm New Password</label>
            <input 
              name="confirmPassword" 
              type="password" 
              value={form.confirmPassword}
              onChange={handleChange}
              className="profile-input" 
              placeholder="Confirm new password"
              disabled={updating}
            />
          </div>

          <button 
            className="profile-update-btn" 
            type="submit" 
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
} 