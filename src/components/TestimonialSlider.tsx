import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import "./TestimonialSlider.css";

const testimonials = [
  {
    id: 1,
    name: "Amit S.",
    text: "I earned my first reward in just 2 weeks! The referral system is super easy and the products are top-notch.",
    location: "Delhi, India",
  },
  {
    id: 2,
    name: "Priya K.",
    text: "GiftNest changed my shopping experience. I love the rewards and the community!",
    location: "Mumbai, India",
  },
  {
    id: 3,
    name: "Rahul M.",
    text: "The dashboard makes it so easy to track my referrals. Already aiming for the iPhone!",
    location: "Bangalore, India",
  },
];

export const TestimonialSlider: React.FC = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section testimonial-slider-section">
      <h1 className="heading-violet">What Our Users Say</h1>
      <div className="testimonial-slider">
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonials[index].id}
            className="testimonial-card"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5 }}
          >
            <div className="testimonial-avatar">
              <User size={36} />
            </div>
            <div className="testimonial-text">“{testimonials[index].text}”</div>
            <div className="testimonial-user">{testimonials[index].name}</div>
            <div className="testimonial-location">{testimonials[index].location}</div>
          </motion.div>
        </AnimatePresence>
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