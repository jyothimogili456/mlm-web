import React, { useState } from "react";
import "./SettingsPanel.css";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
];

export default function SettingsPanel() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value);

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    alert("Account deleted (demo)");
  };

  return (
    <div className="settings-dashboard-panel">
      <form className="settings-form">
        <div className="settings-section">
          <div className="settings-section-title">Change Password</div>
          <div className="settings-field-row">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              className="settings-input"
              placeholder="New Password"
            />
            <label className="settings-toggle-label">
              <input type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} /> Show
            </label>
            <button className="settings-btn" type="button" onClick={() => alert("Password updated (demo)")}>Update</button>
          </div>
        </div>
        <div className="settings-divider" />
        <div className="settings-section">
          <div className="settings-section-title">Notification Preferences</div>
          <div className="settings-field-row">
            <label className="settings-toggle-label">
              <input type="checkbox" checked={notifyEmail} onChange={e => setNotifyEmail(e.target.checked)} /> Email
            </label>
            <label className="settings-toggle-label">
              <input type="checkbox" checked={notifySMS} onChange={e => setNotifySMS(e.target.checked)} /> SMS
            </label>
          </div>
        </div>
        <div className="settings-divider" />
        <div className="settings-section">
          <div className="settings-section-title">Language</div>
          <div className="settings-field-row">
            <select value={language} onChange={handleLanguageChange} className="settings-input">
              {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
        </div>
        <div className="settings-divider" />
        <div className="settings-section settings-danger-section">
          <div className="settings-section-title">Danger Zone</div>
          <div className="settings-field-row">
            <button
              className="settings-btn delete-btn"
              type="button"
              onClick={() => setShowDeleteModal(true)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              Delete Account
            </button>
            {showTooltip && <span className="settings-tooltip">Warning: This action cannot be undone!</span>}
          </div>
        </div>
      </form>
      {showDeleteModal && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <div className="settings-modal-title">Delete Account</div>
            <div className="settings-modal-message">Are you sure you want to delete your account? This action cannot be undone.</div>
            <div className="settings-modal-actions">
              <button className="settings-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="settings-btn delete-btn" onClick={handleDeleteAccount}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 