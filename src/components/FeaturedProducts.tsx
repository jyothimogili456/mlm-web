
import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedProducts.css';

const products = [
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
  }
];

const FeaturedProducts = () => {
  return (
    <section className="featured-products-section">
      <h2 className="featured-products-heading">Top Picks for You</h2>
      <div className="featured-products-list">
        {products.map(product => (
          <div className="featured-product-card" key={product.id}>
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
    </section>
  );
};

export default FeaturedProducts;