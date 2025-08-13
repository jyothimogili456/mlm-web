import React, { useState, useEffect } from "react";
import { ShoppingCart, UserCircle, LogOut, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLinks } from "./NavLinks";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { apiUtils } from "../api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useUser } from "../context/UserContext";
import "./Header.css";

export const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();
  const { logout: userLogout } = useUser();

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkAuthStatus = () => {
      const loggedIn = apiUtils.isLoggedIn();
      setIsLoggedIn(loggedIn);
    };

    checkAuthStatus();
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  const handleLogout = () => {
    // Use UserContext logout to clear state, then redirect
    userLogout();
    window.location.href = '/';
  };

  return (
    <header className="header">
      {/* Left: Logo/Name */}
      <div className="header__logo">
        <img src={logo} alt="GiftsHero Logo" />
      </div>

      {/* Center: Nav links (hidden on mobile) */}
      <motion.div
        className="header__center"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 2, 0.6, 1] }}
      >
        <NavLinks />
      </motion.div>

      {/* Right: Cart, Wishlist, User/Login, CTA, Hamburger */}
      <div className="header__right">
        {/* Cart Icon with badge and tap bounce */}
        <Link to="/cart" style={{ textDecoration: 'none' }}>
          <motion.div
            className="header__cart"
            whileTap={{ scale: 1.2 }}
            tabIndex={0}
            aria-label="View cart"
          >
            <ShoppingCart size={26} />
            {isLoggedIn && cartState.itemCount > 0 && (
              <span className="header__cart-badge">{cartState.itemCount}</span>
            )}
          </motion.div>
        </Link>

        {/* Wishlist Icon */}
        {isLoggedIn && (
          <Link to="/wishlist" style={{ textDecoration: 'none' }}>
            <motion.div
              className="header__wishlist"
              whileTap={{ scale: 1.2 }}
              tabIndex={0}
              aria-label="View wishlist"
            >
              <Heart size={26} />
              {wishlistState.items.length > 0 && (
                <span className="header__wishlist-badge">{wishlistState.items.length}</span>
              )}
            </motion.div>
          </Link>
        )}

        {/* User Icon or Login */}
        {isLoggedIn ? (
          <div className="header__user-menu">
            <Link to="/dashboard" className="header__user" tabIndex={0} aria-label="User Dashboard">
              <UserCircle size={26} color="#7c3aed" />
              <span style={{ display: "none" }}>Dashboard</span>
            </Link>
            <motion.button
              className="header__logout-btn"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Logout"
            >
              <LogOut size={20} />
            </motion.button>
          </div>
        ) : (
          <Link to="/login" className="header__user" tabIndex={0} aria-label="Login">
            <UserCircle size={26} color="#7c3aed" />
            <span style={{ display: "none" }}>Login</span>
          </Link>
        )}

        {/* CTA Button: Join Now (desktop only) */}
        {!isLoggedIn && (
          <motion.button
            className="header__cta header__cta--desktop"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.location.href = '/register'}
          >
            Join Now
          </motion.button>
        )}

        {/* Custom Hamburger menu (mobile only) */}
        <button
          className={`header__menu-btn ${mobileOpen ? 'active' : ''}`}
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <div className="hamburger">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Mobile Menu Header */}
              <div className="mobile-menu-header">
                <button
                  className={`header__menu-btn active`}
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  style={{ position: "absolute", top: "1rem", right: "1rem" }}
                >
                  <div className="hamburger">
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                  </div>
                </button>
              </div>
              
              {/* Mobile Menu Content */}
              <div className="mobile-menu-content">
                <NavLinks orientation="vertical" onLinkClick={() => setMobileOpen(false)} />
                
                {/* Mobile Auth Buttons */}
                {isLoggedIn ? (
                  <div className="mobile-auth-buttons">
                    <Link to="/dashboard" className="mobile-auth-btn dashboard">
                      Dashboard
                    </Link>
                    <Link to="/cart" className="mobile-auth-btn cart">
                      Cart ({cartState.itemCount})
                    </Link>
                    <Link to="/wishlist" className="mobile-auth-btn wishlist">
                      Wishlist ({wishlistState.items.length})
                    </Link>
                    <button className="mobile-auth-btn logout" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                ) : (
                  <motion.button
                    className="header__cta"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ marginTop: "auto", width: "100%" }}
                    onClick={() => window.location.href = '/register'}
                  >
                    Join Now
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}; 