import React, { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from "react";
import { apiUtils, wishlistApi } from "../api";

type WishlistItem = {
  wishlistId: number;
  productId: number;
  productName: string;
  productPrice: number;
  productStatus?: string;
  productCount?: number;
  productCode?: number;
  createdAt: string;
};

type WishlistState = {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
};

type WishlistAction =
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_WISHLIST"; items: WishlistItem[] }
  | { type: "ADD_ITEM"; item: WishlistItem }
  | { type: "REMOVE_ITEM"; wishlistId: number }
  | { type: "CLEAR_WISHLIST" };

const initialState: WishlistState = { 
  items: [], 
  loading: false, 
  error: null 
};

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_WISHLIST":
      return { 
        ...state, 
        items: action.items,
        loading: false,
        error: null
      };
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.item],
      };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(item => item.wishlistId !== action.wishlistId) };
    case "CLEAR_WISHLIST":
      return { ...initialState };
    default:
      return state;
  }
}

const WishlistContext = createContext<{
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
  addToWishlist: (product: any) => Promise<void>;
  removeFromWishlist: (wishlistId: number) => Promise<void>;
  clearWishlist: () => Promise<void>;
  loadWishlist: () => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}>({ 
  state: initialState, 
  dispatch: () => null,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  clearWishlist: async () => {},
  loadWishlist: async () => {},
  isInWishlist: () => false,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const hasLoadedRef = React.useRef(false);

  const loadWishlist = useCallback(async () => {
    const userData = apiUtils.getUserData();
    const token = apiUtils.getToken();
    
    // Prevent multiple simultaneous calls
    if (state.loading) {
      console.log('Wishlist already loading, skipping duplicate call');
      return;
    }
    
    // Prevent multiple loads on re-renders
    if (hasLoadedRef.current && state.items.length > 0) {
      console.log('Wishlist already loaded, skipping duplicate load');
      return;
    }
    
    console.log('LoadWishlist Debug:', { 
      userData: userData ? { id: userData.id, name: userData.name } : null, 
      token: token ? 'Token exists' : 'No token', 
      isTokenValid: apiUtils.isTokenValid(),
      isLoggedIn: apiUtils.isLoggedIn()
    });
      
      if (!userData || !token) {
        console.log('No user data or token, skipping wishlist load');
        dispatch({ type: "SET_LOADING", loading: false });
        return;
      }

      // More lenient token validation - only check if token exists and user is logged in
      if (!apiUtils.isLoggedIn()) {
        console.log('User not logged in, skipping wishlist load');
        dispatch({ type: "SET_LOADING", loading: false });
        return;
      }

      dispatch({ type: "SET_LOADING", loading: true });
      try {
        console.log('Making wishlist API call for user ID:', userData.id);
        console.log('API URL will be:', `http://localhost:3000/wishlist/getWishListProducts/${userData.id}`);
        
        // Test API connectivity first
        try {
          const testResponse = await fetch('http://localhost:3000/', { method: 'GET' });
          console.log('Backend connectivity test:', testResponse.ok ? 'SUCCESS' : 'FAILED', testResponse.status);
        } catch (connectError) {
          console.warn('Backend connectivity test failed:', connectError);
        }
        
        // Test wishlist endpoint specifically
        try {
          const wishlistTestResponse = await fetch(`http://localhost:3000/wishlist/getWishListProducts/${userData.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('Wishlist endpoint test:', wishlistTestResponse.ok ? 'SUCCESS' : 'FAILED', wishlistTestResponse.status);
          if (!wishlistTestResponse.ok) {
            console.log('Wishlist endpoint error status:', wishlistTestResponse.status, wishlistTestResponse.statusText);
            const errorText = await wishlistTestResponse.text();
            console.log('Wishlist endpoint error response:', errorText);
          } else {
            const testData = await wishlistTestResponse.json();
            console.log('Wishlist endpoint test response:', testData);
          }
        } catch (wishlistTestError) {
          console.warn('Wishlist endpoint test failed:', wishlistTestError);
        }
        
        // Use the NestJS backend endpoint (which has database integration)
        console.log('Calling wishlistApi.getWishlistProducts with:', { userId: userData.id, token: token ? 'Present' : 'Missing' });
        
        let result;
        try {
          result = await wishlistApi.getWishlistProducts(userData.id, token);
          console.log('Wishlist API call successful');
        } catch (apiError) {
          console.error('Wishlist API call failed:', apiError);
          throw apiError;
        }
        
        console.log('Wishlist API Response Data:', result);
        console.log('Wishlist API Response Type:', typeof result);
        console.log('Wishlist API Response Keys:', result ? Object.keys(result) : 'No result');
        console.log('Wishlist API Response Length:', Array.isArray(result) ? result.length : 'Not an array');
          
        // Handle different possible response structures
        let items = [];
        
        // Log the raw result for debugging
        console.log('Raw API result:', result);
        console.log('Result type:', typeof result);
        console.log('Is array:', Array.isArray(result));
        
        if (result && result.data && Array.isArray(result.data)) {
          // Standard API response structure: { statusCode, message, data: [...] }
          items = result.data;
          console.log('Using result.data (standard API response)');
        } else if (Array.isArray(result)) {
          // Direct array response (NestJS backend returns this)
          items = result;
          console.log('Using direct array response (NestJS backend)');
        } else if (result && result.data && !Array.isArray(result.data)) {
          // Data exists but is not an array
          console.log('Data exists but is not an array:', result.data);
          items = [];
        } else if (result && typeof result === 'object') {
          // Try to find any array in the result object
          const resultObj = result as Record<string, any>;
          const arrayKeys = Object.keys(resultObj).filter(key => Array.isArray(resultObj[key]));
          if (arrayKeys.length > 0) {
            console.log('Found array keys:', arrayKeys);
            items = resultObj[arrayKeys[0]];
            console.log('Using first array found:', arrayKeys[0]);
          } else {
            console.log('No arrays found in result object');
            items = [];
          }
        } else {
          // No valid data structure
          console.log('No valid data structure found in response');
          items = [];
        }
          
        console.log('Processed Wishlist Data:', { items, itemCount: items.length });
          
        dispatch({ 
          type: "SET_WISHLIST", 
          items: items
        });
        
        // Mark as loaded to prevent duplicate loads
        hasLoadedRef.current = true;
      } catch (error) {
        console.error('Wishlist API Network Error:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        
        if (error instanceof Error && error.message.includes('401')) {
          console.log('Unauthorized - token may be expired');
          dispatch({ type: "SET_ERROR", error: "Your session has expired. Please login again." });
          // Don't automatically redirect on 401, let the user handle it
        } else {
          dispatch({ type: "SET_ERROR", error: "Network error loading wishlist" });
        }
        dispatch({ type: "SET_LOADING", loading: false });
      }
    }, [state.loading, state.items.length]); // Include dependencies

  const addToWishlist = async (product: any) => {
    const userData = apiUtils.getUserData();
    const token = apiUtils.getToken();
    
    if (!userData || !token) {
      dispatch({ type: "SET_ERROR", error: "Please login to add items to wishlist" });
      return;
    }

    if (!apiUtils.isLoggedIn()) {
      dispatch({ type: "SET_ERROR", error: "Your session has expired. Please login again." });
      return;
    }

    try {
      const result = await wishlistApi.addToWishlist(userData.id, product, token);
      console.log('Add to Wishlist Success:', result);
      await loadWishlist(); // Reload wishlist to get updated data
    } catch (error) {
      console.error('Add to Wishlist Network Error:', error);
      if (error instanceof Error && error.message.includes('Product already in wishlist')) {
        // This is not really an error, just inform the user
        console.log('Product already in wishlist - this is expected behavior');
        // Optionally reload wishlist to make sure it's up to date
        await loadWishlist();
      } else {
        dispatch({ type: "SET_ERROR", error: "Failed to add item to wishlist" });
      }
    }
  };

  const removeFromWishlist = async (wishlistId: number) => {
    const userData = apiUtils.getUserData();
    const token = apiUtils.getToken();
    
    if (!userData || !token) {
      return;
    }

    try {
      await wishlistApi.removeFromWishlist(wishlistId, userData.id, token);
      await loadWishlist(); // Reload wishlist to get updated data
    } catch (error) {
      console.error('Remove from Wishlist Error:', error);
      dispatch({ type: "SET_ERROR", error: "Failed to remove item from wishlist" });
    }
  };

  const clearWishlist = async () => {
    const userData = apiUtils.getUserData();
    const token = apiUtils.getToken();
    
    if (!userData || !token) {
      return;
    }

    try {
      await wishlistApi.clearWishlist(userData.id, token);
      dispatch({ type: "CLEAR_WISHLIST" });
    } catch (error) {
      console.error('Clear Wishlist Error:', error);
      dispatch({ type: "SET_ERROR", error: "Failed to clear wishlist" });
    }
  };

  const isInWishlist = (productId: number): boolean => {
    return state.items.some(item => item.productId === productId);
  };

  // Load wishlist automatically when the provider mounts and user is logged in
  useEffect(() => {
    const userData = apiUtils.getUserData();
    const token = apiUtils.getToken();
    
    if (userData && token && apiUtils.isLoggedIn() && !hasLoadedRef.current) {
      console.log('WishlistProvider mounted, auto-loading wishlist');
      loadWishlist();
    }
    
    // Cleanup function to reset loading state on unmount
    return () => {
      if (state.loading) {
        dispatch({ type: "SET_LOADING", loading: false });
      }
      // Clear any pending timeout
    };
  }, [loadWishlist, state.loading]); // Include loadWishlist and state.loading

  return (
    <WishlistContext.Provider value={{ 
      state, 
      dispatch, 
      addToWishlist, 
      removeFromWishlist, 
      clearWishlist, 
      loadWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}; 