import React from 'react';
import { Trees, Calendar, Mountain, HeartHandshake, Sparkles, Quote, Award } from 'lucide-react';
import { useLanguage } from '../../locales/LanguageContext';
import joynalAbedinPhoto from '../../assets/images/Joynal Abedin.jpg';

export const IntroStorySection: React.FC = () => {
  const { t, isBn } = useLanguage();

  const stats = [
    {
      value: t.intro.statBigha,
      label: t.intro.statBighaLabel,
      icon: Trees,
      color: 'text-slate-900'
    },
    {
      value: t.intro.statTrees,
      label: t.intro.statTreesLabel,
      icon: Sparkles,
      color: 'text-[#C62828]'
    },
    {
      value: t.intro.statFounded,
      label: t.intro.statFoundedLabel,
      icon: Calendar,
      color: 'text-slate-700'
    },
    {
      value: t.intro.statRiver,
      label: t.intro.statRiverLabel,
      icon: Mountain,
      color: 'text-slate-600'
    }
  ];

  return (
    <section id="explore" className="relative w-full py-20 lg:py-24 bg-slate-50 text-slate-900 border-b border-slate-200 bg-grid-pattern">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 mb-6 shadow-xs">
            <Quote className="w-3.5 h-3.5 text-[#C62828]" />
            <span>{isBn ? 'ঐতিহাসিক পটভূমি' : 'HISTORICAL ORIGIN'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali-serif tracking-tight text-slate-900 leading-tight mb-6">
            {t.intro.quoteHeading}
          </h2>

          <div className="w-16 h-1 bg-[#C62828] mx-auto mb-6 rounded-full" />

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed text-balance">
            {t.intro.founderIntro}
          </p>
        </div>

        {/* 4 Executive Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {stats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col items-center text-center group"
              >
                <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center mb-4 text-slate-800 group-hover:bg-slate-200 transition-colors">
                  <IconComp className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-modern mb-1">
                  {stat.value}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Founder & History Maker Feature Showcase */}
        <div className="mt-12 bg-slate-900 rounded-2xl p-6 sm:p-8 md:p-10 text-white shadow-md border border-slate-800 flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
          {/* Portrait Photo Container */}
          <div className="relative shrink-0 flex flex-col items-center">
            <div className="relative w-44 sm:w-52 md:w-56 aspect-[4/5] rounded-xl overflow-hidden border-2 border-slate-700/80 shadow-xl ring-4 ring-slate-800/50 group">
              <img
                src={joynalAbedinPhoto}
                alt={isBn ? 'মরহুম আলহাজ্ব জয়নাল আবেদীন - শিমুল বাগানের স্বপ্নদ্রষ্টা ও রূপকার' : 'Late Alhaj Joynal Abedin - Founder of Shimul Bagan'}
                width="224"
                height="280"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 inset-x-2.5 text-center">
                <span className="inline-block px-2 py-0.5 rounded bg-slate-950/90 backdrop-blur-md text-[10px] font-bold text-rose-400 uppercase tracking-widest border border-slate-700/50">
                  {isBn ? 'প্রতিষ্ঠাতা ও রূপকার' : 'Founder & Visionary'}
                </span>
              </div>
            </div>
            <div className="mt-2.5 text-center">
              <span className="text-xs font-semibold text-slate-300 block">
                {isBn ? 'মরহুম আলহাজ্ব জয়নাল আবেদীন' : 'Late Alhaj Joynal Abedin'}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {isBn ? 'বাদাঘাট, তাহিরপুর, সুনামগঞ্জ' : 'Badaghat, Tahirpur, Sunamganj'}
              </span>
            </div>
          </div>

          {/* Description and Tribute */}
          <div className="space-y-4 flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-rose-500/10 text-xs text-rose-400 font-bold tracking-wider uppercase border border-rose-500/20">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
              <span>{isBn ? 'ঐতিহাসিক রূপকার ও স্বপ্নদ্রষ্টা' : 'The Visionary History Maker'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-bengali-serif text-white leading-snug">
              {isBn ? 'মরহুম আলহাজ্ব জয়নাল আবেদীন' : 'Late Alhaj Joynal Abedin'}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {isBn
                ? 'অনাবাদী এক ধু-ধু বালুচরে নিজ খরচে ও ভালোবাসায় তিন সহস্রাধিক শিমুল চারা রোপণের মাধ্যমে যিনি গড়ে তুলেছিলেন এক অপরূপ প্রাকৃতিক বিস্ময়। বাণিজ্যিক লাভের আশা না করে কেবল প্রকৃতির প্রতি অসীম প্রেম ও মানুষের কল্যাণে তাঁর সেই অদম্য দূরদর্শিতার কারণে আজ তাহিরপুর সারা বিশ্বের ভ্রমণপিপাসুদের এক স্বপ্নের ঠিকানা।'
                : 'Through selfless personal investment and an enduring devotion to nature, he hand-planted over 3,000 crimson silk-cotton saplings on a barren sandy riverbed along the Jadukata. Today, his vision stands as Bangladesh’s largest red blossom sanctuary, empowering the local community and mesmerizing travelers.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 text-center lg:text-left">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
                  {isBn ? 'প্রতিষ্ঠা বর্ষ' : 'FOUNDED'}
                </span>
                <span className="text-lg font-bold text-white font-mono">2002</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 text-center lg:text-left">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
                  {isBn ? 'মোট আয়তন' : 'AREA'}
                </span>
                <span className="text-lg font-bold text-white font-mono">{isBn ? '১০০+ বিঘা' : '100+ Bigha'}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 text-center lg:text-left col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
                  {isBn ? 'বৃক্ষসংখ্যা' : 'TREES'}
                </span>
                <span className="text-lg font-bold text-rose-400 font-mono">{isBn ? '১৮০০+' : '1,800+'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
