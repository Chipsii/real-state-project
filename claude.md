# Real Estate Dashboard - Project Context for Claude

## Project Overview
This is a **Next.js real estate platform** ("Homez") with a full-featured dashboard for property management. The project uses a **monorepo structure** with the frontend (Next.js + JS) and backend (Express + TypeScript) co-located under `src/`.

## Tech Stack
- **Frontend**: Next.js 16, React 19, Bootstrap 5, SCSS, Swiper, Recharts, React Select
- **Backend**: Express 4, TypeScript, Node.js
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Auth**: Supabase Auth (JWT tokens)
- **Storage**: Supabase Storage (4 buckets: property-images, user-avatars, agent-images, review-images)
- **Realtime**: Supabase Realtime for live messaging

## Project Structure
```
real-state-project/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (home)/             # 10 home page variants (home-v1 to home-v10)
│   │   ├── (listing)/          # Property listing views (grid, list, map)
│   │   ├── (property)/
│   │   │   ├── (dashboard)/    # 9 dashboard pages (main target)
│   │   │   ├── (agents)/       # Agent listing/detail pages
│   │   │   └── (single-style)/ # Property detail page variants
│   │   ├── (pages)/            # Static pages (about, contact, FAQ, login, pricing)
│   │   ├── (blog)/             # Blog pages
│   │   └── register/           # Registration page
│   ├── components/             # React components organized by feature
│   │   ├── common/             # Shared components (header, footer, mobile menu)
│   │   ├── home/               # Home page components (10 variants)
│   │   ├── listing/            # Listing page components
│   │   ├── property/           # Property-related components
│   │   │   ├── dashboard/      # ★ Dashboard components (main focus)
│   │   │   ├── agents/         # Agent components
│   │   │   └── property-single-style/
│   │   ├── pages/              # Static page components
│   │   └── blog/               # Blog components
│   ├── data/                   # Mock data files (listings.js, agents.js, etc.)
│   ├── utilis/                 # Frontend utilities
│   └── backend/                # ★ Express TypeScript backend
│       ├── src/
│       │   ├── server.ts       # Entry point (port 5000)
│       │   ├── config/         # Supabase client, env config
│       │   ├── middleware/     # Auth, validation, error handling
│       │   ├── routes/         # Express route definitions
│       │   ├── controllers/    # Request handlers
│       │   ├── services/       # Business logic
│       │   ├── validators/     # Joi validation schemas
│       │   ├── utils/          # API response, pagination, file upload
│       │   └── types/          # TypeScript type definitions
│       └── supabase-migration.sql  # Database schema
```

## Dashboard Pages & Their Backend Mappings

| Dashboard Page | Route | Component | API Endpoint |
|---|---|---|---|
| Dashboard Home | `/dashboard-home` | TopStateBlock, RecentActivities, PropertyViews | `GET /api/v1/dashboard/stats`, `/recent-activities`, `/property-views` |
| Add Property | `/dashboard-add-property` | AddPropertyTabContent (5 tabs) | `POST /api/v1/properties` |
| My Properties | `/dashboard-my-properties` | PropertyDataTable, FilterHeader | `GET /api/v1/properties/user/my` |
| Messages | `/dashboard-message` | UserInboxList, UserChatBoxContent | `GET /api/v1/messages/conversations`, `/conversations/:userId` |
| My Favourites | `/dashboard-my-favourites` | ListingsFavourites | `GET /api/v1/favourites` |
| Saved Search | `/dashboard-saved-search` | SearchDataTable | `GET /api/v1/saved-searches` |
| Reviews | `/dashboard-reviews` | AllReviews, SingleReview | `GET /api/v1/reviews` |
| My Package | `/dashboard-my-package` | PackageDataTable | `GET /api/v1/packages/my` |
| My Profile | `/dashboard-my-profile` | ProfileBox, PersonalInfo, SocialField, ChangePasswordForm | `GET/PUT /api/v1/profile` |

## Database Schema (12 tables)
`users`, `properties`, `property_images`, `property_amenities`, `favourites`, `saved_searches`, `reviews`, `messages`, `packages`, `user_packages`, `activities`, `property_view_events`

## Architecture Pattern
Routes → Controllers → Services → Supabase Client

- **Routes**: Define HTTP endpoints, apply middleware (auth, validation)
- **Controllers**: Handle HTTP request/response, call services
- **Services**: Business logic, Supabase queries
- **Validators**: Joi schemas matching frontend form fields
- **Middleware**: JWT auth via Supabase, Joi validation, error handling

## API Response Format
```json
{ "success": true, "data": {...}, "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 } }
```

## Key Conventions
- All API routes prefixed with `/api/v1`
- Backend runs on port 5000, frontend on port 3000
- Supabase service client bypasses RLS for admin operations
- All CRUD operations verify resource ownership before mutation
- Activities are auto-created for key user actions (property created, favourited, reviewed)
- Messages support Supabase Realtime for live WebSocket delivery
- File uploads use multer memory storage → Supabase Storage
