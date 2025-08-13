import React from "react";
import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Main Heading Section - No Background */}
      <div className="about-main-heading">
        <h1>About Us</h1>
        <p>Empowering communities through innovative referral commerce and creating lasting connections.</p>
      </div>

      {/* Section 1: Our Mission */}
      <section className="about-row">
        <div className="about-img about-img-left">
          <img src={require("../assets/mission.jpeg")} alt="Our Mission" />
        </div>
        <div className="about-content about-content-right">
          <div className="about-section-heading">
            <h2>Our Mission</h2>
          </div>
          <p>
            Growing better is about aligning your business success with the success of your customers. When our customers thrive, we thrive. We focus on innovative solutions, ethical practices, and a collaborative spirit that ensures every win is a win-win. By putting people first and prioritizing long-term impact, we help organizations unlock their full potential and make a positive difference in their communities.<br /><br />
            Join us on this journey to grow better—together.
          </p>
        </div>
      </section>

      {/* Our Story Section (heading + prompt stacked, image right) */}
      <section className="about-row">
        <div className="about-story-textblock">
          <h2 className="about-story-heading">Our Story</h2>
          <p className="about-story-description">
            In 2004, fellow MIT graduate students Brian Halligan and Dharmesh Shah noticed a major shift in the way people shop and purchase products. Buyers didn't want to be interrupted by ads, they wanted to be helped. So they set out to create a new kind of company, one that would help businesses grow better.
          </p>
        </div>
        <div className="about-img about-img-right">
          <img src={require("../assets/story.jpeg")} alt="Our Story" />
        </div>
      </section>

      {/* Co-Founders Heading */}
      <div className="about-section-heading left-align">
        <h2>Co-Founders</h2>
      </div>

      {/* New Card Section (like screenshot) */}
      <section className="about-cards-section">
        <div className="about-cards-row">
          <div className="about-card">
            <div className="about-card-img-wrapper">
              <img src="https://images.pexels.com/photos/1181696/pexels-photo-1181696.jpeg?auto=compress&w=400" alt="Person 1" />
            </div>
            <div className="about-card-title">Custom SEO Services</div>
            <div className="about-card-desc">Custom, organic SEO services that include technical audits, on-page search engine optimization.</div>
            <div className="about-card-bar">
              <button className="about-card-icon" type="button" title="WhatsApp">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="white"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.58 2.236 6.364L4 29l7.636-2.236A11.96 11.96 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.89 0-3.68-.52-5.207-1.42l-.37-.22-4.53 1.33 1.33-4.53-.22-.37A8.96 8.96 0 017 15c0-4.963 4.037-9 9-9s9 4.037 9 9-4.037 9-9 9zm5.07-6.36c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.32s.99 2.69 1.13 2.88c.14.19 1.95 2.98 4.74 4.06.66.23 1.18.37 1.58.47.66.17 1.26.15 1.73.09.53-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
              </button>
              <button className="about-card-icon" type="button" title="Instagram">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="white"><path d="M16 7c2.757 0 3.09.01 4.175.06 1.08.05 1.67.22 2.06.37.5.19.86.42 1.24.8.38.38.61.74.8 1.24.15.39.32.98.37 2.06.05 1.085.06 1.418.06 4.175s-.01 3.09-.06 4.175c-.05 1.08-.22 1.67-.37 2.06-.19.5-.42.86-.8 1.24-.38.38-.74.61-1.24.8-.39.15-.98.32-2.06.37-1.085.05-1.418.06-4.175.06s-3.09-.01-4.175-.06c-1.08-.05-1.67-.22-2.06-.37-.5-.19-.86-.42-1.24-.8-.38-.38-.61-.74-.8-1.24-.15-.39-.32-.98-.37-2.06C7.01 19.09 7 18.757 7 16s.01-3.09.06-4.175c.05-1.08.22-1.67.37-2.06.19-.5.42-.86.8-1.24.38-.38.74-.61 1.24-.8.39-.15.98-.32 2.06-.37C12.91 7.01 13.243 7 16 7zm0-2C13.19 5 12.823 5.01 11.737 5.06c-1.09.05-1.84.22-2.48.47-.67.26-1.23.6-1.79 1.16-.56.56-.9 1.12-1.16 1.79-.25.64-.42 1.39-.47 2.48C5.01 12.823 5 13.19 5 16s.01 3.177.06 4.263c.05 1.09.22 1.84.47 2.48.26.67.6 1.23 1.16 1.79.56.56 1.12.9 1.79 1.16.64.25 1.39.42 2.48.47C12.823 26.99 13.19 27 16 27s3.177-.01 4.263-.06c1.09-.05 1.84-.22 2.48-.47.67-.26 1.23-.6 1.79-1.16.56-.56.9-1.12 1.16-1.79.25-.64.42-1.39.47-2.48.05-1.086.06-1.453.06-4.263s-.01-3.177-.06-4.263c-.05-1.09-.22-1.84-.47-2.48-.26-.67-.6-1.23-1.16-1.79-.56-.56-1.12-.9-1.79-1.16-.64-.25-1.39-.42-2.48-.47C19.177 5.01 18.81 5 16 5zm0 3a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12zm7.5-1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg>
              </button>
              <button className="about-card-icon" type="button" title="Twitter">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="white"><path d="M32 6.076a13.14 13.14 0 01-3.769 1.031A6.601 6.601 0 0031.115 4.1a13.195 13.195 0 01-4.169 1.594A6.563 6.563 0 0022.155 3c-3.626 0-6.563 2.938-6.563 6.563 0 .514.058 1.016.17 1.496C10.272 10.85 5.444 8.13 2.228 4.161c-.564.97-.888 2.096-.888 3.301 0 2.277 1.159 4.287 2.924 5.463A6.533 6.533 0 01.64 11.1v.083c0 3.181 2.263 5.834 5.267 6.437-.551.15-1.13.23-1.728.23-.423 0-.832-.041-1.232-.117.833 2.6 3.25 4.494 6.116 4.547A13.18 13.18 0 010 27.026 18.616 18.616 0 0010.063 30c12.072 0 18.678-10.003 18.678-18.678 0-.285-.006-.568-.019-.85A13.354 13.354 0 0032 6.076z"/></svg>
              </button>
            </div>
          </div>
          <div className="about-card">
            <div className="about-card-img-wrapper">
              <img src="https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&w=400" alt="Person 2" />
            </div>
            <div className="about-card-title">SEO Website Design</div>
            <div className="about-card-desc">1st on the List provides highly effective PPC advertising for every budget including Google PPC Ads, Bing PPC, and more.</div>
            <div className="about-card-bar">
              <button className="about-card-icon" type="button" title="WhatsApp">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="white"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.58 2.236 6.364L4 29l7.636-2.236A11.96 11.96 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.89 0-3.68-.52-5.207-1.42l-.37-.22-4.53 1.33 1.33-4.53-.22-.37A8.96 8.96 0 017 15c0-4.963 4.037-9 9-9s9 4.037 9 9-4.037 9-9 9zm5.07-6.36c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.32s.99 2.69 1.13 2.88c.14.19 1.95 2.98 4.74 4.06.66.23 1.18.37 1.58.47.66.17 1.26.15 1.73.09.53-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
              </button>
              <button className="about-card-icon" type="button" title="Instagram">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="white"><path d="M16 7c2.757 0 3.09.01 4.175.06 1.08.05 1.67.22 2.06.37.5.19.86.42 1.24.8.38.38.61.74.8 1.24.15.39.32.98.37 2.06.05 1.085.06 1.418.06 4.175s-.01 3.09-.06 4.175c-.05 1.08-.22 1.67-.37 2.06-.19.5-.42.86-.8 1.24-.38.38-.74.61-1.24.8-.39.15-.98.32-2.06.37-1.085.05-1.418.06-4.175.06s-3.09-.01-4.175-.06c-1.08-.05-1.67-.22-2.06-.37-.5-.19-.86-.42-1.24-.8-.38-.38-.61-.74-.8-1.24-.15-.39-.32-.98-.37-2.06C7.01 19.09 7 18.757 7 16s.01-3.09.06-4.175c.05-1.08.22-1.67.37-2.06.19-.5.42-.86.8-1.24.38-.38.74-.61 1.24-.8.39-.15.98-.32 2.06-.37C12.91 7.01 13.243 7 16 7zm0-2C13.19 5 12.823 5.01 11.737 5.06c-1.09.05-1.84.22-2.48.47-.67.26-1.23.6-1.79 1.16-.56.56-.9 1.12-1.16 1.79-.25.64-.42 1.39-.47 2.48C5.01 12.823 5 13.19 5 16s.01 3.177.06 4.263c.05 1.09.22 1.84.47 2.48.26.67.6 1.23 1.16 1.79.56.56 1.12.9 1.79 1.16.64.25 1.39.42 2.48.47C12.823 26.99 13.19 27 16 27s3.177-.01 4.263-.06c1.09-.05 1.84-.22 2.48-.47.67-.26 1.23-.6 1.79-1.16.56-.56.9-1.12 1.16-1.79.25-.64.42-1.39.47-2.48.05-1.086.06-1.453.06-4.263s-.01-3.177-.06-4.263c-.05-1.09-.22-1.84-.47-2.48-.26-.67-.6-1.23-1.16-1.79-.56-.56-1.12-.9-1.79-1.16-.64-.25-1.39-.42-2.48-.47C19.177 5.01 18.81 5 16 5zm0 3a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12zm7.5-1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg>
              </button>
              <button className="about-card-icon" type="button" title="Twitter">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="white"><path d="M32 6.076a13.14 13.14 0 01-3.769 1.031A6.601 6.601 0 0031.115 4.1a13.195 13.195 0 01-4.169 1.594A6.563 6.563 0 0022.155 3c-3.626 0-6.563 2.938-6.563 6.563 0 .514.058 1.016.17 1.496C10.272 10.85 5.444 8.13 2.228 4.161c-.564.97-.888 2.096-.888 3.301 0 2.277 1.159 4.287 2.924 5.463A6.533 6.533 0 01.64 11.1v.083c0 3.181 2.263 5.834 5.267 6.437-.551.15-1.13.23-1.728.23-.423 0-.832-.041-1.232-.117.833 2.6 3.25 4.494 6.116 4.547A13.18 13.18 0 010 27.026 18.616 18.616 0 0010.063 30c12.072 0 18.678-10.003 18.678-18.678 0-.285-.006-.568-.019-.85A13.354 13.354 0 0032 6.076z"/></svg>
              </button>
            </div>
          </div>
          <div className="about-card">
            <div className="about-card-img-wrapper">
              <img src="https://images.pexels.com/photos/1138903/pexels-photo-1138903.jpeg?auto=compress&w=400" alt="Person 3" />
            </div>
            <div className="about-card-title">SEO Consulting</div>
            <div className="about-card-desc">B2B SEO is the process of generating valuable inbound leads from other businesses.</div>
            <div className="about-card-bar">
              <button className="about-card-icon" type="button" title="WhatsApp">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="white"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.58 2.236 6.364L4 29l7.636-2.236A11.96 11.96 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.89 0-3.68-.52-5.207-1.42l-.37-.22-4.53 1.33 1.33-4.53-.22-.37A8.96 8.96 0 017 15c0-4.963 4.037-9 9-9s9 4.037 9 9-4.037 9-9 9zm5.07-6.36c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.32s.99 2.69 1.13 2.88c.14.19 1.95 2.98 4.74 4.06.66.23 1.18.37 1.58.47.66.17 1.26.15 1.73.09.53-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
              </button>
              <button className="about-card-icon" type="button" title="Instagram">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="white"><path d="M16 7c2.757 0 3.09.01 4.175.06 1.08.05 1.67.22 2.06.37.5.19.86.42 1.24.8.38.38.61.74.8 1.24.15.39.32.98.37 2.06.05 1.085.06 1.418.06 4.175s-.01 3.09-.06 4.175c-.05 1.08-.22 1.67-.37 2.06-.19.5-.42.86-.8 1.24-.38.38-.74.61-1.24.8-.39.15-.98.32-2.06.37-1.085.05-1.418.06-4.175.06s-3.09-.01-4.175-.06c-1.08-.05-1.67-.22-2.06-.37-.5-.19-.86-.42-1.24-.8-.38-.38-.61-.74-.8-1.24-.15-.39-.32-.98-.37-2.06C7.01 19.09 7 18.757 7 16s.01-3.09.06-4.175c.05-1.08.22-1.67.37-2.06.19-.5.42-.86.8-1.24.38-.38.74-.61 1.24-.8.39-.15.98-.32 2.06-.37C12.91 7.01 13.243 7 16 7zm0-2C13.19 5 12.823 5.01 11.737 5.06c-1.09.05-1.84.22-2.48.47-.67.26-1.23.6-1.79 1.16-.56.56-.9 1.12-1.16 1.79-.25.64-.42 1.39-.47 2.48C5.01 12.823 5 13.19 5 16s.01 3.177.06 4.263c.05 1.09.22 1.84.47 2.48.26.67.6 1.23 1.16 1.79.56.56 1.12.9 1.79 1.16.64.25 1.39.42 2.48.47C12.823 26.99 13.19 27 16 27s3.177-.01 4.263-.06c1.09-.05 1.84-.22 2.48-.47.67-.26 1.23-.6 1.79-1.16.56-.56.9-1.12 1.16-1.79.25-.64.42-1.39.47-2.48.05-1.086.06-1.453.06-4.263s-.01-3.177-.06-4.263c-.05-1.09-.22-1.84-.47-2.48-.26-.67-.6-1.23-1.16-1.79-.56-.56-1.12-.9-1.79-1.16-.64-.25-1.39-.42-2.48-.47C19.177 5.01 18.81 5 16 5zm0 3a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12zm7.5-1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg>
              </button>
              <button className="about-card-icon" type="button" title="Twitter">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="white"><path d="M32 6.076a13.14 13.14 0 01-3.769 1.031A6.601 6.601 0 0031.115 4.1a13.195 13.195 0 01-4.169 1.594A6.563 6.563 0 0022.155 3c-3.626 0-6.563 2.938-6.563 6.563 0 .514.058 1.016.17 1.496C10.272 10.85 5.444 8.13 2.228 4.161c-.564.97-.888 2.096-.888 3.301 0 2.277 1.159 4.287 2.924 5.463A6.533 6.533 0 01.64 11.1v.083c0 3.181 2.263 5.834 5.267 6.437-.551.15-1.13.23-1.728.23-.423 0-.832-.041-1.232-.117.833 2.6 3.25 4.494 6.116 4.547A13.18 13.18 0 010 27.026 18.616 18.616 0 0010.063 30c12.072 0 18.678-10.003 18.678-18.678 0-.285-.006-.568-.019-.85A13.354 13.354 0 0032 6.076z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}