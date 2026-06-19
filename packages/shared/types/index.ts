// Shared types for ExpenseForge iOS and Web apps

export type UserNiche = 'contractor' | 'real_estate_agent' | 'other';
export type OAuthProvider = 'google' | 'facebook' | 'linkedin';

export interface User {
  id: string;
  email: string;
  name: string | null;
  niche: UserNiche;
  oauth_provider: OAuthProvider | null;
  oauth_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Receipt {
  id: string;
  user_id: string;
  vendor_name: string | null;
  amount: number;
  currency: string;
  category: string | null;
  date: string;
  image_url: string | null;
  extracted_data: Record<string, any> | null;
  is_processed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  receipt_id: string | null;
  amount: number;
  currency: string;
  category: string;
  description: string | null;
  date: string;
  is_tax_deductible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Mileage {
  id: string;
  user_id: string;
  date: string;
  kilometers: number;
  purpose: string | null;
  deduction_rate: number; // CRA rate
  created_at: string;
  updated_at: string;
}

export interface TaxSummary {
  id: string;
  user_id: string;
  year: number;
  total_expenses: number;
  total_mileage: number;
  mileage_deduction: number;
  tax_deductible_expenses: number;
  generated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Niche-specific category constants
export const CONTRACTOR_CATEGORIES = [
  'Equipment',
  'Tools',
  'Vehicle',
  'Fuel',
  'Software',
  'Office',
  'Training',
  'Insurance',
  'Utilities',
  'Other',
];

export const REAL_ESTATE_AGENT_CATEGORIES = [
  'Vehicle - Mileage',
  'Vehicle - Maintenance',
  'Vehicle - Fuel',
  'Office Supplies',
  'Technology',
  'Marketing',
  'Professional Development',
  'Insurance',
  'Meals & Entertainment',
  'Property Fees',
  'Other',
];

export const OTHER_CATEGORIES = [
  'Travel',
  'Equipment',
  'Software',
  'Office',
  'Professional Services',
  'Training',
  'Other',
];

export function getCategoriesByNiche(niche: UserNiche): string[] {
  switch (niche) {
    case 'contractor':
      return CONTRACTOR_CATEGORIES;
    case 'real_estate_agent':
      return REAL_ESTATE_AGENT_CATEGORIES;
    default:
      return OTHER_CATEGORIES;
  }
}

