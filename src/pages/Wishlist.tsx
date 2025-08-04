import React, { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { apiUtils } from "../api";
import { Heart, ShoppingCart, Trash2, Loader, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import "./Wishlist.css";

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

const Wishlist: React.FC = () => {
  const { state: wishlistState, removeFromWishlist, clearWishlist, loadWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: number | null;
    itemName: string;
    type: 'item' | 'clear';
  }>({
    isOpen: false,
    itemId: null,
    itemName: '',
    type: 'item'
  });
  
  const [loadingStates, setLoadingStates] = useState<{
    delete: boolean;
    clear: boolean;
    moveToCart: boolean;
  }>({
    delete: false,
    clear: false,
    moveToCart: false
  });

  const handleRemove = async (wishlistId: number, productName: string) => {
    setDeleteModal({
      isOpen: true,
      itemId: wishlistId,
      itemName: productName,
      type: 'item'
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.itemId) return;
    
    setLoadingStates(prev => ({ ...prev, delete: true }));
    
    try {
      await removeFromWishlist(deleteModal.itemId);
      setDeleteModal({ isOpen: false, itemId: null, itemName: '', type: 'item' });
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, delete: false }));
    }
  };

  const handleMoveToCart = async (product: any) => {
    setLoadingStates(prev => ({ ...prev, moveToCart: true }));
    
    try {
      await addToCart(product.productId, 1);
      await removeFromWishlist(product.wishlistId);
    } catch (error) {
      console.error('Failed to move to cart:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, moveToCart: false }));
    }
  };

  const handleClearWishlist = () => {
    setDeleteModal({
      isOpen: true,
      itemId: null,
      itemName: 'all items',
      type: 'clear'
    });
  };

  const confirmClearWishlist = async () => {
    setLoadingStates(prev => ({ ...prev, clear: true }));
    
    try {
      await clearWishlist();
      setDeleteModal({ isOpen: false, itemId: null, itemName: '', type: 'item' });
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, clear: false }));
    }
  };

  const handleRefresh = () => {
    loadWishlist();
  };

  if (!apiUtils.isLoggedIn()) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-login-prompt">
          <Heart size={48} color="#7c3aed" />
          <h2>Please Login to View Your Wishlist</h2>
          <p>Sign in to see your saved items and manage your wishlist.</p>
          <Link to="/login" className="wishlist-login-btn">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <div className="wishlist-title">
            <Heart size={32} color="#7c3aed" />
            <h1>My Wishlist</h1>
            <span className="wishlist-count">({wishlistState.items.length} items)</span>
          </div>
          <div className="wishlist-actions">
            <button 
              onClick={handleRefresh} 
              className="wishlist-refresh-btn"
              disabled={wishlistState.loading}
            >
              <Loader size={16} className={wishlistState.loading ? "animate-spin" : ""} />
              Refresh
            </button>
            {wishlistState.items.length > 0 && (
              <button 
                onClick={handleClearWishlist} 
                className="wishlist-clear-btn"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
          </div>
        </div>

        {wishlistState.loading && (
          <div className="wishlist-loading">
            <Loader size={32} className="animate-spin" />
            <p>Loading your wishlist...</p>
          </div>
        )}

        {wishlistState.error && (
          <div className="wishlist-error">
            <p>Error: {wishlistState.error}</p>
            <button onClick={handleRefresh} className="wishlist-retry-btn">
              Retry
            </button>
          </div>
        )}

        {!wishlistState.loading && !wishlistState.error && wishlistState.items.length === 0 && (
          <div className="wishlist-empty">
            <Heart size={64} color="#d1d5db" />
            <h2>Your Wishlist is Empty</h2>
            <p>Start adding products to your wishlist to see them here.</p>
            <Link to="/products" className="wishlist-shop-btn">
              Browse Products
            </Link>
          </div>
        )}

        {!wishlistState.loading && !wishlistState.error && wishlistState.items.length > 0 && (
          <div className="wishlist-grid">
            {wishlistState.items.map((item) => (
              <div key={item.wishlistId} className="wishlist-item">
                <div className="wishlist-item-image">
                  <img 
                    src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
                    alt={item.productName}
                  />
                </div>
                <div className="wishlist-item-content">
                  <h3 className="wishlist-item-title">{item.productName}</h3>
                  <p className="wishlist-item-price">₹{item.productPrice?.toLocaleString() || '0'}</p>
                  <div className="wishlist-item-actions">
                    <button 
                      onClick={() => handleMoveToCart(item)}
                      className="wishlist-cart-btn"
                      title="Move to Cart"
                      disabled={loadingStates.moveToCart}
                    >
                      {loadingStates.moveToCart ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        <ShoppingCart size={16} />
                      )}
                      Move to Cart
                    </button>
                    <Link 
                      to={`/products/${item.productId}`}
                      className="wishlist-view-btn"
                      title="View Details"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                    <button 
                      onClick={() => handleRemove(item.wishlistId, item.productName)}
                      className="wishlist-remove-btn"
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null, itemName: '', type: 'item' })}
        onConfirm={deleteModal.type === 'clear' ? confirmClearWishlist : confirmDelete}
        title={deleteModal.type === 'clear' ? 'Clear Wishlist' : 'Remove Item'}
        message={
          deleteModal.type === 'clear' 
            ? 'Are you sure you want to remove all items from your wishlist? This action cannot be undone.'
            : `Are you sure you want to remove "${deleteModal.itemName}" from your wishlist?`
        }
        confirmText={deleteModal.type === 'clear' ? 'Clear All' : 'Remove'}
        cancelText="Cancel"
        type="danger"
        loading={loadingStates.delete || loadingStates.clear}
      />
    </div>
  );
};

export default Wishlist; 