import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ubaonkyyxanwwtbudafn.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViYW9ua3l5eGFud3d0YnVkYWZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzkxMzQ0NywiZXhwIjoyMTAzNDg5NDQ3fQ.pVVxdrQCksr6bOf-ON6-JBXX83oJkjIlw4EPyY2zP_s';
const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  console.log('=== Starting Database Seed ===\n');
  const errors = [];

  // 1. Tour Packages
  const tourPackages = [
    { title_en: 'Shimul Bagan & Jadukata River Day Escape', title_bn: 'শিমুল বাগান ও যাদুকাটা নদী ডে ট্যুর', duration_en: '1 Full Day (Sunrise to Sunset)', duration_bn: '১ দিন (সকাল থেকে সন্ধ্যা)', price_en: 'Custom quote based on group size (Inquire below)', price_bn: 'গ্রুপ সাইজ ও চাহিদামতো সাশ্রয়ী বাজেট', description_en: '1-Day Signature Exploration of Crimson Forest & Border Hills', description_bn: 'একদিনে লাল শিমুল ফুল, যাদুকাটা নদী ও বারেক টিলার সান্নিধ্য', image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200', features_en: ['Morning golden hour walk in the red Shimul grove', 'Scenic wooden boat ride across Jadukata', '360-degree hilltop border panorama from Barek Tila', 'Authentic local lunch with fresh river fish'], features_bn: ['সকালে শিমুল বাগানে পদচারণা ও ফটোগ্রাফি', 'যাদুকাটা নদীতে কাঠের নৌকায় নদীভ্রমণ', 'বারেক টিলার চূড়া থেকে ৩৬০ ডিগ্রি ভিউ', 'স্থানীয় টাটকা মাছ ও ভর্তায় মধ্যাহ্নভোজ'], popular: true, category: 'standard' },
    { title_en: 'Tahirpur Complete Nature Escape (2D/1N)', title_bn: 'তাহিরপুর নেচার এস্কেপ (২ দিন ১ রাত)', duration_en: '2 Days / 1 Night', duration_bn: '২ দিন ১ রাত', price_en: 'Custom group pricing (Contact us)', price_bn: 'কাস্টমাইজড গ্রুপ প্রাইসিং', description_en: 'Comprehensive 2-Day Borderland, Lake & Red Canopy Experience', description_bn: 'শিমুল বাগান, নীলাদ্রি লেক, বারেক টিলা ও টেকেরঘাট সীমান্ত অন্বেষণ', image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200', features_en: ['Unrushed sunrise exploration of Shimul Bagan', 'Indigenous cultural visit at Barek Tila', 'Sunset over Niladri Lake', 'Overnight stay in Tekerghat'], features_bn: ['শিমুল বাগানে মনভরে ছবি তোলা', 'বারেক টিলার আদিবাসী গ্রাম দর্শন', 'নীলাদ্রি লেকে সূর্যাস্ত', 'টেকেরঘাটে রাত্রিযাপন'], popular: false, category: 'adventure' },
    { title_en: 'Grand Haor & Crimson Sanctuary Cruise (3D/2N)', title_bn: 'প্রিমিয়াম হাওর ও লাল স্বর্গ ক্রুজ (৩ দিন ২ রাত)', duration_en: '3 Days / 2 Nights', duration_bn: '৩ দিন ২ রাত', price_en: 'Seasonal houseboat rates apply (Inquire now)', price_bn: 'সিজনাল হাউজবোট রেট অনুযায়ী', description_en: 'Luxury Houseboat Cruise on Tanguar Haor + Shimul Bagan & Hills', description_bn: 'টাঙ্গুয়ার হাওরে বিলাসবহুল হাউজবোট ও শিমুল বাগানের রাজকীয় সফর', image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200', features_en: ['2 nights aboard luxury wooden houseboat', 'Submerged forest trails and birdwatch', 'Exclusive excursion to Shimul Bagan', 'Starlit nocturnal tranquility'], features_bn: ['হাউজবোটে ২ রাত অবস্থান', 'জলজ বন ও পাখির কলকাকলি', 'শিমুল বাগানে ফটোসেশন', 'হাওরের চাঁদের আলোয় রাত'], popular: false, category: 'luxury' }
  ];
  console.log('1. Tour Packages...');
  for (const pkg of tourPackages) { const { error } = await supabase.from('tour_packages').insert(pkg); if (error) errors.push(`tour: ${error.message}`); else console.log(`  + ${pkg.title_en}`); }

  // 2. Hotels
  const hotels = [
    { name_en: 'Tahirpur Dak Bungalow & VIP Guesthouse', name_bn: 'তাহিরপুর ডাকবাংলো ও ভিআইপি গেস্টহাউস', type_en: 'Government Rest House', type_bn: 'সরকারি ডাকবাংলো', distance_en: '30-40 mins by CNG', distance_bn: 'সিএনজিতে ৩০-৪০ মিনিট', price_en: '৳800 – ৳1,500 / night', price_bn: '৳৮০০ – ৳১,৫০০ / রাত', rating: 4.2, reviews: 15, image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200', amenities_en: ['Riverside tranquil setting', 'Attached washroom', 'Local dining nearby'], amenities_bn: ['নদীর কাছে শান্ত পরিবেশ', 'সংযুক্ত বাথরুম', 'স্থানীয় খাবার'], phone: '' },
    { name_en: 'Tekerghat Nilkutir & Local Homestays', name_bn: 'টেকেরঘাট নীলকুটির ও হোমস্টে', type_en: 'Eco Homestay', type_bn: 'ইকো হোমস্টে', distance_en: '20-25 mins by Bike', distance_bn: 'বাইকে ২০-২৫ মিনিট', price_en: '৳600 – ৳1,200 / night', price_bn: '৳৬০০ – ৳১,২০০ / রাত', rating: 4.4, reviews: 22, image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200', amenities_en: ['Walking distance to Niladri Lake', 'Warm rustic hospitality', 'Fresh haor fish & duck dishes'], amenities_bn: ['নীলাদ্রি লেকের কাছে', 'আন্তরিক আতিথেয়তা', 'তাজা হাঁস ও মাছের খাবার'], phone: '' }
  ];
  console.log('2. Hotels...');
  for (const h of hotels) { const { error } = await supabase.from('hotels').insert(h); if (error) errors.push(`hotel: ${error.message}`); else console.log(`  + ${h.name_en}`); }

  // 3. Gallery
  const gallery = [
    { url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200', caption_en: 'Thousands of red silk-cotton blossoms forming a vivid natural cathedral.', caption_bn: 'হাজার হাজার লাল শিমুল ফুলের রক্তিম রূপ।', category: 'shimul' },
    { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200', caption_en: 'The crystalline mountain river along the foothills of Meghalaya.', caption_bn: 'মেঘালয় পাহাড়ের কোল ঘেঁষে বয়ে চলা স্বচ্ছ জলের ধারা।', category: 'jadukata' },
    { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200', caption_en: 'Panorama from Barek Tila — mountains and river systems.', caption_bn: 'বারেক টিলা থেকে পাহাড় ও নদীর প্যানোরামা।', category: 'mountains' },
    { url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200', caption_en: 'The vast expanse of Tanguar Haor wetland under monsoon clouds.', caption_bn: 'বর্ষার মেঘের নিচে টাঙ্গুয়ার হাওর।', category: 'tahirpur' },
    { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200', caption_en: 'Golden hour light through the crimson Shimul canopy.', caption_bn: 'রক্তিম শিমুল গাছের ছায়ায় সোনালী আলো।', category: 'shimul' }
  ];
  console.log('3. Gallery...');
  for (const g of gallery) { const { error } = await supabase.from('gallery_items').insert(g); if (error) errors.push(`gallery: ${error.message}`); else console.log(`  + ${g.caption_en.slice(0,40)}...`); }

  // 4. Blog Posts
  const blogs = [
    { title_en: 'The Man Behind the Vision: Late Alhaj Joynal Abedin', title_bn: 'শিমুল বাগানের পেছনের মানুষ: মরহুম আলহাজ্ব জয়নাল আবেদীন', slug: 'story-behind-shimul-bagan-joynal-abedin', category_en: 'Heritage & Legacy', category_bn: 'ইতিহাস ও ঐতিহ্য', author_en: 'Tahirpur Heritage Trust', author_bn: 'তাহিরপুর হেরিটেজ ট্রাস্ট', author_role_en: 'Local History Chroniclers', author_role_bn: 'স্থানীয় ইতিহাস সংগ্রাহক', published_date_en: 'Spring Edition 2026', published_date_bn: 'বসন্ত সংস্করণ ২০২৬', read_time_en: '4 min read', read_time_bn: '৪ মিনিট পাঠ', cover_image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200', excerpt_en: 'How one man transformed a barren riverbed into Bangladesh\'s most iconic red floral sanctuary.', excerpt_bn: 'কীভাবে একজন মানুষ অনাবাদী বালুচরকে রূপান্তর করেছে।', content_en: ['Late Alhaj Joynal Abedin was a visionary from Badaghat.', 'In 2002 he planted 3,000+ crimson saplings along the Jadukata.', 'Today it is Bangladesh\'s largest red blossom sanctuary.'], content_bn: ['মরহুম আলহাজ্ব জয়নাল আবেদীন ছিলেন বাদাঘাটের একজন দূরদর্শী।', '২০০২ সালে তিনি যাদুকাটা নদীর তীরে ৩০০০+ শিমুল চারা রোপণ করেন।', 'আজ এটি দেশের বৃহত্তম শিমুল বাগান।'], tags: ['ইতিহাস', 'জয়নাল আবেদীন', 'শিমুল বাগান'] },
    { title_en: 'Jadukata: The River Singing the Songs of the Blue Mountains', title_bn: 'যাদুকাটা: যে নদীর বুকে লুকিয়ে আছে নীল পাহাড়ের গান', slug: 'jadukata-river-culture', category_en: 'Nature & Culture', category_bn: 'প্রকৃতি ও সংস্কৃতি', author_en: 'Sumon Bhowmik', author_bn: 'সুমন ভৌমিক', author_role_en: 'Environmental Writer', author_role_bn: 'পরিবেশ লেখক', published_date_en: '15 Jan 2026', published_date_bn: '১৫ জানুয়ারি ২০২৬', read_time_en: '5 min read', read_time_bn: '৫ মিনিট পাঠ', cover_image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200', excerpt_en: 'The Jadukata river is the cultural heartbeat and poetic artery of Sunamganj.', excerpt_bn: 'যাদুকাটা নদী এই অঞ্চলের প্রাণস্পন্দন।', content_en: ['Crystal clarity mesmerizes all visitors.', 'Hundreds of wooden skiffs harvest mineral sands at dawn.', 'Folk melodies of Hason Raja and Shah Abdul Karim linger along the banks.'], content_bn: ['যাদুকাটা নদীর স্বচ্ছ জল সকলকে মুগ্ধ করে।', 'ভোরে শত শত নৌকায় বালু সংগ্রহ করা হয়।', 'হাছন রাজা ও শাহ আব্দুল করিমের সুর নদীর তীরে ভেসে বেড়ায়।'], tags: ['যাদুকাটা', 'নদী', 'মেঘালয়'] },
    { title_en: 'Drone Photography Guide for Shimul Bagan', title_bn: 'শিমুল বাগানে ড্রোন ফটোগ্রাফি মাস্টারক্লাস', slug: 'drone-photography-guide', category_en: 'Photography Tips', category_bn: 'ফটোগ্রাফি টিপস', author_en: 'Tanvir Ahmed', author_bn: 'তানভীর আহমেদ', author_role_en: 'Travel Photographer', author_role_bn: 'ট্রাভেল ফটোগ্রাফার', published_date_en: '01 Feb 2026', published_date_bn: '১ ফেব্রুয়ারি ২০২৬', read_time_en: '3 min read', read_time_bn: '৩ মিনিট পাঠ', cover_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200', excerpt_en: 'Mastering golden hour lighting and aerial compositions amidst the scarlet floral geometry.', excerpt_bn: 'সোনালী আলো ও লাল ফুলের জ্যামিতি ক্যামেরায় বন্দী করার কৌশল।', content_en: ['Prime lighting: 6:30–8:30 AM and 4:00 PM to sunset.', 'Morning sunlight casts elongated tree shadows.', 'Drone shots reveal symmetrical orchard lattice.'], content_bn: ['সেরা আলোর সময়: সকাল ৬:৩০–৮:৩০ ও বিকেল ৪:০০।', 'সকালের রোদে গাছের ছায়া জ্যামিতিক প্যাটার্ন তৈরি করে।', 'ড্রোন থেকে গাছের সুষম সারি দেখা যায়।'], tags: ['ফটোগ্রাফি', 'ড্রোন', 'টিপস'] }
  ];
  console.log('4. Blog Posts...');
  for (const b of blogs) { const { error } = await supabase.from('blog_posts').insert(b); if (error) errors.push(`blog: ${error.message}`); else console.log(`  + ${b.title_en.slice(0,40)}...`); }

  // 5. FAQ Items
  const faqs = [
    { category: 'timing', question_en: 'When is the best time to see the flowers?', question_bn: 'শিমুল বাগানে ফুল ফোটার সেরা সময় কোনটি?', answer_en: 'Early February through first week of March.', answer_bn: 'ফেব্রুয়ারি মাসের শুরু থেকে মার্চের প্রথম সপ্তাহ।' },
    { category: 'transport', question_en: 'How to reach from Dhaka?', question_bn: 'ঢাকা থেকে কীভাবে পৌঁছানো যায়?', answer_en: 'Overnight bus to Sunamganj, then CNG to Tahirpur.', answer_bn: 'ঢাকা থেকে রাতের বাসে সুনামগঞ্জ, তারপর সিএনজিতে তাহিরপুর।' },
    { category: 'stay', question_en: 'Accommodations in Tahirpur?', question_bn: 'তাহিরপুরে থাকার ব্যবস্থা?', answer_en: 'Government rest houses, eco-homestays, and town hotels.', answer_bn: 'সরকারি ডাকবাংলো, ইকো হোমস্টে ও শহরের হোটেল।' },
    { category: 'photography', question_en: 'Drone photography permits?', question_bn: 'ড্রোন ও ক্যামেরার অনুমতি?', answer_en: 'Standard photography welcome. Follow BGB border guidelines for drones.', answer_bn: 'সাধারণ ক্যামেরার জন্য অনুমতি লাগে না। ড্রোনের জন্য বিজিবি নীতিমালা মানুন।' },
    { category: 'general', question_en: 'What other spots to visit nearby?', question_bn: 'আশেপাশে আর কী কী দর্শনীয়?', answer_en: 'Jadukata River, Barek Tila, Niladri Lake, Tanguar Haor.', answer_bn: 'যাদুকাটা নদী, বারেক টিলা, নীলাদ্রি লেক, টাঙ্গুয়ার হাওর।' }
  ];
  console.log('5. FAQ Items...');
  for (const f of faqs) { const { error } = await supabase.from('faq_items').insert(f); if (error) errors.push(`faq: ${error.message}`); else console.log(`  + ${f.question_en.slice(0,40)}...`); }

  // 6. Community Stories
  const community = [
    { name_en: 'Abdul Karim Majhi', name_bn: 'আব্দুল করিম মাঝি', role_en: 'Veteran Boatman of Jadukata River', role_bn: 'যাদুকাটা নদীর প্রবীণ খেয়া মাঝি', years_of_experience_en: '22 Years', years_of_experience_bn: '২২ বছর', location_en: 'Laurer Garh Ferry Ghat', location_bn: 'লাউড়ের গড় খেয়াঘাট', quote_en: '"When the river shines like glass and Shimul turns scarlet, every stroke fills my heart."', quote_bn: '"নদীর পানি যখন কাঁচের মতো চকচক করে, তখন বৈঠা বাইতে মনটা জুড়াইয়া যায়।"', story_en: 'Uncle Karim arrives at the ghat at dawn with his handcrafted wooden skiff.', story_bn: 'করিম চাচা প্রতিদিন ভোরে তাঁর নৌকা নিয়ে ঘাটে আসেন।', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400' },
    { name_en: 'Rahela Begum', name_bn: 'রাহেলা বেগম', role_en: 'Master Chef of Haor Dining', role_bn: 'হাওরের খাবারের কারিগর', years_of_experience_en: '15 Years', years_of_experience_bn: '১৫ বছর', location_en: 'Tahirpur Sadar Bazaar', location_bn: 'তাহিরপুর সদর বাজার', quote_en: '"Watching travelers smile at our fresh haor fish is the greatest reward."', quote_bn: '"মেহমানদের মুখে তৃপ্তির হাসি দেখাই আমার আনন্দ।"', story_en: 'Her rustic dining room in Tahirpur bazaar is beloved by travelers.', story_bn: 'তাহিরপুর বাজারে তাঁর খাবার ঘর পর্যটকদের প্রিয়।', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400' }
  ];
  console.log('6. Community Stories...');
  for (const c of community) { const { error } = await supabase.from('community_stories').insert(c); if (error) errors.push(`community: ${error.message}`); else console.log(`  + ${c.name_en}`); }

  // 7. Local Foods
  const foods = [
    { name_en: 'Haor Freshwater Baim (Eel) Curry', name_bn: 'হাওরের তাজা বাইম মাছের ঝোল', description_en: 'Traditional curry with freshwater eel from the wetlands, cooked in turmeric and mustard paste.', description_bn: 'হাওরের তাজা বাইম মাছ হলুদ ও সরিষায় রান্না।', image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200', category_en: 'Fish', category_bn: 'মাছ', where_to_find_en: 'Tahirpur Sadar Bazaar', where_to_find_bn: 'তাহিরপুর সদর বাজার', taste_note_en: 'Rich, earthy, and aromatic', taste_note_bn: 'গাঢ়, মাটির স্বাদ, সুগন্ধি' },
    { name_en: 'Mashed Bhorta Platter', name_bn: 'বিভিন্ন ধরনের ভর্তা প্ল্যাটার', description_en: 'Assortment of traditional Bengali mashed preparations — roasted eggplant, spiced potato, and dried fish.', description_bn: 'পোড়া বেগুন, আলু ও শুকনো মাছের ভর্তার সমন্বয়।', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1200', category_en: 'Traditional Platter', category_bn: 'ঐতিহ্যবাহী থালা', where_to_find_en: 'Any local eatery in Tahirpur', where_to_find_bn: 'তাহিরপুরের যেকোনো খাবার ঘর', taste_note_en: 'Spicy, smoky, and comforting', taste_note_bn: 'ঝাল, ধূনো আর আরামদায়ক' }
  ];
  console.log('7. Local Foods...');
  for (const f of foods) { const { error } = await supabase.from('local_foods').insert(f); if (error) errors.push(`food: ${error.message}`); else console.log(`  + ${f.name_en}`); }

  // 8. Destinations
  const destinations = [
    { name_en: 'Shimul Bagan (Manigaon)', name_bn: 'শিমুল বাগান', slug: 'shimul-bagan', subtitle_en: 'Largest Crimson Red Silk Cotton Forest of Bangladesh', subtitle_bn: 'দেশের বৃহত্তম রক্তিম শিমুল বন', description_en: 'Located at Manigaon village along the Jadukata River, with 3,000+ symmetrically planted crimson trees.', description_bn: 'মানিগাঁও গ্রামে যাদুকাটা নদীর তীরে অবস্থিত।', category: 'garden', image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200', gallery_images: [], distance_from_garden_en: 'Primary Destination', distance_from_garden_bn: 'মূল গন্তব্য', best_time_to_visit_en: 'February to March', best_time_to_visit_bn: 'ফেব্রুয়ারি থেকে মার্চ', highlights_en: ['3,000+ Shimul trees', 'Scarlet petal carpets', 'Jadukata & Meghalaya backdrop'], highlights_bn: ['৩,০০০+ শিমুল গাছ', 'লাল ফুলের গালিচা', 'যাদুকাটা ও মেঘালয়ের প্যানোরামা'], travel_tips_en: ['Sunrise offers magical lighting', 'Do not pluck flowers'], travel_tips_bn: ['সূর্যোদয়ে সবচেয়ে মায়াবী', 'ফুল ছিঁড়বেন না'], coordinates: { lat: 25.1764, lng: 91.2411 }, map_x: 48, map_y: 52, history_en: 'Founded 2002 by Alhaj Joynal Abedin.', history_bn: '২০০২ সালে জয়নাল আবেদীন প্রতিষ্ঠা।' },
    { name_en: 'Jadukata River', name_bn: 'যাদুকাটা নদী', slug: 'jadukata-river', subtitle_en: 'Crystal Clear Turquoise River from Meghalaya', subtitle_bn: 'মেঘালয় থেকে নেমে আসা স্বচ্ছ নীল নদী', description_en: 'One of the clearest rivers in South Asia with turquoise water and silvery sandbars.', description_bn: 'দক্ষিণ এশিয়ার সবচেয়ে স্বচ্ছ নদীগুলোর একটি।', category: 'river', image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200', gallery_images: [], distance_from_garden_en: 'Adjacent (1 min walk)', distance_from_garden_bn: 'পাশেই (১ মিনিট)', best_time_to_visit_en: 'October to April', best_time_to_visit_bn: 'অক্টোবর থেকে এপ্রিল', highlights_en: ['Crystal-clear water', 'Wooden boat rides', 'Sunset reflections'], highlights_bn: ['স্বচ্ছ জল', 'নৌকায় ভ্রমণ', 'সূর্যাস্তের প্রতিফলন'], travel_tips_en: ['Hire wooden boat to Barek Tila'], travel_tips_bn: ['নৌকায় বারেক টিলায় যাওয়া যায়'], coordinates: { lat: 25.1822, lng: 91.2483 }, map_x: 52, map_y: 46, history_en: '', history_bn: '' }
  ];
  console.log('8. Destinations...');
  for (const d of destinations) { const { error } = await supabase.from('destinations').insert(d); if (error) errors.push(`dest: ${error.message}`); else console.log(`  + ${d.name_en}`); }

  // Summary
  console.log('\n=== Seed Complete ===');
  if (errors.length > 0) {
    console.log(`\nErrors: ${errors.length}`);
    errors.forEach(e => console.log(`  - ${e}`));
  } else {
    console.log('All data seeded successfully!');
  }

  // Verify
  console.log('\nVerifying...');
  for (const t of ['tour_packages','hotels','gallery_items','blog_posts','faq_items','community_stories','local_foods','destinations','trip_inquiries']) {
    const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
    console.log(`  ${t}: ${count} rows`);
  }
}

main().catch(console.error);