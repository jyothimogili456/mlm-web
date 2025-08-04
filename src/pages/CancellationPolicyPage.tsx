import React, { useRef } from "react";
import "./CancellationPolicyPage.css";

const sections = [
  { id: "cancellation-window", icon: "⏳", title: "Order Cancellation Window" },
  { id: "refund-process", icon: "💸", title: "Refund Process & Timelines" },
  { id: "non-refundable", icon: "🚫", title: "Non-Refundable Items" },
  { id: "contact-support", icon: "📞", title: "Contact Support for Disputes" },
];

type SectionId = "cancellation-window" | "refund-process" | "non-refundable" | "contact-support";

export default function CancellationPolicyPage() {
  const refs = {
    "cancellation-window": useRef<HTMLDivElement>(null),
    "refund-process": useRef<HTMLDivElement>(null),
    "non-refundable": useRef<HTMLDivElement>(null),
    "contact-support": useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (id: SectionId) => {
    refs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="policy-page">
      <aside className="policy-sidebar">
        <div className="policy-sidebar-title">Jump to</div>
        <nav className="policy-nav">
          {sections.map(s => (
            <button key={s.id} className="policy-nav-link" onClick={() => scrollToSection(s.id as SectionId)}>
              <span className="policy-nav-icon" role="img" aria-label={s.title}>{s.icon}</span> {s.title}
            </button>
          ))}
        </nav>
      </aside>
      <main className="policy-content">
        <h1 className="policy-title">Cancellation & Refund Policy</h1>
        <section ref={refs["cancellation-window"]} id="cancellation-window" className="policy-section">
          <h2><span role="img" aria-label="timer">⏳</span> Order Cancellation Window</h2>
          <p>You may cancel your order within <b>2 hours</b> of placing it, provided it has not yet been shipped. After this window, cancellations may not be possible as the order may already be in transit.</p>
        </section>
        <section ref={refs["refund-process"]} id="refund-process" className="policy-section">
          <h2><span role="img" aria-label="refund">💸</span> Refund Process & Timelines</h2>
          <ul>
            <li>Refunds are processed to your original payment method within <b>5-7 business days</b> after approval.</li>
            <li>Once your cancellation or return is approved, you will receive a confirmation email with refund details.</li>
            <li>Delays may occur due to bank processing times.</li>
          </ul>
        </section>
        <section ref={refs["non-refundable"]} id="non-refundable" className="policy-section">
          <h2><span role="img" aria-label="no refund">🚫</span> Non-Refundable Items</h2>
          <ul>
            <li>Opened or used personal care products</li>
            <li>Gift cards and vouchers</li>
            <li>Items marked as final sale or non-returnable</li>
            <li>Any item not in its original condition, damaged, or missing parts for reasons not due to our error</li>
          </ul>
        </section>
        <section ref={refs["contact-support"]} id="contact-support" className="policy-section">
          <h2><span role="img" aria-label="support">📞</span> Contact Support for Disputes</h2>
          <p>If you have any questions or disputes regarding cancellations or refunds, please contact our support team:</p>
          <ul>
            <li><b>Email:</b> support@giftshero.com</li>
            <li><b>Phone:</b> +91 98765 43210</li>
            <li><b>WhatsApp:</b> <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">Chat Now</a></li>
          </ul>
        </section>
      </main>
    </div>
  );
} 