import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, TripInquiryRow } from '../lib/supabase';
import { StatCard } from '../components/StatCard';

interface DashboardStats {
  inquiries: number;
  tours: number;
  hotels: number;
  gallery: number;
  blogs: number;
  destinations: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    inquiries: 0, tours: 0, hotels: 0, gallery: 0, blogs: 0, destinations: 0
  });
  const [recentInquiries, setRecentInquiries] = useState<TripInquiryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [inquiries, tours, hotels, gallery, blogs, destinations, recent] = await Promise.all([
        supabase.from('trip_inquiries').select('id', { count: 'exact', head: true }),
        supabase.from('tour_packages').select('id', { count: 'exact', head: true }),
        supabase.from('hotels').select('id', { count: 'exact', head: true }),
        supabase.from('gallery_items').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('destinations').select('id', { count: 'exact', head: true }),
        supabase.from('trip_inquiries').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        inquiries: inquiries.count ?? 0,
        tours: tours.count ?? 0,
        hotels: hotels.count ?? 0,
        gallery: gallery.count ?? 0,
        blogs: blogs.count ?? 0,
        destinations: destinations.count ?? 0,
      });

      setRecentInquiries(recent.data ?? []);
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const quickLinks = [
    { label: 'Add Tour Package', to: '/admin/tours', icon: '🗺️', color: 'bg-rose-600/20 hover:bg-rose-600/30 border-rose-600/30 text-rose-300' },
    { label: 'Add Hotel', to: '/admin/hotels', icon: '🏨', color: 'bg-orange-600/20 hover:bg-orange-600/30 border-orange-600/30 text-orange-300' },
    { label: 'Add Blog Post', to: '/admin/blog', icon: '📝', color: 'bg-blue-600/20 hover:bg-blue-600/30 border-blue-600/30 text-blue-300' },
    { label: 'View Inquiries', to: '/admin/inquiries', icon: '📬', color: 'bg-emerald-600/20 hover:bg-emerald-600/30 border-emerald-600/30 text-emerald-300' },
    { label: 'Manage Gallery', to: '/admin/gallery', icon: '🖼️', color: 'bg-purple-600/20 hover:bg-purple-600/30 border-purple-600/30 text-purple-300' },
    { label: 'Edit FAQs', to: '/admin/faq', icon: '❓', color: 'bg-slate-700/50 hover:bg-slate-700 border-slate-600/30 text-slate-300' },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1 text-sm">Welcome back! Here's what's happening with your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Inquiries" value={stats.inquiries} icon="📬" color="rose" />
        <StatCard label="Tour Packages" value={stats.tours} icon="🗺️" color="orange" />
        <StatCard label="Hotels" value={stats.hotels} icon="🏨" color="emerald" />
        <StatCard label="Gallery Items" value={stats.gallery} icon="🖼️" color="blue" />
        <StatCard label="Blog Posts" value={stats.blogs} icon="📝" color="purple" />
        <StatCard label="Destinations" value={stats.destinations} icon="📍" color="rose" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-slate-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-center ${link.color}`}
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-xs font-medium leading-tight">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Inquiries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-200">Recent Inquiries</h2>
          <Link to="/admin/inquiries" className="text-xs text-rose-400 hover:text-rose-300 transition-colors">
            View all →
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-slate-400 text-sm">No inquiries yet. They'll appear here when visitors contact you.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Type</th>
                  <th className="text-left px-5 py-3 hidden lg:table-cell">Package</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-slate-200">{inq.name}</p>
                        <p className="text-slate-500 text-xs">{inq.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-slate-300 capitalize">{inq.inquiry_type}</td>
                    <td className="px-5 py-3 hidden lg:table-cell text-slate-400 text-xs truncate max-w-32">
                      {inq.selected_package || '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        inq.status === 'new' ? 'bg-rose-600/20 text-rose-400' :
                        inq.status === 'replied' ? 'bg-emerald-600/20 text-emerald-400' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-slate-500 text-xs">
                      {new Date(inq.created_at).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
