import React from 'react';
import { Utensils, MapPin, Flame } from 'lucide-react';
import { foodData } from '../../data/food';
import { useLiveData } from '../../hooks/useLiveData';
import { useLanguage } from '../../locales/LanguageContext';

export const LocalFoodSection: React.FC = () => {
  const { t, isBn } = useLanguage();
  const allFoods = useLiveData<any>('local_foods', foodData);

  return (
    <section id="food" className="relative w-full py-20 lg:py-24 bg-slate-50 text-slate-900 border-b border-slate-200 bg-grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-rose-600 text-xs font-bold uppercase tracking-widest mb-4">
            <Utensils className="w-3.5 h-3.5" />
            <span>{t.food.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali-serif tracking-tight text-slate-900 leading-tight mb-4">
            {t.food.title}
          </h2>

          <p className="text-base text-slate-500 font-normal leading-relaxed">
            {t.food.subtitle}
          </p>
        </div>

        {/* Food Cards 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {allFoods.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between group"
            >
              {/* Food Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={isBn ? item.nameBn : item.nameEn}
                  width="400"
                  height="264"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                  {isBn ? item.categoryBn : item.categoryEn}
                </div>
              </div>

              {/* Food Description Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-bengali-serif leading-snug mb-1.5">
                    {isBn ? item.nameBn : item.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    {isBn ? item.descriptionBn : item.descriptionEn}
                  </p>
                </div>

                {/* Taste Note & Where to Find */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-start gap-1.5 text-rose-600 font-medium">
                    <Flame className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{isBn ? item.tasteNoteBn : item.tasteNoteEn}</span>
                  </div>

                  <div className="flex items-start gap-1.5 text-slate-500 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{isBn ? item.whereToFindBn : item.whereToFindEn}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
