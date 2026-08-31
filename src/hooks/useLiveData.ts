import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function useLiveData<T>(tableName: string, fallback: T[], orderBy = 'created_at'): T[] {
  const [data, setData] = useState<T[]>(fallback);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!supabase) { setData(fallback); return; }
      const { data: rows, error } = await supabase.from(tableName).select('*').order(orderBy, { ascending: false });
      if (!cancelled && !error && rows?.length) setData(rows as T[]);
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
