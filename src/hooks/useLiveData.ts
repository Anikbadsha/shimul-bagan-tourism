import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Client-side cache: { data, timestamp }
const dataCache = new Map<string, { data: unknown[]; ts: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function mapRowGeneric(row: Record<string, any>): Record<string, any> {
  const mapped: Record<string, any> = { id: row.id };
  for (const [key, val] of Object.entries(row)) {
    if (key === 'id') continue;
    mapped[snakeToCamel(key)] = val;
  }
  return mapped;
}

// Select only columns actually used by the public site per table
const TABLE_COLUMNS: Record<string, string> = {
  hotels: 'id,name_bn,name_en,type_bn,type_en,distance_bn,distance_en,price_bn,price_en,rating,reviews,image_url,amenities_bn,amenities_en',
  gallery_items: 'id,url,caption_en,caption_bn,category',
  tour_packages: 'id,title_bn,title_en,duration_bn,duration_en,price_bn,price_en,description_bn,description_en,features_bn,features_en,popular,category,image_url',
  blog_posts: 'id,title_bn,title_en,slug,category_bn,category_en,author_bn,author_en,author_role_bn,author_role_en,published_date_bn,published_date_en,read_time_bn,read_time_en,cover_image,excerpt_bn,excerpt_en,content_bn,content_en,tags',
  faq_items: 'id,question_bn,question_en,answer_bn,answer_en,category',
  community_stories: 'id,name_bn,name_en,role_bn,role_en,years_of_experience_bn,years_of_experience_en,quote_bn,quote_en,story_bn,story_en,location_bn,location_en,avatar_url',
  local_foods: 'id,name_bn,name_en,description_bn,description_en,image_url,category_bn,category_en,where_to_find_bn,where_to_find_en,taste_note_bn,taste_note_en',
  destinations: 'id,slug,name_bn,name_en,subtitle_bn,subtitle_en,description_bn,description_en,category,image_url,distance_from_garden_bn,distance_from_garden_en,best_time_to_visit_bn,best_time_to_visit_en,highlights_bn,highlights_en',
};

const TABLE_MAPPERS: Record<string, (row: Record<string, any>) => Record<string, any>> = {
  hotels: (row) => {
    const m = mapRowGeneric(row);
    m.stayTypeBn = row.type_bn;
    m.stayTypeEn = row.type_en;
    m.locationBn = row.distance_bn;
    m.locationEn = row.distance_en;
    m.priceIndicatorBn = row.price_bn;
    m.priceIndicatorEn = row.price_en;
    m.contactNoteBn = 'ফোনে বুকিং করুন।';
    m.contactNoteEn = 'Book via phone.';
    m.priceCategory = 'mid';
    m.distanceToShimulBn = row.distance_bn;
    m.distanceToShimulEn = row.distance_en;
    return m;
  },
  gallery_items: (row) => {
    const m = mapRowGeneric(row);
    m.imageUrl = row.url;
    m.titleBn = row.caption_bn;
    m.titleEn = row.caption_en;
    m.locationBn = '';
    m.locationEn = '';
    m.photographer = '';
    m.aspectRatio = 'landscape';
    return m;
  },
  tour_packages: (row) => {
    const m = mapRowGeneric(row);
    m.priceNoteBn = row.price_bn;
    m.priceNoteEn = row.price_en;
    m.tagBn = row.category;
    m.tagEn = row.category;
    m.inclusionsBn = row.features_bn || [];
    m.inclusionsEn = row.features_en || [];
    m.destinations = row.features_en || [];
    m.subtitleBn = row.description_bn;
    m.subtitleEn = row.description_en;
    return m;
  },
};

function mapRow(tableName: string, row: Record<string, any>): Record<string, any> {
  const mapper = TABLE_MAPPERS[tableName];
  return mapper ? mapper(row) : mapRowGeneric(row);
}

export function useLiveData<T extends Record<string, any>>(tableName: string, fallback: T[], orderBy = 'created_at'): T[] {
  const [data, setData] = useState<T[]>(fallback);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!supabase) { setData(fallback); return; }

      // Check client-side cache
      const cached = dataCache.get(tableName);
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        if (!cancelled) setData(cached.data as T[]);
        return;
      }

      const columns = TABLE_COLUMNS[tableName] || '*';
      const { data: rows, error } = await supabase.from(tableName).select(columns).order(orderBy, { ascending: false });
      if (!cancelled && !error && rows?.length) {
        const mapped = rows.map((r) => mapRow(tableName, r) as T);
        dataCache.set(tableName, { data: mapped, ts: Date.now() });
        setData(mapped);
      }
    })();
    return () => { cancelled = true; };
  }, [tableName]);
  return data;
}

export async function submitTripInquiry(data: Record<string, unknown>) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('trip_inquiries').insert(data);
  if (error) throw error;
}
