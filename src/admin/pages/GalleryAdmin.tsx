import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase, GalleryItemRow } from '../lib/supabase';

type FormData = Omit<GalleryItemRow, 'created_at' | 'updated_at'>;

const categories = ['all', 'shimul', 'nature', 'jadukata', 'mountains', 'tahirpur', 'travel', 'people'];

export function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GalleryItemRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const { register, handleSubmit, reset, watch } = useForm<FormData>();

  const fetchItems = async () => {
    const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { reset({ id: crypto.randomUUID(), category: 'shimul', aspect_ratio: 'landscape' }); setEditing(null); setShowForm(true); };
  const openEdit = (item: GalleryItemRow) => { reset(item); setEditing(item); setShowForm(true); };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    const now = new Date().toISOString();
    if (editing) { await supabase.from('gallery_items').update({ ...data, updated_at: now }).eq('id', editing.id); }
    else { await supabase.from('gallery_items').insert({ ...data, created_at: now, updated_at: now }); }
    await fetchItems();
    setShowForm(false);
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this photo?')) return;
    await supabase.from('gallery_items').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const filtered = filterCat === 'all' ? items : items.filter(i => i.category === filterCat);
  const previewUrl = watch('image_url');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Gallery</h1><p className="text-slate-400 text-sm mt-1">{items.length} photos</p></div>
        <button onClick={openNew} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium transition-all">＋ Add Photo</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filterCat === cat ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}>{cat}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all">
              <div className="aspect-square bg-slate-800">
                <img src={item.image_url} alt={item.title_en} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23334155" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2364748b" font-size="30">🖼️</text></svg>'; }} />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-white truncate">{item.title_en}</p>
                <p className="text-slate-500 text-xs">{item.category} · {item.aspect_ratio}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)} className="p-1.5 bg-slate-900/90 rounded-lg text-xs hover:bg-slate-800">✏️</button>
                <button onClick={() => deleteItem(item.id)} className="p-1.5 bg-slate-900/90 rounded-lg text-xs hover:bg-rose-600/50">🗑️</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">🖼️</p>
              <p className="text-slate-400">No photos in this category.</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">{editing ? 'Edit Photo' : 'Add Photo'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl bg-slate-800" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Image URL</label>
                <input {...register('image_url', { required: true })} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[['title_en', 'Title (English)'], ['title_bn', 'Title (Bengali)'], ['location_en', 'Location (English)'], ['location_bn', 'Location (Bengali)'], ['caption_en', 'Caption (English)'], ['caption_bn', 'Caption (Bengali)'], ['photographer', 'Photographer']].map(([name, label]) => (
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
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Aspect Ratio</label>
                  <select {...register('aspect_ratio')} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500">
                    <option value="landscape">Landscape</option>
                    <option value="portrait">Portrait</option>
                    <option value="square">Square</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {saving ? 'Saving...' : (editing ? 'Update' : 'Add Photo')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
