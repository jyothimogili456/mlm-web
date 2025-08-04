import React from "react";
import { Link } from "react-router-dom";

export type NavLinksProps = {
  orientation?: "horizontal" | "vertical";
  onLinkClick?: () => void;
  className?: string;
};

const links = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Rewards", href: "/rewards" },
  { name: "Contact", href: "/contact" },
  { name: "FAQs", href: "/faqs" },
  { name: "About", href: "/about" },
  
];

export const NavLinks: React.FC<NavLinksProps> = ({ orientation = "horizontal", onLinkClick, className = "" }) => {
  return (
    <nav className={`nav-links nav-links--${orientation} ${className}`}>
      {links.map((link) => (
        <Link
          key={link.name}
          to={link.href}
          className="nav-link"
          onClick={onLinkClick}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}; 