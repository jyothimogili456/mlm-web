import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { apiUtils, productApi } from '../api';
import { ShoppingCart, Heart, Eye, Loader } from 'lucide-react';
import noproImg from '../assets/nopro.jpg';
import PopupModal from '../components/PopupModal';
import './Products.css';
import './Products-mobile-fix.css';

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
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  
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
        console.log('Fetching products...'); // Debug log
        
        // Fetch products using the API function
        const result = await productApi.getAllProducts();
          console.log('API Response:', result); // Debug log
        
        // Map the API response to match the expected Product interface
        const mappedProducts = (result.data || []).map((product: any) => ({
          id: product.id,
          name: product.productName || product.name,
          image: product.image || product.photoUrl || product.productImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9kdWN0PC90ZXh0Pgo8L3N2Zz4K',
          category: product.category || 'General',
          itemCode: product.itemCode || product.productCode || product.id.toString(),
          mrp: product.mrp || product.productMrp || product.productPrice * 1.2, // 20% markup as MRP
          price: product.productPrice || product.price,
          rating: product.rating || 4.0,
          description: product.description || product.productDescription || 'Product description coming soon...',
          productName: product.productName || product.name,
          productPrice: product.productPrice || product.price,
          productCount: product.productCount || 0,
          productStatus: product.productStatus || 'active',
          productCode: product.productCode || product.id
        }));
        
        console.log('Mapped Products:', mappedProducts);
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
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

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!apiUtils.isLoggedIn()) {
      setPopup({
        isOpen: true,
        title: 'Login Required',
        message: 'Please login to add items to your cart.',
        type: 'warning'
      });
      return;
    }

    setLoadingStates(prev => ({ ...prev, [product.id]: 'cart' }));
    
    try {
      await addToCart(product.id, 1);
      setLoadingStates(prev => ({ ...prev, [product.id]: '' }));
      setPopup({
        isOpen: true,
        title: 'Success!',
        message: `${product.name} has been added to your cart.`,
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setLoadingStates(prev => ({ ...prev, [product.id]: '' }));
      setPopup({
        isOpen: true,
        title: 'Error',
        message: 'Failed to add item to cart. Please try again.',
        type: 'error'
      });
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!apiUtils.isLoggedIn()) {
      setPopup({
        isOpen: true,
        title: 'Login Required',
        message: 'Please login to add items to your wishlist.',
        type: 'warning'
      });
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
      setPopup({
        isOpen: true,
        title: 'Success!',
        message: `${product.name} has been added to your wishlist.`,
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      setLoadingStates(prev => ({ ...prev, [product.id]: '' }));
      setPopup({
        isOpen: true,
        title: 'Error',
        message: 'Failed to add item to wishlist. Please try again.',
        type: 'error'
      });
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
    if (
      error.toLowerCase().includes('token') ||
      error.toLowerCase().includes('expired') ||
      error.toLowerCase().includes('login') ||
      error.toLowerCase().includes('session')
    ) {
      return (
        <section className="products-section" id="products">
          <div className="section-header">
            <h2 className="section-title">Our Premium Products</h2>
            <p className="section-subtitle">
              Discover high-quality products that can transform your life and earn you rewards
            </p>
          </div>
          <div className="products-login-prompt">
            <h2>Please Login to View Products</h2>
            <p>Your session has expired. Please login again to continue.</p>
            <Link to="/login" className="products-login-btn">Login Now</Link>
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
          {(products.length === 0) && (
            <div className="no-products">
              <img src={noproImg} alt="No products found" className="products-empty-img" />
              {/* <h2 className="products-empty-title">No products found</h2> */}
              <p>There are currently no products available.</p>
              <Link to="/" className="products-shop-btn go-home-btn">Go to Home</Link>
            </div>
          )}
          {filtered.length === 0 && products.length > 0 && (
            <div className="no-products">
              <img src={noproImg} alt="No products found" className="products-empty-img" />
              <h2 className="products-empty-title">No products found</h2>
              <p>No products match your filters.</p>
              <Link to="/" className="products-shop-btn">Go to Home</Link>
            </div>
          )}
          {filtered.length > 0 && filtered.map(product => (
            <div className="product-card-grid" key={product.id}>
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
              <div className="product-actions">
                <button 
                  className={`action-btn cart-btn ${loadingStates[product.id] === 'cart' ? 'loading' : ''}`}
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={loadingStates[product.id] === 'cart'}
                  title="Add to Cart"
                >
                  {loadingStates[product.id] === 'cart' ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <ShoppingCart size={16} />
                  )}
                </button>
                <button 
                  className={`action-btn wishlist-btn ${isInWishlist(product.id) ? 'active' : ''} ${loadingStates[product.id] === 'wishlist' ? 'loading' : ''}`}
                  onClick={(e) => handleAddToWishlist(e, product)}
                  disabled={loadingStates[product.id] === 'wishlist'}
                  title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  {loadingStates[product.id] === 'wishlist' ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <Heart size={16} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                  )}
                </button>
                <Link to={`/products/${product.id}`} className="action-btn view-btn" title="View Details">
                  <Eye size={16} />
                </Link>
              </div>
            </div>
          ))}
        </main>
      </div>
      {/* Popup Modal */}
      <PopupModal
        isOpen={popup.isOpen}
        onClose={closePopup}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        autoClose={popup.type === 'success'}
        autoCloseDelay={3000}
      />
    </section>
  );
}
