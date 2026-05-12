import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

// Server-side Supabase client with service role key (bypasses RLS)
let serviceClient: SupabaseClient | null = null;

// Public Supabase client with anon key (respects RLS)
let anonClient: SupabaseClient | null = null;

/**
 * Get the Supabase service client (admin access, bypasses RLS).
 * Use for server-side operations like creating users, admin queries, etc.
 */
export function getServiceClient(): SupabaseClient {
  if (!serviceClient) {
    if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
      throw new Error('Supabase URL and Service Role Key are required. Check your .env file.');
    }
    serviceClient = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return serviceClient;
}

/**
 * Get the Supabase anon client (public access, respects RLS).
 * Use for operations that should respect Row Level Security.
 */
export function getAnonClient(): SupabaseClient {
  if (!anonClient) {
    if (!env.supabaseUrl || !env.supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key are required. Check your .env file.');
    }
    anonClient = createClient(env.supabaseUrl, env.supabaseAnonKey);
  }
  return anonClient;
}

/**
 * Create a Supabase client with a user's JWT token.
 * This client respects RLS and acts as the authenticated user.
 */
export function getUserClient(accessToken: string): SupabaseClient {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key are required. Check your .env file.');
  }
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

/**
 * Storage bucket names used across the application.
 * Multiple buckets for different image categories.
 */
export const STORAGE_BUCKETS = {
  PROPERTY_IMAGES: 'property-images',
  USER_AVATARS: 'user-avatars',
  AGENT_IMAGES: 'agent-images',
  REVIEW_IMAGES: 'review-images',
} as const;
