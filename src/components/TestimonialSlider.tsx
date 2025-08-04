import React, { useState } from "react";
import "./TestimonialSlider.css";

const testimonials = [
  {
    id: 1,
    name: "Amit S.",
    text: "I earned my first reward in just 2 weeks! The referral system is super easy and the products are top-notch.",
    role: "Premium Member",
    photo: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    id: 2,
    name: "Priya K.",
    text: "GiftNest changed my shopping experience. I love the rewards and the community!",
    role: "Gold Member",
    photo: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    id: 3,
    name: "Rahul M.",
    text: "The dashboard makes it so easy to track my referrals. Already aiming for the iPhone!",
    role: "Silver Member",
    photo: "https://randomuser.me/api/portraits/men/33.jpg"
  },
  {
    id: 4,
    name: "Sneha P.",
    text: "Amazing platform! I've earned over ₹50,000 in rewards. The customer support is excellent.",
    role: "Diamond Member",
    photo: "https://randomuser.me/api/portraits/women/28.jpg"
  },
  {
    id: 5,
    name: "Vikram J.",
    text: "Best referral program I've ever seen. The rewards are real and the process is transparent.",
    role: "Platinum Member",
    photo: "https://randomuser.me/api/portraits/men/67.jpg"
  }
];

export const TestimonialSlider: React.FC = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section testimonial-slider-section">
      <h1 className="heading-violet">What Our Users Say</h1>
      <div className="testimonial-slider">
        <button className="testimonial-arrow left" onClick={prev}>&lt;</button>
        <div className="testimonial-card">
          <img src={testimonials[index].photo} alt={testimonials[index].name} className="testimonial-photo" />
          <div className="testimonial-text">"{testimonials[index].text}"</div>
          <div className="testimonial-name">{testimonials[index].name}</div>
          <div className="testimonial-role">{testimonials[index].role}</div>
        </div>
        <button className="testimonial-arrow right" onClick={next}>&gt;</button>
      </div>
      <div className="testimonial-dots">
        {testimonials.map((_, i) => (
          <span
            key={i}
            className={`dot${i === index ? " active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}; 