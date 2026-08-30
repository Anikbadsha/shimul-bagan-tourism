import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase, FaqItemRow } from '../lib/supabase';

type FormData = Omit<FaqItemRow, 'created_at' | 'updated_at'>;
const categories = ['general', 'transport', 'timing', 'stay', 'photography'];

export function FaqAdmin() {
  const [items, setItems] = useState<FaqItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FaqItemRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const { register, handleSubmit, reset } = useForm<FormData>();

  const fetchItems = async () => {
    const { data } = await supabase.from('faq_items').select('*').order('created_at', { ascending: true });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { reset({ id: crypto.randomUUID(), category: 'general' }); setEditing(null); setShowForm(true); };
  const openEdit = (item: FaqItemRow) => { reset(item); setEditing(item); setShowForm(true); };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    const now = new Date().toISOString();
    if (editing) { await supabase.from('faq_items').update({ ...data, updated_at: now }).eq('id', editing.id); }
    else { await supabase.from('faq_items').insert({ ...data, created_at: now, updated_at: now }); }
    await fetchItems();
    setShowForm(false);
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    await supabase.from('faq_items').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const filtered = filterCat === 'all' ? items : items.filter(i => i.category === filterCat);
  const catColor: Record<string, string> = {
    general: 'bg-slate-700 text-slate-300',
    transport: 'bg-blue-600/20 text-blue-400',
    timing: 'bg-orange-600/20 text-orange-400',
    stay: 'bg-emerald-600/20 text-emerald-400',
    photography: 'bg-purple-600/20 text-purple-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">FAQs</h1><p className="text-slate-400 text-sm mt-1">{items.length} questions</p></div>
        <button onClick={openNew} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium">＋ Add FAQ</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', ...categories].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filterCat === cat ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}>{cat}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${catColor[item.category] || catColor.general}`}>{item.category}</span>
                  </div>
                  <p className="font-medium text-white text-sm">{item.question_en}</p>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">{item.answer_en}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(item)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs">✏️</button>
                  <button onClick={() => deleteItem(item.id)} className="px-3 py-1.5 bg-slate-800 hover:bg-rose-600/30 hover:text-rose-400 text-slate-400 rounded-lg text-xs">🗑️</button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">❓</p>
              <p className="text-slate-400">No FAQs yet. Click "Add FAQ" to create your first question.</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">{editing ? 'Edit FAQ' : 'New FAQ'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Category</label>
                <select {...register('category')} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {[
                ['question_en', 'Question (English)', 2],
                ['question_bn', 'Question (Bengali)', 2],
                ['answer_en', 'Answer (English)', 4],
                ['answer_bn', 'Answer (Bengali)', 4],
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
                  {saving ? 'Saving...' : (editing ? 'Update FAQ' : 'Add FAQ')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
