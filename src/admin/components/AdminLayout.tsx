import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/inquiries', label: 'Inquiries', icon: '📬' },
  { to: '/admin/tours', label: 'Tour Packages', icon: '🗺️' },
  { to: '/admin/hotels', label: 'Hotels', icon: '🏨' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { to: '/admin/blog', label: 'Blog & Stories', icon: '📝' },
  { to: '/admin/destinations', label: 'Destinations', icon: '📍' },
  { to: '/admin/community', label: 'Community', icon: '👥' },
  { to: '/admin/food', label: 'Local Food', icon: '🍽️' },
  { to: '/admin/faq', label: 'FAQs', icon: '❓' },
  { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-800 gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-900/30">
            <span className="text-lg">🌺</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white leading-tight">শিমুল বাগান</p>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                ${isActive
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`
              }
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info + sign out */}
        <div className="p-3 border-t border-slate-800">
          {sidebarOpen ? (
            <div className="bg-slate-800/50 rounded-xl p-3">
              <p className="text-xs text-slate-400 truncate mb-0.5">Signed in as</p>
              <p className="text-xs font-medium text-slate-200 truncate mb-3">{user?.email}</p>
              <button
                onClick={handleSignOut}
                className="w-full text-xs py-2 px-3 bg-slate-700 hover:bg-rose-600/30 hover:text-rose-300 text-slate-300 rounded-lg transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="w-full flex items-center justify-center py-2 text-slate-400 hover:text-rose-400 transition-colors"
            >
              🚪
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-slate-900/60 border-b border-slate-800 flex items-center px-6 gap-4 flex-shrink-0 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
          <div className="flex-1" />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800"
          >
            🌐 View Live Site ↗
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
