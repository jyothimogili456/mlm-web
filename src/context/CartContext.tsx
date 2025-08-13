import React, { createContext, useContext, useReducer, ReactNode, useCallback } from "react";
import { apiUtils } from "../api";

type CartItem = {
  cartId: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  productStatus?: string;
  productCount?: number;
  productCode?: number;
  productPhoto?: string;
  productDescription?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  userName?: string;
  userEmail?: string;
};

type CartState = {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  total: number;
  itemCount: number;
};

type CartAction =
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_CART"; items: CartItem[]; total: number; itemCount: number }
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "UPDATE_ITEM"; id: number; quantity: number }
  | { type: "REMOVE_ITEM"; id: number }
  | { type: "CLEAR_CART" };

const initialState: CartState = { 
  items: [], 
  loading: false, 
  error: null, 
  total: 0, 
  itemCount: 0 
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_CART":
      return { 
        ...state, 
        items: action.items, 
        total: action.total, 
        itemCount: action.itemCount,
        loading: false,
        error: null
      };
    case "ADD_ITEM":
      const existingItem = state.items.find(item => item.productId === action.item.productId);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === action.item.productId
              ? { ...item, quantity: item.quantity + action.item.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.item],
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map(item =>
          item.cartId === action.id ? { ...item, quantity: action.quantity } : item
        ),
      };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(item => item.cartId !== action.id) };
    case "CLEAR_CART":
      return { ...initialState };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (cartId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
}>({ 
  state: initialState, 
  dispatch: () => null,
  addToCart: async () => {},
  updateCartItem: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  loadCart: async () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const loadCart = useCallback(async () => {
    const userData = apiUtils.getUserData();
    const token = apiUtils.getToken();
    
    console.log('LoadCart Debug:', { 
      userData: userData ? { id: userData.id, name: userData.name } : null, 
      token: token ? 'Token exists' : 'No token', 
      isTokenValid: apiUtils.isTokenValid(),
      isLoggedIn: apiUtils.isLoggedIn()
    });
    
    if (!userData || !token) {
      console.log('No user data or token, skipping cart load');
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
      // Get cart items
      const cartResponse = await fetch(`http://localhost:3000/cart/getCartItems/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Cart Items API Response Status:', cartResponse.status);
      
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        console.log('Cart Items API Response Data:', cartData);
        
        // Get cart total
        const totalResponse = await fetch(`http://localhost:3000/cart/total/${userData.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        let total = 0;
        if (totalResponse.ok) {
          const totalData = await totalResponse.json();
          total = totalData.data?.cartTotal || totalData.cartTotal || 0;
        }
        
        // Process cart items
        const items = cartData.data || cartData || [];
        const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
        
        console.log('Processed Cart Data:', { items, total, itemCount });
        
        dispatch({ 
          type: "SET_CART", 
          items: items, 
          total: total, 
          itemCount: itemCount 
        });
      } else {
        const errorText = await cartResponse.text();
        console.error('Cart API Error:', cartResponse.status, errorText);
        
        if (cartResponse.status === 401) {
          console.log('Unauthorized - token may be expired');
          dispatch({ type: "SET_ERROR", error: "Your session has expired. Please login again." });
          apiUtils.logoutAndRedirect('/login');
        } else {
          dispatch({ type: "SET_ERROR", error: `Failed to load cart: ${cartResponse.status}` });
        }
      }
    } catch (error) {
      console.error('Cart API Network Error:', error);
      dispatch({ type: "SET_ERROR", error: "Network error loading cart" });
    }
  }, [dispatch]);

  const addToCart = useCallback(async (productId: number, quantity: number = 1) => {
    const userData = apiUtils.getUserData();
    const token = apiUtils.getToken();
    
    console.log('Add to Cart Debug:', { 
      userData, 
      token: token ? 'Token exists' : 'No token', 
      isTokenValid: apiUtils.isTokenValid(),
      productId, 
      quantity 
    });
    
    if (!userData || !token) {
      dispatch({ type: "SET_ERROR", error: "Please login to add items to cart" });
      return;
    }

    if (!apiUtils.isTokenValid()) {
      dispatch({ type: "SET_ERROR", error: "Your session has expired. Please login again." });
      apiUtils.logoutAndRedirect('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/cart/add/${userData.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      console.log('Add to Cart Response Status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Add to Cart Success:', result);
        await loadCart(); // Reload cart to get updated data
      } else {
        const errorText = await response.text();
        console.error('Add to Cart Error:', response.status, errorText);
        
        if (response.status === 401) {
          // Token might be expired or invalid
          dispatch({ type: "SET_ERROR", error: "Authentication failed. Please login again." });
          apiUtils.logoutAndRedirect('/login');
        } else {
          dispatch({ type: "SET_ERROR", error: `Failed to add item to cart: ${response.status}` });
        }
      }
    } catch (error) {
      console.error('Add to Cart Network Error:', error);
      dispatch({ type: "SET_ERROR", error: "Network error adding to cart" });
    }
  }, [loadCart]);

  const updateCartItem = useCallback(async (cartId: number, quantity: number) => {
    const userData = apiUtils.getUserData();
    const token = apiUtils.getToken();
    
    if (!userData || !token) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/cart/updateQuantity/${cartId}/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await loadCart(); // Reload cart to get updated data
      } else {
        dispatch({ type: "SET_ERROR", error: "Failed to update cart item" });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", error: "Network error" });
    }
  }, [loadCart]);

  const removeFromCart = useCallback(async (cartId: number) => {
    const userData = apiUtils.getUserData();
    const token = apiUtils.getToken();
    
    if (!userData || !token) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/cart/remove/${cartId}/${userData.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await loadCart(); // Reload cart to get updated data
      } else {
        dispatch({ type: "SET_ERROR", error: "Failed to remove item from cart" });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", error: "Network error" });
    }
  }, [loadCart]);

  const clearCart = useCallback(async () => {
    const userData = apiUtils.getUserData();
    const token = apiUtils.getToken();
    
    if (!userData || !token) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/cart/clear/${userData.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        dispatch({ type: "CLEAR_CART" });
      } else {
        dispatch({ type: "SET_ERROR", error: "Failed to clear cart" });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", error: "Network error" });
    }
  }, [dispatch]);

  // Don't automatically load cart on mount - only load when explicitly requested
  // This prevents 401 errors when browsing products without being logged in

  return (
    <CartContext.Provider value={{ 
      state, 
      dispatch, 
      addToCart, 
      updateCartItem, 
      removeFromCart, 
      clearCart, 
      loadCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}; 