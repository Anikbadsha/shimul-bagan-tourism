import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      tour_packages: { Row: TourPackageRow; Insert: TourPackageRow; Update: Partial<TourPackageRow> };
      hotels: { Row: HotelRow; Insert: HotelRow; Update: Partial<HotelRow> };
      blog_posts: { Row: BlogPostRow; Insert: BlogPostRow; Update: Partial<BlogPostRow> };
      gallery_items: { Row: GalleryItemRow; Insert: GalleryItemRow; Update: Partial<GalleryItemRow> };
      community_stories: { Row: CommunityStoryRow; Insert: CommunityStoryRow; Update: Partial<CommunityStoryRow> };
      faq_items: { Row: FaqItemRow; Insert: FaqItemRow; Update: Partial<FaqItemRow> };
      local_foods: { Row: LocalFoodRow; Insert: LocalFoodRow; Update: Partial<LocalFoodRow> };
      destinations: { Row: DestinationRow; Insert: DestinationRow; Update: Partial<DestinationRow> };
      trip_inquiries: { Row: TripInquiryRow; Insert: TripInquiryRow; Update: Partial<TripInquiryRow> };
    };
  };
};

export interface TourPackageRow {
  id: string;
  title_bn: string;
  title_en: string;
  subtitle_bn: string;
  subtitle_en: string;
  duration_bn: string;
  duration_en: string;
  destinations: string[];
  highlights_bn: string[];
  highlights_en: string[];
  inclusions_bn: string[];
  inclusions_en: string[];
  exclusions_bn: string[];
  exclusions_en: string[];
  ideal_for_bn: string;
  ideal_for_en: string;
  price_note_bn: string;
  price_note_en: string;
  tag_bn: string | null;
  tag_en: string | null;
  created_at: string;
  updated_at: string;
}

export interface HotelRow {
  id: string;
  name_bn: string;
  name_en: string;
  location_bn: string;
  location_en: string;
  stay_type_bn: string;
  stay_type_en: string;
  price_category: 'budget' | 'mid' | 'premium';
  price_indicator_bn: string;
  price_indicator_en: string;
  rating: number;
  distance_to_shimul_bn: string;
  distance_to_shimul_en: string;
  amenities_bn: string[];
  amenities_en: string[];
  image_url: string;
  contact_note_bn: string;
  contact_note_en: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPostRow {
  id: string;
  slug: string;
  title_bn: string;
  title_en: string;
  excerpt_bn: string;
  excerpt_en: string;
  content_bn: string[];
  content_en: string[];
  author_bn: string;
  author_en: string;
  author_role_bn: string;
  author_role_en: string;
  published_date_bn: string;
  published_date_en: string;
  read_time_bn: string;
  read_time_en: string;
  category_bn: string;
  category_en: string;
  cover_image: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface GalleryItemRow {
  id: string;
  title_bn: string;
  title_en: string;
  category: string;
  image_url: string;
  location_bn: string;
  location_en: string;
  caption_bn: string;
  caption_en: string;
  photographer: string;
  aspect_ratio: 'landscape' | 'portrait' | 'square';
  created_at: string;
  updated_at: string;
}

export interface CommunityStoryRow {
  id: string;
  name_bn: string;
  name_en: string;
  role_bn: string;
  role_en: string;
  years_of_experience_bn: string;
  years_of_experience_en: string;
  quote_bn: string;
  quote_en: string;
  story_bn: string;
  story_en: string;
  location_bn: string;
  location_en: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface FaqItemRow {
  id: string;
  category: string;
  question_bn: string;
  question_en: string;
  answer_bn: string;
  answer_en: string;
  created_at: string;
  updated_at: string;
}

export interface LocalFoodRow {
  id: string;
  name_bn: string;
  name_en: string;
  category_bn: string;
  category_en: string;
  description_bn: string;
  description_en: string;
  image_url: string;
  where_to_find_bn: string;
  where_to_find_en: string;
  taste_note_bn: string;
  taste_note_en: string;
  created_at: string;
  updated_at: string;
}

export interface DestinationRow {
  id: string;
  slug: string;
  name_bn: string;
  name_en: string;
  subtitle_bn: string;
  subtitle_en: string;
  description_bn: string;
  description_en: string;
  history_bn: string | null;
  history_en: string | null;
  category: string;
  image_url: string;
  gallery_images: string[];
  distance_from_garden_bn: string;
  distance_from_garden_en: string;
  best_time_to_visit_bn: string;
  best_time_to_visit_en: string;
  highlights_bn: string[];
  highlights_en: string[];
  travel_tips_bn: string[];
  travel_tips_en: string[];
  coordinates: { lat: number; lng: number; elevation: string };
  map_x: number;
  map_y: number;
  created_at: string;
  updated_at: string;
}

export interface TripInquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  travel_date: string;
  travelers_count: string;
  selected_package: string | null;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}
