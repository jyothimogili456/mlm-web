import React from "react";
import "./BranchesPage.css";

const branches = [
  {
    city: "Hyderabad",
    address: "Plot 12, Banjara Hills, Hyderabad, Telangana",
    manager: "Ravi Kumar",
    phone: "+91 90000 12345",
    whatsapp: "https://wa.me/919000012345",
    hours: "Mon–Sat: 10am–7pm",
    map: "https://www.google.com/maps?q=17.4239,78.4483"
  },
  {
    city: "Bangalore",
    address: "#45, MG Road, Bangalore, Karnataka",
    manager: "Anita Rao",
    phone: "+91 98860 54321",
    whatsapp: "https://wa.me/919886054321",
    hours: "Mon–Sat: 10am–7pm",
    map: "https://www.google.com/maps?q=12.9716,77.5946"
  },
  {
    city: "Mumbai",
    address: "101, Andheri East, Mumbai, Maharashtra",
    manager: "Suresh Patil",
    phone: "+91 98210 67890",
    whatsapp: "https://wa.me/919821067890",
    hours: "Mon–Sat: 10am–7pm",
    map: "https://www.google.com/maps?q=19.1197,72.8468"
  }
];

export default function BranchesPage() {
  return (
    <div className="branches-page">
      <h1 className="branches-title">Our Branches & Locations</h1>
      <div className="branches-map-section">
        <iframe
          className="branches-map"
          src="https://www.google.com/maps/d/embed?mid=1v8Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw&hl=en"
          width="100%"
          height="320"
          style={{ border: 0, borderRadius: '1.2rem' }}
          allowFullScreen={true}
          loading="lazy"
          title="GiftsHero Branches Map"
        ></iframe>
      </div>
      <div className="branches-list">
        {branches.map((b, i) => (
          <div className="branch-card" key={i}>
            <div className="branch-city">{b.city}</div>
            <div className="branch-address">{b.address}</div>
            <div className="branch-manager"><b>Manager:</b> {b.manager}</div>
            <div className="branch-contact-row">
              <a href={`tel:${b.phone}`} className="branch-contact-icon" title="Call"><span role="img" aria-label="phone">📞</span></a>
              <a href={b.whatsapp} className="branch-contact-icon whatsapp" target="_blank" rel="noopener noreferrer" title="WhatsApp">🟢</a>
              <a href={b.map} className="branch-contact-icon map" target="_blank" rel="noopener noreferrer" title="Map">🗺️</a>
              <span className="branch-phone">{b.phone}</span>
            </div>
            <div className="branch-hours"><b>Hours:</b> {b.hours}</div>
            <div className="branch-actions">
              <button className="branch-action-btn">Schedule a Visit</button>
              <a href={b.map} className="branch-action-btn secondary" target="_blank" rel="noopener noreferrer">Get Directions</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 