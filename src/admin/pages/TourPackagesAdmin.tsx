import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { supabase, TourPackageRow } from '../lib/supabase';
import { ImageUpload } from "../components/ImageUpload";

type FormData = Omit<TourPackageRow, 'created_at' | 'updated_at'>;

const emptyForm: Omit<FormData, 'id'> = {
  title_bn: '', title_en: '', description_bn: '', description_en: '',
  duration_bn: '', duration_en: '',
  price_bn: '', price_en: '', image_url: '',
  features_bn: [], features_en: [],
  popular: false, category: '',
};

function arrayField(value: string[]): string { return value.join('\n'); }
function parseArray(value: string): string[] { return value.split('\n').map(s => s.trim()).filter(Boolean); }

export function TourPackagesAdmin() {
  const [items, setItems] = useState<TourPackageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TourPackageRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, control } = useForm<FormData>();

  const fetchItems = async () => {
    const { data } = await supabase.from('tour_packages').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => {
    reset({ id: crypto.randomUUID(), ...emptyForm });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item: TourPackageRow) => {
    reset({
      ...item,
    });
    setEditing(item);
    setShowForm(true);
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    const now = new Date().toISOString();
    const row = { ...data, updated_at: now };

    if (editing) {
      await supabase.from('tour_packages').update(row).eq('id', editing.id);
    } else {
      await supabase.from('tour_packages').insert({ ...row, created_at: now });
    }

    await fetchItems();
    setShowForm(false);
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this tour package?')) return;
    await supabase.from('tour_packages').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tour Packages</h1>
          <p className="text-slate-400 text-sm mt-1">{items.length} packages</p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2"
        >
          ＋ Add Package
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-slate-700 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white truncate">{item.title_en}</h3>
                  {item.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-600/30 flex-shrink-0">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm truncate">{item.description_en}</p>
                <p className="text-slate-500 text-xs mt-1">⏱ {item.duration_en}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-all"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-rose-600/30 hover:text-rose-400 text-slate-400 rounded-lg text-xs transition-all"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">🗺️</p>
              <p className="text-slate-400">No tour packages yet. Click "Add Package" to create your first one.</p>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">{editing ? 'Edit Tour Package' : 'New Tour Package'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['title_en', 'Title (English)', true],
                  ['title_bn', 'Title (Bengali)', true],
                  ['description_en', 'Description (English)', true],
                  ['description_bn', 'Description (Bengali)', true],
                  ['duration_en', 'Duration (English)', true],
                  ['duration_bn', 'Duration (Bengali)', true],
                  ['price_en', 'Price (English)', true],
                  ['price_bn', 'Price (Bengali)', true],
                  ['category', 'Category', false],
                ].map(([name, label, required]) => (
                  <div key={name as string}>
                    <label className="block text-xs text-slate-400 mb-1">{label as string}</label>
                    <input
                      {...register(name as keyof FormData, { required: required as boolean })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                ))}
              </div>
              <Controller
                control={control}
                name="image_url"
                render={({ field }) => (
                  <ImageUpload value={field.value || ''} onChange={field.onChange} folder="tours" label="Tour Package Image" />
                )}
              />

              {/* Array fields */}
              {[
                ['features_en', 'Features English (one per line)'],
                ['features_bn', 'Features Bengali (one per line)'],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="block text-xs text-slate-400 mb-1">{label}</label>
                  <textarea
                    defaultValue={arrayField((editing as any)?.[name] ?? [])}
                    onChange={(e) => setValue(name as keyof FormData, parseArray(e.target.value) as any)}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 resize-none"
                    placeholder="Item 1&#10;Item 2&#10;Item 3"
                  />
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {saving ? 'Saving...' : (editing ? 'Update Package' : 'Create Package')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
