import React, { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import "./FaqContact.css";

const contactInfo = {
  address: "Madhapur,Hyderabad,Telangana,India",
  phone: "+91 9059614343",
  email: "camelq.in",
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <>
      <div className="contact-hero-header">
        <h1 className="contact-hero-title">Contact us</h1>
        <div className="contact-hero-subtitle">We'd love to hear from you! Reach out for support, questions, or partnership inquiries.</div>
      </div>
      <section className="contact-modern-bg">
        <div className="contact-card-row contact-card-row-animate">
          {/* Left: Image */}
          <div className="contact-card-image-col">
            <img
              src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80"
              alt="Support Agents Talking"
              className="contact-card-img"
            />
          </div>
          {/* Right: Form */}
          <div className="contact-card-form-col">
            <h1 className="contact-card-title">Get in Touch</h1>
            <form className="contact-card-form contact-card-form-animate" onSubmit={handleSubmit} autoComplete="off">
              <div className="floating-label">
                <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder=" " />
                <label htmlFor="name">Name</label>
              </div>
              <div className="floating-label">
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder=" " />
                <label htmlFor="email">Email address</label>
              </div>
              <div className="floating-label">
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder=" " />
                <label htmlFor="phone">Phone</label>
              </div>
              <div className="floating-label">
                <textarea name="message" value={form.message} onChange={handleChange} required placeholder=" " />
                <label htmlFor="message">Message</label>
              </div>
              <button className="contact-card-submit" type="submit">SUBMIT</button>
              {sent && <div className="contact-card-confirm">Thank you! We'll get back to you soon.</div>}
            </form>
          </div>
        </div>
        {/* Info Cards Row */}
        <div className="contact-modern-info-row">
          <div className="contact-modern-info-card">
            <MapPin className="contact-modern-info-icon" />
            <div>
              <div className="contact-modern-info-label">Address</div>
              <div className="contact-modern-info-value">{contactInfo.address}</div>
            </div>
          </div>
          <div className="contact-modern-info-card">
            <Phone className="contact-modern-info-icon" />
            <div>
              <div className="contact-modern-info-label">Phone</div>
              <div className="contact-modern-info-value">{contactInfo.phone}</div>
            </div>
          </div>
          <div className="contact-modern-info-card">
            <Mail className="contact-modern-info-icon" />
            <div>
              <div className="contact-modern-info-label">Email</div>
              <div className="contact-modern-info-value">{contactInfo.email}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}