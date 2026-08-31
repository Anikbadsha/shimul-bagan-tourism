import React from 'react';
import { Heart, Quote, MapPin, Award } from 'lucide-react';
import { communityStories } from '../../data/community';
import { useLiveData } from '../../hooks/useLiveData';
import { useLanguage } from '../../locales/LanguageContext';

export const CommunityVoicesSection: React.FC = () => {
  const { t, isBn } = useLanguage();
  const allCommunity = useLiveData<any>('community_stories', communityStories);

  return (
    <section className="relative w-full py-20 lg:py-24 bg-slate-50 text-slate-900 border-b border-slate-200 bg-grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-rose-600 text-xs font-bold uppercase tracking-widest mb-4">
            <Heart className="w-3.5 h-3.5" />
            <span>{t.community.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali-serif tracking-tight text-slate-900 leading-tight mb-4">
            {t.community.title}
          </h2>

          <p className="text-base text-slate-500 font-normal leading-relaxed">
            {t.community.subtitle}
          </p>
        </div>

        {/* 3 People Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allCommunity.map((person) => (
            <div
              key={person.id}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Person Header with Photo & Role */}
                <div className="flex items-center gap-3.5 mb-5">
                  <img
                    src={person.avatarUrl}
                    alt={isBn ? person.nameBn : person.nameEn}
                    className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-200 shadow-2xs"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-bengali-serif leading-snug">
                      {isBn ? person.nameBn : person.nameEn}
                    </h3>
                    <p className="text-xs text-rose-600 font-semibold">
                      {isBn ? person.roleBn : person.roleEn}
                    </p>
                  </div>
                </div>

                {/* Quote Box */}
                <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 mb-4 relative">
                  <Quote className="w-4 h-4 text-rose-500/40 mb-1" />
                  <p className="text-xs sm:text-sm font-medium italic text-slate-800 leading-relaxed">
                    {isBn ? person.quoteBn : person.quoteEn}
                  </p>
                </div>

                {/* Short Story */}
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  {isBn ? person.storyBn : person.storyEn}
                </p>
              </div>

              {/* Card Footer: Location & Experience */}
              <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {isBn ? person.locationBn : person.locationEn}
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Award className="w-3.5 h-3.5 text-rose-600" />
                  {isBn ? person.yearsOfExperienceBn : person.yearsOfExperienceEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
