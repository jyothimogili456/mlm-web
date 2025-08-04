import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
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

  const loadWishlist = async () => {
    const userData = apiUtils.getUserData();
    const token = apiUtils.getToken();
    
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

    if (!apiUtils.isTokenValid()) {
      console.log('Token is invalid, redirecting to login');
      dispatch({ type: "SET_ERROR", error: "Your session has expired. Please login again." });
      apiUtils.logoutAndRedirect('/login');
      return;
    }

    dispatch({ type: "SET_LOADING", loading: true });
    try {
      console.log('Making wishlist API call for user ID:', userData.id);
      const result = await wishlistApi.getWishlistProducts(userData.id, token);
      console.log('Wishlist API Response Data:', result);
      
      // Handle different possible response structures
      let items = [];
      if (result.data) {
        items = result.data || [];
      } else if (Array.isArray(result)) {
        items = result;
      } else {
        items = [];
      }
      
      console.log('Processed Wishlist Data:', { items, itemCount: items.length });
      
      dispatch({ 
        type: "SET_WISHLIST", 
        items: items
      });
    } catch (error) {
      console.error('Wishlist API Network Error:', error);
      if (error instanceof Error && error.message.includes('401')) {
        console.log('Unauthorized - token may be expired');
        dispatch({ type: "SET_ERROR", error: "Your session has expired. Please login again." });
        apiUtils.logoutAndRedirect('/login');
      } else {
        dispatch({ type: "SET_ERROR", error: "Network error loading wishlist" });
      }
    }
  };

  const addToWishlist = async (product: any) => {
    const userData = apiUtils.getUserData();
    const token = apiUtils.getToken();
    
    if (!userData || !token) {
      dispatch({ type: "SET_ERROR", error: "Please login to add items to wishlist" });
      return;
    }

    if (!apiUtils.isTokenValid()) {
      dispatch({ type: "SET_ERROR", error: "Your session has expired. Please login again." });
      apiUtils.logoutAndRedirect('/login');
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

  // Load wishlist on mount if user is logged in
  useEffect(() => {
    if (apiUtils.isLoggedIn()) {
      loadWishlist();
    }
  }, []);

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