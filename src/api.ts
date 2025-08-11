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
  wallet_balance?: number;
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

interface BankDetails {
  id: number;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolderName: string;
  redeemAmount: number;
  redeemStatus: 'processing' | 'deposited';
  created_at: string;
  updated_at: string;
  user: User;
}

interface BankDetailsRequest {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  redeemAmount?: number;
  redeemStatus?: 'processing' | 'deposited';
}

interface BankDetailsValidationResponse {
  isValid: boolean;
  errors: any[];
}

interface Payout {
  id: number;
  userId: number;
  payoutId: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'processing';
  description: string;
  bankDetails: string;
  transactionId?: string;
  date: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    mobileNumber: string;
    referral_code: string;
  };
}

interface Payment {
  id: number;
  userId: number;
  orderId: string;
  paymentId?: string;
  amount: string;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  receipt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
    mobileNumber: string;
    referral_code: string;
  };
}

interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  pendingAmount: number;
  paidAmount: number;
  failedAmount: number;
  refundedAmount: number;
}

interface PayoutStats {
  totalPayouts: number;
  totalAmount: number;
  pendingAmount: number;
  completedAmount: number;
  processingAmount: number;
  failedAmount: number;
}

interface CreatePayoutRequest {
  userId: number;
  payoutId: string;
  amount: number;
  method: string;
  status?: 'pending' | 'completed' | 'failed' | 'processing';
  description: string;
  bankDetails: string;
  transactionId?: string;
}

interface UpdatePayoutRequest {
  status?: 'pending' | 'completed' | 'failed' | 'processing';
  transactionId?: string;
  description?: string;
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
  
  const url = BASE_URL + path;
  console.log('apiGet called with URL:', url, 'headers:', headers);
  
  const res = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });
  
  console.log('apiGet response status:', res.status, 'ok:', res.ok);
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Server error" }));
    console.log('apiGet error data:', errorData);
    throw new Error(errorData.message || "Server error");
  }
  
  const data = await res.json();
  console.log('apiGet response data:', data);
  return data;
}

export async function apiPut<T = any>(path: string, data: any, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(BASE_URL + path, {
    method: "PUT",
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

export async function apiDelete<T = any>(path: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(BASE_URL + path, {
    method: "DELETE",
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

// Bank Details API functions
export const bankDetailsApi = {
  // Get bank details for a user
  getBankDetails: async (userId: number, token: string): Promise<ApiResponse<BankDetails>> => {
    return apiGet<ApiResponse<BankDetails>>(`/api/bankDetails/getBankDetails/${userId}`, token);
  },

  // Create bank details for a user
  createBankDetails: async (userId: number, bankDetails: BankDetailsRequest, token: string): Promise<ApiResponse<BankDetails>> => {
    return apiPost<ApiResponse<BankDetails>>(`/api/bankDetails/createBankDetails/${userId}`, bankDetails, token);
  },

  // Update bank details for a user
  updateBankDetails: async (userId: number, bankDetails: BankDetailsRequest, token: string): Promise<ApiResponse<BankDetails>> => {
    return apiPut<ApiResponse<BankDetails>>(`/api/bankDetails/updateBankDetails/${userId}`, bankDetails, token);
  },

  // Create or update bank details for a user
  createOrUpdateBankDetails: async (userId: number, bankDetails: BankDetailsRequest, token: string): Promise<ApiResponse<BankDetails>> => {
    return apiPost<ApiResponse<BankDetails>>(`/api/bankDetails/createOrUpdateBankDetails/${userId}`, bankDetails, token);
  },

  // Delete bank details for a user
  deleteBankDetails: async (userId: number, token: string): Promise<ApiResponse<any>> => {
    return apiPost<ApiResponse<any>>(`/api/bankDetails/deleteBankDetails/${userId}`, {}, token);
  },

  // Check if bank details exist for a user
  checkBankDetails: async (userId: number, token: string): Promise<ApiResponse<{ hasBankDetails: boolean }>> => {
    return apiGet<ApiResponse<{ hasBankDetails: boolean }>>(`/api/bankDetails/checkBankDetails/${userId}`, token);
  },

  // Validate bank details without saving
  validateBankDetails: async (bankDetails: BankDetailsRequest, token: string): Promise<ApiResponse<BankDetailsValidationResponse>> => {
    return apiPost<ApiResponse<BankDetailsValidationResponse>>('/api/bankDetails/validateBankDetails', bankDetails, token);
  },

  // Get all bank details with users and status
  getAllBankDetailsWithUsers: async (token: string): Promise<ApiResponse<BankDetails[]>> => {
    return apiGet<ApiResponse<BankDetails[]>>('/api/bankDetails/getAllBankDetailsWithUsers', token);
  },

  // Update redeem status for a user
  updateRedeemStatus: async (userId: number, status: 'processing' | 'deposited', token: string): Promise<ApiResponse<BankDetails>> => {
    return apiPut<ApiResponse<BankDetails>>(`/api/bankDetails/updateRedeemStatus/${userId}`, { status }, token);
  },

  // Update redeem amount for a user
  updateRedeemAmount: async (userId: number, redeemAmount: number, token: string): Promise<ApiResponse<BankDetails>> => {
    return apiPut<ApiResponse<BankDetails>>(`/api/bankDetails/updateRedeemAmount/${userId}`, { redeemAmount }, token);
  },

  // Get redeem history for a user
  getRedeemHistory: async (userId: number, token: string): Promise<ApiResponse<any[]>> => {
    return apiGet<ApiResponse<any[]>>(`/api/bankDetails/redeemHistory/${userId}`, token);
  }
};

// Product API functions
export const productApi = {
  // Get all products
  getAllProducts: async (): Promise<ApiResponse<any[]>> => {
    return apiGet<ApiResponse<any[]>>('/product/all');
  },

  // Get product by ID
  getProductById: async (productId: number): Promise<ApiResponse<any>> => {
    return apiGet<ApiResponse<any>>(`/product/${productId}`);
  },

  // Place order
  placeOrder: async (orderData: { userId: number; productName: string; quantity?: number }, token: string): Promise<ApiResponse<any>> => {
    return apiPost<ApiResponse<any>>('/product/order', orderData, token);
  },

  // Get order history
  getOrderHistory: async (userId: number, token?: string): Promise<ApiResponse<any[]>> => {
    return apiGet<ApiResponse<any[]>>(`/product/order-history/${userId}`, token);
  }
};

// FAQ API functions
export const faqApi = {
  // Get all FAQs
  getAllFaqs: async (token?: string): Promise<ApiResponse<any[]>> => {
    return apiGet<ApiResponse<any[]>>('/faq/getAllFaqs', token);
  }
};

// Privacy Policy API functions
export const privacyApi = {
  // Get all privacy policies
  getAllPrivacy: async (): Promise<ApiResponse<any[]>> => {
    return apiGet<ApiResponse<any[]>>('/privacy');
  },

  // Get active privacy policy
  getActivePrivacy: async (): Promise<ApiResponse<any>> => {
    return apiGet<ApiResponse<any>>('/privacy/active');
  },

  // Get privacy policy by ID
  getPrivacyById: async (id: number): Promise<ApiResponse<any>> => {
    return apiGet<ApiResponse<any>>(`/privacy/${id}`);
  }
};

// Terms & Conditions API functions
export const termsApi = {
  // Get all terms and conditions
  getAllTerms: async (): Promise<ApiResponse<any[]>> => {
    return apiGet<ApiResponse<any[]>>('/terms');
  },

  // Get active terms and conditions
  getActiveTerms: async (): Promise<ApiResponse<any>> => {
    return apiGet<ApiResponse<any>>('/terms/active');
  },

  // Get terms and conditions by ID
  getTermsById: async (id: number): Promise<ApiResponse<any>> => {
    return apiGet<ApiResponse<any>>(`/terms/${id}`);
  }
};

// Cart API functions
export const cartApi = {
  addToCart: async (userId: number, productId: number, quantity: number = 1, token: string): Promise<ApiResponse<any>> => {
    return apiPost<ApiResponse<any>>(`/cart/add/${userId}`, { productId, quantity }, token);
  },
  getCartItems: async (userId: number, token: string): Promise<ApiResponse<any[]>> => {
    return apiGet<ApiResponse<any[]>>(`/cart/getCartItems/${userId}`, token);
  },
  getCartTotal: async (userId: number, token: string): Promise<ApiResponse<any>> => {
    return apiGet<ApiResponse<any>>(`/cart/total/${userId}`, token);
  },
  updateCartItemQuantity: async (cartId: number, userId: number, quantity: number, token: string): Promise<ApiResponse<any>> => {
    return apiPut<ApiResponse<any>>(`/cart/updateQuantity/${cartId}/${userId}`, { quantity }, token);
  },
  removeFromCart: async (cartId: number, userId: number, token: string): Promise<ApiResponse<any>> => {
    return apiDelete<ApiResponse<any>>(`/cart/remove/${cartId}/${userId}`, token);
  },
  clearCart: async (userId: number, token: string): Promise<ApiResponse<any>> => {
    return apiDelete<ApiResponse<any>>(`/cart/clear/${userId}`, token);
  },
  isInCart: async (userId: number, productId: number, token: string): Promise<ApiResponse<{ isInCart: boolean }>> => {
    return apiGet<ApiResponse<{ isInCart: boolean }>>(`/cart/check/${userId}/${productId}`, token);
  },
  getCartCount: async (userId: number, token: string): Promise<ApiResponse<any>> => {
    return apiGet<ApiResponse<any>>(`/cart/count/${userId}`, token);
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
    return apiDelete<ApiResponse<any>>(`/wishlist/remove/${wishlistId}/${userId}`, token);
  },
  clearWishlist: async (userId: number, token: string): Promise<ApiResponse<any>> => {
    return apiDelete<ApiResponse<any>>(`/wishlist/clear/${userId}`, token);
  },
  isInWishlist: async (userId: number, productId: number, token: string): Promise<ApiResponse<{ isInWishlist: boolean }>> => {
    return apiGet<ApiResponse<{ isInWishlist: boolean }>>(`/wishlist/check/${userId}/${productId}`, token);
  }
};

// Razorpay API functions
export const razorpayApi = {
  createOrder: async (orderData: { user_id: number; amount: number; receipt?: string; notes?: Record<string, string> }, token: string): Promise<ApiResponse<any>> => {
    return apiPost<ApiResponse<any>>('/api/payments/create-order', orderData, token);
  }
};

// Payouts API functions
export const payoutsApi = {
  createPayout: async (payoutData: CreatePayoutRequest, token: string): Promise<ApiResponse<Payout>> => {
    return apiPost<ApiResponse<Payout>>('/payouts', payoutData, token);
  },
  getPayoutsByUserId: async (userId: number, token: string): Promise<ApiResponse<Payout[]>> => {
    console.log('Calling getPayoutsByUserId with userId:', userId, 'token:', token ? 'Present' : 'Missing');
    const result = await apiGet<ApiResponse<Payout[]>>(`/payouts/user/${userId}`, token);
    console.log('getPayoutsByUserId result:', result);
    return result;
  },
  getAllPayoutsWithUsers: async (token: string): Promise<ApiResponse<Payout[]>> => {
    return apiGet<ApiResponse<Payout[]>>('/payouts/all', token);
  },
  getPayoutStatsByUserId: async (userId: number, token: string): Promise<ApiResponse<PayoutStats>> => {
    return apiGet<ApiResponse<PayoutStats>>(`/payouts/stats/${userId}`, token);
  },
  getPayoutById: async (payoutId: string, token: string): Promise<ApiResponse<Payout>> => {
    return apiGet<ApiResponse<Payout>>(`/payouts/${payoutId}`, token);
  },
  updatePayoutStatus: async (payoutId: string, updateData: UpdatePayoutRequest, token: string): Promise<ApiResponse<Payout>> => {
    return apiPut<ApiResponse<Payout>>(`/payouts/${payoutId}/status`, updateData, token);
  }
};

// Payments API functions
export const paymentsApi = {
  getPaymentsByUserId: async (userId: number, token: string): Promise<ApiResponse<Payment[]>> => {
    return apiGet<ApiResponse<Payment[]>>(`/payments/user/${userId}`, token);
  },
  getAllPaymentsWithUsers: async (token: string): Promise<ApiResponse<Payment[]>> => {
    return apiGet<ApiResponse<Payment[]>>('/payments/all', token);
  },
  getPaymentStatsByUserId: async (userId: number, token: string): Promise<ApiResponse<PaymentStats>> => {
    return apiGet<ApiResponse<PaymentStats>>(`/payments/stats/${userId}`, token);
  },
  getPaymentById: async (paymentId: number, token: string): Promise<ApiResponse<Payment>> => {
    return apiGet<ApiResponse<Payment>>(`/payments/${paymentId}`, token);
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