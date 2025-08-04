import React, { useState } from "react";
import "./CareersPage.css";

const roles = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    description: "Build beautiful, scalable web interfaces for our e-commerce platform with referral system.",
    responsibilities: [
      "Develop and maintain React-based e-commerce applications",
      "Implement responsive designs for mobile and desktop",
      "Integrate payment gateways and shopping cart functionality",
      "Build user dashboard and referral tracking systems",
      "Optimize website performance and user experience"
    ],
    requirements: [
      "3+ years experience in frontend development",
      "Strong expertise in React, TypeScript, and modern CSS",
      "Experience with e-commerce platforms and payment integrations",
      "Knowledge of responsive design and mobile-first approach",
      "Excellent problem-solving and communication skills"
    ]
  },
  {
    id: 2,
    title: "Backend Developer",
    department: "Engineering",
    location: "Remote",
    description: "Develop robust backend systems for our e-commerce and referral platform.",
    responsibilities: [
      "Design and implement RESTful APIs for e-commerce functionality",
      "Build referral system with reward calculations and tracking",
      "Integrate payment gateways and order management systems",
      "Develop user authentication and authorization systems",
      "Optimize database queries and ensure system scalability"
    ],
    requirements: [
      "4+ years experience in backend development",
      "Strong in Node.js, Express, and MongoDB/PostgreSQL",
      "Experience with payment gateway integrations (Razorpay, Stripe)",
      "Knowledge of microservices architecture and API design",
      "Understanding of e-commerce business logic and referral systems"
    ]
  },
  {
    id: 3,
    title: "Digital Marketing Specialist",
    department: "Marketing",
    location: "Mumbai",
    description: "Drive user acquisition and growth through digital marketing strategies.",
    responsibilities: [
      "Develop and execute digital marketing campaigns for e-commerce",
      "Manage social media presence and influencer partnerships",
      "Optimize referral program marketing and user engagement",
      "Analyze campaign performance and user acquisition metrics",
      "Create content strategies for product launches and promotions"
    ],
    requirements: [
      "3+ years in digital marketing, preferably in e-commerce",
      "Experience with Google Ads, Facebook Ads, and social media marketing",
      "Understanding of referral marketing and user acquisition strategies",
      "Strong analytical skills and data-driven decision making",
      "Creative thinking and excellent communication skills"
    ]
  },
  {
    id: 4,
    title: "Customer Success Manager",
    department: "Support",
    location: "Bangalore",
    description: "Ensure exceptional customer experience and support our growing user base.",
    responsibilities: [
      "Provide excellent customer support for e-commerce platform",
      "Help users understand referral program and reward system",
      "Resolve technical issues and payment-related problems",
      "Gather user feedback and improve product features",
      "Train and mentor customer support team members"
    ],
    requirements: [
      "2+ years in customer success or support roles",
      "Experience with e-commerce platforms and payment systems",
      "Strong problem-solving and communication skills",
      "Patience and empathy in handling customer concerns",
      "Fluent in English and Hindi, additional languages a plus"
    ]
  },
  {
    id: 5,
    title: "Product Manager",
    department: "Product",
    location: "Remote",
    description: "Lead product strategy and development for our e-commerce platform.",
    responsibilities: [
      "Define product roadmap and feature priorities",
      "Conduct user research and analyze market trends",
      "Collaborate with engineering team on feature development",
      "Optimize referral program and reward system",
      "Monitor key metrics and drive product improvements"
    ],
    requirements: [
      "4+ years in product management, preferably in e-commerce",
      "Experience with referral programs and user engagement strategies",
      "Strong analytical skills and data-driven decision making",
      "Excellent communication and stakeholder management",
      "Understanding of e-commerce business models and user behavior"
    ]
  },
  {
    id: 6,
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    description: "Create intuitive and beautiful user experiences for our platform.",
    responsibilities: [
      "Design user interfaces for e-commerce platform and mobile app",
      "Create user flows and wireframes for referral system",
      "Conduct user research and usability testing",
      "Collaborate with development team on design implementation",
      "Maintain design system and brand consistency"
    ],
    requirements: [
      "3+ years in UI/UX design, preferably in e-commerce",
      "Proficiency in Figma, Adobe Creative Suite, and prototyping tools",
      "Understanding of e-commerce user experience and conversion optimization",
      "Experience with mobile-first design and responsive layouts",
      "Strong portfolio showcasing e-commerce or referral platform designs"
    ]
  }
];

const departments = ["All", ...Array.from(new Set(roles.map(r => r.department)))];
const locations = ["All", ...Array.from(new Set(roles.map(r => r.location)))];

const testimonials = [
  {
    name: "Amit S.",
    role: "Senior Frontend Developer",
    text: "Working on this e-commerce platform has been incredible. The referral system we built is helping thousands of users earn rewards!",
    photo: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    name: "Priya K.",
    role: "Digital Marketing Lead",
    text: "The growth we've achieved through our referral program is phenomenal. Every campaign brings new opportunities!",
    photo: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Rahul M.",
    role: "Customer Success Manager",
    text: "Seeing users succeed with our referral program is incredibly rewarding. The team culture and flexibility are amazing!",
    photo: "https://randomuser.me/api/portraits/men/33.jpg"
  }
];

const benefits = [
  { icon: "🕒", label: "Remote Work" },
  { icon: "💰", label: "Competitive Salary" },
  { icon: "🎓", label: "Learning Budget" },
  { icon: "🏖️", label: "Unlimited PTO" },
  { icon: "🏥", label: "Health Benefits" },
  { icon: "📈", label: "Stock Options" }
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
        <p className="careers-subtitle">Grow your career with a passionate team building innovative e-commerce solutions with referral rewards. Explore open roles below!</p>
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
        <h2>Why Join Our Team?</h2>
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