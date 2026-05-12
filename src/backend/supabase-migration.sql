-- =====================================================
-- Real Estate Dashboard - Supabase SQL Migration
-- Run this in your Supabase SQL Editor
-- =====================================================

-- ──────────────────────────────────────
-- 1. USERS TABLE (profile data)
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  position TEXT,
  language TEXT,
  company_name TEXT,
  tax_number TEXT,
  address TEXT,
  about TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────
-- 2. PROPERTIES TABLE
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  listed_in TEXT DEFAULT 'Active',
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Published')),
  price NUMERIC NOT NULL DEFAULT 0,
  yearly_tax_rate NUMERIC,
  after_price_label TEXT,
  city TEXT,
  location TEXT,
  lat NUMERIC,
  lng NUMERIC,
  beds INTEGER DEFAULT 0,
  baths INTEGER DEFAULT 0,
  sqft INTEGER DEFAULT 0,
  property_type TEXT,
  year_built INTEGER,
  for_rent BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_properties_user_id ON public.properties(user_id);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_property_type ON public.properties(property_type);
CREATE INDEX idx_properties_price ON public.properties(price);

-- ──────────────────────────────────────
-- 3. PROPERTY IMAGES TABLE
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);

-- ──────────────────────────────────────
-- 4. PROPERTY AMENITIES TABLE
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.property_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  amenity_name TEXT NOT NULL
);

CREATE INDEX idx_property_amenities_property_id ON public.property_amenities(property_id);

-- ──────────────────────────────────────
-- 5. FAVOURITES TABLE
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.favourites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

CREATE INDEX idx_favourites_user_id ON public.favourites(user_id);
CREATE INDEX idx_favourites_property_id ON public.favourites(property_id);

-- ──────────────────────────────────────
-- 6. SAVED SEARCHES TABLE
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  search_criteria JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_searches_user_id ON public.saved_searches(user_id);

-- ──────────────────────────────────────
-- 7. REVIEWS TABLE
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

CREATE INDEX idx_reviews_property_id ON public.reviews(property_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);

-- ──────────────────────────────────────
-- 8. MESSAGES TABLE
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_conversation ON public.messages(sender_id, receiver_id, created_at);

-- ──────────────────────────────────────
-- 9. PACKAGES TABLE
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  max_properties INTEGER NOT NULL DEFAULT 0,
  max_featured INTEGER NOT NULL DEFAULT 0,
  max_renewals INTEGER NOT NULL DEFAULT 0,
  storage_mb INTEGER NOT NULL DEFAULT 0,
  price NUMERIC NOT NULL DEFAULT 0,
  billing_cycle TEXT DEFAULT 'monthly'
);

-- ──────────────────────────────────────
-- 10. USER PACKAGES TABLE
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  properties_used INTEGER DEFAULT 0,
  featured_used INTEGER DEFAULT 0,
  renewals_used INTEGER DEFAULT 0,
  storage_used_mb INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_packages_user_id ON public.user_packages(user_id);

-- ──────────────────────────────────────
-- 11. ACTIVITIES TABLE
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  highlight TEXT,
  icon TEXT DEFAULT 'flaticon-home',
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at DESC);

-- ──────────────────────────────────────
-- 12. PROPERTY VIEW EVENTS TABLE (for analytics)
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.property_view_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_property_view_events_user_id ON public.property_view_events(user_id);
CREATE INDEX idx_property_view_events_viewed_at ON public.property_view_events(viewed_at);

-- ════════════════════════════════════════
-- RPC FUNCTIONS (used by the backend)
-- ════════════════════════════════════════

-- Increment property view count
CREATE OR REPLACE FUNCTION increment_view_count(property_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.properties
  SET view_count = view_count + 1
  WHERE id = property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get average rating for a property
CREATE OR REPLACE FUNCTION get_property_avg_rating(prop_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  avg_rating NUMERIC;
BEGIN
  SELECT COALESCE(AVG(rating), 0) INTO avg_rating
  FROM public.reviews
  WHERE property_id = prop_id;
  RETURN ROUND(avg_rating, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment helpful count on a review
CREATE OR REPLACE FUNCTION increment_helpful_count(review_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.reviews
  SET helpful_count = helpful_count + 1
  WHERE id = review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment not helpful count on a review
CREATE OR REPLACE FUNCTION increment_not_helpful_count(review_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.reviews
  SET not_helpful_count = not_helpful_count + 1
  WHERE id = review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get conversations for a user (for inbox)
CREATE OR REPLACE FUNCTION get_conversations(current_user_id UUID)
RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  user_avatar TEXT,
  last_message TEXT,
  last_message_time TIMESTAMPTZ,
  unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH conversation_partners AS (
    SELECT DISTINCT
      CASE
        WHEN m.sender_id = current_user_id THEN m.receiver_id
        ELSE m.sender_id
      END AS partner_id
    FROM public.messages m
    WHERE m.sender_id = current_user_id OR m.receiver_id = current_user_id
  ),
  latest_messages AS (
    SELECT DISTINCT ON (cp.partner_id)
      cp.partner_id,
      m.content,
      m.created_at
    FROM conversation_partners cp
    JOIN public.messages m ON (
      (m.sender_id = current_user_id AND m.receiver_id = cp.partner_id) OR
      (m.sender_id = cp.partner_id AND m.receiver_id = current_user_id)
    )
    ORDER BY cp.partner_id, m.created_at DESC
  ),
  unread_counts AS (
    SELECT
      m.sender_id AS partner_id,
      COUNT(*) AS cnt
    FROM public.messages m
    WHERE m.receiver_id = current_user_id AND m.is_read = FALSE
    GROUP BY m.sender_id
  )
  SELECT
    u.id AS user_id,
    COALESCE(u.first_name || ' ' || u.last_name, u.username, u.email) AS user_name,
    u.avatar_url AS user_avatar,
    lm.content AS last_message,
    lm.created_at AS last_message_time,
    COALESCE(uc.cnt, 0) AS unread_count
  FROM conversation_partners cp
  JOIN public.users u ON u.id = cp.partner_id
  JOIN latest_messages lm ON lm.partner_id = cp.partner_id
  LEFT JOIN unread_counts uc ON uc.partner_id = cp.partner_id
  ORDER BY lm.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ════════════════════════════════════════
-- SEED DATA: Default packages
-- ════════════════════════════════════════

INSERT INTO public.packages (name, max_properties, max_featured, max_renewals, storage_mb, price, billing_cycle)
VALUES
  ('Free', 5, 2, 7, 20, 0, 'monthly'),
  ('Basic', 20, 5, 15, 100, 29.99, 'monthly'),
  ('Professional', 50, 15, 30, 500, 79.99, 'monthly'),
  ('Enterprise', 999, 50, 100, 2000, 199.99, 'monthly')
ON CONFLICT DO NOTHING;

-- ════════════════════════════════════════
-- REALTIME: Enable for messages table
-- ════════════════════════════════════════

-- Enable realtime for the messages table (for live chat)
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ════════════════════════════════════════
-- STORAGE: Create buckets
-- Run these in the Supabase Dashboard > Storage
-- or use the Supabase CLI
-- ════════════════════════════════════════

-- Note: Storage buckets should be created via the Supabase Dashboard:
-- 1. property-images (public)
-- 2. user-avatars (public)
-- 3. agent-images (public)
-- 4. review-images (public)

-- ════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) Policies
-- ════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_view_events ENABLE ROW LEVEL SECURITY;

-- Users: users can read all profiles, update their own
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Properties: anyone can read, owners can CUD
CREATE POLICY "Properties are viewable by everyone" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Users can insert own properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own properties" ON public.properties FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own properties" ON public.properties FOR DELETE USING (auth.uid() = user_id);

-- Property images: anyone can read, owners can CUD
CREATE POLICY "Property images viewable by everyone" ON public.property_images FOR SELECT USING (true);
CREATE POLICY "Property owners can manage images" ON public.property_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND user_id = auth.uid())
);

-- Property amenities: anyone can read, owners can CUD
CREATE POLICY "Amenities viewable by everyone" ON public.property_amenities FOR SELECT USING (true);
CREATE POLICY "Property owners can manage amenities" ON public.property_amenities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND user_id = auth.uid())
);

-- Favourites: users can manage their own
CREATE POLICY "Users can view own favourites" ON public.favourites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favourites" ON public.favourites FOR ALL USING (auth.uid() = user_id);

-- Saved searches: users can manage their own
CREATE POLICY "Users can manage own saved searches" ON public.saved_searches FOR ALL USING (auth.uid() = user_id);

-- Reviews: anyone can read, authenticated users can create
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Messages: participants can view their messages
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Receivers can update messages" ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);

-- Packages: anyone can read
CREATE POLICY "Packages viewable by everyone" ON public.packages FOR SELECT USING (true);

-- User packages: users can view own
CREATE POLICY "Users can view own packages" ON public.user_packages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can subscribe to packages" ON public.user_packages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activities: users can view own
CREATE POLICY "Users can view own activities" ON public.activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert activities" ON public.activities FOR INSERT WITH CHECK (true);

-- Property view events
CREATE POLICY "View events readable by property owner" ON public.property_view_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND user_id = auth.uid())
);
CREATE POLICY "Anyone can insert view events" ON public.property_view_events FOR INSERT WITH CHECK (true);
