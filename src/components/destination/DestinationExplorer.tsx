import React, { useState } from 'react';
import { MapPin, ArrowRight, CheckCircle2, Compass } from 'lucide-react';
import { destinationsData } from '../../data/destinations';
import { useLiveData } from '../../hooks/useLiveData';
import { Destination } from '../../types';
import { InteractiveMapCanvas } from './InteractiveMapCanvas';
import { useLanguage } from '../../locales/LanguageContext';

export const DestinationExplorer: React.FC = () => {
  const { t, isBn } = useLanguage();
  const [selectedDestination, setSelectedDestination] = useState<Destination>(destinationsData[0]);
  const allDestinations = useLiveData<any>("destinations", destinationsData);

  return (
    <section id="destinations" className="relative w-full py-20 lg:py-24 bg-slate-900 text-white border-b border-slate-800 bg-grid-pattern-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-rose-400 font-bold uppercase tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '20s' }} />
            <span>{t.destinations.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali-serif tracking-tight text-white leading-tight mb-4">
            {t.destinations.title}
          </h2>

          <p className="text-base text-slate-300 font-light leading-relaxed">
            {t.destinations.subtitle}
          </p>
        </div>

        {/* 1. Interactive Topological Geospatial Map */}
        <div className="mb-14">
          <InteractiveMapCanvas
            destinations={destinationsData}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
          />
        </div>

        {/* 2. Storytelling Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDestinations.map((dest, index) => {
            const isSelected = dest.id === selectedDestination.id;
            return (
              <div
                id={dest.slug}
                key={dest.id}
                className={`rounded-xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-slate-800/90 border-[#C62828] shadow-md ring-1 ring-[#C62828]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Image Header */}
                <div className="relative w-full h-52 overflow-hidden">
                  <img
                    src={dest.imageUrl}
                    alt={isBn ? dest.nameBn : dest.nameEn}
                    width="400"
                    height="208"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Top Badge: Index Number & Category */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="w-7 h-7 rounded-md bg-slate-950/80 backdrop-blur-md text-white text-xs font-mono font-bold flex items-center justify-center border border-slate-700">
                      0{index + 1}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-[#C62828] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      {dest.category}
                    </span>
                  </div>

                  {/* Bottom Title on Image */}
                  <div className="absolute bottom-3 left-3.5 right-3.5">
                    <h3 className="text-lg font-bold text-white font-bengali-serif">
                      {isBn ? dest.nameBn : dest.nameEn}
                    </h3>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs text-rose-300 font-semibold mb-2">
                      {isBn ? dest.subtitleBn : dest.subtitleEn}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 font-light">
                      {isBn ? dest.descriptionBn : dest.descriptionEn}
                    </p>
                  </div>

                  {/* Highlights Pill List */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    {(isBn ? dest.highlightsBn : dest.highlightsEn).slice(0, 2).map((hl, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer: Distance & Best Time */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{isBn ? dest.distanceFromGardenBn : dest.distanceFromGardenEn}</span>
                    </div>

                    <button
                      onClick={() => setSelectedDestination(dest)}
                      className="text-white hover:text-rose-400 font-semibold flex items-center gap-1 text-xs transition-colors cursor-pointer"
                    >
                      <span>{isBn ? 'বাছাই করুন' : 'Select'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
