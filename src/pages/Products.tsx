import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { apiUtils, productApi } from '../api';
import { ShoppingCart, Heart, Eye, Loader } from 'lucide-react';
import './Products.css';

const mockCategories = ['All', 'Health', 'Wellness', 'Supplements', 'Electronics'];

interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  itemCode: string;
  mrp: number;
  price: number;
  rating: number;
  description: string;
  productName: string;
  productPrice: number;
  productCount: number;
  productStatus: string;
  productCode: number;
}

export default function Products() {
  const [category, setCategory] = useState('All');
  const [price, setPrice] = useState(15000); // Increased max price
  const [rating, setRating] = useState(0);
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: string }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  // Category filter buttons
  const categories = [
    'All Products',
    'Health & Wellness',
    'Supplements',
    'Electronics',
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = apiUtils.getToken();
        const result = await productApi.getAllProducts(token || undefined);
        console.log('API Response:', result); // Debug log
        setProducts(result.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Network error while fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filtered = products.filter(p =>
    (category === 'All' || category === 'All Products' || p.category === category) &&
    p.price <= price &&
    p.rating >= rating
  );

  console.log('Products:', products); // Debug log
  console.log('Filtered:', filtered); // Debug log
  console.log('Category:', category, 'Price:', price, 'Rating:', rating); // Debug log

  const handleClear = () => {
    setCategory('All');
    setPrice(15000); // Reset to higher max price
    setRating(0);
  };

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!apiUtils.isLoggedIn()) {
      alert('Please login to add items to cart');
      return;
    }

    setLoadingStates(prev => ({ ...prev, [product.id]: 'cart' }));
    
    try {
      await addToCart(product.id, 1);
      setLoadingStates(prev => ({ ...prev, [product.id]: '' }));
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setLoadingStates(prev => ({ ...prev, [product.id]: '' }));
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!apiUtils.isLoggedIn()) {
      alert('Please login to add items to wishlist');
      return;
    }

    setLoadingStates(prev => ({ ...prev, [product.id]: 'wishlist' }));
    
    try {
      await addToWishlist({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
      });
      setLoadingStates(prev => ({ ...prev, [product.id]: '' }));
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      setLoadingStates(prev => ({ ...prev, [product.id]: '' }));
    }
  };

  if (loading) {
    return (
      <section className="products-section" id="products">
        <div className="section-header">
          <h2 className="section-title">Our Premium Products</h2>
          <p className="section-subtitle">
            Discover high-quality products that can transform your life and earn you rewards
          </p>
        </div>
        <div className="products-loading">
          <Loader size={32} className="animate-spin" />
          <p>Loading products...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section" id="products">
        <div className="section-header">
          <h2 className="section-title">Our Premium Products</h2>
          <p className="section-subtitle">
            Discover high-quality products that can transform your life and earn you rewards
          </p>
        </div>
        <div className="products-error">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section" id="products">
      <div className="section-header">
        <h2 className="section-title">Our Premium Products</h2>
        <p className="section-subtitle">
          Discover high-quality products that can transform your life and earn you rewards
        </p>
      </div>
      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn${category === cat || (cat === 'All Products' && (category === 'All' || category === 'All Products')) ? ' active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="products-page">
        <aside className="products-filters">
          <h3>Filters</h3>
          <div className="filter-group">
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {mockCategories.map(cat => <option key={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Max Price: ₹{price.toLocaleString()}</label>
            <input 
              type="range" 
              min={100} 
              max={20000} 
              step={100} 
              value={price} 
              onChange={e => setPrice(Number(e.target.value))} 
            />
          </div>
          <div className="filter-group">
            <label>Min Rating: {rating}★</label>
            <input type="range" min={0} max={5} step={0.5} value={rating} onChange={e => setRating(Number(e.target.value))} />
          </div>
          <button className="clear-filter-btn" onClick={handleClear}>Clear Filter</button>
        </aside>
        <main className="products-grid">
          {filtered.length === 0 && products.length > 0 && (
            <div className="no-products">
              <p>No products match your current filters.</p>
              <p>Total products available: {products.length}</p>
              <button onClick={handleClear} className="clear-filter-btn">
                Clear All Filters
              </button>
            </div>
          )}
          {products.length === 0 && (
            <div className="no-products">
              <p>No products found in database.</p>
            </div>
          )}
          {filtered.map(product => (
            <div className="product-card-container" key={product.id}>
              <Link to={`/products/${product.id}`} className="product-card-link">
                <div className="product-card-grid">
                  <div className="product-img-wrap">
                    <img src={product.image} alt={product.name} className="product-img" />
                    {product.mrp > product.price && (
                      <span className="product-discount-badge">{Math.round(100 - (product.price / product.mrp) * 100)}% OFF</span>
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-description">{product.description}</div>
                    <div className="product-rating-row">
                      <span className="product-stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
                      <span className="product-rating-value">{product.rating.toFixed(1)}</span>
                    </div>
                    <div className="product-price-row">
                      <span className="product-price">₹{product.price.toLocaleString()}</span>
                      {product.mrp > product.price && (
                        <span className="product-mrp">₹{product.mrp.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
              <div className="product-actions">
                <button 
                  className={`action-btn cart-btn ${loadingStates[product.id] === 'cart' ? 'loading' : ''}`}
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={loadingStates[product.id] === 'cart'}
                >
                  {loadingStates[product.id] === 'cart' ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <ShoppingCart size={16} />
                  )}
                  Add to Cart
                </button>
                <button 
                  className={`action-btn wishlist-btn ${isInWishlist(product.id) ? 'active' : ''} ${loadingStates[product.id] === 'wishlist' ? 'loading' : ''}`}
                  onClick={(e) => handleAddToWishlist(e, product)}
                  disabled={loadingStates[product.id] === 'wishlist'}
                >
                  {loadingStates[product.id] === 'wishlist' ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <Heart size={16} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                  )}
                  {isInWishlist(product.id) ? 'In Wishlist' : 'Wishlist'}
                </button>
                <Link to={`/products/${product.id}`} className="action-btn view-btn">
                  <Eye size={16} />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </main>
      </div>
    </section>
  );
} 
