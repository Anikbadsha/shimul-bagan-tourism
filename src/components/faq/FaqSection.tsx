import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { faqsData } from '../../data/community';
import { useLiveData } from '../../hooks/useLiveData';
import { useLanguage } from '../../locales/LanguageContext';

export const FaqSection: React.FC = () => {
  const { t, isBn } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const allFaqs = useLiveData<any>('faq_items', faqsData);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full py-20 lg:py-24 bg-slate-950 text-white border-b border-slate-800 bg-grid-pattern-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-rose-400 font-bold uppercase tracking-widest mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.faq.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali-serif tracking-tight text-white leading-tight mb-4">
            {t.faq.title}
          </h2>

          <p className="text-base text-slate-400 font-light leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {allFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden transition-all duration-200 shadow-2xs"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/60 transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="text-base font-bold font-bengali-serif text-white">
                    {isBn ? faq.questionBn : faq.questionEn}
                  </span>
                  <div className={`p-1.5 rounded-md bg-slate-800 text-slate-300 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-rose-600 text-white' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 animate-in fade-in duration-200 font-light">
                    <p>{isBn ? faq.answerBn : faq.answerEn}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
