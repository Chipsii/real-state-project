# Real Estate Dashboard - Project Context for GPT

---

## PROJECT SUMMARY
Full-stack real estate platform. Frontend: Next.js 16 + React 19 + Bootstrap 5. Backend: Express + TypeScript. Database: Supabase (PostgreSQL). Monorepo structure with both under `src/`.

---

## TECH STACK
| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js (App Router) | 16.1.1 |
| UI | React + Bootstrap 5 + SCSS | React 19.2.3 |
| Backend | Express + TypeScript | Express 4.x, TS 5.9.3 |
| Database | Supabase (PostgreSQL) | supabase-js 2.x |
| Auth | Supabase Auth (JWT) | Built-in |
| Storage | Supabase Storage | 4 buckets |
| Realtime | Supabase Realtime | WebSocket for messages |
| Validation | Joi | 17.x |
| File Upload | Multer → Supabase Storage | Memory storage |

---

## FILE STRUCTURE

### Frontend (`src/app/` + `src/components/`)
```
src/app/(property)/(dashboard)/    ← 9 dashboard page routes
  dashboard-home/page.js
  dashboard-add-property/page.js
  dashboard-my-properties/page.js
  dashboard-message/page.js
  dashboard-my-favourites/page.js
  dashboard-saved-search/page.js
  dashboard-reviews/page.js
  dashboard-my-package/page.js
  dashboard-my-profile/page.js

src/components/property/dashboard/  ← Dashboard UI components
  dashboard-home/          (TopStateBlock, RecentActivities, PropertyViews charts)
  dashboard-add-property/  (5-tab form: Description, Media, Location, Details, Amenities)
  dashboard-my-properties/ (PropertyDataTable, FilterHeader)
  dashboard-message/       (UserInboxList, UserChatBoxContent, ChatBoxForm)
  dashboard-my-favourites/ (ListingsFavourites)
  dashboard-saved-search/  (SearchDataTable)
  dashboard-reviews/       (AllReviews, SingleReview)
  dashboard-package/       (PackageDataTable)
  dashboard-profile/       (ProfileBox, PersonalInfo, SocialField, ChangePasswordForm)
```

### Backend (`src/backend/`)
```
src/backend/
  src/
    server.ts              ← Entry point (port 5000)
    config/supabase.ts     ← 3 client types: service, anon, user
    config/env.ts          ← Environment loader
    middleware/auth.ts     ← JWT verification via Supabase
    middleware/validate.ts ← Joi schema validator
    middleware/errorHandler.ts ← Global error handler
    routes/index.ts        ← Aggregator mounting 9 route modules
    routes/*.routes.ts     ← auth, profile, properties, dashboard, messages, favourites, reviews, savedSearch, packages
    controllers/*.controller.ts ← HTTP handlers
    services/*.service.ts  ← Business logic + DB queries
    validators/*.validator.ts ← Joi schemas
    types/index.ts         ← All TypeScript interfaces
    utils/apiResponse.ts   ← Standardized { success, data, meta, error }
    utils/pagination.ts    ← Offset pagination helpers
    utils/fileUpload.ts    ← Multer + Supabase Storage helpers
  supabase-migration.sql   ← Complete schema (12 tables + RPC + RLS + seeds)
```

---

## API ENDPOINTS (all prefixed `/api/v1`)

### Auth
- `POST /auth/register` — Register (Supabase Auth + users table)
- `POST /auth/login` — Login → returns JWT tokens
- `POST /auth/logout` — Invalidate session
- `POST /auth/refresh` — Refresh access token
- `POST /auth/change-password` — Change password (authenticated)

### Dashboard
- `GET /dashboard/stats` — Total properties, views, reviews, favourites
- `GET /dashboard/property-views?period=hourly|weekly|monthly` — Chart data
- `GET /dashboard/recent-activities?limit=10` — Activity feed

### Properties
- `GET /properties` — List with filters & pagination (public)
- `GET /properties/:id` — Single property with images & amenities (public)
- `GET /properties/user/my` — Current user's properties (auth)
- `POST /properties` — Create (auth)
- `PUT /properties/:id` — Update (auth, owner only)
- `DELETE /properties/:id` — Delete (auth, owner only)
- `POST /properties/:id/images` — Upload images (auth, owner)
- `DELETE /properties/:id/images/:imageId` — Delete image (auth, owner)

### Profile
- `GET /profile` — Get profile (auth)
- `PUT /profile` — Update personal info (auth)
- `PUT /profile/social` — Update social links (auth)
- `POST /profile/avatar` — Upload avatar (auth)
- `DELETE /profile/avatar` — Delete avatar (auth)

### Messages
- `GET /messages/conversations` — Inbox list (auth)
- `GET /messages/conversations/:userId` — Chat with user (auth)
- `POST /messages` — Send message (auth)
- `PUT /messages/:id/read` — Mark as read (auth)
- `GET /messages/unread-count` — Unread count (auth)
- `GET /messages/realtime-config` — Supabase Realtime subscription info (auth)

### Favourites
- `GET /favourites` — List favourites (auth)
- `POST /favourites/:propertyId` — Add to favourites (auth)
- `DELETE /favourites/:propertyId` — Remove (auth)

### Reviews
- `GET /reviews` — Reviews on user's properties (auth)
- `GET /reviews/property/:propertyId` — Property reviews (public)
- `POST /reviews` — Create review (auth)
- `POST /reviews/:id/helpful` — Vote helpful (public)
- `POST /reviews/:id/not-helpful` — Vote not helpful (public)

### Saved Searches
- `GET /saved-searches` — List (auth)
- `POST /saved-searches` — Create (auth)
- `PUT /saved-searches/:id` — Update (auth)
- `DELETE /saved-searches/:id` — Delete (auth)

### Packages
- `GET /packages` — List available packages (auth)
- `GET /packages/my` — User's current package (auth)
- `POST /packages/subscribe/:packageId` — Subscribe (auth)

---

## DATABASE TABLES
`users`, `properties`, `property_images`, `property_amenities`, `favourites`, `saved_searches`, `reviews`, `messages`, `packages`, `user_packages`, `activities`, `property_view_events`

## KEY PATTERNS
1. **Architecture**: Routes → Controllers → Services → Supabase
2. **Auth**: Supabase Auth JWT in `Authorization: Bearer <token>` header
3. **Validation**: Joi schemas strip unknown fields, return structured error arrays
4. **Responses**: Always `{ success: boolean, data?: T, meta?: PaginationMeta, error?: ApiError }`
5. **Ownership**: All mutations verify `user_id` matches authenticated user
6. **Activities**: Auto-logged for property creation, favouriting, reviews
7. **Realtime**: Messages table has Supabase Realtime enabled for live chat
8. **Storage**: 4 buckets — property-images, user-avatars, agent-images, review-images
