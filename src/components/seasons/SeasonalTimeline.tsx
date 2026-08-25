import React, { useState } from 'react';
import { Calendar, Sun, Droplets, Star, Sparkles, CheckCircle2, Eye } from 'lucide-react';
import { seasonsData } from '../../data/seasons';
import { useLanguage } from '../../locales/LanguageContext';

export const SeasonalTimeline: React.FC = () => {
  const { t, isBn } = useLanguage();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(2); // Default to February (peak bloom)

  const activeSeason = seasonsData.find((s) => s.monthIndex === selectedMonthIndex) || seasonsData[1];

  return (
    <section id="seasonal" className="relative w-full py-20 lg:py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest mb-4">
            <Calendar className="w-3.5 h-3.5 text-[#C62828]" />
            <span>{t.seasons.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali-serif tracking-tight text-slate-900 leading-tight mb-4">
            {t.seasons.title}
          </h2>

          <p className="text-base text-slate-500 font-normal leading-relaxed">
            {t.seasons.subtitle}
          </p>
        </div>

        {/* 12 Months Horizontal Selector Bar */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {seasonsData.map((item) => {
            const isSelected = item.monthIndex === selectedMonthIndex;
            return (
              <button
                key={item.monthIndex}
                onClick={() => setSelectedMonthIndex(item.monthIndex)}
                className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shrink-0 flex flex-col items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : item.isPeakSeason
                    ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-[#C62828]/40'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="tracking-wide">
                  {isBn ? item.monthBn : item.monthEn.slice(0, 3)}
                </span>
                {item.isPeakSeason && (
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    isSelected ? 'bg-rose-500 text-white' : 'bg-[#C62828] text-white'
                  }`}>
                    {isBn ? 'পিক' : 'PEAK'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Month Detailed Card */}
        <div className="bg-slate-50 rounded-xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-xs relative overflow-hidden">
          {/* Month Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-bengali-serif">
                  {isBn ? activeSeason.monthBn : activeSeason.monthEn}
                </h3>
                <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-semibold">
                  {isBn ? activeSeason.seasonBn : activeSeason.seasonEn}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {isBn ? `বাংলা মাস: ${activeSeason.bengaliMonth}` : `Bengali Season Cycle: ${activeSeason.bengaliMonth}`}
              </p>
            </div>

            {/* Travel Rating Score */}
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(activeSeason.travelRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">
                {activeSeason.travelRating} / 5.0
              </span>
            </div>
          </div>

          {/* 3 Major Condition Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Flower Condition */}
            <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C62828] uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.seasons.flowerStageLabel}</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {isBn ? activeSeason.bloomStatusBn : activeSeason.bloomStatusEn}
              </p>
            </div>

            {/* Haor Condition */}
            <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>{t.seasons.haorStatusLabel}</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {isBn ? activeSeason.haorConditionBn : activeSeason.haorConditionEn}
              </p>
            </div>

            {/* Weather & Climate */}
            <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.seasons.weatherLabel}</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {isBn ? activeSeason.weatherDescriptionBn : activeSeason.weatherDescriptionEn}
              </p>
            </div>
          </div>

          {/* Recommendation & Key Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-900 rounded-lg p-6 text-white border border-slate-800">
            <div className="lg:col-span-8 space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.seasons.recommendationLabel}</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-light">
                {isBn ? activeSeason.recommendationBn : activeSeason.recommendationEn}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-wrap gap-2 justify-start lg:justify-end">
              {(isBn ? activeSeason.highlightsBn : activeSeason.highlightsEn).map((hl, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700"
                >
                  <CheckCircle2 className="w-3 h-3 text-rose-400" />
                  <span>{hl}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
