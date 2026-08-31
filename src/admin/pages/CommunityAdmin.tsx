import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase, CommunityStoryRow } from '../lib/supabase';
import { ImageUpload } from "../components/ImageUpload";

type FormData = Omit<CommunityStoryRow, 'created_at' | 'updated_at'>;

export function CommunityAdmin() {
  const [items, setItems] = useState<CommunityStoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CommunityStoryRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();

  const fetchItems = async () => {
    const { data } = await supabase.from('community_stories').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { reset({ id: crypto.randomUUID() }); setEditing(null); setShowForm(true); };
  const openEdit = (item: CommunityStoryRow) => { reset(item); setEditing(item); setShowForm(true); };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    const now = new Date().toISOString();
    if (editing) { await supabase.from('community_stories').update({ ...data, updated_at: now }).eq('id', editing.id); }
    else { await supabase.from('community_stories').insert({ ...data, created_at: now, updated_at: now }); }
    await fetchItems();
    setShowForm(false);
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this story?')) return;
    await supabase.from('community_stories').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Community Stories</h1><p className="text-slate-400 text-sm mt-1">{items.length} voices</p></div>
        <button onClick={openNew} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium">＋ Add Story</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex gap-4 hover:border-slate-700 transition-all">
              <img src={item.avatar_url} alt={item.name_en} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 bg-slate-800" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect fill="%23334155" width="56" height="56" rx="12"/><text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" fill="%2364748b" font-size="24">👤</text></svg>'; }} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">{item.name_en}</p>
                <p className="text-slate-400 text-sm">{item.role_en} · {item.years_of_experience_en}</p>
                <p className="text-slate-500 text-xs mt-1 truncate">"{item.quote_en}"</p>
              </div>
              <div className="flex gap-2 flex-shrink-0 self-start">
                <button onClick={() => openEdit(item)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs">✏️</button>
                <button onClick={() => deleteItem(item.id)} className="px-3 py-1.5 bg-slate-800 hover:bg-rose-600/30 hover:text-rose-400 text-slate-400 rounded-lg text-xs">🗑️</button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">👥</p>
              <p className="text-slate-400">No community stories yet.</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">{editing ? 'Edit Story' : 'New Story'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['name_en', 'Name (English)'], ['name_bn', 'Name (Bengali)'],
                  ['role_en', 'Role (English)'], ['role_bn', 'Role (Bengali)'],
                  ['years_of_experience_en', 'Experience (English)'], ['years_of_experience_bn', 'Experience (Bengali)'],
                  ['location_en', 'Location (English)'], ['location_bn', 'Location (Bengali)'],
                  ['avatar_url', 'Avatar Image URL'],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-xs text-slate-400 mb-1">{label}</label>
                    <input {...register(name as keyof FormData)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500" />
                  </div>
                ))}
              </div>
              {[
                ['quote_en', 'Quote (English)', 2], ['quote_bn', 'Quote (Bengali)', 2],
                ['story_en', 'Full Story (English)', 4], ['story_bn', 'Full Story (Bengali)', 4],
              ].map(([name, label, rows]) => (
                <div key={name as string}>
                  <label className="block text-xs text-slate-400 mb-1">{label as string}</label>
                  <textarea {...register(name as keyof FormData)} rows={rows as number} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 resize-none" />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {saving ? 'Saving...' : (editing ? 'Update Story' : 'Add Story')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
