import React, { useState } from 'react';
import { Bus, Car, Ship, Bike, Calculator, Users, User, Heart, CheckCircle2, Navigation, Clock, CreditCard } from 'lucide-react';
import { travelGuideSteps, budgetCalculatorData } from '../../data/travelGuide';
import { useLanguage } from '../../locales/LanguageContext';

export const TravelGuideSection: React.FC = () => {
  const { t, isBn } = useLanguage();
  const [budgetType, setBudgetType] = useState<'solo' | 'couple' | 'group'>('couple');

  const selectedBudget = budgetCalculatorData[budgetType];

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'bus': return Bus;
      case 'car': return Car;
      case 'boat': return Ship;
      case 'bike': return Bike;
      default: return Navigation;
    }
  };

  return (
    <section id="travel-guide" className="relative w-full py-20 lg:py-24 bg-slate-50 text-slate-900 border-b border-slate-200 bg-grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest mb-4">
            <Navigation className="w-3.5 h-3.5 text-[#C62828]" />
            <span>{t.travelGuide.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali-serif tracking-tight text-slate-900 leading-tight mb-4">
            {t.travelGuide.title}
          </h2>

          <p className="text-base text-slate-500 font-normal leading-relaxed">
            {t.travelGuide.subtitle}
          </p>
        </div>

        {/* 4 Sequential Transit Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {travelGuideSteps.map((step) => {
            const IconComp = getStepIcon(step.iconName);
            return (
              <div
                key={step.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Step Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white text-xs font-bold font-mono flex items-center justify-center shadow-xs">
                      {step.stepNumber}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Step Title & Details */}
                  <div className="space-y-1.5 mb-5">
                    <h3 className="text-base font-bold text-slate-900 font-bengali-serif leading-snug">
                      {isBn ? step.titleBn : step.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">
                      {isBn ? step.descriptionBn : step.descriptionEn}
                    </p>
                  </div>
                </div>

                {/* Footer Metrics: Time & Estimated Cost */}
                <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#C62828]" />
                    <span className="truncate">{isBn ? step.durationBn : step.durationEn}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? step.costRangeBn : step.costRangeEn}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Travel Budget Calculator */}
        <div className="bg-slate-900 rounded-xl p-6 sm:p-8 lg:p-10 text-white shadow-sm border border-slate-800 relative overflow-hidden">
          {/* Calculator Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-800 pb-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 text-[11px] text-slate-300 font-semibold mb-2 uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.travelGuide.budgetEstimatorTitle}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-bengali-serif text-white">
                {isBn ? 'সঠিক খরচের বাজেট হিসাব করুন' : 'Estimated Travel Expense Calculator'}
              </h3>
            </div>

            {/* Segmented Selector for Budget Persona */}
            <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setBudgetType('solo')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  budgetType === 'solo'
                    ? 'bg-slate-800 text-white shadow-2xs border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{isBn ? 'একক' : 'Solo'}</span>
              </button>

              <button
                onClick={() => setBudgetType('couple')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  budgetType === 'couple'
                    ? 'bg-[#C62828] text-white shadow-2xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{isBn ? 'দম্পতি' : 'Couple'}</span>
              </button>

              <button
                onClick={() => setBudgetType('group')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  budgetType === 'group'
                    ? 'bg-slate-800 text-white shadow-2xs border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{isBn ? 'গ্রুপ' : 'Group (4-6)'}</span>
              </button>
            </div>
          </div>

          {/* Calculator Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Total Cost Display Box */}
            <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-lg p-6 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                {isBn ? selectedBudget.titleBn : selectedBudget.titleEn}
              </span>
              <p className="text-xs text-slate-400 mb-3">
                {isBn ? '২ দিন ১ রাত ভ্রমণের সম্ভাব্য মোট খরচ' : 'Estimated total cost for 2 Days / 1 Night itinerary'}
              </p>
              <div className="text-4xl sm:text-5xl font-extrabold text-white font-modern tracking-tight mb-2 text-rose-400">
                {isBn ? selectedBudget.totalBn : selectedBudget.totalEn}
              </div>
              <p className="text-[11px] text-slate-500 font-light">
                {isBn
                  ? '* বাসের শ্রেণি ও পছন্দের উপর ভিত্তি করে কিছুটা পরিবর্তিত হতে পারে।'
                  : '* Final cost varies slightly depending on transport class and choices.'}
              </p>
            </div>

            {/* Cost Breakdown List */}
            <div className="lg:col-span-7 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {isBn ? 'বিস্তারিত খরচের খাতসমূহ:' : 'Cost Breakdown Items:'}
              </p>
              {(isBn ? selectedBudget.breakdownBn : selectedBudget.breakdownEn).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-md bg-slate-950/50 border border-slate-800/80 text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
