import React, { useState } from "react";
import "./TermsPage.css";

const sections = [
  {
    id: "user-agreement",
    title: "User Agreement & Platform Usage Rules",
    content: (
      <ul>
        <li>By using GiftsHero, you agree to abide by all platform rules and policies.</li>
        <li>Accounts must be registered with accurate, up-to-date information.</li>
        <li>Unauthorized use, fraud, or abuse of the platform is strictly prohibited.</li>
        <li>Users are responsible for maintaining the confidentiality of their account credentials.</li>
      </ul>
    )
  },
  {
    id: "order-terms",
    title: "Order, Payment & Shipping Terms",
    content: (
      <ul>
        <li>All orders are subject to acceptance and availability.</li>
        <li>Payments must be made using approved methods at checkout.</li>
        <li>Shipping timelines are estimates and may vary due to external factors.</li>
        <li>Users are responsible for providing correct shipping information.</li>
      </ul>
    )
  },
  {
    id: "referral-program",
    title: "Referral Program Rules",
    content: (
      <ul>
        <li>Referrals must be genuine and not self-created or fraudulent.</li>
        <li>Referral bonuses are credited only after the referred user completes a qualifying purchase.</li>
        <li>Multiple accounts or abuse of the referral system will result in disqualification.</li>
      </ul>
    )
  },
  {
    id: "rewards-disputes",
    title: "Reward Eligibility & Dispute Handling",
    content: (
      <ul>
        <li>Rewards are subject to eligibility criteria as outlined in the program details.</li>
        <li>In case of disputes, the decision of GiftsHero management will be final.</li>
        <li>Users may contact support for clarification or to raise a dispute.</li>
      </ul>
    )
  },
  {
    id: "termination",
    title: "Termination Clause",
    content: (
      <ul>
        <li>GiftsHero reserves the right to suspend or terminate accounts for violation of terms.</li>
        <li>Termination may result in loss of access to rewards, referrals, and account data.</li>
        <li>Users may terminate their account at any time by contacting support.</li>
      </ul>
    )
  }
];

export default function TermsPage() {
  const [open, setOpen] = useState<string | null>(sections[0].id);
  return (
    <div className="terms-page">
      <h1 className="terms-title">Terms & Conditions</h1>
      <div className="terms-toc">
        <b>Table of Contents</b>
        <ul>
          {sections.map(section => (
            <li key={section.id}>
              <a href={`#${section.id}`} onClick={e => { e.preventDefault(); setOpen(section.id); document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{section.title}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="terms-sections">
        {sections.map(section => {
          const isOpen = open === section.id;
          return (
            <div className={`terms-section${isOpen ? " open" : ""}`} key={section.id} id={section.id}>
              <button className="terms-section-title" onClick={() => setOpen(isOpen ? null : section.id)}>
                <b>{section.title}</b>
                <span className="terms-arrow">{isOpen ? "▲" : "▼"}</span>
              </button>
              <div className="terms-section-content" style={{ maxHeight: isOpen ? 400 : 0 }}>
                {section.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 