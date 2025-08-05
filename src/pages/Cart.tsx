import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { apiUtils, productApi } from "../api";
import { ShoppingCart, Trash2, Loader, Minus, Plus, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import "./Cart.css";

const Cart: React.FC = () => {
  const { state: cartState, updateCartItem, removeFromCart, clearCart, loadCart } = useCart();
  
  // Load cart items when component mounts - use a ref to ensure it only runs once
  const hasLoaded = React.useRef(false);
  React.useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadCart();
    }
  }, []);
  
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
  
  const [loadingStates, setLoadingStates] = useState<{
    update: boolean;
    delete: boolean;
    clear: boolean;
    bookNow: boolean;
  }>({
    update: false,
    delete: false,
    clear: false,
    bookNow: false
  });

  const handleUpdateQuantity = async (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setLoadingStates(prev => ({ ...prev, update: true }));
    
    try {
      await updateCartItem(cartId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, update: false }));
    }
  };

  const handleRemoveItem = (cartId: number, productName: string) => {
    setDeleteModal({
      isOpen: true,
      itemId: cartId,
      itemName: productName,
      type: 'item'
    });
  };

  const confirmDeleteItem = async () => {
    if (!deleteModal.itemId) return;
    
    setLoadingStates(prev => ({ ...prev, delete: true }));
    
    try {
      await removeFromCart(deleteModal.itemId);
      setDeleteModal({ isOpen: false, itemId: null, itemName: '', type: 'item' });
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, delete: false }));
    }
  };

  const handleClearCart = () => {
    setDeleteModal({
      isOpen: true,
      itemId: null,
      itemName: 'all items',
      type: 'clear'
    });
  };

  const confirmClearCart = async () => {
    setLoadingStates(prev => ({ ...prev, clear: true }));
    
    try {
      await clearCart();
      setDeleteModal({ isOpen: false, itemId: null, itemName: '', type: 'item' });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, clear: false }));
    }
  };

  const handleBookNow = async () => {
    const userData = apiUtils.getUserData();
    const token = apiUtils.getToken();
    
    if (!userData || !token) {
      setPopup({
        isOpen: true,
        title: 'Login Required',
        message: 'Please login to place orders.',
        type: 'warning'
      });
      return;
    }

    setLoadingStates(prev => ({ ...prev, bookNow: true }));
    
    try {
      // Place orders for each cart item
      const orderPromises = cartState.items.map(item => 
        productApi.placeOrder({
          userId: userData.id,
          productName: item.productName,
          quantity: item.quantity
        }, token)
      );
      
      await Promise.all(orderPromises);
      
      // Clear the cart after successful order placement
      await clearCart();
      
      setPopup({
        isOpen: true,
        title: 'Order Placed Successfully!',
        message: 'Your order has been placed and will be processed soon.',
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to place order:', error);
      setPopup({
        isOpen: true,
        title: 'Order Failed',
        message: 'Failed to place order. Please try again.',
        type: 'error'
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, bookNow: false }));
    }
  };

  if (!apiUtils.isLoggedIn()) {
    return (
      <div className="cart-page">
        <div className="cart-login-prompt">
          <ShoppingCart size={48} color="#7c3aed" />
          <h2>Please Login to View Your Cart</h2>
          <p>Sign in to see your cart items and proceed to checkout.</p>
          <Link to="/login" className="cart-login-btn">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (cartState.loading) {
    return (
      <div className="cart-page">
        <div className="cart-loading">
          <Loader size={32} className="animate-spin" />
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartState.error) {
    return (
      <div className="cart-page">
        <div className="cart-error">
          <p>Error: {cartState.error}</p>
          <button onClick={() => window.location.reload()} className="cart-retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (cartState.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <ShoppingCart size={64} color="#d1d5db" />
          <h2>Your Cart is Empty</h2>
          <p>Start shopping to add items to your cart.</p>
          <Link to="/products" className="cart-shop-btn">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart</h1>
          <span className="cart-count">({cartState.itemCount} items)</span>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartState.items.map((item) => (
              <div key={item.cartId} className="cart-item">
                <div className="cart-item-image">
                  <img 
                    src={item.productPhoto || "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"}
                    alt={item.productName}
                  />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.productName}</h3>
                  <p className="cart-item-price">₹{item.productPrice?.toLocaleString() || '0'}</p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    onClick={() => handleUpdateQuantity(item.cartId, item.quantity - 1)}
                    className="quantity-btn"
                    disabled={item.quantity <= 1 || loadingStates.update}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.cartId, item.quantity + 1)}
                    className="quantity-btn"
                    disabled={loadingStates.update}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="cart-item-total">
                  ₹{(item.productPrice * item.quantity)?.toLocaleString() || '0'}
                </div>
                <button
                  onClick={() => handleRemoveItem(item.cartId, item.productName)}
                  className="cart-item-remove"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="cart-summary-row">
              <span>Subtotal ({cartState.itemCount} items):</span>
              <span>₹{cartState.total?.toLocaleString() || '0'}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total:</span>
              <span>₹{cartState.total?.toLocaleString() || '0'}</span>
            </div>
            
            <div className="cart-actions">
              <button
                onClick={handleClearCart}
                className="cart-clear-btn"
                disabled={loadingStates.clear}
              >
                {loadingStates.clear ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <Trash2 size={16} />
                )}
                Clear Cart
              </button>
              <button
                onClick={handleBookNow}
                className="cart-book-now-btn"
                disabled={loadingStates.bookNow || cartState.items.length === 0}
              >
                {loadingStates.bookNow ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <CreditCard size={16} />
                )}
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null, itemName: '', type: 'item' })}
        onConfirm={deleteModal.type === 'clear' ? confirmClearCart : confirmDeleteItem}
        title={deleteModal.type === 'clear' ? 'Clear Cart' : 'Remove Item'}
        message={
          deleteModal.type === 'clear' 
            ? 'Are you sure you want to remove all items from your cart? This action cannot be undone.'
            : `Are you sure you want to remove "${deleteModal.itemName}" from your cart?`
        }
        confirmText={deleteModal.type === 'clear' ? 'Clear All' : 'Remove'}
        cancelText="Cancel"
        type="danger"
        loading={loadingStates.delete || loadingStates.clear}
      />

      {/* Popup Modal */}
      <ConfirmationModal
        isOpen={popup.isOpen}
        onClose={() => setPopup(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => setPopup(prev => ({ ...prev, isOpen: false }))}
        title={popup.title}
        message={popup.message}
        confirmText="OK"
        cancelText=""
        type={popup.type === 'error' ? 'danger' : popup.type === 'success' ? 'info' : 'info'}
        loading={false}
      />
    </div>
  );
};

export default Cart; 