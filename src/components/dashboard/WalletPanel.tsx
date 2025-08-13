import React, { useState } from "react";
import { DollarSign, PieChart, CreditCard } from "react-feather";
import "./WalletPanel.css";

const transactions = [
  { source: "Order #1234", date: "2024-05-01", amount: -499 },
  { source: "Cashback", date: "2024-04-28", amount: 50 },
  { source: "Referral Bonus", date: "2024-04-25", amount: 200 },
  { source: "Order #1233", date: "2024-04-20", amount: -999 },
  { source: "Cashback", date: "2024-04-18", amount: 30 },
];

export default function WalletPanel() {
  const [balance] = useState(1250);
  const cashback = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const spending = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Pie chart: spending vs cashback (simple SVG)
  const total = cashback + spending;
  const cashbackAngle = total ? (cashback / total) * 360 : 0;

  return (
    <div className="wallet-dashboard-panel">
      <div className="wallet-balance-card wallet-gradient-card">
        <div className="wallet-balance-icon"><CreditCard size={32} /></div>
        <div className="wallet-balance-info">
          <div className="wallet-balance-label">Total Balance</div>
          <div className="wallet-balance-value">₹{balance}</div>
        </div>
        <button className="wallet-withdraw-btn">Withdraw</button>
      </div>
      <div className="wallet-main-grid">
        <div className="wallet-pie-card wallet-gradient-card">
          <div className="wallet-pie-title">
            <PieChart size={22} /> Spending vs Cashback
          </div>
          <div className="wallet-pie-chart">
            <svg width="90" height="90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="#f3f4f6" />
              <circle
                cx="18" cy="18" r="16"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="4"
                strokeDasharray={`${cashbackAngle / 360 * 100} ${100 - cashbackAngle / 360 * 100}`}
                strokeDashoffset="25"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div className="wallet-pie-legend">
              <span className="wallet-pie-dot wallet-pie-cashback"></span> Cashback
              <span className="wallet-pie-dot wallet-pie-spending"></span> Spending
            </div>
          </div>
          <div className="wallet-cashback-label">Cashback Earned: <b>₹{cashback}</b></div>
        </div>
        <div className="wallet-transactions-card wallet-gradient-card">
          <div className="wallet-transactions-title"><DollarSign size={22} /> Recent Transactions</div>
          <div className="wallet-transactions-list">
            {transactions.map((t, i) => (
              <div className={`wallet-transaction-card ${t.amount > 0 ? "wallet-in" : "wallet-out"}`} key={i}>
                <div className="wallet-transaction-source">{t.source}</div>
                <div className="wallet-transaction-date">{t.date}</div>
                <div className="wallet-transaction-amount">{t.amount > 0 ? "+" : "-"}₹{Math.abs(t.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 