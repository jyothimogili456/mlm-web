import React from "react";
import "./BranchesPage.css";

interface Branch {
  id: string;
  city: string;
  address: string;
  manager: string;
  phone: string;
  whatsapp: string;
  hours: string;
  map: string;
}

const branches: Branch[] = [
  {
    id: "hyderabad",
    city: "Hyderabad",
    address: "Plot 12, Banjara Hills, Hyderabad, Telangana",
    manager: "Ravi Kumar",
    phone: "+91 90000 12345",
    whatsapp: "https://wa.me/919000012345",
    hours: "Monday - Saturday: 10:00 AM - 7:00 PM",
    map: "https://www.google.com/maps?q=17.4239,78.4483"
  },
  {
    id: "bangalore",
    city: "Bangalore",
    address: "#45, MG Road, Bangalore, Karnataka",
    manager: "Anita Rao",
    phone: "+91 98860 54321",
    whatsapp: "https://wa.me/919886054321",
    hours: "Monday - Saturday: 10:00 AM - 7:00 PM",
    map: "https://www.google.com/maps?q=12.9716,77.5946"
  },
  {
    id: "mumbai",
    city: "Mumbai",
    address: "101, Andheri East, Mumbai, Maharashtra",
    manager: "Suresh Patil",
    phone: "+91 98210 67890",
    whatsapp: "https://wa.me/919821067890",
    hours: "Monday - Saturday: 10:00 AM - 7:00 PM",
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d78.4483!3d17.4239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI1JzI2LjAiTiA3OMKwMjYnNTQuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
          width="100%"
          height="320"
          style={{ border: 0, borderRadius: '1.2rem' }}
          allowFullScreen={true}
          loading="lazy"
          title="GiftsHero Branches Map"
          aria-label="Interactive map showing all GiftsHero branch locations"
        ></iframe>
      </div>
      <div className="branches-list" role="region" aria-label="Branch locations and contact information">
        {branches.map((branch) => (
          <div className="branch-card" key={branch.id}>
            <div className="branch-city">{branch.city}</div>
            <div className="branch-address">{branch.address}</div>
            <div className="branch-manager"><b>Manager:</b> {branch.manager}</div>
            <div className="branch-contact-row">
              <a href={`tel:${branch.phone}`} className="branch-contact-icon" title="Call" aria-label={`Call ${branch.city} branch`}>
                <span role="img" aria-hidden="true">📞</span>
              </a>
              <a href={branch.whatsapp} className="branch-contact-icon whatsapp" target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label={`WhatsApp ${branch.city} branch`}>
                <span role="img" aria-hidden="true">🟢</span>
              </a>
              <a href={branch.map} className="branch-contact-icon map" target="_blank" rel="noopener noreferrer" title="Map" aria-label={`View ${branch.city} branch on map`}>
                <span role="img" aria-hidden="true">🗺️</span>
              </a>
              <span className="branch-phone">{branch.phone}</span>
            </div>
            <div className="branch-hours"><b>Hours:</b> {branch.hours}</div>
            <div className="branch-actions">
              <button className="branch-action-btn" aria-label={`Schedule a visit to ${branch.city} branch`}>
                Schedule a Visit
              </button>
              <a href={branch.map} className="branch-action-btn secondary" target="_blank" rel="noopener noreferrer" aria-label={`Get directions to ${branch.city} branch`}>
                Get Directions
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 