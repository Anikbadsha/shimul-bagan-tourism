import React, { useState } from 'react';
import { Star, MapPin, CheckCircle2, Home } from 'lucide-react';
import { hotelsData } from '../../data/hotels';
import { useLanguage } from '../../locales/LanguageContext';

export const HotelDiscoverySection: React.FC = () => {
  const { t, isBn } = useLanguage();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredHotels = filterCategory === 'all'
    ? hotelsData
    : hotelsData.filter((h) => h.priceCategory === filterCategory);

  return (
    <section id="hotels" className="relative w-full py-20 lg:py-24 bg-slate-900 text-white border-b border-slate-800 bg-grid-pattern-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-rose-400 font-bold uppercase tracking-widest mb-4">
            <Home className="w-3.5 h-3.5" />
            <span>{t.hotels.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali-serif tracking-tight text-white leading-tight mb-4">
            {t.hotels.title}
          </h2>

          <p className="text-base text-slate-400 font-light leading-relaxed">
            {t.hotels.subtitle}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: isBn ? 'সকল বিকল্প' : 'All Accommodations' },
            { id: 'budget', label: isBn ? 'বাজেট ও হোমস্টে' : 'Budget & Homestays' },
            { id: 'mid', label: isBn ? 'স্ট্যান্ডার্ড হোটেল' : 'Standard Hotels' },
            { id: 'premium', label: isBn ? 'প্রিমিয়াম হাউজবোট' : 'Premium Houseboats' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-slate-950/70 rounded-xl overflow-hidden border border-slate-800 shadow-sm flex flex-col sm:flex-row group hover:border-slate-700 transition-all duration-300"
            >
              {/* Hotel Photo Banner */}
              <div className="sm:w-2/5 relative h-52 sm:h-auto overflow-hidden">
                <img
                  src={hotel.imageUrl}
                  alt={isBn ? hotel.nameBn : hotel.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-slate-700">
                  {isBn ? hotel.stayTypeBn : hotel.stayTypeEn}
                </div>
              </div>

              {/* Hotel Info Content */}
              <div className="sm:w-3/5 p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-white font-bengali-serif leading-snug">
                      {isBn ? hotel.nameBn : hotel.nameEn}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{hotel.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>{isBn ? hotel.locationBn : hotel.locationEn}</span>
                  </div>

                  <p className="text-xs font-semibold text-emerald-400 mb-3">
                    {isBn ? hotel.priceIndicatorBn : hotel.priceIndicatorEn}
                  </p>

                  {/* Amenities */}
                  <div className="space-y-1">
                    {(isBn ? hotel.amenitiesBn : hotel.amenitiesEn).slice(0, 3).map((amenity, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Note */}
                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-light">
                  <span>{isBn ? hotel.contactNoteBn : hotel.contactNoteEn}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
