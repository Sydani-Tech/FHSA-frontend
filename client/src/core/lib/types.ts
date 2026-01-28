export interface User {
  id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role: "business_user" | "admin";
  status: "pending" | "approved" | "restricted";
  business_name?: string | null;
  phone?: string | null;
  location?: string | null;
  production_focus?: string | null;
  certifications?: string[] | null;
  needs?: string[] | null;
  created_at?: string;
  login_count?: number;
}

export interface UserCreate {
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  role?: "business_user" | "admin";
  business_name?: string;
  phone?: string;
  location?: string;
  production_focus?: string;
  certifications?: string[];
  needs?: string[];
}

export interface LoginData {
  username: string; // Changed from email to match Login form usage
  password: string;
}

export interface UserProfileUpdate {
  business_name?: string;
  phone?: string;
  location?: string;
  production_focus?: string;
  certifications?: string[];
  needs?: string[];
}

export interface UserUpdate {
  status?: "pending" | "approved" | "restricted";
  business_name?: string;
  phone?: string;
  location?: string;
  production_focus?: string;
  certifications?: string[];
  needs?: string[];
}

export interface Asset {
  id: number;
  name: string;
  type: string;
  location: string;
  description?: string | null;
  specs?: Record<string, any> | null;
  images?: string[] | null;
  cost: string;
  duration_options?: string[] | null;
  availability?: Record<string, any> | null;
  active: boolean;
  total_quantity: number;
  available_quantity?: number; // Calculated field
  owner_id?: number | null;
}

export interface AssetCreate {
  name: string;
  type: string;
  location: string;
  description?: string;
  specs?: Record<string, any>;
  images?: string[];
  cost: string;
  duration_options?: string[];
  availability?: Record<string, any>;
  active?: boolean;
  total_quantity?: number;
  owner_id?: number | null;
}

export interface AssetUpdate {
  name?: string;
  type?: string;
  location?: string;
  description?: string;
  specs?: Record<string, any>;
  images?: string[];
  cost?: string;
  duration_options?: string[];
  availability?: Record<string, any>;
  active?: boolean;
  total_quantity?: number;
}

// Bookings
export interface BookingAudit {
  id: number;
  booking_id: number;
  action: string;
  details?: Record<string, any> | null;
  performed_by_id: number;
  timestamp: string;
}

export interface Payment {
  id: number;
  booking_id: number;
  reference: string;
  amount: string;
  status: string;
  currency: string;
  created_at: string;
}

export interface PaymentCreate {
  amount: string;
  method: string;
}

export interface Feedback {
  id: number;
  booking_id: number;
  asset_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Booking {
  id: number;
  reference_code: string;
  user_id: number;
  asset_id: number;
  dates: {
    start: string;
    end: string;
  };
  quantity: number;
  purpose: string;
  notes?: string;
  payment_status: "unpaid" | "paid" | "refunded";
  status:
    | "pending"
    | "awaiting_payment"
    | "paid"
    | "in_possession"
    | "returned"
    | "overdue"
    | "cancelled"
    | "rejected";
  created_at: string;
  updated_at?: string;
  audits?: BookingAudit[];
  payments?: Payment[]; // Added payments list
  feedback?: Feedback; // Added feedback
  user?: User;
  asset?: Asset;
}

export interface BookingCreate {
  asset_id: number;
  dates: {
    start: string;
    end: string;
  };
  quantity?: number;
  purpose: string;
  notes?: string;
}

export interface BookingUpdateStatus {
  status: string;
}


export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}
