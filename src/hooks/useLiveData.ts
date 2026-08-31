import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
      const { data: rows, error } = await supabase.from(tableName).select('*').order(orderBy, { ascending: false });
      if (!cancelled && !error && rows?.length) {
        setData(rows.map((r) => mapRow(tableName, r) as T));
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
