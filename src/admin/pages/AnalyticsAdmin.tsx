import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Stats {
  totalInquiries: number;
  newInquiries: number;
  repliedInquiries: number;
  tourPackages: number;
  hotels: number;
  blogPosts: number;
  galleryItems: number;
  destinations: number;
  communityStories: number;
  faqItems: number;
  localFoods: number;
  inquiriesByType: { type: string; count: number }[];
  recentMonths: { month: string; count: number }[];
}

export function AnalyticsAdmin() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const [
        totalInq, newInq, repliedInq,
        tours, hotels, blogs, gallery, dest, community, faq, food,
        inquiries
      ] = await Promise.all([
        supabase.from('trip_inquiries').select('id', { count: 'exact', head: true }),
        supabase.from('trip_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('trip_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'replied'),
        supabase.from('tour_packages').select('id', { count: 'exact', head: true }),
        supabase.from('hotels').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('gallery_items').select('id', { count: 'exact', head: true }),
        supabase.from('destinations').select('id', { count: 'exact', head: true }),
        supabase.from('community_stories').select('id', { count: 'exact', head: true }),
        supabase.from('faq_items').select('id', { count: 'exact', head: true }),
        supabase.from('local_foods').select('id', { count: 'exact', head: true }),
        supabase.from('trip_inquiries').select('inquiry_type, created_at'),
      ]);

      // Count by type
      const typeMap: Record<string, number> = {};
      (inquiries.data ?? []).forEach(i => { typeMap[i.inquiry_type] = (typeMap[i.inquiry_type] || 0) + 1; });
      const inquiriesByType = Object.entries(typeMap).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);

      // Count by month (last 6 months)
      const monthMap: Record<string, number> = {};
      (inquiries.data ?? []).forEach(i => {
        const month = new Date(i.created_at).toLocaleString('en-US', { month: 'short', year: '2-digit' });
        monthMap[month] = (monthMap[month] || 0) + 1;
      });
      const recentMonths = Object.entries(monthMap).slice(-6).map(([month, count]) => ({ month, count }));

      setStats({
        totalInquiries: totalInq.count ?? 0,
        newInquiries: newInq.count ?? 0,
        repliedInquiries: repliedInq.count ?? 0,
        tourPackages: tours.count ?? 0,
        hotels: hotels.count ?? 0,
        blogPosts: blogs.count ?? 0,
        galleryItems: gallery.count ?? 0,
        destinations: dest.count ?? 0,
        communityStories: community.count ?? 0,
        faqItems: faq.count ?? 0,
        localFoods: food.count ?? 0,
        inquiriesByType,
        recentMonths,
      });
      setLoading(false);
    }
    fetchAll();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!stats) return null;

  const maxTypeCount = Math.max(...stats.inquiriesByType.map(i => i.count), 1);
  const maxMonthCount = Math.max(...stats.recentMonths.map(m => m.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Overview of your website content and inquiries</p>
      </div>

      {/* Inquiry stats */}
      <div>
        <h2 className="text-base font-semibold text-slate-200 mb-4">Inquiries Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total', value: stats.totalInquiries, color: 'text-rose-400', bg: 'bg-rose-600/10 border-rose-600/20' },
            { label: 'New / Unread', value: stats.newInquiries, color: 'text-orange-400', bg: 'bg-orange-600/10 border-orange-600/20' },
            { label: 'Replied', value: stats.repliedInquiries, color: 'text-emerald-400', bg: 'bg-emerald-600/10 border-emerald-600/20' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border rounded-2xl p-5 text-center`}>
              <p className={`text-4xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-slate-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inquiry by type */}
      {stats.inquiriesByType.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-slate-200 mb-4">Inquiries by Type</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            {stats.inquiriesByType.map(({ type, count }) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-300 capitalize">{type}</span>
                  <span className="text-slate-400">{count}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-600 to-orange-500 rounded-full transition-all" style={{ width: `${(count / maxTypeCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly */}
      {stats.recentMonths.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-slate-200 mb-4">Inquiries by Month</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-end gap-3 h-32">
              {stats.recentMonths.map(({ month, count }) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-slate-400">{count}</span>
                  <div className="w-full bg-gradient-to-t from-rose-600 to-orange-500 rounded-t-lg transition-all" style={{ height: `${(count / maxMonthCount) * 100}%`, minHeight: count > 0 ? '8px' : '0' }} />
                  <span className="text-xs text-slate-500">{month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content summary */}
      <div>
        <h2 className="text-base font-semibold text-slate-200 mb-4">Content Summary</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3">Content Type</th>
              <th className="text-right px-5 py-3">Total Items</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-800">
              {[
                ['🗺️ Tour Packages', stats.tourPackages],
                ['🏨 Hotels', stats.hotels],
                ['📝 Blog Posts', stats.blogPosts],
                ['🖼️ Gallery Photos', stats.galleryItems],
                ['📍 Destinations', stats.destinations],
                ['👥 Community Stories', stats.communityStories],
                ['🍽️ Local Foods', stats.localFoods],
                ['❓ FAQ Items', stats.faqItems],
              ].map(([label, count]) => (
                <tr key={label as string} className="hover:bg-slate-800/40">
                  <td className="px-5 py-3 text-slate-200">{label as string}</td>
                  <td className="px-5 py-3 text-right font-semibold text-white">{count as number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
