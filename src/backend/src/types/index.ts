// Custom types for the backend API

import { Request } from 'express';

/**
 * Authenticated request - extends Express Request with user info
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
  accessToken?: string;
}

/**
 * Standardized API response format
 */
export interface ApiResponseData<T = any> {
  success: boolean;
  data?: T;
  meta?: PaginationMeta;
  error?: ApiError;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Pagination query parameters
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Property filter options (matching frontend filter UI)
 */
export interface PropertyFilters {
  search?: string;
  category?: string;
  status?: string;
  listedIn?: string;
  city?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  maxBeds?: number;
  minBaths?: number;
  maxBaths?: number;
  minSqft?: number;
  maxSqft?: number;
  forRent?: boolean;
  featured?: boolean;
  amenities?: string[];
  yearBuilt?: number;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalProperties: number;
  totalViews: number;
  totalReviews: number;
  totalFavourites: number;
}

/**
 * Message conversation preview
 */
export interface ConversationPreview {
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'online' | 'away' | 'busy' | 'none';
}

/**
 * Database table row types (matching Supabase schema)
 */
export interface UserRow {
  id: string;
  email: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  position: string | null;
  language: string | null;
  company_name: string | null;
  tax_number: string | null;
  address: string | null;
  about: string | null;
  avatar_url: string | null;
  social_links: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  listed_in: string | null;
  status: string;
  price: number;
  yearly_tax_rate: number | null;
  after_price_label: string | null;
  city: string | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  beds: number;
  baths: number;
  sqft: number;
  property_type: string | null;
  year_built: number | null;
  for_rent: boolean;
  tags: string[] | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyImageRow {
  id: string;
  property_id: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
}

export interface FavouriteRow {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface SavedSearchRow {
  id: string;
  user_id: string;
  title: string;
  search_criteria: Record<string, any>;
  created_at: string;
}

export interface ReviewRow {
  id: string;
  user_id: string;
  property_id: string;
  rating: number;
  comment: string;
  image_urls: string[] | null;
  helpful_count: number;
  not_helpful_count: number;
  created_at: string;
}

export interface MessageRow {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface PackageRow {
  id: string;
  name: string;
  max_properties: number;
  max_featured: number;
  max_renewals: number;
  storage_mb: number;
  price: number;
  billing_cycle: string;
}

export interface UserPackageRow {
  id: string;
  user_id: string;
  package_id: string;
  properties_used: number;
  featured_used: number;
  renewals_used: number;
  storage_used_mb: number;
  expires_at: string;
  created_at: string;
}

export interface ActivityRow {
  id: string;
  user_id: string;
  type: string;
  description: string;
  highlight: string | null;
  icon: string;
  reference_id: string | null;
  created_at: string;
}
