import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  color?: 'rose' | 'orange' | 'emerald' | 'blue' | 'purple';
}

const colorMap = {
  rose: 'from-rose-600/20 to-rose-600/5 border-rose-600/20 text-rose-400',
  orange: 'from-orange-600/20 to-orange-600/5 border-orange-600/20 text-orange-400',
  emerald: 'from-emerald-600/20 to-emerald-600/5 border-emerald-600/20 text-emerald-400',
  blue: 'from-blue-600/20 to-blue-600/5 border-blue-600/20 text-blue-400',
  purple: 'from-purple-600/20 to-purple-600/5 border-purple-600/20 text-purple-400',
};

export function StatCard({ label, value, icon, trend, trendUp, color = 'rose' }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <div className={`bg-gradient-to-br ${colors} border rounded-2xl p-5 flex flex-col gap-3`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      {trend && (
        <p className={`text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-slate-400'}`}>
          {trendUp ? '↑' : '→'} {trend}
        </p>
      )}
    </div>
  );
}
