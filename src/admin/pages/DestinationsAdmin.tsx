import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase, DestinationRow } from '../lib/supabase';

type FormData = Omit<DestinationRow, 'created_at' | 'updated_at'>;
function parseArray(v: string): string[] { return v.split('\n').map(s => s.trim()).filter(Boolean); }
function arrayField(v: string[]): string { return (v ?? []).join('\n'); }

const categories = ['garden', 'river', 'hills', 'lake', 'wetland', 'heritage'];

export function DestinationsAdmin() {
  const [items, setItems] = useState<DestinationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DestinationRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm<FormData>();

  const fetchItems = async () => {
    const { data } = await supabase.from('destinations').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => {
    reset({ id: crypto.randomUUID(), category: 'garden', gallery_images: [], highlights_bn: [], highlights_en: [], travel_tips_bn: [], travel_tips_en: [], coordinates: { lat: 25.0, lng: 91.0, elevation: '0m' }, map_x: 50, map_y: 50, history_bn: null, history_en: null });
    setEditing(null); setShowForm(true);
  };
  const openEdit = (item: DestinationRow) => { reset(item); setEditing(item); setShowForm(true); };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    const now = new Date().toISOString();
    if (editing) { await supabase.from('destinations').update({ ...data, updated_at: now }).eq('id', editing.id); }
    else { await supabase.from('destinations').insert({ ...data, created_at: now, updated_at: now }); }
    await fetchItems();
    setShowForm(false);
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this destination?')) return;
    await supabase.from('destinations').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const catColors: Record<string, string> = {
    garden: 'bg-rose-600/20 text-rose-400',
    river: 'bg-blue-600/20 text-blue-400',
    hills: 'bg-orange-600/20 text-orange-400',
    lake: 'bg-cyan-600/20 text-cyan-400',
    wetland: 'bg-emerald-600/20 text-emerald-400',
    heritage: 'bg-purple-600/20 text-purple-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Destinations</h1><p className="text-slate-400 text-sm mt-1">{items.length} places</p></div>
        <button onClick={openNew} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium">＋ Add Destination</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex gap-4 hover:border-slate-700 transition-all">
              {item.image_url && <img src={item.image_url} alt={item.name_en} className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-slate-800" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{item.name_en}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${catColors[item.category] || ''}`}>{item.category}</span>
                </div>
                <p className="text-slate-400 text-sm truncate">{item.subtitle_en}</p>
                <p className="text-slate-500 text-xs mt-1">{item.distance_from_garden_en}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0 self-start">
                <button onClick={() => openEdit(item)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs">✏️ Edit</button>
                <button onClick={() => deleteItem(item.id)} className="px-3 py-1.5 bg-slate-800 hover:bg-rose-600/30 hover:text-rose-400 text-slate-400 rounded-lg text-xs">🗑️</button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">📍</p>
              <p className="text-slate-400">No destinations yet.</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">{editing ? 'Edit Destination' : 'New Destination'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['name_en', 'Name (English)'], ['name_bn', 'Name (Bengali)'],
                  ['slug', 'Slug'], ['subtitle_en', 'Subtitle (English)'],
                  ['subtitle_bn', 'Subtitle (Bengali)'], ['image_url', 'Image URL'],
                  ['distance_from_garden_en', 'Distance (English)'], ['distance_from_garden_bn', 'Distance (Bengali)'],
                  ['best_time_to_visit_en', 'Best Time (English)'], ['best_time_to_visit_bn', 'Best Time (Bengali)'],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-xs text-slate-400 mb-1">{label}</label>
                    <input {...register(name as keyof FormData)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select {...register('category')} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {[
                ['description_en', 'Description (English)', 3], ['description_bn', 'Description (Bengali)', 3],
              ].map(([name, label, rows]) => (
                <div key={name as string}>
                  <label className="block text-xs text-slate-400 mb-1">{label as string}</label>
                  <textarea {...register(name as keyof FormData)} rows={rows as number} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 resize-none" />
                </div>
              ))}

              {[
                ['highlights_en', 'Highlights (English, one per line)'],
                ['highlights_bn', 'Highlights (Bengali, one per line)'],
                ['travel_tips_en', 'Travel Tips (English, one per line)'],
                ['travel_tips_bn', 'Travel Tips (Bengali, one per line)'],
                ['gallery_images', 'Gallery Image URLs (one per line)'],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="block text-xs text-slate-400 mb-1">{label}</label>
                  <textarea
                    defaultValue={arrayField((editing as any)?.[name] ?? [])}
                    onChange={(e) => setValue(name as keyof FormData, parseArray(e.target.value) as any)}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {saving ? 'Saving...' : (editing ? 'Update Destination' : 'Add Destination')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
