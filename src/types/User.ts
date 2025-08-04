export interface User {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
  referralCode: string;
  profileImage?: string;
  referrals?: string[];
  [key: string]: any;
} 