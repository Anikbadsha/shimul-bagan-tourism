import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './locales/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { IntroStorySection } from './components/story/IntroStorySection';
import { FlowerSection } from './components/flower/FlowerSection';
import { SeasonalTimeline } from './components/seasons/SeasonalTimeline';
import { DestinationExplorer } from './components/destination/DestinationExplorer';
import { TravelGuideSection } from './components/travel/TravelGuideSection';
import { GalleryExperience } from './components/gallery/GalleryExperience';
import { TourPackagesSection } from './components/tours/TourPackagesSection';
import { HotelDiscoverySection } from './components/hotels/HotelDiscoverySection';
import { LocalFoodSection } from './components/food/LocalFoodSection';
import { FeaturedBlogSection } from './components/blog/FeaturedBlogSection';
import { CommunityVoicesSection } from './components/community/CommunityVoicesSection';
import { FaqSection } from './components/faq/FaqSection';
import { Footer } from './components/layout/Footer';
import { TripPlannerModal } from './components/planner/TripPlannerModal';
import { CustomCursor } from './components/ui/CustomCursor';
import { natureAudio } from './utils/audioSynth';
import { useState } from 'react';

// Lazy-loaded admin imports
const AdminLayout = React.lazy(() => import('./admin/components/AdminLayout').then(m => ({ default: m.AdminLayout })));
const ProtectedRoute = React.lazy(() => import('./admin/components/ProtectedRoute').then(m => ({ default: m.ProtectedRoute })));
const AdminLogin = React.lazy(() => import('./admin/pages/AdminLogin').then(m => ({ default: m.AdminLogin })));
const Dashboard = React.lazy(() => import('./admin/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const InquiriesAdmin = React.lazy(() => import('./admin/pages/InquiriesAdmin').then(m => ({ default: m.InquiriesAdmin })));
const TourPackagesAdmin = React.lazy(() => import('./admin/pages/TourPackagesAdmin').then(m => ({ default: m.TourPackagesAdmin })));
const HotelsAdmin = React.lazy(() => import('./admin/pages/HotelsAdmin').then(m => ({ default: m.HotelsAdmin })));
const GalleryAdmin = React.lazy(() => import('./admin/pages/GalleryAdmin').then(m => ({ default: m.GalleryAdmin })));
const BlogAdmin = React.lazy(() => import('./admin/pages/BlogAdmin').then(m => ({ default: m.BlogAdmin })));
const FaqAdmin = React.lazy(() => import('./admin/pages/FaqAdmin').then(m => ({ default: m.FaqAdmin })));
const CommunityAdmin = React.lazy(() => import('./admin/pages/CommunityAdmin').then(m => ({ default: m.CommunityAdmin })));
const FoodAdmin = React.lazy(() => import('./admin/pages/FoodAdmin').then(m => ({ default: m.FoodAdmin })));
const DestinationsAdmin = React.lazy(() => import('./admin/pages/DestinationsAdmin').then(m => ({ default: m.DestinationsAdmin })));
const AnalyticsAdmin = React.lazy(() => import('./admin/pages/AnalyticsAdmin').then(m => ({ default: m.AnalyticsAdmin })));

function AdminFallback() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function PublicSite() {
  const [isTripPlannerOpen, setIsTripPlannerOpen] = useState(false);
  const [selectedPackageForInquiry, setSelectedPackageForInquiry] = useState<string>('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleToggleAudio = () => {
    const status = natureAudio.toggle();
    setIsAudioPlaying(status);
  };

  const handleOpenTripPlanner = (packageName?: string) => {
    if (packageName) {
      setSelectedPackageForInquiry(packageName);
    } else {
      setSelectedPackageForInquiry('');
    }
    setIsTripPlannerOpen(true);
  };

  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-600 selection:text-white font-sans antialiased overflow-x-hidden">
        <CustomCursor />
        <Navbar
          onOpenTripPlanner={() => handleOpenTripPlanner()}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
        />
        <HeroSection onOpenTripPlanner={() => handleOpenTripPlanner()} />
        <IntroStorySection />
        <FlowerSection />
        <SeasonalTimeline />
        <DestinationExplorer />
        <TravelGuideSection />
        <GalleryExperience />
        <TourPackagesSection onSelectPackageForInquiry={(pkg) => handleOpenTripPlanner(pkg)} />
        <HotelDiscoverySection />
        <LocalFoodSection />
        <FeaturedBlogSection />
        <CommunityVoicesSection />
        <FaqSection />
        <Footer />
        <TripPlannerModal
          isOpen={isTripPlannerOpen}
          onClose={() => setIsTripPlannerOpen(false)}
          preselectedPackage={selectedPackageForInquiry}
        />
      </div>
    </LanguageProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public website */}
        <Route path="/" element={<PublicSite />} />

        {/* Admin login (no auth required) */}
        <Route path="/admin/login" element={<Suspense fallback={<AdminFallback />}><AdminLogin /></Suspense>} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            </Suspense>
          }
        >
          <Route index element={<Suspense fallback={<AdminFallback />}><Dashboard /></Suspense>} />
          <Route path="inquiries" element={<Suspense fallback={<AdminFallback />}><InquiriesAdmin /></Suspense>} />
          <Route path="tours" element={<Suspense fallback={<AdminFallback />}><TourPackagesAdmin /></Suspense>} />
          <Route path="hotels" element={<Suspense fallback={<AdminFallback />}><HotelsAdmin /></Suspense>} />
          <Route path="gallery" element={<Suspense fallback={<AdminFallback />}><GalleryAdmin /></Suspense>} />
          <Route path="blog" element={<Suspense fallback={<AdminFallback />}><BlogAdmin /></Suspense>} />
          <Route path="faq" element={<Suspense fallback={<AdminFallback />}><FaqAdmin /></Suspense>} />
          <Route path="community" element={<Suspense fallback={<AdminFallback />}><CommunityAdmin /></Suspense>} />
          <Route path="food" element={<Suspense fallback={<AdminFallback />}><FoodAdmin /></Suspense>} />
          <Route path="destinations" element={<Suspense fallback={<AdminFallback />}><DestinationsAdmin /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<AdminFallback />}><AnalyticsAdmin /></Suspense>} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
