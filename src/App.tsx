import React, { useState } from 'react';
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

export default function App() {
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
        {/* Subtle Desktop Interactive Custom Cursor */}
        <CustomCursor />

        {/* Floating Glass Navigation Bar */}
        <Navbar
          onOpenTripPlanner={() => handleOpenTripPlanner()}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
        />

        {/* 1. Cinematic 3D WebGL Petal Canvas Hero Section */}
        <HeroSection onOpenTripPlanner={() => handleOpenTripPlanner()} />

        {/* 2. Editorial Intro Story & Founder Tribute Section */}
        <IntroStorySection />

        {/* 3. Botanical Wonder & Interactive 3D Tree Branch Viewer */}
        <FlowerSection />

        {/* 4. Interactive 12-Month Seasonal Climate & Bloom Calendar */}
        <SeasonalTimeline />

        {/* 5. Geospatial Interactive Map & Tahirpur Destinations */}
        <DestinationExplorer />

        {/* 6. Step-by-Step Route Transit Guide & Budget Estimator */}
        <TravelGuideSection />

        {/* 7. Categorized Masonry Photography Gallery & Lightbox */}
        <GalleryExperience />

        {/* 8. Curated Tour Packages & Guided Expeditions */}
        <TourPackagesSection onSelectPackageForInquiry={(pkg) => handleOpenTripPlanner(pkg)} />

        {/* 9. Verified Accommodations & Houseboats Directory */}
        <HotelDiscoverySection />

        {/* 10. Local Food & Haor Freshwater Fish Delicacies */}
        <LocalFoodSection />

        {/* 11. Editorial Stories & Historical Archives */}
        <FeaturedBlogSection />

        {/* 12. Community Voices: People Behind the Place */}
        <CommunityVoicesSection />

        {/* 13. Essential Travel FAQs Accordion */}
        <FaqSection />

        {/* 14. Comprehensive Editorial Footer */}
        <Footer />

        {/* 15. Interactive Trip Planner & Inquiry Modal */}
        <TripPlannerModal
          isOpen={isTripPlannerOpen}
          onClose={() => setIsTripPlannerOpen(false)}
          preselectedPackage={selectedPackageForInquiry}
        />
      </div>
    </LanguageProvider>
  );
}
