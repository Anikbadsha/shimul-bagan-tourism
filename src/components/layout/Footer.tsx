import React from 'react';
import { MapPin, ArrowUp } from 'lucide-react';
import { useLanguage } from '../../locales/LanguageContext';

export const Footer: React.FC = () => {
  const { t, isBn } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12 bg-grid-pattern-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#C62828] flex items-center justify-center text-white font-bold font-bengali-serif text-lg shadow-xs">
                শ
              </div>
              <div>
                <h3 className="text-lg font-bold font-bengali-serif text-white leading-none">
                  {t.nav.brand}
                </h3>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block mt-0.5">
                  {t.nav.brandSub}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-light">
              {t.footer.brandBio}
            </p>

            <div className="flex items-start gap-2 text-xs text-slate-300 pt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>{t.footer.locationText}</span>
            </div>

            <div className="pt-1">
              <p className="text-[11px] text-rose-300/90 italic font-light">
                {t.footer.founderTribute}
              </p>
            </div>
          </div>

          {/* Quick Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {t.footer.sectionsHeader}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#explore" className="hover:text-white transition-colors">{t.nav.explore}</a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-white transition-colors">{t.nav.destinations}</a>
              </li>
              <li>
                <a href="#seasonal" className="hover:text-white transition-colors">{t.nav.seasonal}</a>
              </li>
              <li>
                <a href="#travel-guide" className="hover:text-white transition-colors">{t.nav.travelGuide}</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">{t.nav.gallery}</a>
              </li>
            </ul>
          </div>

          {/* Attractions (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {t.footer.attractionsHeader}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#shimul-bagan" className="hover:text-white transition-colors">
                  {isBn ? 'শিমুল বাগান (মানিগাঁও)' : 'Shimul Bagan (Manigaon)'}
                </a>
              </li>
              <li>
                <a href="#jadukata-river" className="hover:text-white transition-colors">
                  {isBn ? 'যাদুকাটা নদী ও রূপালী বালুচর' : 'Jadukata River & Sandbars'}
                </a>
              </li>
              <li>
                <a href="#barek-tila" className="hover:text-white transition-colors">
                  {isBn ? 'বারেক টিলা ভিউপয়েন্ট' : 'Barek Tila Border Viewpoint'}
                </a>
              </li>
              <li>
                <a href="#niladri-lake" className="hover:text-white transition-colors">
                  {isBn ? 'নীলাদ্রি লেক (শহীদ সিরাজ লেক)' : 'Niladri Lake (Shahid Siraj)'}
                </a>
              </li>
              <li>
                <a href="#tanguar-haor" className="hover:text-white transition-colors">
                  {isBn ? 'টাঙ্গুয়ার হাওর রামসার সাইট' : 'Tanguar Haor Ramsar Site'}
                </a>
              </li>
            </ul>
          </div>

          {/* Safety & Responsible Tourism (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {t.footer.legalHeader}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400 font-light">
              <li>• {isBn ? 'ফুল ও ডাল ছেঁড়া নিষেধ' : 'Do not pluck flowers'}</li>
              <li>• {isBn ? 'প্লাস্টিক বর্জ্য ফেলবেন না' : 'Zero plastic waste policy'}</li>
              <li>• {isBn ? 'সীমান্ত শৃঙ্খলা মেনে চলুন' : 'Respect border markers'}</li>
              <li>• {isBn ? 'লাইফ জ্যাকেট ব্যবহার করুন' : 'Wear life jacket on boats'}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{t.footer.copyright}</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <span>{isBn ? 'উপরে ফিরুন' : 'Back to Top'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
