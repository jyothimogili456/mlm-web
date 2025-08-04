import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <main
      style={{
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        padding: isHome ? "0" : "1rem 0.5rem",
        boxSizing: "border-box"
      }}
    >
      {children}
    </main>
  );
};

export default MainLayout; 