import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { supabase, HotelRow } from '../lib/supabase';
import { ImageUpload } from "../components/ImageUpload";

type FormData = Omit<HotelRow, 'created_at' | 'updated_at'>;
function arrayField(value: string[]): string { return value.join('\n'); }
function parseArray(value: string): string[] { return value.split('\n').map(s => s.trim()).filter(Boolean); }

export function HotelsAdmin() {
  const [items, setItems] = useState<HotelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<HotelRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, setValue, control } = useForm<FormData>();

  const fetchItems = async () => {
    const { data } = await supabase.from('hotels').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { reset({ id: crypto.randomUUID(), rating: 4.0, reviews: 0, amenities_bn: [], amenities_en: [], phone: '' }); setEditing(null); setShowForm(true); };
  const openEdit = (item: HotelRow) => { reset(item); setEditing(item); setShowForm(true); };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    const now = new Date().toISOString();
    if (editing) { await supabase.from('hotels').update({ ...data, updated_at: now }).eq('id', editing.id); }
    else { await supabase.from('hotels').insert({ ...data, created_at: now, updated_at: now }); }
    await fetchItems();
    setShowForm(false);
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this hotel?')) return;
    await supabase.from('hotels').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Hotels & Accommodations</h1><p className="text-slate-400 text-sm mt-1">{items.length} listings</p></div>
        <button onClick={openNew} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">＋ Add Hotel</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex gap-4 hover:border-slate-700 transition-all">
              {item.image_url && (
                <img src={item.image_url} alt={item.name_en} className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-slate-800" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white truncate">{item.name_en}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">{item.type_en}</span>
                </div>
                <p className="text-slate-400 text-sm">📍 {item.distance_en}</p>
                <p className="text-slate-500 text-xs mt-1">⭐ {item.rating} · {item.price_en}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0 self-start">
                <button onClick={() => openEdit(item)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-all">✏️ Edit</button>
                <button onClick={() => deleteItem(item.id)} className="px-3 py-1.5 bg-slate-800 hover:bg-rose-600/30 hover:text-rose-400 text-slate-400 rounded-lg text-xs transition-all">🗑️</button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">🏨</p>
              <p className="text-slate-400">No hotels yet. Click "Add Hotel" to create your first listing.</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">{editing ? 'Edit Hotel' : 'New Hotel'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['name_en', 'Name (English)', 'text'],
                  ['name_bn', 'Name (Bengali)', 'text'],
                  ['type_en', 'Stay Type (English)', 'text'],
                  ['type_bn', 'Stay Type (Bengali)', 'text'],
                  ['distance_en', 'Distance (English)', 'text'],
                  ['distance_bn', 'Distance (Bengali)', 'text'],
                  ['price_en', 'Price (English)', 'text'],
                  ['price_bn', 'Price (Bengali)', 'text'],
                  ['rating', 'Rating (1-5)', 'number'],
                  ['reviews', 'Reviews', 'number'],
                  ['phone', 'Phone', 'text'],
                ].map(([name, label, type]) => (
                  <div key={name as string}>
                    <label className="block text-xs text-slate-400 mb-1">{label as string}</label>
                    <input
                      {...register(name as keyof FormData)}
                      type={type as string}
                      step={name === 'rating' ? '0.1' : name === 'reviews' ? '1' : undefined}
                      min={name === 'rating' ? '1' : name === 'reviews' ? '0' : undefined}
                      max={name === 'rating' ? '5' : undefined}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                ))}
              </div>
              <Controller
                control={control}
                name="image_url"
                render={({ field }) => (
                  <ImageUpload value={field.value || ''} onChange={field.onChange} folder="hotels" label="Hotel Image" />
                )}
              />
              {[
                ['amenities_en', 'Amenities (English, one per line)'],
                ['amenities_bn', 'Amenities (Bengali, one per line)'],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="block text-xs text-slate-400 mb-1">{label}</label>
                  <textarea
                    defaultValue={arrayField((editing as any)?.[name] ?? [])}
                    onChange={(e) => setValue(name as keyof FormData, parseArray(e.target.value) as any)}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 resize-none"
                    placeholder="Amenity 1&#10;Amenity 2"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {saving ? 'Saving...' : (editing ? 'Update Hotel' : 'Create Hotel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
