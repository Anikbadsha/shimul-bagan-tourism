import React from 'react';
import { ArrowDown, Compass, Sparkles, MapPin, Wind, Calendar } from 'lucide-react';
import { Hero3DCanvas } from '../three/Hero3DCanvas';
import { useLanguage } from '../../locales/LanguageContext';
import HeroBanner from '../../assets/images/Hero_Banner.jpg';

interface HeroSectionProps {
  onOpenTripPlanner: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTripPlanner }) => {
  const { t } = useLanguage();

  const handleScrollToExplore = () => {
    const exploreElement = document.getElementById('explore');
    if (exploreElement) {
      exploreElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950 text-white">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={HeroBanner}
          alt="Shimul Bagan Crimson Blossom Canopy in Tahirpur Sunamganj"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.6] contrast-[1.1]"
        />
        {/* Layer 2: Atmosphere Vignette & Slate Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/80" />
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-30" />
      </div>

      {/* Layer 3: Interactive 3D WebGL Petal Physics Field */}
      <Hero3DCanvas interactive={true} />

      {/* Top Margin Spacer */}
      <div className="pt-28 md:pt-36" />

      {/* Hero Center Content: Crisp Executive Typography & Polish */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left my-auto py-12">
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white font-medium tracking-wide mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <Wind className="w-3.5 h-3.5 text-rose-300" />
          <span className="text-slate-200">{t.hero.taglineBadge}</span>
        </div>

        {/* Display Typography */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight font-bengali-serif leading-none text-white drop-shadow-sm">
          {t.hero.title}
        </h1>
        <p className="text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] text-slate-300 uppercase mt-3 mb-6 font-modern">
          {t.hero.titleEngSecondary}
        </p>

        {/* Subtitle / Poetic Tagline */}
        <p className="text-lg sm:text-2xl md:text-3xl font-serif text-slate-100 max-w-3xl mx-auto font-bengali-serif leading-relaxed mb-4">
          {t.hero.subheading}
        </p>

        {/* Editorial Paragraph */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          {t.hero.description}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={handleScrollToExplore}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[#C62828] hover:bg-[#b71c1c] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 border border-white/15"
          >
            <Compass className="w-4 h-4" />
            <span>{t.hero.ctaExplore}</span>
          </button>

          <button
            onClick={onOpenTripPlanner}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/25 shadow-sm transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.hero.ctaPlan}</span>
          </button>
        </div>
      </div>

      {/* Hero Bottom Bar: Live Bloom Info, Coordinates & Scroll Indicator */}
      <div className="relative z-20 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          {/* Coordinates */}
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-mono tracking-wider text-slate-300">{t.hero.coordinates}</span>
          </div>

          {/* Scroll Down Indicator */}
          <button
            onClick={handleScrollToExplore}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group cursor-pointer"
          >
            <span className="tracking-widest uppercase text-[10px] font-bold">
              {t.hero.scrollIndicator}
            </span>
            <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-slate-500 group-hover:bg-slate-800 transition-all">
              <ArrowDown className="w-3 h-3 animate-bounce text-slate-300" />
            </div>
          </button>

          {/* Current Season Badge */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-md text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-xs">{t.hero.bloomPeak}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
