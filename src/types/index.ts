export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string;
  price: number;
  image_url: string;
  supplier: string | null;
  supplier_sku: string | null;
  featured: boolean;
  in_stock: boolean;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  stripe_session_id: string | null;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_email: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface CustomOrder {
  id: string;
  user_id: string;
  product_type: string;
  title: string;
  description: string;
  quantity: number;
  budget: number | null;
  deadline: string | null;
  artwork_url: string | null;
  artwork_filename: string | null;
  artwork_content_type: string | null;
  status: string;
  supplier: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  company: string | null;
  phone: string | null;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
