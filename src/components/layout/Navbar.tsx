import React, { useState, useEffect } from 'react';
import { Menu, X, Compass, Globe, Sparkles, MapPin, Calendar, BookOpen, Camera, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../locales/LanguageContext';

interface NavbarProps {
  onOpenTripPlanner: () => void;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTripPlanner,
  isAudioPlaying = false,
  onToggleAudio
}) => {
  const { isBn, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.explore, href: '#explore', icon: Compass },
    { label: t.nav.destinations, href: '#destinations', icon: MapPin },
    { label: t.nav.seasonal, href: '#seasonal', icon: Calendar },
    { label: t.nav.travelGuide, href: '#travel-guide', icon: BookOpen },
    { label: t.nav.gallery, href: '#gallery', icon: Camera },
    { label: t.nav.packages, href: '#packages', icon: Sparkles }
  ];

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm text-slate-900'
            : 'py-4 bg-slate-950/70 backdrop-blur-sm border-b border-white/10 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 group focus:outline-none shrink-0"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src="/logo.png"
              alt="Shimul Bagan"
              className="w-10 h-10 rounded-full object-cover shadow-sm transition-transform duration-200 group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <span className={`text-base md:text-lg font-extrabold tracking-tight block font-bengali-serif leading-none ${
                scrolled ? 'text-slate-900' : 'text-white'
              }`}>
                {t.nav.brand}
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-widest block mt-0.5 ${
                scrolled ? 'text-slate-500' : 'text-slate-300'
              }`}>
                {t.nav.brandSub}
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className={`hidden lg:flex items-center gap-0.5 px-2 py-1 rounded-lg border shadow-xs overflow-x-auto scrollbar-none ${
            scrolled
              ? 'bg-slate-50 border-slate-200 text-slate-600'
              : 'bg-white/10 border-white/15 text-white/90 backdrop-blur-md'
          }`}>
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`px-2 py-1.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    scrolled
                      ? 'hover:text-slate-900 hover:bg-white'
                      : 'hover:text-white hover:bg-white/15'
                  }`}
                >
                  <IconComponent className={`w-3 h-3 shrink-0 ${scrolled ? 'text-slate-700' : 'text-slate-300'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Ambient Sound Toggle */}
            {onToggleAudio && (
              <button
                onClick={onToggleAudio}
                className={`p-2 rounded-md border text-xs flex items-center justify-center transition-all ${
                  isAudioPlaying
                    ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs'
                    : scrolled
                    ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
                }`}
                title={isAudioPlaying ? t.hero.soundOff : t.hero.soundOn}
              >
                {isAudioPlaying ? (
                  <Volume2 className="w-4 h-4 animate-pulse text-white" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border transition-all active:scale-95 ${
                scrolled
                  ? 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md'
              }`}
            >
              <Globe className={`w-3 h-3 ${scrolled ? 'text-slate-600' : 'text-slate-300'}`} />
              <span>{isBn ? 'EN' : 'বাং'}</span>
            </button>

            {/* Plan Your Trip CTA */}
            <button
              onClick={onOpenTripPlanner}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold tracking-wider whitespace-nowrap transition-all shadow-sm active:scale-95 ${
                scrolled
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-[#C62828] hover:bg-[#b71c1c] text-white border border-white/20'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{isBn ? 'ভ্রমণ পরিকল্পনা' : 'Plan Trip'}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-md border ${
                scrolled
                  ? 'bg-slate-100 text-slate-800 border-slate-200'
                  : 'bg-white/10 text-white border-white/20'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/98 backdrop-blur-xl flex flex-col justify-between p-6 pt-24 text-white lg:hidden animate-in fade-in duration-200">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-4 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                {t.nav.brandSub}
              </span>
              <h2 className="text-2xl font-bold font-bengali-serif mt-1 text-white">{t.nav.brand}</h2>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="flex items-center gap-3 w-full p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-left text-xs uppercase tracking-wider font-semibold transition-all"
                  >
                    <div className="p-2 rounded-md bg-slate-800 text-slate-300">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTripPlanner();
              }}
              className="w-full py-3.5 px-4 rounded-md bg-[#C62828] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.nav.planTrip}</span>
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 font-mono">
              <button onClick={toggleLanguage} className="flex items-center gap-2 text-white">
                <Globe className="w-4 h-4 text-slate-400" />
                <span>{isBn ? 'Switch to English' : 'বাংলায় দেখুন'}</span>
              </button>
              <span>{t.hero.coordinates}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
