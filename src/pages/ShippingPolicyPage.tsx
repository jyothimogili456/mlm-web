import React, { useState } from "react";
import "./ShippingPolicyPage.css";

const sections = [
  {
    id: "regions",
    icon: "🌏",
    badge: "Shipping Regions",
    content: (
      <ul>
        <li><b>India:</b> We deliver to all major cities and towns across India.</li>
        <li><b>International:</b> Select products are available for international shipping. Check product page for eligibility.</li>
      </ul>
    )
  },
  {
    id: "delivery-times",
    icon: "⏱️",
    badge: "Estimated Delivery Times",
    content: (
      <ul>
        <li>Metro cities: <b>2-4 business days</b></li>
        <li>Other locations: <b>4-7 business days</b></li>
        <li>International: <b>7-15 business days</b></li>
      </ul>
    )
  },
  {
    id: "charges",
    icon: "💸",
    badge: "Shipping Charges & Free Shipping",
    content: (
      <ul>
        <li>Free shipping on orders above <b>₹500</b> within India</li>
        <li>Standard shipping charge: <b>₹49</b> for orders below ₹500</li>
        <li>International shipping charges calculated at checkout</li>
      </ul>
    )
  },
  {
    id: "delays-tracking",
    icon: "🚚",
    badge: "Delays & Tracking Info",
    content: (
      <ul>
        <li>Delays may occur due to weather, holidays, or unforeseen events</li>
        <li>Track your order anytime from your account dashboard</li>
        <li>24/7 support for shipping queries <span className="policy-badge support">24/7 Support</span></li>
      </ul>
    )
  },
  {
    id: "return-shipping",
    icon: "🔄",
    badge: "Return Shipping Process",
    content: (
      <ul>
        <li>Initiate a return from your account within 7 days of delivery</li>
        <li>We arrange pickup for eligible returns</li>
        <li>Return shipping is free for damaged/incorrect items</li>
        <li>For other returns, shipping charges may apply</li>
      </ul>
    )
  }
];

export default function ShippingPolicyPage() {
  const [open, setOpen] = useState<string | null>(sections[0].id);
  return (
    <div className="shipping-page">
      <h1 className="shipping-title">Shipping Policy</h1>
      <div className="shipping-badges-row">
        <span className="policy-badge fast">🚀 Fast Delivery</span>
        <span className="policy-badge support">24/7 Support</span>
        <span className="policy-badge trust">🔒 Trusted Shipping</span>
      </div>
      <div className="shipping-sections">
        {sections.map(section => {
          const isOpen = open === section.id;
          return (
            <div className={`shipping-section${isOpen ? " open" : ""}`} key={section.id}>
              <button className="shipping-section-title" onClick={() => setOpen(isOpen ? null : section.id)}>
                <span className="shipping-section-icon" role="img" aria-label={section.badge}>{section.icon}</span>
                <b>{section.badge}</b>
                <span className="shipping-arrow">{isOpen ? "▲" : "▼"}</span>
              </button>
              <div className="shipping-section-content" style={{ maxHeight: isOpen ? 400 : 0 }}>
                {section.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 