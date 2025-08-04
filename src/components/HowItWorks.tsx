import React from "react";
import { motion } from "framer-motion";
import { Gift, Users, Package, Gauge } from "lucide-react";
import "./HowItWorks.css";

export const HowItWorks: React.FC = () => {
  return (
    <section className="section section--alt how-it-works">
      <h1 className="heading-violet">How It Works</h1>
      <div className="how-grid">
        <motion.div className="how-card" whileHover={{ scale: 1.03 }}>
          <Package size={40} />
          <h3>Buy a Product</h3>
          <p>Choose from premium quality items.</p>
        </motion.div>
        <motion.div className="how-card" whileHover={{ scale: 1.03 }}>
          <Users size={40} />
          <h3>Refer Friends</h3>
          <p>Invite others with your referral link.</p>
        </motion.div>
        <motion.div className="how-card" whileHover={{ scale: 1.03 }}>
          <Gift size={40} />
          <h3>Earn Rewards</h3>
          <p>Get cashbacks and exciting prizes.</p>
        </motion.div>
        <motion.div className="how-card" whileHover={{ scale: 1.03 }}>
          <Gauge size={40} />
          <h3>Track Progress</h3>
          <p>Monitor your journey in the dashboard.</p>
        </motion.div>
      </div>
    </section>
  );
}; 