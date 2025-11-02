export interface AudiobookChapter {
  id: string;
  title: string;
  duration: number; // in seconds
  audioUrl: string;
  transcript: string;
  startTime: number;
  endTime: number;
}

export interface Audiobook {
  id: string;
  title: string;
  author: string;
  description: string;
  shortDescription: string; // For Blinkist-style preview
  coverImage: string;
  duration: number; // total duration in seconds
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: 'English' | 'Igbo' | 'Bilingual';
  publishedAt: string;
  featured: boolean;
  trending: boolean;
  rating: number;
  totalRatings: number;
  chapters: AudiobookChapter[];
  tags: string[];
  relatedArticles?: number[]; // IDs of related articles
  isFree: boolean;
  premiumContent: boolean;
}

export interface UserProgress {
  audiobookId: string;
  chapterId: string;
  currentTime: number;
  completed: boolean;
  bookmarked: boolean;
  lastListened: string;
  totalListenTime: number;
}

export interface AudiobookPlaylist {
  id: string;
  title: string;
  description: string;
  audiobooks: string[]; // Audiobook IDs
  createdBy: string;
  isPublic: boolean;
  createdAt: string;
}

export interface AudiobookReview {
  id: string;
  audiobookId: string;
  userId: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: string;
}
