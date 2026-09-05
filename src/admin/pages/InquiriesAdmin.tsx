import React, { useEffect, useState } from 'react';
import { supabase, TripInquiryRow } from '../lib/supabase';
import { Phone, Mail, Calendar, Users, MapPin, MessageSquare, Trash2, Copy, Check } from 'lucide-react';

const typeLabels: Record<string, { en: string; icon: string }> = {
  tour: { en: 'Tour Package', icon: '🗺️' },
  hotel: { en: 'Hotel Booking', icon: '🏨' },
  transport: { en: 'Transport', icon: '🚗' },
  general: { en: 'General Inquiry', icon: '💬' },
};

export function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState<TripInquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [selected, setSelected] = useState<TripInquiryRow | null>(null);
  const [copied, setCopied] = useState(false);

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

  const copyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const statusColors: Record<string, string> = {
    new: 'bg-rose-500 text-white',
    read: 'bg-slate-600 text-slate-200',
    replied: 'bg-emerald-500 text-white',
  };

  const statusDot: Record<string, string> = {
    new: 'bg-rose-400',
    read: 'bg-slate-500',
    replied: 'bg-emerald-400',
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trip Inquiries</h1>
          <p className="text-slate-400 text-sm mt-1">{inquiries.length} total · {inquiries.filter(i => i.status === 'new').length} unread</p>
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
                onClick={() => { setSelected(inq); if (inq.status === 'new') updateStatus(inq.id, 'read'); }}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selected?.id === inq.id
                    ? 'bg-rose-600/10 border-rose-600/40'
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    inq.status === 'new' ? 'bg-rose-600/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {getInitials(inq.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`font-medium text-sm truncate ${inq.status === 'new' ? 'text-white' : 'text-slate-300'}`}>
                        {inq.name}
                      </p>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[inq.status]}`} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {inq.phone}
                      </span>
                      <span>{typeLabels[inq.inquiry_type]?.icon} {typeLabels[inq.inquiry_type]?.en || inq.inquiry_type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {inq.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {inq.guests}
                      </span>
                      <span>{timeAgo(inq.created_at)}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 sticky top-0">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-600/20 flex items-center justify-center text-lg font-bold text-rose-400 flex-shrink-0">
                  {getInitials(selected.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[selected.status]}`}>
                      {selected.status}
                    </span>
                    <span className="text-slate-600 text-xs">{new Date(selected.created_at).toLocaleString('en-GB')}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteInquiry(selected.id)}
                  className="p-2 rounded-lg hover:bg-rose-600/20 text-slate-500 hover:text-rose-400 transition-all"
                  title="Delete inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-500 text-xs">Phone</p>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-200 font-medium text-sm truncate">{selected.phone}</p>
                      <button onClick={() => copyPhone(selected.phone)} className="text-slate-500 hover:text-slate-300 flex-shrink-0" title="Copy">
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-500 text-xs">Email</p>
                    <p className="text-slate-200 font-medium text-sm truncate">{selected.email || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                  <p className="text-slate-500 text-xs mb-1">Type</p>
                  <p className="text-slate-200 font-medium text-sm">
                    {typeLabels[selected.inquiry_type]?.icon} {typeLabels[selected.inquiry_type]?.en || selected.inquiry_type}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                  <p className="text-slate-500 text-xs mb-1">Travel Date</p>
                  <p className="text-slate-200 font-medium text-sm">{selected.date}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                  <p className="text-slate-500 text-xs mb-1">Travelers</p>
                  <p className="text-slate-200 font-medium text-sm">{selected.guests} {selected.guests === 1 ? 'person' : 'people'}</p>
                </div>
              </div>

              {/* Message */}
              {selected.message && (
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-500 text-xs mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Message
                  </p>
                  <p className="text-slate-200 text-sm leading-relaxed">{selected.message}</p>
                </div>
              )}

              {/* Status Buttons */}
              <div className="flex gap-3">
                {(['new', 'read', 'replied'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl border capitalize transition-all ${
                      selected.status === s
                        ? statusColors[s] + ' border-transparent cursor-default'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Reply Buttons */}
              <div className="flex gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: Your inquiry about Shimul Bagan`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium transition-all"
                >
                  <Mail className="w-4 h-4" /> Reply via Email
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-all cursor-not-allowed opacity-60"
                >
                  <MessageSquare className="w-4 h-4" /> Reply via WhatsApp
                </a>
              </div>
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
