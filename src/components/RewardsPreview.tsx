import React from "react";
import { motion } from "framer-motion";
import { Watch, Smartphone, Bike, Car, IndianRupee } from "lucide-react";
import "./RewardsPreview.css";

const rewards = [
  {
    id: 1,
    icon: <Watch size={36} />, // Smartwatch
    title: "Smartwatch",
    description: "For 500 referrals",
    target: 500,
    progress: 320, // Example progress
  },
  {
    id: 2,
    icon: <Smartphone size={36} />, // iPhone
    title: "iPhone",
    description: "For 750 referrals",
    target: 750,
    progress: 320,
  },
  {
    id: 3,
    icon: <Bike size={36} />, // Royal Enfield
    title: "Royal Enfield",
    description: "For 1,000 referrals",
    target: 1000,
    progress: 320,
  },
  {
    id: 4,
    icon: <Car size={36} />, // Fortune Car
    title: "Fortune Car",
    description: "For 10,000 referrals",
    target: 10000,
    progress: 320,
  },
  {
    id: 5,
    icon: <IndianRupee size={36} />, // ₹1 Cr Cash Prize
    title: "₹1 Cr Cash Prize",
    description: "For 100,000 referrals",
    target: 100000,
    progress: 320,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120 } },
};

export const RewardsPreview: React.FC = () => {
  // carouselRef removed as it was unused



  return (
    <section className="section section--alt rewards-preview-section">
      <h1 className="heading-violet">Rewards Preview</h1>
      <div className="rewards-carousel-wrapper">
        <motion.div
          className="rewards-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {rewards.map((reward) => (
            <motion.div className="reward-card" key={reward.id} variants={cardVariants}>
              <div className="reward-icon">{reward.icon}</div>
              <div className="reward-info">
                <h3>{reward.title}</h3>
                <p>{reward.description}</p>
                <div className="reward-target">Target: {reward.target.toLocaleString()} Referrals</div>
                <div className="reward-progress-bar">
                  <div
                    className="reward-progress"
                    style={{ width: Math.min((reward.progress / reward.target) * 100, 100) + "%" }}
                  />
                </div>
                <div className="reward-progress-label">
                  {reward.progress.toLocaleString()} / {reward.target.toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};