import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const supabaseUrl = 'https://ubaonkyyxanwwtbudafn.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViYW9ua3l5eGFud3d0YnVkYWZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzkxMzQ0NywiZXhwIjoyMTAzNDg5NDQ3fQ.pVVxdrQCksr6bOf-ON6-JBXX83oJkjIlw4EPyY2zP_s';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViYW9ua3l5eGFud3d0YnVkYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MTM0NDcsImV4cCI6MjEwMzQ4OTQ0N30.hrg8bSlmqBFQ0CfrGYTQAuQ-A30uVZcX2XUZFSy8PK0';

const supabase = createClient(supabaseUrl, serviceKey);

async function checkTables() {
  const tables = ['trip_inquiries', 'tour_packages', 'hotels', 'gallery_items', 'blog_posts', 'faq_items', 'community_stories', 'local_foods', 'destinations'];
  const existing = [];
  const missing = [];

  for (const t of tables) {
    const { error } = await supabase.from(t).select('id').limit(1);
    if (error && error.code === '42P01') {
      missing.push(t);
    } else {
      existing.push(t);
    }
  }
  return { existing, missing };
}

async function seedData() {
  const { tourPackagesData } = await import('../src/data/tours.js');
  const { hotelsData } = await import('../src/data/hotels.js');
  const { galleryData } = await import('../src/data/gallery.js');
  const { storiesData } = await import('../src/data/stories.js');
  const { faqsData } = await import('../src/data/community.js');
  const { communityStories } = await import('../src/data/community.js');
  const { foodData } = await import('../src/data/food.js');
  const { destinationsData } = await import('../src/data/destinations.js');

  const results = [];

  // Seed tour_packages
  for (const pkg of tourPackagesData) {
    const { error } = await supabase.from('tour_packages').upsert({
      id: pkg.id,
      title_en: pkg.titleEn,
      title_bn: pkg.titleBn,
      duration_en: pkg.durationEn,
      duration_bn: pkg.durationBn,
      price_en: pkg.priceNoteEn,
      price_bn: pkg.priceNoteBn,
      description_en: pkg.subtitleEn,
      description_bn: pkg.subtitleBn,
      image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop',
      features_en: pkg.highlightsEn,
      features_bn: pkg.highlightsBn,
      popular: pkg.tagEn === 'Most Popular',
      category: pkg.tagEn?.includes('Luxury') ? 'luxury' : pkg.tagEn?.includes('Adventure') ? 'adventure' : 'standard'
    });
    if (error) results.push(`tour_packages: ${error.message}`);
  }

  // Seed hotels
  for (const h of hotelsData) {
    const { error } = await supabase.from('hotels').upsert({
      id: h.id,
      name_en: h.nameEn,
      name_bn: h.nameBn,
      type_en: h.stayTypeEn,
      type_bn: h.stayTypeBn,
      distance_en: h.distanceToShimulEn,
      distance_bn: h.distanceToShimulBn,
      price_en: h.priceIndicatorEn,
      price_bn: h.priceIndicatorBn,
      rating: h.rating,
      reviews: 0,
      image_url: h.imageUrl,
      amenities_en: h.amenitiesEn,
      amenities_bn: h.amenitiesBn,
      phone: ''
    });
    if (error) results.push(`hotels: ${error.message}`);
  }

  // Seed gallery
  for (const g of galleryData) {
    const { error } = await supabase.from('gallery_items').upsert({
      id: g.id,
      url: g.imageUrl,
      caption_en: g.captionEn,
      caption_bn: g.captionBn,
      category: g.category
    });
    if (error) results.push(`gallery: ${error.message}`);
  }

  // Seed blog_posts
  for (const s of storiesData) {
    const { error } = await supabase.from('blog_posts').upsert({
      id: s.id,
      title_en: s.titleEn,
      title_bn: s.titleBn,
      slug: s.slug,
      category_en: s.categoryEn,
      category_bn: s.categoryBn,
      author_en: s.authorEn,
      author_bn: s.authorBn,
      author_role_en: s.authorRoleEn,
      author_role_bn: s.authorRoleBn,
      published_date_en: s.publishedDateEn,
      published_date_bn: s.publishedDateBn,
      read_time_en: s.readTimeEn,
      read_time_bn: s.readTimeBn,
      cover_image: s.coverImage,
      excerpt_en: s.excerptEn,
      excerpt_bn: s.excerptBn,
      content_en: s.contentEn,
      content_bn: s.contentBn,
      tags: s.tags
    });
    if (error) results.push(`blog_posts: ${error.message}`);
  }

  // Seed faq_items
  for (const f of faqsData) {
    const { error } = await supabase.from('faq_items').upsert({
      id: f.id,
      question_en: f.questionEn,
      question_bn: f.questionBn,
      answer_en: f.answerEn,
      answer_bn: f.answerBn,
      category: f.category
    });
    if (error) results.push(`faq_items: ${error.message}`);
  }

  // Seed community_stories
  for (const c of communityStories) {
    const { error } = await supabase.from('community_stories').upsert({
      id: c.id,
      name_en: c.nameEn,
      name_bn: c.nameBn,
      role_en: c.roleEn,
      role_bn: c.roleBn,
      years_of_experience_en: c.yearsOfExperienceEn,
      years_of_experience_bn: c.yearsOfExperienceBn,
      location_en: c.locationEn,
      location_bn: c.locationBn,
      quote_en: c.quoteEn,
      quote_bn: c.quoteBn,
      story_en: c.storyEn,
      story_bn: c.storyBn,
      avatar_url: c.avatarUrl
    });
    if (error) results.push(`community_stories: ${error.message}`);
  }

  // Seed local_foods
  for (const f of foodData) {
    const { error } = await supabase.from('local_foods').upsert({
      id: f.id,
      name_en: f.nameEn,
      name_bn: f.nameBn,
      description_en: f.descriptionEn,
      description_bn: f.descriptionBn,
      image_url: f.imageUrl,
      category_en: f.categoryEn,
      category_bn: f.categoryBn,
      where_to_find_en: f.whereToFindEn,
      where_to_find_bn: f.whereToFindBn,
      taste_note_en: f.tasteNoteEn,
      taste_note_bn: f.tasteNoteBn
    });
    if (error) results.push(`local_foods: ${error.message}`);
  }

  // Seed destinations
  for (const d of destinationsData) {
    const { error } = await supabase.from('destinations').upsert({
      id: d.id,
      name_en: d.nameEn,
      name_bn: d.nameBn,
      slug: d.slug,
      subtitle_en: d.subtitleEn,
      subtitle_bn: d.subtitleBn,
      description_en: d.descriptionEn,
      description_bn: d.descriptionBn,
      category: d.category,
      image_url: d.imageUrl,
      gallery_images: d.galleryImages,
      distance_from_garden_en: d.distanceFromGardenEn,
      distance_from_garden_bn: d.distanceFromGardenBn,
      best_time_to_visit_en: d.bestTimeToVisitEn,
      best_time_to_visit_bn: d.bestTimeToVisitBn,
      highlights_en: d.highlightsEn,
      highlights_bn: d.highlightsBn,
      travel_tips_en: d.travelTipsEn,
      travel_tips_bn: d.travelTipsBn,
      coordinates: d.coordinates,
      map_x: d.mapX,
      map_y: d.mapY,
      history_en: d.historyEn,
      history_bn: d.historyBn
    });
    if (error) results.push(`destinations: ${error.message}`);
  }

  return results;
}

async function main() {
  console.log('=== Shimul Bagan Supabase Setup ===\n');

  // Step 1: Check tables
  console.log('1. Checking tables...');
  const { existing, missing } = await checkTables();
  console.log(`   Existing: ${existing.length} tables`);
  if (missing.length > 0) {
    console.log(`   Missing: ${missing.join(', ')}`);
    console.log('\n   Please run supabase/schema.sql in the Supabase SQL Editor first!');
    console.log('   Go to: https://supabase.com/dashboard/project/ubaonkyyxanwwtbudafn/sql/new');
    return;
  }
  console.log('   All 9 tables found!\n');

  // Step 2: Seed data
  console.log('2. Seeding data...');
  const seedErrors = await seedData();
  if (seedErrors.length > 0) {
    console.log('   Seed errors:');
    seedErrors.forEach(e => console.log(`     - ${e}`));
  } else {
    console.log('   All data seeded successfully!\n');
  }

  console.log('=== Setup Complete ===');
}

main().catch(console.error);