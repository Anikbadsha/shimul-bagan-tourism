import React from 'react';
import { Sparkles, Clock, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { tourPackagesData as fallbackData } from '../../data/tours';
import { useLanguage } from '../../locales/LanguageContext';
import { useLiveData } from '../../hooks/useLiveData';

interface TourPackagesSectionProps {
  onSelectPackageForInquiry: (packageName: string) => void;
}

export const TourPackagesSection: React.FC<TourPackagesSectionProps> = ({
  onSelectPackageForInquiry
}) => {
  const { t, isBn } = useLanguage();
  const packages = useLiveData<any>('tour_packages', fallbackData);

  return (
    <section id="packages" className="relative w-full py-20 lg:py-24 bg-white text-slate-900 border-b border-slate-200 bg-grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-rose-600 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tours.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali-serif tracking-tight text-slate-900 leading-tight mb-4">
            {t.tours.title}
          </h2>

          <p className="text-base text-slate-500 font-normal leading-relaxed">
            {t.tours.subtitle}
          </p>
        </div>

        {/* Tour Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between group relative"
              >
                {/* Optional Top Tag */}
                {pkg.tagBn && (
                  <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-md bg-[#C62828] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    {isBn ? pkg.tagBn : pkg.tagEn}
                  </div>
                )}

                {/* Package Header */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isBn ? pkg.durationBn : pkg.durationEn}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 font-bengali-serif leading-snug mb-2">
                    {isBn ? pkg.titleBn : pkg.titleEn}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-5 font-light">
                    {isBn ? pkg.subtitleBn : pkg.subtitleEn}
                  </p>

                  {/* Destinations Included Chips */}
                  {pkg.destinations && pkg.destinations.length > 0 && (
                    <div className="mb-5 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {isBn ? 'অন্তর্ভুক্ত গন্তব্যসমূহ:' : 'Key Destinations:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.destinations.map((dest: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700 border border-slate-200"
                          >
                            {dest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Inclusions Checklist */}
                  {pkg.inclusionsEn && (
                    <div className="space-y-1.5 mb-6 pt-4 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {t.tours.inclusionsLabel}:
                      </span>
                      {(isBn ? pkg.inclusionsBn : pkg.inclusionsEn).map((inc: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Button & Note */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onSelectPackageForInquiry(isBn ? pkg.titleBn : pkg.titleEn)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-[#C62828] text-white text-xs font-bold tracking-wide transition-colors cursor-pointer shadow-2xs active:scale-98"
                  >
                    <span>{t.tours.inquireBtn}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="block text-center text-[10px] text-slate-400 mt-2 font-light">
                    {isBn ? pkg.priceNoteBn : pkg.priceNoteEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
};
