import React, { ReactNode } from "react";

const HEADER_HEIGHT = 72; // px, matches header padding (1rem top+bottom)

const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
      }}
    >
      <main style={{ maxWidth: "100vw", margin: 0, padding: 0, background: 'none', boxShadow: 'none', borderRadius: 0, backdropFilter: 'none' }}>
        {children}
      </main>
    </div>
  );
};

export default AuthLayout; 