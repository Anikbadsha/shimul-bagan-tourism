import { TravelGuideStep } from '../types';

export const travelGuideSteps: TravelGuideStep[] = [
  {
    id: 'step-1',
    stepNumber: '০১',
    titleBn: 'ঢাকা থেকে সুনামগঞ্জ শহর',
    titleEn: 'Dhaka to Sunamganj Town',
    modeBn: 'নন-এসি / এসি বাস (শ্যামলী, হানিফ, মামুন, এনা ইত্যাদি)',
    modeEn: 'Non-AC / AC Direct Coaches (Shyamoli, Hanif, Mamun, Ena)',
    durationBn: 'প্রায় ৬–৮ ঘণ্টা (রাতের বাস সুবিধাজনক)',
    durationEn: 'Approx. 6–8 hours (Overnight bus recommended)',
    costRangeBn: '৳৭০০ – ৳১,২০০ (বাস ভেদে)',
    costRangeEn: '৳700 – ৳1,200 per seat',
    descriptionBn: 'ঢাকার সায়দাবাদ, ফকিরাপুল, মহাখালী বা আব্দুল্লাহপুর থেকে সরাসরি সুনামগঞ্জের বাস ছাড়ে। রাতে বাসে উঠে ঘুমালে পরদিন ভোরে সরাসরি সুনামগঞ্জ নতুন বাসস্ট্যান্ডে পৌঁছানো যায়।',
    descriptionEn: 'Direct inter-district luxury and standard buses depart from Sayedabad, Fakirapool, Mohakhali, and Abdullahpur. Boarding an overnight bus brings you into Sunamganj town by sunrise.',
    iconName: 'bus'
  },
  {
    id: 'step-2',
    stepNumber: '০২',
    titleBn: 'সুনামগঞ্জ শহর থেকে তাহিরপুর / লাউড়ের গড়',
    titleEn: 'Sunamganj Town to Tahirpur / Laurer Garh',
    modeBn: 'সিএনজি অটো-রিকশা / লোকাল মোটরসাইকেল / লেগুনা',
    modeEn: 'CNG Auto-rickshaw / Local Motorbike / Shared Leguna',
    durationBn: 'প্রায় ১ ঘণ্টা – ১ ঘণ্টা ২০ মিনিট',
    durationEn: 'Approx. 1 hr – 1 hr 20 mins',
    costRangeBn: '৳১০০ – ৳৩৫০ (বাহন ও রিজার্ভ ভেদে)',
    costRangeEn: '৳100 – ৳350 per person',
    descriptionBn: 'সুনামগঞ্জের মল্লিকপুর বা সাহেব বাড়ি ঘাট ব্রিজ পার হয়ে আব্দুজ জহুর সেতুর প্রান্ত থেকে সিএনজি বা বাইকে সরাসরি তাহিরপুর সদর অথবা লাউড়ের গড় বাজারের দিকে যাত্রা করা যায়।',
    descriptionEn: 'From Abdur Jahur bridge point in Sunamganj town, board shared CNGs or hire motorbikes towards Tahirpur Bazaar or directly towards Laurer Garh village.',
    iconName: 'car'
  },
  {
    id: 'step-3',
    stepNumber: '০৩',
    titleBn: 'যাদুকাটা নদী পারাপার ও শিমুল বাগানে প্রবেশ',
    titleEn: 'Jadukata River Crossing & Entry to Shimul Bagan',
    modeBn: 'লোকাল খেয়া নৌকা ও সংক্ষিপ্ত হাঁটা পথ',
    modeEn: 'Local Wooden Ferry Boat & Short Walking Trail',
    durationBn: 'প্রায় ৫–১০ মিনিট',
    durationEn: 'Approx. 5–10 minutes',
    costRangeBn: '৳১০ – ৳২০ (খেয়া ভাড়া)',
    costRangeEn: '৳10 – ৳20 (ferry crossing)',
    descriptionBn: 'লাউড়ের গড় বা বাদাঘাট পয়েন্টে নেমে নৌকায় করে স্ফটিকস্বচ্ছ যাদুকাটা নদী পার হলেই মানিগাঁও গ্রামে অবস্থিত দৃষ্টিনন্দন শিমুল বাগান। বাগানে প্রবেশ করে লাল ফুলের ছায়ায় কাটান অবিস্মরণীয় সময়।',
    descriptionEn: 'Cross the picturesque turquoise waters of Jadukata on a traditional wooden boat to reach Manigaon village, stepping directly beneath the majestic Shimul canopy.',
    iconName: 'boat'
  },
  {
    id: 'step-4',
    stepNumber: '০৪',
    titleBn: 'শিমুল বাগান থেকে অন্যান্য দর্শনীয় স্থানে যাত্রা',
    titleEn: 'Connecting to Barek Tila, Niladri & Tanguar Haor',
    modeBn: 'ভাড়াকৃত মোটরসাইকেল / সিএনজি / ট্রলার নৌকা',
    modeEn: 'Hired Trail Motorbike / Local CNG / Engine Trawler',
    durationBn: '১৫ মিনিট থেকে ১ ঘণ্টা',
    durationEn: '15 mins to 1 hour',
    costRangeBn: '৳২০০ – ৳১,৫০০ (দূরত্ব ও বাহন ভেদে)',
    costRangeEn: '৳200 – ৳1,500 depending on route',
    descriptionBn: 'শিমুল বাগান দেখা শেষে নদী পার হয়ে উঠুন বারেক টিলায়। সেখান থেকে মোটরসাইকেল রিজার্ভ করে রাজাই ঝর্ণা, টেকেরঘাট ও বিখ্যাত নীলাদ্রি লেক দর্শন করে তাহিরপুর ঘাটে ফিরে আসা যায়।',
    descriptionEn: 'After exploring the garden, cross over to Barek Tila. From there, hire local motorcycle guides to visit Rajai Waterfall, Tekerghat, and the iconic Niladri Lake.',
    iconName: 'bike'
  }
];

export const budgetCalculatorData = {
  solo: {
    titleBn: 'একক ভ্রমণকারী (Solo Backpacker)',
    titleEn: 'Solo Backpacker',
    totalBn: '৳৩,২০০ – ৳৪,৫০০',
    totalEn: '৳3,200 – ৳4,500',
    breakdownBn: [
      'ঢাকা-সুনামগঞ্জ যাতায়াত বাস (নন-এসি): ৳১,৬০০ (উভয় পথ)',
      'লোকাল সিএনজি ও খেয়া নৌকা: ৳৫০০',
      'তাহিরপুরে রাত্রিযাপন (হোমস্টে/বাজেট হোটেল): ৳৮০০ – ৳১,২০০',
      'খাবার ও চা-নাস্তা (২ দিন): ৳১,২০০',
      'জরুরি ও অতিরিক্ত খরচ: ৳৫০০'
    ],
    breakdownEn: [
      'Dhaka-Sunamganj roundtrip bus (Non-AC): ৳1,600',
      'Local CNG transit & ferry crossing: ৳500',
      'Budget hotel / rustic homestay (1 Night): ৳800 – ৳1,200',
      'Local meals & snacks (2 days): ৳1,200',
      'Incidental & reserve budget: ৳500'
    ]
  },
  couple: {
    titleBn: 'দম্পতি / দুজন (Couple / Duo)',
    titleEn: 'Couple / Duo',
    totalBn: '৳৬,৫০০ – ৳৯,০০০ (মোট)',
    totalEn: '৳6,500 – ৳9,000 (Total)',
    breakdownBn: [
      'ঢাকা-সুনামগঞ্জ যাতায়াত বাস (এসি/নন-এসি): ৳৩,২০০ – ৳৪,৮০০',
      'বাইক / সিএনজি রিজার্ভ দর্শনীয় স্থানে: ৳১,৫০০',
      'মানসম্মত হোটেল / কাপল রুম (১ রাত): ৳১,৫০০ – ৳২,৫০০',
      'হাওরের তাজা মাছ ও স্থানীয় খাবার: ৳২,০০০',
      'নৌকা ও ফটোগ্রাফি টিপস: ৳৮০০'
    ],
    breakdownEn: [
      'Dhaka-Sunamganj roundtrip buses: ৳3,200 – ৳4,800',
      'Reserved bike / CNG local transit: ৳1,500',
      'Standard private room / lodge (1 Night): ৳1,500 – ৳2,500',
      'Fresh haor fish & regional dining: ৳2,000',
      'Private boat ride & local guide: ৳800'
    ]
  },
  group: {
    titleBn: '৪-৬ জনের গ্রুপ (Group of 4–6)',
    titleEn: 'Group of 4–6 Friends/Family',
    totalBn: '৳২,৮০০ – ৳৩,৮০০ (জনপ্রতি)',
    totalEn: '৳2,800 – ৳3,800 (Per Person)',
    breakdownBn: [
      'গ্রুপ বাস টিকিট বা মাইক্রোবাস শেয়ার: ৳১,৬০০ (জনপ্রতি)',
      'রিজার্ভ বোট বা সিএনজি শেয়ারিং খরচ: ৳৫০০ (জনপ্রতি)',
      'তাহিরপুর বা সুনামগঞ্জে গ্রুপ রুম শেয়ার: ৳৭০০ – ৳১,০০০ (জনপ্রতি)',
      'হাওরের ঐতিহ্যবাহী ভুরিভোজ: ৳১,০০০ (জনপ্রতি)'
    ],
    breakdownEn: [
      'Group transport ticket split: ৳1,600 per person',
      'Shared reserved boat & transport: ৳500 per person',
      'Multi-bed room / cottage split: ৳700 – ৳1,000 per person',
      'Traditional group feasts with fresh fish: ৳1,000 per person'
    ]
  }
};
