import React from "react";
import "./Rewards.css";

const rewardTypes = [
  { icon: "🪙", title: "Cashback", desc: "Earn instant cashback on every purchase." },
  { icon: "🤝", title: "Referral Bonuses", desc: "Invite friends and earn bonuses when they shop." },
  { icon: "🎁", title: "Gift Prizes", desc: "Win exciting gifts in monthly contests." },
  { icon: "👑", title: "Rank-based Rewards", desc: "Unlock exclusive rewards as you climb the ranks." },
];

const milestones = [
  { label: "Refer 1 friend", reward: "₹250" },
  { label: "Refer 1000 friends", reward: "Iphone" },
  { label: "Refer 10000 friends", reward: "Royal Enfield" },
  { label: "Achieve Gold Rank", reward: "Special Gift" },
];

const leaderboard = [
  { name: "Amit S.", amount: 12000 },
  { name: "Priya K.", amount: 9500 },
  { name: "Rahul M.", amount: 8700 },
  { name: "Sneha T.", amount: 8200 },
  { name: "Vikas P.", amount: 7900 },
];

const faqs = [
  { q: "What payment methods are accepted?", a: "We accept credit/debit cards, UPI, net banking, and wallets." },
  { q: "How do I earn rewards?", a: "Earn rewards by shopping, referring friends, and participating in contests." },
  { q: "When are rewards credited?", a: "Cashback is instant. Referral and contest rewards are credited monthly." },
];

export default function Rewards() {
  return (
    <div className="rewards-page">
      <div className="rewards-hero-header">
        <h1 className="rewards-hero-title">Rewards</h1>
        <div className="rewards-hero-subtitle">
          Unlock amazing rewards by shopping, referring friends, and climbing the leaderboard!
        </div>
      </div>

      {/* Reward Types */}
      <div className="reward-types-row">
        {rewardTypes.map((r, i) => (
          <div className={`reward-type-card type-${i}`} key={r.title}>
            <span className="reward-icon" role="img" aria-label={r.title}>{r.icon}</span>
            <div className="reward-type-title">{r.title}</div>
            <div className="reward-type-desc">{r.desc}</div>
          </div>
        ))}
      </div>

      {/* Milestone Tracker */}
      <div className="milestone-section">
        <div className="milestone-title">Unlock Rewards as You Grow</div>
        <div className="milestone-tracker">
          {milestones.map((m, i) => (
            <React.Fragment key={i}>
              <div className="milestone-step">
                <div className="milestone-circle">{i + 1}</div>
                <div className="milestone-label">{m.label}</div>
                <div className="milestone-reward">
                  → <b>{m.reward}</b>
                </div>
              </div>
              {i < milestones.length - 1 && <div className="milestone-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="leaderboard-section">
        <div className="leaderboard-title">Top Earners</div>
        <div className="leaderboard-list">
          {leaderboard.map((l, i) => (
            <div className="leaderboard-row" key={i}>
              <span className="lb-rank">#{i + 1}</span>
              <span className="lb-name">{l.name}</span>
              <span className="lb-amount">₹{l.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="faq-section">
        <div className="faq-title">Payments & Rewards FAQs</div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div className="faq-item" key={i}>
              <div className="faq-q">Q: {f.q}</div>
              <div className="faq-a">A: {f.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rewards-cta-row">
        <button className="rewards-cta-btn">Start Earning Rewards Today!</button>
      </div>
    </div>
  );
}
