import { Audiobook } from '@/types/audiobooks';

export const audiobooks: Audiobook[] = [
  {
    id: 'ab-001',
    title: 'The Wisdom of Igbo Proverbs',
    author: 'Dr. Adaora Nwosu',
    description: 'A comprehensive exploration of traditional Igbo proverbs and their deep cultural meanings. This audiobook delves into the wisdom passed down through generations, examining how these sayings reflect Igbo values, philosophy, and worldview.',
    shortDescription: 'Discover the profound wisdom embedded in traditional Igbo proverbs and their relevance to modern life.',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center',
    duration: 1800, // 30 minutes
    category: 'Culture',
    difficulty: 'Beginner',
    language: 'Bilingual',
    publishedAt: '2024-03-15',
    featured: true,
    trending: true,
    rating: 4.8,
    totalRatings: 156,
    chapters: [
      {
        id: 'ch-001-1',
        title: 'Introduction to Igbo Proverbs',
        duration: 300,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'Welcome to the wisdom of Igbo proverbs. In this chapter, we explore the foundation of Igbo oral tradition...',
        startTime: 0,
        endTime: 300
      },
      {
        id: 'ch-001-2',
        title: 'Proverbs About Family and Community',
        duration: 450,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'Family is the cornerstone of Igbo society. These proverbs teach us about unity, respect, and responsibility...',
        startTime: 300,
        endTime: 750
      },
      {
        id: 'ch-001-3',
        title: 'Wisdom for Success and Achievement',
        duration: 600,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'Igbo proverbs offer timeless guidance for personal and professional success. Let us explore these gems of wisdom...',
        startTime: 750,
        endTime: 1350
      },
      {
        id: 'ch-001-4',
        title: 'Modern Applications',
        duration: 450,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'How do these ancient proverbs apply to our contemporary world? We examine their relevance today...',
        startTime: 1350,
        endTime: 1800
      }
    ],
    tags: ['proverbs', 'wisdom', 'culture', 'tradition'],
    relatedArticles: [1, 6],
    isFree: true,
    premiumContent: false
  },
  {
    id: 'ab-002',
    title: 'Igbo Business Philosophy',
    author: 'Chinedu Okonkwo',
    description: 'An in-depth analysis of traditional Igbo business practices and their application in modern entrepreneurship. Learn about the principles that have guided Igbo traders and businesspeople for centuries.',
    shortDescription: 'Master the time-tested business principles that have made Igbo entrepreneurs successful worldwide.',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
    duration: 2400, // 40 minutes
    category: 'Business',
    difficulty: 'Intermediate',
    language: 'English',
    publishedAt: '2024-03-12',
    featured: true,
    trending: false,
    rating: 4.6,
    totalRatings: 89,
    chapters: [
      {
        id: 'ch-002-1',
        title: 'The Foundation of Igbo Business',
        duration: 600,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'Understanding the core principles that have guided Igbo business practices for generations...',
        startTime: 0,
        endTime: 600
      },
      {
        id: 'ch-002-2',
        title: 'Networking and Relationships',
        duration: 720,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'The importance of building strong relationships in Igbo business culture...',
        startTime: 600,
        endTime: 1320
      },
      {
        id: 'ch-002-3',
        title: 'Risk Management and Investment',
        duration: 720,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'Traditional approaches to risk assessment and investment strategies...',
        startTime: 1320,
        endTime: 2040
      },
      {
        id: 'ch-002-4',
        title: 'Modern Applications',
        duration: 360,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'Applying these principles in today\'s global business environment...',
        startTime: 2040,
        endTime: 2400
      }
    ],
    tags: ['business', 'entrepreneurship', 'networking', 'investment'],
    relatedArticles: [2],
    isFree: false,
    premiumContent: true
  },
  {
    id: 'ab-003',
    title: 'Traditional Igbo Medicine',
    author: 'Dr. Ngozi Okafor',
    description: 'Explore the rich tradition of Igbo herbal medicine and healing practices. Learn about the plants, techniques, and wisdom that have been used for centuries to promote health and wellness.',
    shortDescription: 'Discover the healing wisdom of traditional Igbo medicine and its modern applications.',
    coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop&crop=center',
    duration: 2100, // 35 minutes
    category: 'Health',
    difficulty: 'Beginner',
    language: 'Bilingual',
    publishedAt: '2024-03-08',
    featured: false,
    trending: true,
    rating: 4.7,
    totalRatings: 124,
    chapters: [
      {
        id: 'ch-003-1',
        title: 'Introduction to Traditional Medicine',
        duration: 420,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'Welcome to the world of traditional Igbo medicine. We begin with understanding the holistic approach...',
        startTime: 0,
        endTime: 420
      },
      {
        id: 'ch-003-2',
        title: 'Common Healing Plants',
        duration: 630,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'Let us explore the plants that have been used for healing in Igbo tradition...',
        startTime: 420,
        endTime: 1050
      },
      {
        id: 'ch-003-3',
        title: 'Healing Techniques and Practices',
        duration: 630,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'Understanding the methods and practices used in traditional healing...',
        startTime: 1050,
        endTime: 1680
      },
      {
        id: 'ch-003-4',
        title: 'Integration with Modern Medicine',
        duration: 420,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'How traditional and modern medicine can work together for better health outcomes...',
        startTime: 1680,
        endTime: 2100
      }
    ],
    tags: ['medicine', 'health', 'herbs', 'healing', 'wellness'],
    relatedArticles: [4],
    isFree: true,
    premiumContent: false
  },
  {
    id: 'ab-004',
    title: 'Igbo Women in Leadership',
    author: 'Adaora Uche',
    description: 'Celebrating the achievements and leadership qualities of Igbo women throughout history and in contemporary society. This audiobook highlights the strength, wisdom, and resilience of Igbo women.',
    shortDescription: 'Celebrate the remarkable achievements and leadership of Igbo women across generations.',
    coverImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=center',
    duration: 2700, // 45 minutes
    category: 'Culture',
    difficulty: 'Intermediate',
    language: 'English',
    publishedAt: '2024-03-05',
    featured: false,
    trending: false,
    rating: 4.9,
    totalRatings: 203,
    chapters: [
      {
        id: 'ch-004-1',
        title: 'Historical Women Leaders',
        duration: 675,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'We begin by honoring the women who shaped Igbo history and society...',
        startTime: 0,
        endTime: 675
      },
      {
        id: 'ch-004-2',
        title: 'Contemporary Achievements',
        duration: 810,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'Modern Igbo women making their mark in various fields and industries...',
        startTime: 675,
        endTime: 1485
      },
      {
        id: 'ch-004-3',
        title: 'Leadership Qualities',
        duration: 810,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'The unique qualities that make Igbo women effective leaders...',
        startTime: 1485,
        endTime: 2295
      },
      {
        id: 'ch-004-4',
        title: 'Future Opportunities',
        duration: 405,
        audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        transcript: 'Looking ahead to the continued advancement of Igbo women in leadership...',
        startTime: 2295,
        endTime: 2700
      }
    ],
    tags: ['women', 'leadership', 'empowerment', 'history', 'achievement'],
    relatedArticles: [5],
    isFree: false,
    premiumContent: true
  }
];

export const audiobookCategories = [
  'All',
  'Culture',
  'History', 
  'Business',
  'Education',
  'Health',
  'Technology',
  'Lifestyle',
  'Language',
  'Philosophy'
];

export const difficultyLevels = [
  'Beginner',
  'Intermediate', 
  'Advanced'
];

export const languages = [
  'English',
  'Igbo',
  'Bilingual'
];
