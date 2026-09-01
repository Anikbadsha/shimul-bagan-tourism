import React, { useState } from 'react';
import { MapPin, Navigation, Compass, ArrowUpRight, Mountain, Waves, Sparkles, CheckCircle2 } from 'lucide-react';
import { Destination } from '../../types';
import { useLanguage } from '../../locales/LanguageContext';

interface InteractiveMapCanvasProps {
  destinations: Destination[];
  onSelectDestination?: (dest: Destination) => void;
}

export const InteractiveMapCanvas: React.FC<InteractiveMapCanvasProps> = ({
  destinations,
  onSelectDestination
}) => {
  const { isBn } = useLanguage();
  const [activeId, setActiveId] = useState<string>(destinations[0]?.id || 'shimul-bagan');

  const selectedDestination = destinations.find((d) => d.id === activeId) || destinations[0];

  return (
    <div className="relative w-full bg-[#132c21] rounded-3xl p-6 lg:p-8 border border-emerald-900/40 shadow-2xl text-white overflow-hidden">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C62828]/20 border border-[#C62828]/40 text-xs text-[#ff8a80] font-medium tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '15s' }} />
            {isBn ? 'তাহিরপুর জিওস্পেশিয়াল ট্রেইল ম্যাপ' : 'Tahirpur Geospatial Discovery Canvas'}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {isBn ? 'তাহিরপুরের জীবন্ত ভৌগোলিক মানচিত্র' : 'Interactive Map of Tahirpur & Borderlands'}
          </h3>
        </div>

        {/* Live Active Destination Pill */}
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-xs">
            <p className="text-white/60">{isBn ? 'নির্বাচিত অবস্থান' : 'Active Location'}</p>
            <p className="font-bold text-white text-sm">
              {isBn ? selectedDestination.nameBn : selectedDestination.nameEn}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Map Canvas on Left/Center, Live Detail Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Stylized Interactive Map (7 Cols) */}
        <div className="lg:col-span-7 relative w-full h-[360px] md:h-[480px] bg-[#0c1f17] rounded-2xl border border-emerald-800/30 overflow-hidden select-none p-4 flex items-center justify-center">
          {/* Subtle Background Contours / Grid */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(#4B86A8 1px, transparent 1px), linear-gradient(to right, #173A2B 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* SVG Map Graphics */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              {/* River Gradient */}
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4B86A8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#7EADC9" stopOpacity="0.7" />
              </linearGradient>

              {/* Haor Gradient */}
              <radialGradient id="haorGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4B86A8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#173A2B" stopOpacity="0.05" />
              </radialGradient>

              {/* Mountain Ridge Gradient */}
              <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#25543d" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#173a2b" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Northern Meghalaya Hills Boundary (Top Zone) */}
            <path
              d="M 0,0 L 100,0 L 100,20 Q 80,12 60,18 T 20,12 Q 10,16 0,22 Z"
              fill="url(#mountainGrad)"
              stroke="#315c3b"
              strokeWidth="0.5"
            />
            {/* Mountain text label */}
            <text x="50" y="8" fill="#d8c39a" opacity="0.65" fontSize="2.8" textAnchor="middle" letterSpacing="0.4">
              {isBn ? '▲ মেঘালয় পাহাড় সীমান্ত (ভারত)' : '▲ MEGHALAYA HILLS BORDER (INDIA)'}
            </text>

            {/* Tanguar Haor Wetland Zone (South-West) */}
            <ellipse cx="20" cy="70" rx="16" ry="14" fill="url(#haorGrad)" stroke="#4B86A8" strokeDasharray="1 1" strokeWidth="0.4" />
            <text x="20" y="73" fill="#7EADC9" opacity="0.75" fontSize="2.2" textAnchor="middle">
              {isBn ? 'টাঙ্গুয়ার হাওর রামসার সাইট' : 'Tanguar Haor Wetland'}
            </text>

            {/* S-shaped Jadukata River Path */}
            <path
              d="M 68,16 Q 60,32 54,46 T 45,62 Q 38,78 30,95 L 34,97 Q 42,80 49,64 T 58,48 Q 64,34 72,18 Z"
              fill="url(#riverGrad)"
            />
            <text x="60" y="36" fill="#ffffff" opacity="0.6" fontSize="2.2" transform="rotate(35 60 36)">
              {isBn ? 'যাদুকাটা নদী ~' : 'Jadukata River ~'}
            </text>

            {/* Trail / Connection Route Lines */}
            <path
              d="M 48,52 L 58,38 L 25,26 L 22,34 L 16,65"
              fill="none"
              stroke="#D8C39A"
              strokeWidth="0.35"
              strokeDasharray="1.2 0.8"
              opacity="0.5"
            />
          </svg>

          {/* Interactive HTML Coordinate Pins overlaying SVG */}
          {destinations.map((dest) => {
            const isSelected = dest.id === activeId;
            return (
              <button
                key={dest.id}
                onClick={() => {
                  setActiveId(dest.id);
                  if (onSelectDestination) onSelectDestination(dest);
                }}
                style={{ left: `${dest.mapX}%`, top: `${dest.mapY}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20 transition-transform duration-300 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                }`}
                title={isBn ? dest.nameBn : dest.nameEn}
              >
                {/* Ping wave for selected pin */}
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-[#C62828] opacity-60 animate-ping" />
                )}

                {/* Marker Pin Circle */}
                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg transition-all ${
                    isSelected
                      ? 'bg-[#C62828] border-white text-white shadow-[#C62828]/60 ring-4 ring-[#C62828]/30'
                      : 'bg-[#173A2B] border-[#D8C39A] text-[#D8C39A] hover:bg-[#C62828] hover:text-white'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>

                {/* Floating Pin Label Tag */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-9 px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap backdrop-blur-md border shadow-md transition-all ${
                    isSelected
                      ? 'bg-[#C62828] text-white border-white/40 opacity-100 scale-100'
                      : 'bg-black/75 text-white/90 border-white/10 opacity-85 group-hover:opacity-100'
                  }`}
                >
                  {isBn ? dest.nameBn : dest.nameEn}
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Destination Inspector Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-[#173A2B]/80 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-white/15 shadow-xl">
          {/* Card Image Banner */}
          <div className="relative w-full h-44 rounded-xl overflow-hidden group">
            <img
              src={selectedDestination.imageUrl}
              alt={isBn ? selectedDestination.nameBn : selectedDestination.nameEn}
              width="400"
              height="176"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-[#C62828] text-[10px] uppercase font-bold tracking-wider text-white">
                  {selectedDestination.category}
                </span>
                <h4 className="text-lg font-bold text-white mt-1">
                  {isBn ? selectedDestination.nameBn : selectedDestination.nameEn}
                </h4>
              </div>
              <div className="text-right text-[11px] text-[#D8C39A]">
                <span>{selectedDestination.coordinates.elevation}</span>
              </div>
            </div>
          </div>

          {/* Subtitle & Description */}
          <div>
            <p className="text-xs text-[#D8C39A] font-medium mb-1.5">
              {isBn ? selectedDestination.subtitleBn : selectedDestination.subtitleEn}
            </p>
            <p className="text-xs text-white/80 line-clamp-3 leading-relaxed">
              {isBn ? selectedDestination.descriptionBn : selectedDestination.descriptionEn}
            </p>
          </div>

          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-black/25 p-3 rounded-xl border border-white/5">
            <div>
              <span className="text-white/50 block">{isBn ? 'দূরত্ব:' : 'Distance:'}</span>
              <span className="font-semibold text-white">
                {isBn ? selectedDestination.distanceFromGardenBn : selectedDestination.distanceFromGardenEn}
              </span>
            </div>
            <div>
              <span className="text-white/50 block">{isBn ? 'সেরা সময়:' : 'Best Season:'}</span>
              <span className="font-semibold text-emerald-300">
                {isBn ? selectedDestination.bestTimeToVisitBn : selectedDestination.bestTimeToVisitEn}
              </span>
            </div>
          </div>

          {/* Highlights List */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">
              {isBn ? 'প্রধান আকর্ষণসমূহ:' : 'Key Highlights:'}
            </p>
            {(isBn ? selectedDestination.highlightsBn : selectedDestination.highlightsEn).slice(0, 2).map((hl, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-white/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C62828] shrink-0 mt-0.5" />
                <span>{hl}</span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              if (onSelectDestination) onSelectDestination(selectedDestination);
              const element = document.getElementById(selectedDestination.slug);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#C62828] hover:bg-[#a82020] text-white text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95"
          >
            <span>{isBn ? 'বিস্তারিত গাইড ও ছবি দেখুন' : 'Explore Detailed Guide'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile-Friendly Destination Quick Bar */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {destinations.map((dest) => (
          <button
            key={dest.id}
            onClick={() => {
              setActiveId(dest.id);
              if (onSelectDestination) onSelectDestination(dest);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              dest.id === activeId
                ? 'bg-white text-[#173A2B] font-bold shadow-md'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>{isBn ? dest.nameBn : dest.nameEn}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
