import React, { useState } from "react";
import "./PrivacyPolicyPage.css";

const sections = [
  {
    id: "data-collect",
    title: "What Personal Data We Collect",
    content: (
      <ul>
        <li>Name, email, phone, and address</li>
        <li>Order and payment details</li>
        <li>Device and browser information</li>
        <li>Usage data (pages visited, actions taken)</li>
        <li>Referral and marketing data</li>
      </ul>
    )
  },
  {
    id: "data-use",
    title: "How Data is Used",
    content: (
      <ul>
        <li>To process orders and provide services</li>
        <li>For marketing and promotional communications</li>
        <li>To improve our website and user experience</li>
        <li>For analytics and business insights</li>
        <li>To comply with legal obligations</li>
      </ul>
    )
  },
  {
    id: "data-storage",
    title: "Data Storage & Protection Methods",
    content: (
      <ul>
        <li>Data is stored on secure, encrypted servers</li>
        <li>Access is restricted to authorized personnel only</li>
        <li>Regular security audits and updates</li>
        <li>We use SSL/TLS for data transmission</li>
      </ul>
    )
  },
  {
    id: "third-parties",
    title: "Sharing with Third Parties",
    content: (
      <ul>
        <li>Trusted payment processors and logistics partners</li>
        <li>Marketing and analytics service providers</li>
        <li>Legal authorities when required by law</li>
        <li>We never sell your personal data</li>
      </ul>
    )
  },
  {
    id: "your-rights",
    title: "Your Rights (Access, Delete, Modify)",
    content: (
      <ul>
        <li>Request a copy of your personal data</li>
        <li>Ask us to correct or update your information</li>
        <li>Request deletion of your data (subject to legal limits)</li>
        <li>Opt out of marketing communications at any time</li>
      </ul>
    )
  },
  {
    id: "contact-info",
    title: "Contact Info for Privacy Concerns",
    content: (
      <ul>
        <li><b>Email:</b> privacy@giftshero.com</li>
        <li><b>Phone:</b> +91 98765 43210</li>
        <li><b>Address:</b> 123 GiftsHero Avenue, Mumbai, India</li>
      </ul>
    )
  }
];

export default function PrivacyPolicyPage() {
  const [open, setOpen] = useState<string | null>(sections[0].id);
  return (
    <div className="privacy-page">
      <h1 className="privacy-title">Privacy Policy</h1>
      <div className="privacy-sections">
        {sections.map(section => {
          const isOpen = open === section.id;
          return (
            <div className={`privacy-section${isOpen ? " open" : ""}`} key={section.id}>
              <button className="privacy-section-title" onClick={() => setOpen(isOpen ? null : section.id)}>
                <b>{section.title}</b>
                <span className="privacy-arrow">{isOpen ? "▲" : "▼"}</span>
              </button>
              <div className="privacy-section-content" style={{ maxHeight: isOpen ? 400 : 0 }}>
                {section.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 