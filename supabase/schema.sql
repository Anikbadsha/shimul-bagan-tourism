-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Trip Inquiries
CREATE TABLE IF NOT EXISTS public.trip_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    guests INTEGER NOT NULL,
    date VARCHAR(255) NOT NULL,
    inquiry_type VARCHAR(50) NOT NULL,
    package_name VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new'
);

-- 2. Tour Packages
CREATE TABLE IF NOT EXISTS public.tour_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title_en VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255) NOT NULL,
    duration_en VARCHAR(255) NOT NULL,
    duration_bn VARCHAR(255) NOT NULL,
    price_en VARCHAR(255) NOT NULL,
    price_bn VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_bn TEXT NOT NULL,
    image_url TEXT NOT NULL,
    features_en TEXT[],
    features_bn TEXT[],
    popular BOOLEAN DEFAULT false,
    category VARCHAR(100) DEFAULT 'standard'
);

-- 3. Hotels
CREATE TABLE IF NOT EXISTS public.hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name_en VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    type_en VARCHAR(100) NOT NULL,
    type_bn VARCHAR(100) NOT NULL,
    distance_en VARCHAR(100) NOT NULL,
    distance_bn VARCHAR(100) NOT NULL,
    price_en VARCHAR(100) NOT NULL,
    price_bn VARCHAR(100) NOT NULL,
    rating NUMERIC(2, 1) NOT NULL,
    reviews INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    amenities_en TEXT[],
    amenities_bn TEXT[],
    phone VARCHAR(50)
);

-- 4. Gallery Items
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    url TEXT NOT NULL,
    caption_en TEXT,
    caption_bn TEXT,
    category VARCHAR(50) NOT NULL
);

-- 5. Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title_en VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_en VARCHAR(100) NOT NULL,
    category_bn VARCHAR(100) NOT NULL,
    author_en VARCHAR(100) NOT NULL,
    author_bn VARCHAR(100) NOT NULL,
    author_role_en VARCHAR(100),
    author_role_bn VARCHAR(100),
    published_date_en VARCHAR(100) NOT NULL,
    published_date_bn VARCHAR(100) NOT NULL,
    read_time_en VARCHAR(50) NOT NULL,
    read_time_bn VARCHAR(50) NOT NULL,
    cover_image TEXT,
    excerpt_en TEXT NOT NULL,
    excerpt_bn TEXT NOT NULL,
    content_en TEXT[],
    content_bn TEXT[],
    tags TEXT[]
);

-- 6. FAQ Items
CREATE TABLE IF NOT EXISTS public.faq_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    question_en TEXT NOT NULL,
    question_bn TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    answer_bn TEXT NOT NULL,
    category VARCHAR(50) NOT NULL
);

-- 7. Community Stories
CREATE TABLE IF NOT EXISTS public.community_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name_en VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    role_en VARCHAR(255) NOT NULL,
    role_bn VARCHAR(255) NOT NULL,
    years_of_experience_en VARCHAR(50),
    years_of_experience_bn VARCHAR(50),
    location_en VARCHAR(255),
    location_bn VARCHAR(255),
    quote_en TEXT NOT NULL,
    quote_bn TEXT NOT NULL,
    story_en TEXT,
    story_bn TEXT,
    avatar_url TEXT NOT NULL
);

-- 8. Local Foods
CREATE TABLE IF NOT EXISTS public.local_foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name_en VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_bn TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category_en VARCHAR(100) NOT NULL,
    category_bn VARCHAR(100) NOT NULL,
    where_to_find_en VARCHAR(255),
    where_to_find_bn VARCHAR(255),
    taste_note_en VARCHAR(255),
    taste_note_bn VARCHAR(255)
);

-- 9. Destinations
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name_en VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    subtitle_en VARCHAR(255) NOT NULL,
    subtitle_bn VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_bn TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    gallery_images TEXT[],
    distance_from_garden_en VARCHAR(100),
    distance_from_garden_bn VARCHAR(100),
    best_time_to_visit_en VARCHAR(100),
    best_time_to_visit_bn VARCHAR(100),
    highlights_en TEXT[],
    highlights_bn TEXT[],
    travel_tips_en TEXT[],
    travel_tips_bn TEXT[],
    coordinates JSONB,
    map_x INTEGER,
    map_y INTEGER,
    history_en TEXT,
    history_bn TEXT
);

-- Row Level Security (RLS)
ALTER TABLE public.trip_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.local_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- Policies for trip_inquiries (anon can insert, authenticated can read/update/delete)
CREATE POLICY "Anyone can insert inquiries" ON public.trip_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read inquiries" ON public.trip_inquiries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can update inquiries" ON public.trip_inquiries FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete inquiries" ON public.trip_inquiries FOR DELETE TO authenticated USING (true);

-- Policies for content tables (anyone can read, authenticated can write)
DO $$
DECLARE
    t_name text;
BEGIN
    FOR t_name IN SELECT unnest(ARRAY[
        'tour_packages', 'hotels', 'gallery_items', 'blog_posts',
        'faq_items', 'community_stories', 'local_foods', 'destinations'
    ])
    LOOP
        EXECUTE format('CREATE POLICY "Anyone can read %I" ON public.%I FOR SELECT USING (true)', t_name, t_name);
        EXECUTE format('CREATE POLICY "Authenticated can insert %I" ON public.%I FOR INSERT TO authenticated WITH CHECK (true)', t_name, t_name);
        EXECUTE format('CREATE POLICY "Authenticated can update %I" ON public.%I FOR UPDATE TO authenticated USING (true)', t_name, t_name);
        EXECUTE format('CREATE POLICY "Authenticated can delete %I" ON public.%I FOR DELETE TO authenticated USING (true)', t_name, t_name);
    END LOOP;
END;
$$;

-- Grant access for Data API
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT, UPDATE, DELETE ON TABLES TO authenticated;