import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { apiUtils } from "../api";
import { ShoppingCart, Heart, Loader } from "lucide-react";
import PopupModal from "../components/PopupModal";
import "./ProductDetails.css";

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

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState("");
  const [tab, setTab] = useState(0);
  const [loadingStates, setLoadingStates] = useState<{ cart: boolean; wishlist: boolean }>({ cart: false, wishlist: false });
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

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/product/${id}`);
        
        if (response.ok) {
          const result = await response.json();
          const productData = result.data;
          
          // Map the API response to match the expected Product interface
          const mappedProduct = {
            id: productData.id,
            name: productData.productName || productData.name,
            image: productData.image || productData.photoUrl || productData.productImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9kdWN0PC90ZXh0Pgo8L3N2Zz4K',
            category: productData.category || 'General',
            itemCode: productData.itemCode || productData.productCode || productData.id.toString(),
            mrp: productData.mrp || productData.productMrp || productData.productPrice * 1.2, // 20% markup as MRP
            price: productData.productPrice || productData.price,
            rating: productData.rating || 4.0,
            description: productData.description || productData.productDescription || 'Product description coming soon...',
            productName: productData.productName || productData.name,
            productPrice: productData.productPrice || productData.price,
            productCount: productData.productCount || 0,
            productStatus: productData.productStatus || 'active',
            productCode: productData.productCode || productData.id
          };
          
          console.log('Mapped Product:', mappedProduct);
          setProduct(mappedProduct);
          setMainImg(mappedProduct.image);
        } else {
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!apiUtils.isLoggedIn()) {
      setPopup({
        isOpen: true,
        title: 'Login Required',
        message: 'Please login to add items to your cart.',
        type: 'warning'
      });
      return;
    }

    setLoadingStates(prev => ({ ...prev, cart: true }));
    
    try {
      await addToCart(product.id, qty);
      setLoadingStates(prev => ({ ...prev, cart: false }));
      setPopup({
        isOpen: true,
        title: 'Success!',
        message: `${qty} ${qty === 1 ? 'item' : 'items'} of ${product.name} added to your cart.`,
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setLoadingStates(prev => ({ ...prev, cart: false }));
      setPopup({
        isOpen: true,
        title: 'Error',
        message: 'Failed to add item to cart. Please try again.',
        type: 'error'
      });
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    
    if (!apiUtils.isLoggedIn()) {
      setPopup({
        isOpen: true,
        title: 'Login Required',
        message: 'Please login to add items to your wishlist.',
        type: 'warning'
      });
      return;
    }

    setLoadingStates(prev => ({ ...prev, wishlist: true }));
    
    try {
      await addToWishlist({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
      });
      setLoadingStates(prev => ({ ...prev, wishlist: false }));
      setPopup({
        isOpen: true,
        title: 'Success!',
        message: `${product.name} has been added to your wishlist.`,
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      setLoadingStates(prev => ({ ...prev, wishlist: false }));
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
      <div className="product-detail-page">
        <div className="product-detail-loading">
          <Loader size={32} className="animate-spin" />
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-error">
          <p>Error: {error || 'Product not found'}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Generate gallery images (using the same image for now)
  const gallery = [product.image, product.image, product.image, product.image];

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  const tabContent = [
    {
      label: "Product Details",
      render: (product: Product) => (
        <div className="product-detail-desc">
          <p>{product.description}</p>
          <ul className="product-detail-specs">
            <li><strong>Category:</strong> {product.category}</li>
            <li><strong>Item Code:</strong> {product.itemCode}</li>
            <li><strong>Price:</strong> ₹{(product.price || 0).toLocaleString()}</li>
            <li><strong>Rating:</strong> {product.rating} / 5</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Left: Image + Gallery */}
        <div className="product-detail-image-col">
          <div>
            <img
              src={mainImg}
              alt={product.name}
              className="product-detail-image"
            />
            <div className="product-detail-gallery">
              {gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Gallery ${i+1}`}
                  className={`gallery-thumb${mainImg === img ? ' active' : ''}`}
                  onClick={() => setMainImg(img)}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Right: Info */}
        <div className="product-detail-info-col">
          <h1 className="product-detail-title">{product.name}</h1>
          <div className="product-detail-meta">
            <span>Item Code: {product.itemCode}</span>
            <span>Category: {product.category}</span>
          </div>
          <div className="product-detail-price">
            MRP: <span>₹{(product.price || 0).toLocaleString()}</span>
            <span className="product-detail-tax">(Inclusive of all taxes)</span>
          </div>
          <div className="product-detail-qty-row">
            <button 
              onClick={() => setQty((q: number) => Math.max(1, q - 1))} 
              className="qty-btn"
              disabled={qty <= 1}
            >
              -
            </button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={e => setQty(Math.max(1, Number(e.target.value)))}
              className="qty-input"
            />
            <button 
              onClick={() => setQty((q: number) => q + 1)} 
              className="qty-btn"
            >
              +
            </button>
          </div>
          <div className="product-detail-actions">
            <button 
              className={`add-to-cart-btn ${loadingStates.cart ? 'loading' : ''}`}
              onClick={handleAddToCart}
              disabled={loadingStates.cart || loadingStates.wishlist}
            >
              {loadingStates.cart ? (
                <div className="loading-spinner"></div>
              ) : (
                <ShoppingCart size={16} />
              )}
              Add to Cart
            </button>
            <button 
              className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''} ${loadingStates.wishlist ? 'loading' : ''}`}
              onClick={handleAddToWishlist}
              disabled={loadingStates.cart || loadingStates.wishlist}
              title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              {loadingStates.wishlist ? (
                <div className="loading-spinner"></div>
              ) : (
                <Heart size={16} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              )}
            </button>
          </div>
          <div className="product-detail-rating">
            <span className="star">★</span> {product.rating} / 5
            <span className="review-count">(Product Rating)</span>
          </div>
        </div>
      </div>
      {/* Tabs: Details, Features, How To Use, Additional Info */}
      <div className="product-detail-tabs">
        {tabContent.map((t, i) => (
          <button
            key={t.label}
            className={`tab${tab === i ? ' active' : ''}`}
            onClick={() => setTab(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabContent[tab].render(product)}
      
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
    </div>
  );
};

export default ProductDetails; 