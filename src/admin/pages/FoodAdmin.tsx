import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase, LocalFoodRow } from '../lib/supabase';
import { ImageUpload } from "../components/ImageUpload";

type FormData = Omit<LocalFoodRow, 'created_at' | 'updated_at'>;

export function FoodAdmin() {
  const [items, setItems] = useState<LocalFoodRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<LocalFoodRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm<FormData>();

  const fetchItems = async () => {
    const { data } = await supabase.from('local_foods').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { reset({ id: crypto.randomUUID() }); setEditing(null); setShowForm(true); };
  const openEdit = (item: LocalFoodRow) => { reset(item); setEditing(item); setShowForm(true); };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    const now = new Date().toISOString();
    if (editing) { await supabase.from('local_foods').update({ ...data, updated_at: now }).eq('id', editing.id); }
    else { await supabase.from('local_foods').insert({ ...data, created_at: now, updated_at: now }); }
    await fetchItems();
    setShowForm(false);
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this food listing?')) return;
    await supabase.from('local_foods').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const previewUrl = watch('image_url');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Local Food</h1><p className="text-slate-400 text-sm mt-1">{items.length} dishes</p></div>
        <button onClick={openNew} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium">＋ Add Dish</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group">
              <div className="h-40 bg-slate-800 relative">
                <img src={item.image_url} alt={item.name_en} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="160"><rect fill="%231e293b" width="200" height="160"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="%2364748b" font-size="40">🍽️</text></svg>'; }} />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)} className="p-1.5 bg-slate-900/90 rounded-lg text-xs">✏️</button>
                  <button onClick={() => deleteItem(item.id)} className="p-1.5 bg-slate-900/90 rounded-lg text-xs hover:bg-rose-600/50">🗑️</button>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-white">{item.name_en}</p>
                <p className="text-rose-400 text-xs">{item.category_en}</p>
                <p className="text-slate-400 text-xs mt-1 line-clamp-2">{item.description_en}</p>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">🍽️</p>
              <p className="text-slate-400">No local food listings yet.</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">{editing ? 'Edit Dish' : 'New Dish'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-xl bg-slate-800" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
              <ImageUpload value={watch('image_url') || ''} onChange={(url) => reset({...watch(), image_url: url})} folder="food" label="Food Photo" />
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['name_en', 'Name (English)'], ['name_bn', 'Name (Bengali)'],
                  ['category_en', 'Category (English)'], ['category_bn', 'Category (Bengali)'],
                  ['where_to_find_en', 'Where to Find (English)'], ['where_to_find_bn', 'Where to Find (Bengali)'],
                  ['taste_note_en', 'Taste Note (English)'], ['taste_note_bn', 'Taste Note (Bengali)'],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-xs text-slate-400 mb-1">{label}</label>
                    <input {...register(name as keyof FormData)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500" />
                  </div>
                ))}
              </div>
              {[['description_en', 'Description (English)', 3], ['description_bn', 'Description (Bengali)', 3]].map(([name, label, rows]) => (
                <div key={name as string}>
                  <label className="block text-xs text-slate-400 mb-1">{label as string}</label>
                  <textarea {...register(name as keyof FormData)} rows={rows as number} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 resize-none" />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {saving ? 'Saving...' : (editing ? 'Update Dish' : 'Add Dish')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
