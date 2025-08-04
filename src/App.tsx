import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Rewards from "./pages/Rewards";
import DirectReferrals from "./pages/DirectReferrals";
import Profile from "./pages/Profile";
import FaqPage from "./pages/FaqPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { UserProvider } from "./context/UserContext";
import "./App.css";
import CareersPage from "./pages/CareersPage";
import BranchesPage from "./pages/BranchesPage";
import CancellationPolicyPage from "./pages/CancellationPolicyPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ShippingPolicyPage from "./pages/ShippingPolicyPage";
import TermsPage from "./pages/TermsPage";

function App() {
  const location = useLocation(); // <-- use useLocation() instead of window.location
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/reset-password";
  return (
    <UserProvider>
      <CartProvider>
        <WishlistProvider>
          {/* Router is now outside, so useLocation works */}
          {!isAuthPage && <Header />}
          <Routes>
            {/* Main app pages use MainLayout */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
            <Route path="/products/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
            <Route path="/wishlist" element={<MainLayout><Wishlist /></MainLayout>} />
            <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
            <Route path="/thank-you" element={<MainLayout><ThankYou /></MainLayout>} />
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/rewards" element={<MainLayout><Rewards /></MainLayout>} />
            <Route path="/direct-referrals" element={<MainLayout><DirectReferrals /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
            <Route path="/faqs" element={<MainLayout><FaqPage /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
            <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
            <Route path="/careers" element={<MainLayout><CareersPage /></MainLayout>} />
            <Route path="/branches" element={<MainLayout><BranchesPage /></MainLayout>} />
            <Route path="/cancellation-policy" element={<MainLayout><CancellationPolicyPage /></MainLayout>} />
            <Route path="/privacy" element={<MainLayout><PrivacyPolicyPage /></MainLayout>} />
            <Route path="/shipping" element={<MainLayout><ShippingPolicyPage /></MainLayout>} />
            <Route path="/terms" element={<MainLayout><TermsPage /></MainLayout>} />
            {/* Auth pages use AuthLayout */}
            <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
            <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
            <Route path="/reset-password" element={<AuthLayout><div style={{ padding: "2rem", textAlign: "center" }}><h2>Reset Password</h2><p>Password reset functionality coming soon...</p></div></AuthLayout>} />
            {/* 404 fallback */}
            <Route path="*" element={<div style={{ padding: "4rem", textAlign: "center" }}><h1>404 - Not Found</h1></div>} />
          </Routes>
          {!isAuthPage && <Footer />}
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}