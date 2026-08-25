import React, { useState, useEffect } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, MapPin, User, Maximize2 } from 'lucide-react';
import { galleryData } from '../../data/gallery';
import { useLanguage } from '../../locales/LanguageContext';

export const GalleryExperience: React.FC = () => {
  const { t, isBn } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: t.gallery.filterAll },
    { id: 'shimul', label: t.gallery.filterShimul },
    { id: 'nature', label: t.gallery.filterNature },
    { id: 'jadukata', label: t.gallery.filterJadukata },
    { id: 'mountains', label: t.gallery.filterMountains },
    { id: 'tahirpur', label: t.gallery.filterTahirpur },
    { id: 'people', label: t.gallery.filterPeople }
  ];

  const filteredItems = selectedCategory === 'all'
    ? galleryData
    : galleryData.filter((item) => item.category === selectedCategory);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredItems.length]);

  const activePhoto = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <section id="gallery" className="relative w-full py-20 lg:py-24 bg-slate-950 text-white border-b border-slate-800 bg-grid-pattern-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-rose-400 font-bold uppercase tracking-widest mb-4">
            <Camera className="w-3.5 h-3.5" />
            <span>{t.gallery.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali-serif tracking-tight text-white leading-tight mb-4">
            {t.gallery.title}
          </h2>

          <p className="text-base text-slate-400 font-light leading-relaxed">
            {t.gallery.subtitle}
          </p>
        </div>

        {/* Filter Categories Pill Bar */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxIndex(index)}
              className={`relative rounded-xl overflow-hidden cursor-pointer group shadow-sm border border-slate-800 bg-slate-900 ${
                item.aspectRatio === 'portrait' ? 'sm:row-span-2' : ''
              }`}
            >
              <img
                src={item.imageUrl}
                alt={isBn ? item.titleBn : item.titleEn}
                className="w-full h-full min-h-[240px] object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Expand Icon */}
              <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-md bg-slate-950/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-slate-700">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>

              {/* Caption Overlay */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-200">
                <h3 className="text-sm font-bold text-white font-bengali-serif leading-snug">
                  {isBn ? item.titleBn : item.titleEn}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mt-1">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  <span>{isBn ? item.locationBn : item.locationEn}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Lightbox Top Controls */}
          <div className="flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#C62828] text-[10px] font-bold uppercase tracking-wider">
                {activePhoto.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeLightboxIndex! + 1} / {filteredItems.length}
              </span>
            </div>

            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="p-2 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Photo Center Container */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
              }}
              className="absolute left-2 sm:left-4 z-20 p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 transition-all active:scale-95 cursor-pointer"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <img
              src={activePhoto.imageUrl}
              alt={isBn ? activePhoto.titleBn : activePhoto.titleEn}
              className="max-h-[70vh] sm:max-h-[78vh] max-w-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
            />

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-2 sm:right-4 z-20 p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 transition-all active:scale-95 cursor-pointer"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Footer Details */}
          <div className="max-w-2xl mx-auto text-center space-y-1.5 text-white z-10 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h3 className="text-base font-bold font-bengali-serif">
              {isBn ? activePhoto.titleBn : activePhoto.titleEn}
            </h3>
            <p className="text-xs text-slate-300 max-w-xl mx-auto font-light">
              {isBn ? activePhoto.captionBn : activePhoto.captionEn}
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {isBn ? activePhoto.locationBn : activePhoto.locationEn}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                {t.gallery.photoBy} {activePhoto.photographer}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
