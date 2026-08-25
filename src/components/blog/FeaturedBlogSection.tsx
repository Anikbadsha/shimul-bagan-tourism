import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, ArrowRight, User, X, Share2, Check } from 'lucide-react';
import { storiesData } from '../../data/stories';
import { BlogPost } from '../../types';
import { useLanguage } from '../../locales/LanguageContext';

export const FeaturedBlogSection: React.FC = () => {
  const { t, isBn } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="stories" className="relative w-full py-20 lg:py-24 bg-slate-900 text-white border-b border-slate-800 bg-grid-pattern-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-rose-400 font-bold uppercase tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.blog.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali-serif tracking-tight text-white leading-tight mb-4">
            {t.blog.title}
          </h2>

          <p className="text-base text-slate-400 font-light leading-relaxed">
            {t.blog.subtitle}
          </p>
        </div>

        {/* Blog Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {storiesData.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelectedArticle(story)}
              className="bg-slate-950/70 rounded-xl overflow-hidden border border-slate-800 shadow-sm flex flex-col justify-between cursor-pointer group hover:border-slate-700 transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={story.coverImage}
                  alt={isBn ? story.titleBn : story.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3.5 left-3.5 px-2.5 py-0.5 rounded-md bg-[#C62828] text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                  {isBn ? story.categoryBn : story.categoryEn}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-400" />
                      {isBn ? story.readTimeBn : story.readTimeEn}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      {isBn ? story.publishedDateBn : story.publishedDateEn}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-bengali-serif leading-snug mb-2 group-hover:text-rose-300 transition-colors">
                    {isBn ? story.titleBn : story.titleEn}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 font-light">
                    {isBn ? story.excerptBn : story.excerptEn}
                  </p>
                </div>

                {/* Footer Link */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-semibold">
                  <span className="text-slate-400 font-normal">{isBn ? story.authorBn : story.authorEn}</span>
                  <div className="flex items-center gap-1 text-rose-400 group-hover:translate-x-0.5 transition-transform">
                    <span>{t.blog.readArticle}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-white p-6 sm:p-8 my-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              aria-label="Close Article"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Article Header */}
            <div className="space-y-3 border-b border-slate-800 pb-5 mb-5">
              <span className="px-2.5 py-0.5 rounded-md bg-[#C62828] text-[10px] font-bold uppercase tracking-wider text-white inline-block">
                {isBn ? selectedArticle.categoryBn : selectedArticle.categoryEn}
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold font-bengali-serif leading-snug">
                {isBn ? selectedArticle.titleBn : selectedArticle.titleEn}
              </h2>

              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-rose-400" />
                  <span className="font-semibold text-white">{isBn ? selectedArticle.authorBn : selectedArticle.authorEn}</span>
                  <span>({isBn ? selectedArticle.authorRoleBn : selectedArticle.authorRoleEn})</span>
                </div>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs text-white transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? (isBn ? 'লিংক কপি হয়েছে!' : 'Link Copied!') : (isBn ? 'শেয়ার করুন' : 'Share')}</span>
                </button>
              </div>
            </div>

            {/* Article Image */}
            <div className="rounded-xl overflow-hidden mb-5 h-60 sm:h-72">
              <img
                src={selectedArticle.coverImage}
                alt={isBn ? selectedArticle.titleBn : selectedArticle.titleEn}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content Paragraphs */}
            <div className="space-y-3 text-sm text-slate-300 leading-relaxed font-light">
              {(isBn ? selectedArticle.contentBn : selectedArticle.contentEn).map((paragraph, i) => (
                <p key={i} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap gap-1.5">
              {selectedArticle.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
