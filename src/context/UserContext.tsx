import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { User } from "../types/User";

type UserState = {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
  referralCode: string;
  // Add more fields as needed
} | null;

const UserContext = createContext<{
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
  loading: boolean;
  logout: () => void;
  refreshUser: () => void;
}>({ user: null, setUser: () => null, loading: true, logout: () => null, refreshUser: () => null });

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserState>(null);
  const [loading, setLoading] = useState(true);

  // Function to load user data from localStorage
  const loadUserFromStorage = () => {
    try {
      // Check for both user and admin tokens
      const userData = localStorage.getItem('userData');
      const userToken = localStorage.getItem('userToken');
      const adminToken = localStorage.getItem('adminToken');
      
      console.log('Loading user from storage:', { 
        userData: userData ? 'exists' : 'null', 
        userToken: userToken ? 'exists' : 'null', 
        adminToken: adminToken ? 'exists' : 'null' 
      });
      
      // If we have admin token, we need to handle admin login differently
      if (adminToken) {
        console.log('Admin token found, creating admin user context');
        // For now, let's create a basic user context for admin
        const adminUser: UserState = {
          id: 'admin',
          name: 'Admin User',
          email: 'admin@example.com',
          walletBalance: 0,
          referralCode: 'ADMIN',
        };
        setUser(adminUser);
        setLoading(false);
        return;
      }
      
      if (userData && userToken) {
        const parsedUser = JSON.parse(userData);
        console.log('Parsed user data:', parsedUser);
        
        // Transform the user data to match UserState structure
        const transformedUser: UserState = {
          id: parsedUser.id?.toString() || '',
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          walletBalance: parsedUser.walletBalance || 0,
          referralCode: parsedUser.referral_code || '',
        };
        
        console.log('Transformed user:', transformedUser);
        setUser(transformedUser);
      } else {
        console.log('No user data or token found in localStorage');
        console.log('userData:', userData);
        console.log('userToken:', userToken);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  // Logout function that clears everything
  const logout = () => {
    console.log('UserContext logout called');
    // Clear all tokens and user data
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userData');
    // Clear user state
    setUser(null);
    console.log('UserContext: All data cleared, user state reset');
  };

  // Refresh function to reload user data
  const refreshUser = () => {
    console.log('UserContext refreshUser called');
    setLoading(true);
    loadUserFromStorage();
  };

  // Load user data from localStorage on component mount
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}; 