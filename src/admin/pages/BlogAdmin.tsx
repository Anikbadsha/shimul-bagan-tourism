import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { supabase, BlogPostRow } from '../lib/supabase';
import { ImageUpload } from "../components/ImageUpload";

type FormData = Omit<BlogPostRow, 'created_at' | 'updated_at'>;
function parseArray(value: string): string[] { return value.split('\n').map(s => s.trim()).filter(Boolean); }
function arrayField(value: string[]): string { return (value ?? []).join('\n'); }

export function BlogAdmin() {
  const [items, setItems] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPostRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, setValue, control } = useForm<FormData>();

  const fetchItems = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { reset({ id: crypto.randomUUID(), tags: [], content_bn: [], content_en: [] }); setEditing(null); setShowForm(true); };
  const openEdit = (item: BlogPostRow) => { reset(item); setEditing(item); setShowForm(true); };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    const now = new Date().toISOString();
    if (editing) { await supabase.from('blog_posts').update({ ...data, updated_at: now }).eq('id', editing.id); }
    else { await supabase.from('blog_posts').insert({ ...data, created_at: now, updated_at: now }); }
    await fetchItems();
    setShowForm(false);
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Blog & Stories</h1><p className="text-slate-400 text-sm mt-1">{items.length} articles</p></div>
        <button onClick={openNew} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium transition-all">＋ Add Article</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex gap-4 hover:border-slate-700 transition-all">
              {item.cover_image && (
                <img src={item.cover_image} alt={item.title_en} className="w-24 h-20 object-cover rounded-xl flex-shrink-0 bg-slate-800" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/30">{item.category_en}</span>
                </div>
                <h3 className="font-semibold text-white truncate">{item.title_en}</h3>
                <p className="text-slate-400 text-sm truncate mt-0.5">{item.excerpt_en}</p>
                <p className="text-slate-500 text-xs mt-1">By {item.author_en} · {item.read_time_en}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0 self-start">
                <button onClick={() => openEdit(item)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-all">✏️ Edit</button>
                <button onClick={() => deleteItem(item.id)} className="px-3 py-1.5 bg-slate-800 hover:bg-rose-600/30 hover:text-rose-400 text-slate-400 rounded-lg text-xs transition-all">🗑️</button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-slate-400">No blog posts yet. Click "Add Article" to write your first story.</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">{editing ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['title_en', 'Title (English)'], ['title_bn', 'Title (Bengali)'],
                  ['slug', 'Slug (URL)'], ['category_en', 'Category (English)'],
                  ['category_bn', 'Category (Bengali)'], ['author_en', 'Author (English)'],
                  ['author_bn', 'Author (Bengali)'], ['author_role_en', 'Author Role (English)'],
                  ['author_role_bn', 'Author Role (Bengali)'], ['published_date_en', 'Published Date (English)'],
                  ['published_date_bn', 'Published Date (Bengali)'], ['read_time_en', 'Read Time (English)'],
                  ['read_time_bn', 'Read Time (Bengali)'],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-xs text-slate-400 mb-1">{label}</label>
                    <input {...register(name as keyof FormData)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500" />
                  </div>
                ))}
              </div>
              <Controller
                control={control}
                name="cover_image"
                render={({ field }) => (
                  <ImageUpload value={field.value || ''} onChange={field.onChange} folder="blog" label="Cover Image" />
                )}
              />
              {[
                ['excerpt_en', 'Excerpt (English)', 2],
                ['excerpt_bn', 'Excerpt (Bengali)', 2],
              ].map(([name, label, rows]) => (
                <div key={name as string}>
                  <label className="block text-xs text-slate-400 mb-1">{label as string}</label>
                  <textarea {...register(name as keyof FormData)} rows={rows as number} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 resize-none" />
                </div>
              ))}
              {[
                ['content_en', 'Content Paragraphs (English, one paragraph per line)', 6],
                ['content_bn', 'Content Paragraphs (Bengali, one paragraph per line)', 6],
                ['tags', 'Tags (one per line)', 2],
              ].map(([name, label, rows]) => (
                <div key={name as string}>
                  <label className="block text-xs text-slate-400 mb-1">{label as string}</label>
                  <textarea
                    defaultValue={arrayField((editing as any)?.[name as string] ?? [])}
                    onChange={(e) => setValue(name as keyof FormData, parseArray(e.target.value) as any)}
                    rows={rows as number}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {saving ? 'Saving...' : (editing ? 'Update Article' : 'Publish Article')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
