import React from 'react';
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

// Admin imports
import { AdminLayout } from './admin/components/AdminLayout';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminLogin } from './admin/pages/AdminLogin';
import { Dashboard } from './admin/pages/Dashboard';
import { InquiriesAdmin } from './admin/pages/InquiriesAdmin';
import { TourPackagesAdmin } from './admin/pages/TourPackagesAdmin';
import { HotelsAdmin } from './admin/pages/HotelsAdmin';
import { GalleryAdmin } from './admin/pages/GalleryAdmin';
import { BlogAdmin } from './admin/pages/BlogAdmin';
import { FaqAdmin } from './admin/pages/FaqAdmin';
import { CommunityAdmin } from './admin/pages/CommunityAdmin';
import { FoodAdmin } from './admin/pages/FoodAdmin';
import { DestinationsAdmin } from './admin/pages/DestinationsAdmin';
import { AnalyticsAdmin } from './admin/pages/AnalyticsAdmin';

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
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="inquiries" element={<InquiriesAdmin />} />
          <Route path="tours" element={<TourPackagesAdmin />} />
          <Route path="hotels" element={<HotelsAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
          <Route path="faq" element={<FaqAdmin />} />
          <Route path="community" element={<CommunityAdmin />} />
          <Route path="food" element={<FoodAdmin />} />
          <Route path="destinations" element={<DestinationsAdmin />} />
          <Route path="analytics" element={<AnalyticsAdmin />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
