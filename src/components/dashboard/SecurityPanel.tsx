import React from "react";

const SecurityPanel: React.FC = () => {
  return (
    <section className="dashboard-panel security-panel">
      <h2>Security Settings</h2>
      <div className="security-fields">[Change Password, 2FA, Login History, Logout All Devices]</div>
    </section>
  );
};

export default SecurityPanel; 