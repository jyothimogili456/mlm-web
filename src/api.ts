// Central API utility for main frontend
const BASE_URL = "http://localhost:3000"; // Backend API URL

// API Response Types
interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
}

interface User {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  address?: string;
  gender?: string;
  referral_code: string;
  referralCount: number;
  reward?: string;
  referred_by_code?: string;
  payment_status: 'PENDING' | 'PAID';
  status: string;
  created_at: string;
  updated_at: string;
  token?: string; // Optional token for login responses
}

interface LoginResponse {
  id: number;
  name: string;
  email: string;
  referral_code: string;
  referred_by?: string;
  payment_status: string;
  created_at: string;
  token: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  gender?: string;
  address?: string;
  referralCode?: string;
  referredByCode?: string;
  paymentStatus?: 'PENDING' | 'PAID';
  reward?: string;
  referralCount?: number;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ReferralStats {
  todayReferrals: number;
  monthReferrals: number;
  reward?: string;
  todayNextGoal?: string;
  monthNextGoal?: string;
}

// Generic API functions
export async function apiPost<T = any>(path: string, data: any, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(BASE_URL + path, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
    credentials: "include",
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Server error" }));
    throw new Error(errorData.message || "Server error");
  }
  
  return res.json();
}

export async function apiGet<T = any>(path: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(BASE_URL + path, {
    method: "GET",
    headers,
    credentials: "include",
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Server error" }));
    throw new Error(errorData.message || "Server error");
  }
  
  return res.json();
}

// User API functions
export const userApi = {
  // Register new user
  register: async (userData: RegisterRequest): Promise<ApiResponse<User>> => {
    return apiPost<ApiResponse<User>>('/api/users/createUsers', userData);
  },

  // Login user
  login: async (loginData: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiPost<ApiResponse<LoginResponse>>('/api/users/login', loginData);
  },

  // Get user by ID
  getUserById: async (userId: number, token: string): Promise<ApiResponse<User>> => {
    return apiGet<ApiResponse<User>>(`/api/users/getUserById/${userId}`, token);
  },

  // Get all users (admin only)
  getAllUsers: async (token: string): Promise<User[]> => {
    return apiGet<User[]>(`/api/users/all`, token);
  },

  // Get users referred by specific referral code
  getUsersReferredBy: async (referralCode: string, token: string): Promise<ApiResponse<User[]>> => {
    return apiGet<ApiResponse<User[]>>(`/api/users/referredBy/${referralCode}`, token);
  },

  // Get referral statistics
  getReferralStats: async (referralCode: string, token: string): Promise<ApiResponse<ReferralStats>> => {
    return apiGet<ApiResponse<ReferralStats>>(`/api/users/referral-stats/${referralCode}`, token);
  },

  // Update user details
  updateUser: async (userId: number, updates: Partial<User>, token: string): Promise<ApiResponse<User>> => {
    return apiPost<ApiResponse<User>>(`/api/users/updateUser/${userId}`, updates, token);
  },

  // Update user password
  updatePassword: async (userId: number, newPassword: string, token: string): Promise<ApiResponse<{ id: number }>> => {
    return apiPost<ApiResponse<{ id: number }>>(`/api/users/updatePassword/${userId}`, { newPassword }, token);
  },

  // Delete user
  deleteUser: async (userId: number, token: string): Promise<ApiResponse<{ id: number }>> => {
    return apiPost<ApiResponse<{ id: number }>>(`/api/users/delete/${userId}`, {}, token);
  },

  // Get wallet balance
  getWalletBalance: async (userId: number, token: string): Promise<ApiResponse<any>> => {
    return apiGet<ApiResponse<any>>(`/api/users/walletBalance/${userId}`, token);
  }
};

// Product API functions
export const productApi = {
  // Get all products
  getAllProducts: async (token?: string): Promise<ApiResponse<any[]>> => {
    return apiGet<ApiResponse<any[]>>('/product/all', token);
  },

  // Get product by ID
  getProductById: async (productId: number): Promise<ApiResponse<any>> => {
    return apiGet<ApiResponse<any>>(`/product/${productId}`);
  },

  // Place order
  placeOrder: async (orderData: { userId: number; productName: string; quantity?: number }): Promise<ApiResponse<any>> => {
    return apiPost<ApiResponse<any>>('/product/order', orderData);
  },

  // Get order history
  getOrderHistory: async (userId: number): Promise<ApiResponse<any[]>> => {
    return apiGet<ApiResponse<any[]>>(`/product/order-history/${userId}`);
  }
};

// FAQ API functions
export const faqApi = {
  // Get all FAQs
  getAllFaqs: async (token?: string): Promise<ApiResponse<any[]>> => {
    return apiGet<ApiResponse<any[]>>('/faq/getAllFaqs', token);
  }
};

// Cart API functions
export const cartApi = {
  addToCart: async (userId: number, productId: number, quantity: number = 1, token: string): Promise<ApiResponse<any>> => {
    return apiPost<ApiResponse<any>>(`/cart/add/${userId}`, { productId, quantity }, token);
  },
  getCart: async (userId: number, token: string): Promise<ApiResponse<any[]>> => {
    return apiGet<ApiResponse<any[]>>(`/cart/${userId}`, token);
  },
  getCartTotal: async (userId: number, token: string): Promise<ApiResponse<any>> => {
    return apiGet<ApiResponse<any>>(`/cart/total/${userId}`, token);
  },
  updateCartItem: async (cartId: number, userId: number, quantity: number, token: string): Promise<ApiResponse<any>> => {
    return apiPost<ApiResponse<any>>(`/cart/update/${cartId}/${userId}`, { quantity }, token);
  },
  removeFromCart: async (cartId: number, userId: number, token: string): Promise<ApiResponse<any>> => {
    return apiPost<ApiResponse<any>>(`/cart/remove/${cartId}/${userId}`, {}, token);
  },
  clearCart: async (userId: number, token: string): Promise<ApiResponse<any>> => {
    return apiPost<ApiResponse<any>>(`/cart/clear/${userId}`, {}, token);
  }
};

// Wishlist API functions
export const wishlistApi = {
  addToWishlist: async (userId: number, product: any, token: string): Promise<ApiResponse<any>> => {
    return apiPost<ApiResponse<any>>(`/wishlist/add/${userId}`, product, token);
  },
  getWishlist: async (userId: number, token: string): Promise<ApiResponse<any[]>> => {
    return apiGet<ApiResponse<any[]>>(`/wishlist/getWishListProducts/${userId}`, token);
  },
  getWishlistProducts: async (userId: number, token: string): Promise<ApiResponse<any[]>> => {
    return apiGet<ApiResponse<any[]>>(`/wishlist/getWishListProducts/${userId}`, token);
  },
  removeFromWishlist: async (wishlistId: number, userId: number, token: string): Promise<ApiResponse<any>> => {
    return apiPost<ApiResponse<any>>(`/wishlist/remove/${wishlistId}/${userId}`, {}, token);
  },
  clearWishlist: async (userId: number, token: string): Promise<ApiResponse<any>> => {
    return apiPost<ApiResponse<any>>(`/wishlist/clear/${userId}`, {}, token);
  },
  isInWishlist: async (userId: number, productId: number, token: string): Promise<ApiResponse<{ isInWishlist: boolean }>> => {
    return apiGet<ApiResponse<{ isInWishlist: boolean }>>(`/wishlist/check/${userId}/${productId}`, token);
  }
};

// Utility functions
export const apiUtils = {
  getToken: (): string | null => {
    return localStorage.getItem('userToken');
  },
  setToken: (token: string): void => {
    localStorage.setItem('userToken', token);
  },
  removeToken: (): void => {
    localStorage.removeItem('userToken');
  },
  isLoggedIn: (): boolean => {
    // Check for any valid token (user or admin)
    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');
    return !!(userToken || adminToken);
  },
  getUserData: (): any => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },
  setUserData: (userData: any): void => {
    localStorage.setItem('userData', JSON.stringify(userData));
  },
  removeUserData: (): void => {
    localStorage.removeItem('userData');
  },
  logout: (): void => {
    // Clear all tokens and user data
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userData');
    console.log('All tokens and user data cleared from localStorage');
  },
  logoutAndRedirect: (redirectTo: string = '/'): void => {
    // Clear all tokens and user data
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userData');
    console.log('All tokens and user data cleared, redirecting to:', redirectTo);
    window.location.href = redirectTo;
  },
  // New function to check token validity
  isTokenValid: (): boolean => {
    // Check both user and admin tokens
    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');
    const token = userToken || adminToken;
    
    if (!token) return false;
    
    try {
      // Decode JWT token (without verification, just to check expiration)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      console.log('Token Debug:', {
        exp: payload.exp,
        currentTime,
        isExpired: payload.exp < currentTime,
        tokenType: userToken ? 'userToken' : 'adminToken'
      });
      
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
}; 