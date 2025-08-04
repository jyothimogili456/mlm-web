import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './FeaturedProducts.css';

const products: any[] = [
  {
    id: "1",
    name: "Vestige Veslim Energy Drink Mix",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    category: "Health & Wellness",
    code: "22052",
  },
  {
    id: "2",
    name: "Vestige Veslim Shake 500 g Vanilla Flavour",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    category: "Health Supplements",
    code: "22048",
  },
  {
    id: "3",
    name: "Vestige Veslim Shake 500 g Mango Flavour",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    category: "Health Supplements",
    code: "21040A",
  },
  {
    id: "4",
    name: "Vestige Veslim Shake 500 g Kulfi Flavour",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    category: "Health Supplements",
    code: "22049",
  },
  {
    id: "5",
    name: "Vestige Veslim Shake 500 g Chocolate Flavour",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    category: "Health Supplements",
    code: "22050",
  },
];

const FeaturedProducts = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const card = carouselRef.current.querySelector('.product-card');
      if (card) {
        const cardEl = card as HTMLElement;
        const cardStyle = window.getComputedStyle(cardEl);
        const cardWidth = cardEl.offsetWidth;
        const gap = parseInt(cardStyle.marginRight || '0') || 32;
        carouselRef.current.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
      }
    }
  };
  const scrollRight = () => {
    if (carouselRef.current) {
      const card = carouselRef.current.querySelector('.product-card');
      if (card) {
        const cardEl = card as HTMLElement;
        const cardStyle = window.getComputedStyle(cardEl);
        const cardWidth = cardEl.offsetWidth;
        const gap = parseInt(cardStyle.marginRight || '0') || 32;
        carouselRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="featured-products-section">
      <h2 className="featured-products-heading">Top Picks for You</h2>
      <div className="featured-products-carousel">
        <button className="carousel-chevron left" onClick={scrollLeft} aria-label="Scroll left">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="carousel-track" ref={carouselRef}>
          {products.map(product => (
            <div className="product-card" key={product.id}>
              <Link to={`/products/${product.id}`} className="product-card-link">
                <div className="product-image-wrapper">
                  <img src={product.image} alt={product.name} className="product-image" />
                </div>
                <div className="product-category">{product.category}</div>
                <div className="product-name">{product.name}</div>
                <div className="product-code">
                  Item Code : <span className="product-code-text">{product.code}</span>
                </div>
                <div className="view-details-btn">
                  View Details
                </div>
              </Link>
            </div>
          ))}
        </div>
        <button className="carousel-chevron right" onClick={scrollRight} aria-label="Scroll right">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M9 5l7 7-7 7" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default FeaturedProducts; 