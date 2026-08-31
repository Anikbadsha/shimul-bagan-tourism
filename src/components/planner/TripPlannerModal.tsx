import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, Calendar, Users, Phone, Mail, User, Compass } from 'lucide-react';
import { TripInquiryForm } from '../../types';
import { useLanguage } from '../../locales/LanguageContext';
import { submitTripInquiry } from '../../hooks/useLiveData';

interface TripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPackage?: string;
}

export const TripPlannerModal: React.FC<TripPlannerModalProps> = ({
  isOpen,
  onClose,
  preselectedPackage = ''
}) => {
  const { t, isBn } = useLanguage();

  const [formData, setFormData] = useState<TripInquiryForm>({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'tour',
    travelDate: '',
    travelersCount: '2',
    selectedPackage: preselectedPackage,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitTripInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        guests: parseInt(formData.travelersCount) || 2,
        date: formData.travelDate,
        inquiry_type: formData.inquiryType,
        package_name: formData.selectedPackage || '',
        message: formData.message
      });
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      console.error('Submit error', err);
      // Fallback to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('shimul_bagan_inquiries') || '[]');
        existing.push({ ...formData, submittedAt: new Date().toISOString() });
        localStorage.setItem('shimul_bagan_inquiries', JSON.stringify(existing));
      } catch {}
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-white my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success State */
          <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold font-bengali-serif text-white">
              {t.tripPlanner.successTitle}
            </h3>

            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-light">
              {t.tripPlanner.successMsg}
            </p>

            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="mt-6 px-6 py-2.5 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
            >
              {isBn ? 'ঠিক আছে' : 'Got it, Thanks!'}
            </button>
          </div>
        ) : (
          /* Form Content */
          <div>
            {/* Header */}
            <div className="mb-5 space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-800 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-slate-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isBn ? 'অফিশিয়াল ট্যুর ও ভ্রমণ সহায়তা' : 'Official Travel Assistance'}</span>
              </div>
              <h2 className="text-2xl font-bold font-bengali-serif">
                {t.tripPlanner.title}
              </h2>
              <p className="text-xs text-slate-400 font-light">
                {t.tripPlanner.subtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Name */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5 text-xs">
                    <User className="w-3.5 h-3.5 text-rose-400" />
                    <span>{t.tripPlanner.nameLabel} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isBn ? 'আপনার নাম লিখুন' : 'e.g. Farhad Hossain'}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5 text-xs">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.tripPlanner.phoneLabel} *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={isBn ? '০১৭XXXXXXXX' : '+880 17XXXXXXXX'}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Email */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5 text-xs">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t.tripPlanner.emailLabel}</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@domain.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5 text-xs">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.tripPlanner.inquiryTypeLabel}</span>
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value as TripInquiryForm['inquiryType'] })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-rose-500 text-xs"
                  >
                    <option value="tour">{isBn ? 'ট্যুর প্যাকেজ ও গাইড' : 'Tour Package & Guide'}</option>
                    <option value="stay">{isBn ? 'হোটেল ও হাউজবোট বুকিং' : 'Hotel / Houseboat Stay'}</option>
                    <option value="photography">{isBn ? 'ফটোগ্রাফি ও ড্রোন শ্যুট' : 'Photography & Drone'}</option>
                    <option value="general">{isBn ? 'সাধারণ ভ্রমণ পরামর্শ' : 'General Travel Query'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Travel Date */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span>{t.tripPlanner.travelDateLabel}</span>
                  </label>
                  <input
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>

                {/* Number of Travelers */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5 text-xs">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t.tripPlanner.travelersLabel}</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.travelersCount}
                    onChange={(e) => setFormData({ ...formData, travelersCount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-slate-300 font-medium mb-1 text-xs">
                  {t.tripPlanner.messageLabel}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={isBn ? 'আপনার কোনো বিশেষ প্রশ্ন বা রিকোয়েস্ট থাকলে এখানে লিখুন...' : 'Any special preferences or queries...'}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-[#C62828] hover:bg-[#a82020] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{t.tripPlanner.submitting}</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.tripPlanner.submitBtn}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
