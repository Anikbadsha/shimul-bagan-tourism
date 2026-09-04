import React, { useEffect, useState } from 'react';
import { supabase, TripInquiryRow } from '../lib/supabase';

export function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState<TripInquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [selected, setSelected] = useState<TripInquiryRow | null>(null);

  const fetchInquiries = async () => {
    let query = supabase.from('trip_inquiries').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data } = await query;
    setInquiries(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchInquiries(); }, [filter]);

  const updateStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    await supabase.from('trip_inquiries').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry permanently?')) return;
    await supabase.from('trip_inquiries').delete().eq('id', id);
    setInquiries(prev => prev.filter(i => i.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const statusColors: Record<string, string> = {
    new: 'bg-rose-600/20 text-rose-400 border-rose-600/30',
    read: 'bg-slate-700 text-slate-400 border-slate-600',
    replied: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trip Inquiries</h1>
          <p className="text-slate-400 text-sm mt-1">Messages from visitors who want to book or inquire</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'new', 'read', 'replied'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === f ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-2">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : inquiries.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
              <p className="text-3xl mb-3">📭</p>
              <p className="text-slate-400 text-sm">No {filter === 'all' ? '' : filter} inquiries</p>
            </div>
          ) : (
            inquiries.map(inq => (
              <button
                key={inq.id}
                onClick={() => { setSelected(inq); updateStatus(inq.id, inq.status === 'new' ? 'read' : inq.status); }}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selected?.id === inq.id
                    ? 'bg-rose-600/10 border-rose-600/40'
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className={`font-medium text-sm ${inq.status === 'new' ? 'text-white' : 'text-slate-300'}`}>
                    {inq.name}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[inq.status]}`}>
                    {inq.status}
                  </span>
                </div>
                <p className="text-slate-500 text-xs truncate">{inq.message}</p>
                <p className="text-slate-600 text-xs mt-1">{new Date(inq.created_at).toLocaleDateString('en-GB')}</p>
              </button>
            ))
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 sticky top-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
                  <p className="text-slate-400 text-sm">{selected.email} · {selected.phone}</p>
                </div>
                <button
                  onClick={() => deleteInquiry(selected.id)}
                  className="p-2 rounded-lg hover:bg-rose-600/20 text-slate-500 hover:text-rose-400 transition-all"
                  title="Delete inquiry"
                >
                  🗑️
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Type', selected.inquiry_type],
                  ['Travel Date', selected.date],
                  ['Travelers', selected.guests],
                  ['Package', selected.package_name || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="bg-slate-800/50 rounded-xl p-3">
                    <p className="text-slate-500 text-xs mb-0.5">{label}</p>
                    <p className="text-slate-200 font-medium capitalize">{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-500 text-xs mb-2">Message</p>
                <p className="text-slate-200 text-sm leading-relaxed">{selected.message}</p>
              </div>

              <div className="flex gap-3">
                {(['new', 'read', 'replied'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl border capitalize transition-all ${
                      selected.status === s
                        ? statusColors[s] + ' cursor-default'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <a
                href={`mailto:${selected.email}?subject=Re: Your inquiry about ${selected.package_name || 'Shimul Bagan'}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium transition-all"
              >
                ✉️ Reply via Email
              </a>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">👈</p>
              <p className="text-slate-400 text-sm">Select an inquiry from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
