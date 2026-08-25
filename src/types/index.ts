export type Language = 'bn' | 'en';

export type DestinationCategory = 'garden' | 'river' | 'hills' | 'lake' | 'wetland' | 'heritage';

export interface Destination {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  subtitleBn: string;
  subtitleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  historyBn?: string;
  historyEn?: string;
  category: DestinationCategory;
  imageUrl: string;
  galleryImages: string[];
  distanceFromGardenBn: string;
  distanceFromGardenEn: string;
  bestTimeToVisitBn: string;
  bestTimeToVisitEn: string;
  highlightsBn: string[];
  highlightsEn: string[];
  coordinates: {
    lat: number;
    lng: number;
    elevation: string;
  };
  travelTipsBn: string[];
  travelTipsEn: string[];
  mapX: number; // Percentage for stylized SVG map
  mapY: number;
}

export interface GalleryItem {
  id: string;
  titleBn: string;
  titleEn: string;
  category: 'all' | 'shimul' | 'nature' | 'jadukata' | 'mountains' | 'tahirpur' | 'travel' | 'people';
  imageUrl: string;
  locationBn: string;
  locationEn: string;
  captionBn: string;
  captionEn: string;
  photographer: string;
  aspectRatio: 'landscape' | 'portrait' | 'square';
}

export interface SeasonMonth {
  monthIndex: number;
  monthBn: string;
  monthEn: string;
  bengaliMonth: string;
  seasonBn: string;
  seasonEn: string;
  bloomStage: 'dormant' | 'budding' | 'peak-bloom' | 'fading' | 'green-foliage';
  bloomStatusBn: string;
  bloomStatusEn: string;
  weatherDescriptionBn: string;
  weatherDescriptionEn: string;
  haorConditionBn: string;
  haorConditionEn: string;
  travelRating: number; // 1-5
  isPeakSeason: boolean;
  recommendationBn: string;
  recommendationEn: string;
  highlightsBn: string[];
  highlightsEn: string[];
}

export interface TravelGuideStep {
  id: string;
  stepNumber: string;
  titleBn: string;
  titleEn: string;
  modeBn: string;
  modeEn: string;
  durationBn: string;
  durationEn: string;
  costRangeBn: string;
  costRangeEn: string;
  descriptionBn: string;
  descriptionEn: string;
  iconName: 'bus' | 'train' | 'bike' | 'boat' | 'walk' | 'car';
}

export interface Hotel {
  id: string;
  nameBn: string;
  nameEn: string;
  locationBn: string;
  locationEn: string;
  stayTypeBn: string;
  stayTypeEn: string;
  priceCategory: 'budget' | 'mid' | 'premium';
  priceIndicatorBn: string;
  priceIndicatorEn: string;
  rating: number;
  distanceToShimulBn: string;
  distanceToShimulEn: string;
  amenitiesBn: string[];
  amenitiesEn: string[];
  imageUrl: string;
  contactNoteBn: string;
  contactNoteEn: string;
}

export interface LocalFood {
  id: string;
  nameBn: string;
  nameEn: string;
  categoryBn: string;
  categoryEn: string;
  descriptionBn: string;
  descriptionEn: string;
  imageUrl: string;
  whereToFindBn: string;
  whereToFindEn: string;
  tasteNoteBn: string;
  tasteNoteEn: string;
}

export interface TourPackage {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  durationBn: string;
  durationEn: string;
  destinations: string[];
  highlightsBn: string[];
  highlightsEn: string[];
  inclusionsBn: string[];
  inclusionsEn: string[];
  exclusionsBn: string[];
  exclusionsEn: string[];
  idealForBn: string;
  idealForEn: string;
  priceNoteBn: string;
  priceNoteEn: string;
  tagBn?: string;
  tagEn?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  titleBn: string;
  titleEn: string;
  excerptBn: string;
  excerptEn: string;
  contentBn: string[];
  contentEn: string[];
  authorBn: string;
  authorEn: string;
  authorRoleBn: string;
  authorRoleEn: string;
  publishedDateBn: string;
  publishedDateEn: string;
  readTimeBn: string;
  readTimeEn: string;
  categoryBn: string;
  categoryEn: string;
  coverImage: string;
  tags: string[];
}

export interface CommunityStory {
  id: string;
  nameBn: string;
  nameEn: string;
  roleBn: string;
  roleEn: string;
  yearsOfExperienceBn: string;
  yearsOfExperienceEn: string;
  quoteBn: string;
  quoteEn: string;
  storyBn: string;
  storyEn: string;
  locationBn: string;
  locationEn: string;
  avatarUrl: string;
}

export interface FaqItem {
  id: string;
  category: 'general' | 'transport' | 'timing' | 'stay' | 'photography';
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
}

export interface TripInquiryForm {
  name: string;
  email: string;
  phone: string;
  inquiryType: 'tour' | 'guide' | 'stay' | 'photography' | 'general';
  travelDate: string;
  travelersCount: string;
  selectedPackage?: string;
  message: string;
}
