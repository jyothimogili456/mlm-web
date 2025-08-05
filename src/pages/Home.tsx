import React from "react";
import HeroSection from "../components/HeroSection";
import { HowItWorks } from "../components/HowItWorks";
import FeaturedProducts from "../components/FeaturedProducts";
import { RewardsPreview } from "../components/RewardsPreview";
// import { FinalCTA } from "../components/FinalCTA";
import { TestimonialSlider } from "../components/TestimonialSlider";


const Home: React.FC = () => {
  return (
    <main style={{ width: "100%", maxWidth: "100%" }}>
      <HeroSection />
      <div className="how-it-works-section">
        <HowItWorks />
      </div>
      <div className="featured-products-section">
        <FeaturedProducts />
      </div>
      <div className="rewards-section">
        <RewardsPreview />
      </div>
      <div className="testimonial-section">
        <TestimonialSlider />
      </div>
      {/* <div className="final-cta-section">
        <FinalCTA />
      </div> */}
    </main>
  );
};

export default Home; 