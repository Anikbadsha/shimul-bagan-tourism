import React, { Suspense } from 'react';
import { Sparkles, Calendar, Droplets } from 'lucide-react';
import { useLanguage } from '../../locales/LanguageContext';

const ShimulTree3DViewer = React.lazy(() => import('../three/ShimulTree3DViewer').then(m => ({ default: m.ShimulTree3DViewer })));

export const FlowerSection: React.FC = () => {
  const { t, isBn } = useLanguage();

  return (
    <section className="relative w-full py-20 lg:py-24 bg-slate-950 text-white border-b border-slate-800 bg-grid-pattern-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-rose-400 font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.flowerSection.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-bengali-serif tracking-tight text-white leading-tight mb-5 whitespace-pre-line">
            {t.flowerSection.title}
          </h2>

          <p className="text-base text-slate-300 leading-relaxed font-light">
            {t.flowerSection.description}
          </p>
        </div>

        {/* Two-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Botanical Profile & Image Banner */}
          <div className="lg:col-span-5 space-y-5">
            <div className="relative rounded-xl overflow-hidden shadow-sm border border-slate-800 group">
              <img
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop"
                alt="Bombax Ceiba Red Flower Bloom Closeup"
                width="400"
                height="288"
                loading="lazy"
                decoding="async"
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-2.5 py-1 rounded-md bg-[#C62828] text-[10px] font-bold text-white uppercase tracking-wider">
                  {t.flowerSection.scientificName}
                </span>
                <p className="text-xs text-slate-300 mt-2 font-medium">
                  {isBn ? 'রক্তিম শিমুল — বসন্তের দূত' : 'Red Silk Cotton Tree (Bombax ceiba)'}
                </p>
              </div>
            </div>

            {/* Botanical Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isBn ? 'প্রস্ফুটন কাল' : 'Flowering Period'}</span>
                </div>
                <p className="text-sm font-bold text-white">
                  {t.flowerSection.floweringSpan}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>{isBn ? 'মাটির বৈশিষ্ট্য' : 'Soil Nutrition'}</span>
                </div>
                <p className="text-sm font-bold text-white">
                  {t.flowerSection.soilNote}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Botanical Tree & Branch Viewer */}
          <div className="lg:col-span-7">
            <Suspense fallback={<div className="w-full h-96 bg-slate-900 rounded-xl animate-pulse" />}>
              <ShimulTree3DViewer />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};
