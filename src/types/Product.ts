export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  category?: string;
  [key: string]: any;
} 