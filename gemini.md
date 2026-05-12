# Real Estate Dashboard - Project Context for Gemini

## What Is This Project?
A full-stack real estate platform built with **Next.js 16** (frontend) and **Express + TypeScript** (backend) in a monorepo. Uses **Supabase** for database, auth, storage, and realtime messaging. The frontend is a template called "Homez" with 10 home page variants and a 9-page property management dashboard.

## Quick Start
```bash
# Frontend (port 3000)
npm run dev

# Backend (port 5000)
cd src/backend && npm run dev
```

## Directory Map
- `src/app/` — Next.js pages (App Router with route groups)
- `src/components/` — React components by feature area
- `src/data/` — Mock data (listings, agents, blogs, etc.)
- `src/backend/` — Express API server (TypeScript)
  - `src/backend/src/routes/` — 9 route modules + index aggregator
  - `src/backend/src/controllers/` — HTTP request handlers
  - `src/backend/src/services/` — Business logic + Supabase queries
  - `src/backend/src/validators/` — Joi validation schemas
  - `src/backend/src/middleware/` — Auth (Supabase JWT), validation, error handling
  - `src/backend/src/config/` — Supabase client setup, env loader
  - `src/backend/src/types/` — TypeScript interfaces for all entities
  - `src/backend/supabase-migration.sql` — Complete DB schema (12 tables)

## Core API Modules (all under `/api/v1`)

### Auth (`/auth`)
Register, login, logout, refresh token, change password — all via Supabase Auth.

### Dashboard (`/dashboard`)
Stats aggregation (total properties/views/reviews/favourites), property view analytics (hourly/weekly/monthly for charts), recent activity feed.

### Properties (`/properties`)
Full CRUD with filtering (search, category, city, price range, beds, baths, sqft, rent/sale, featured). Image upload via Supabase Storage. Amenity management. Ownership verification on all mutations.

### Profile (`/profile`)
Get/update personal info, social links. Avatar upload/delete via Supabase Storage `user-avatars` bucket.

### Messages (`/messages`)
Conversation listing (inbox), chat history, send message, mark as read, unread count. **Supabase Realtime** enabled on the messages table for live WebSocket delivery.

### Favourites (`/favourites`)
Add/remove/list favourited properties. Auto-creates activity for property owners when their listing is favourited.

### Reviews (`/reviews`)
CRUD with helpful/not-helpful voting (via Supabase RPC). Average rating calculation per property.

### Saved Searches (`/saved-searches`)
CRUD for user's saved search criteria (stored as JSONB).

### Packages (`/packages`)
List available subscription packages, get user's current package with usage stats, subscribe to a package.

## Database Schema
12 tables: `users`, `properties`, `property_images`, `property_amenities`, `favourites`, `saved_searches`, `reviews`, `messages`, `packages`, `user_packages`, `activities`, `property_view_events`

5 RPC functions: `increment_view_count`, `get_property_avg_rating`, `increment_helpful_count`, `increment_not_helpful_count`, `get_conversations`

4 storage buckets: `property-images`, `user-avatars`, `agent-images`, `review-images`

## Frontend-Backend Data Mapping
The frontend currently uses hardcoded arrays in components (e.g., `statisticsData` in TopStateBlock, `propertyData` in PropertyDataTable). The backend API returns data in the same shape so the frontend can swap mock data for API calls with minimal refactoring.

## Patterns to Follow
- Use the Routes → Controllers → Services architecture
- Always validate with Joi before processing
- Return standardized `{ success, data, meta, error }` responses
- Use `authMiddleware` for protected routes
- Create `activities` entries for user-facing events
- Verify resource ownership before any mutation
