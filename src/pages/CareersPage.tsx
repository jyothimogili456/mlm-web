import React, { useState } from "react";
import "./CareersPage.css";

const roles = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    description: "Build beautiful, scalable web interfaces for GiftsHero.",
    responsibilities: [
      "Develop and maintain React-based web apps",
      "Collaborate with designers and backend engineers",
      "Write clean, maintainable code"
    ],
    requirements: [
      "2+ years experience in frontend development",
      "Strong in React, TypeScript, CSS",
      "Good communication skills"
    ]
  },
  {
    id: 2,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Mumbai",
    description: "Lead marketing campaigns and grow the GiftsHero brand.",
    responsibilities: [
      "Plan and execute digital marketing campaigns",
      "Analyze campaign performance",
      "Coordinate with creative teams"
    ],
    requirements: [
      "3+ years in marketing",
      "Experience with digital channels",
      "Leadership skills"
    ]
  },
  {
    id: 3,
    title: "Customer Success Executive",
    department: "Support",
    location: "Bangalore",
    description: "Support our users and ensure a great experience.",
    responsibilities: [
      "Respond to customer queries",
      "Resolve issues promptly",
      "Gather user feedback"
    ],
    requirements: [
      "1+ year in customer support",
      "Empathy and patience",
      "Fluent in English and Hindi"
    ]
  }
];

const departments = ["All", ...Array.from(new Set(roles.map(r => r.department)))];
const locations = ["All", ...Array.from(new Set(roles.map(r => r.location)))];

const testimonials = [
  {
    name: "Amit S.",
    role: "Senior Engineer",
    text: "GiftsHero has given me the freedom to innovate and grow. The team is supportive and the work is meaningful!",
    photo: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    name: "Priya K.",
    role: "Marketing Lead",
    text: "I love the collaborative culture and the opportunities for learning. Every day is exciting!",
    photo: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Rahul M.",
    role: "Customer Success",
    text: "Helping users and seeing their success is so rewarding. The benefits and flexibility are great!",
    photo: "https://randomuser.me/api/portraits/men/33.jpg"
  }
];

const benefits = [
  { icon: "🕒", label: "Flexible Work" },
  { icon: "💰", label: "Performance Bonus" },
  { icon: "🎓", label: "Training & Upskilling" },
  { icon: "🏖️", label: "Paid Time Off" },
  { icon: "🏥", label: "Health Insurance" }
];

export default function CareersPage() {
  const [dept, setDept] = useState("All");
  const [loc, setLoc] = useState("All");
  const [openRole, setOpenRole] = useState<number | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const filteredRoles = roles.filter(r =>
    (dept === "All" || r.department === dept) &&
    (loc === "All" || r.location === loc)
  );

  const nextTestimonial = () => setTestimonialIdx((testimonialIdx + 1) % testimonials.length);
  const prevTestimonial = () => setTestimonialIdx((testimonialIdx - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="careers-page">
      {/* Intro */}
      <div className="careers-hero">
        <h1 className="careers-title">Join GiftsHero – We’re Building the Future of E-commerce</h1>
        <p className="careers-subtitle">Grow your career with a passionate, innovative team. Explore open roles below!</p>
      </div>
      {/* Filters */}
      <div className="careers-filters">
        <select value={dept} onChange={e => setDept(e.target.value)} className="careers-filter">
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={loc} onChange={e => setLoc(e.target.value)} className="careers-filter">
          {locations.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>
      {/* Open Roles */}
      <div className="careers-roles-grid">
        {filteredRoles.length === 0 && <div className="careers-no-roles">No roles found for your filters.</div>}
        {filteredRoles.map(role => (
          <div className={`careers-role-card${openRole === role.id ? " open" : ""}`} key={role.id}>
            <div className="role-header" onClick={() => setOpenRole(openRole === role.id ? null : role.id)}>
              <div className="role-title">{role.title}</div>
              <div className="role-meta">{role.department} | {role.location}</div>
              <button className="role-toggle-btn">{openRole === role.id ? "–" : "+"}</button>
            </div>
            {openRole === role.id && (
              <div className="role-details">
                <div className="role-desc">{role.description}</div>
                <div className="role-section">
                  <b>Responsibilities:</b>
                  <ul>{role.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
                </div>
                <div className="role-section">
                  <b>Requirements:</b>
                  <ul>{role.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
                </div>
                <button className="apply-btn">Apply Now</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Testimonials Slider */}
      <div className="careers-testimonials-section">
        <h2>Employee Testimonials</h2>
        <div className="careers-testimonials-slider">
          <button className="testimonial-arrow left" onClick={prevTestimonial}>&lt;</button>
          <div className="testimonial-card">
            <img src={testimonials[testimonialIdx].photo} alt={testimonials[testimonialIdx].name} className="testimonial-photo" />
            <div className="testimonial-text">“{testimonials[testimonialIdx].text}”</div>
            <div className="testimonial-name">{testimonials[testimonialIdx].name}</div>
            <div className="testimonial-role">{testimonials[testimonialIdx].role}</div>
          </div>
          <button className="testimonial-arrow right" onClick={nextTestimonial}>&gt;</button>
        </div>
      </div>
      {/* Benefits */}
      <div className="careers-benefits-section">
        <h2>Why Join GiftsHero?</h2>
        <div className="benefits-row">
          {benefits.map((b, i) => (
            <div className="benefit-card" key={i}>
              <span className="benefit-icon" role="img" aria-label={b.label}>{b.icon}</span>
              <div className="benefit-label">{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 