import React from "react";
import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import "./ReferralCountdown.css";

// Example: user has 730 referrals, iPhone at 750
const currentReferrals = 730;
const target = 750;
const rewardName = "iPhone";
const remaining = target - currentReferrals;
const percent = Math.min((currentReferrals / target) * 100, 100);

export const ReferralCountdown: React.FC = () => {
  return (
    <section className="section section--alt referral-countdown-section">
      <motion.div
        className="referral-countdown-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="referral-countdown-icon">
          <Smartphone size={32} />
        </div>
        <div className="referral-countdown-message">
          You’re <span className="highlight">{remaining}</span> away from <span className="highlight">{rewardName}!</span>
        </div>
        <div className="referral-countdown-progress-bar">
          <motion.div
            className="referral-countdown-progress"
            style={{ width: `${percent}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <div className="referral-countdown-label">
          {currentReferrals} / {target} referrals
        </div>
      </motion.div>
    </section>
  );
}; 