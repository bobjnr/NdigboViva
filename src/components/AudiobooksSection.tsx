'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  Clock, 
  Star, 
  BookOpen, 
  Headphones, 
  TrendingUp, 
  Filter,
  Search,
  Download,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { Audiobook } from '@/types/audiobooks';
import { audiobooks, audiobookCategories } from '@/lib/audiobooks-data';

interface AudiobooksSectionProps {
  showFullSection?: boolean;
}

export default function AudiobooksSection({ showFullSection = false }: AudiobooksSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [difficulty, setDifficulty] = useState('All');
  const [language, setLanguage] = useState('All');
  const [isPremium, setIsPremium] = useState(false);

  const filteredAudiobooks = audiobooks.filter(audiobook => {
    const matchesCategory = selectedCategory === 'All' || audiobook.category === selectedCategory;
    const matchesSearch = audiobook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         audiobook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         audiobook.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = difficulty === 'All' || audiobook.difficulty === difficulty;
    const matchesLanguage = language === 'All' || audiobook.language === language;
    const matchesPremium = !isPremium || audiobook.isFree;

    return matchesCategory && matchesSearch && matchesDifficulty && matchesLanguage && matchesPremium;
  });

  const sortedAudiobooks = [...filteredAudiobooks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case 'oldest':
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      case 'popular':
        return b.rating - a.rating;
      case 'trending':
        return b.totalRatings - a.totalRatings;
      case 'duration':
        return b.duration - a.duration;
      default:
        return 0;
    }
  });

  const featuredAudiobooks = audiobooks.filter(ab => ab.featured);
  const trendingAudiobooks = audiobooks.filter(ab => ab.trending);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!showFullSection) {
    return (
      <section className="py-16 bg-gradient-to-br from-brand-gold/5 to-brand-forest/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Headphones className="w-8 h-8 text-brand-gold mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">
                Audiobooks & Audio Summaries
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Listen to condensed versions of our best articles and exclusive audiobook content. 
              Perfect for learning on the go, just like Blinkist!
            </p>
          </div>

          {/* Featured Audiobooks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredAudiobooks.slice(0, 3).map((audiobook) => (
              <div key={audiobook.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={audiobook.coverImage}
                    alt={audiobook.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-brand-forest text-white px-3 py-1 rounded-full text-sm font-medium">
                      {audiobook.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="bg-white text-brand-gold p-3 rounded-full hover:bg-brand-gold hover:text-white transition-colors">
                      <Play className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {audiobook.title}
                  </h3>
                  <p className="text-gray-600 mb-2 text-sm">
                    by {audiobook.author}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {audiobook.shortDescription}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDuration(audiobook.duration)}
                    </div>
                    <div className="flex items-center">
                      {renderStars(audiobook.rating)}
                      <span className="ml-1">({audiobook.totalRatings})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      audiobook.isFree ? 'text-green-600' : 'text-brand-gold'
                    }`}>
                      {audiobook.isFree ? 'Free' : 'Premium'}
                    </span>
                    <Link
                      href={`/audiobooks/${audiobook.id}`}
                      className="text-brand-gold hover:text-brand-gold-dark font-semibold transition-colors"
                    >
                      Listen Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/audiobooks"
              className="inline-flex items-center bg-brand-gold hover:bg-brand-gold-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              <Headphones className="w-5 h-5 mr-2" />
              Explore All Audiobooks
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black to-gray-900 text-white py-16">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/Ndigbo Viva Logo.jpg"
            alt="Ndigbo Viva Logo Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Headphones className="w-12 h-12 text-brand-gold mr-4" />
              <h1 className="text-4xl md:text-5xl font-display font-bold">
                <span className="text-brand-gold">AUDIOBOOKS</span> <span className="text-brand-forest">&</span> <span className="text-brand-gold">SUMMARIES</span>
              </h1>
            </div>
            <p className="text-xl text-brand-gold font-semibold max-w-3xl mx-auto">
              Listen to condensed wisdom and insights from Igbo culture, history, and contemporary issues
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search audiobooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                  >
                    {audiobookCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                  >
                    <option value="All">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                  >
                    <option value="All">All Languages</option>
                    <option value="English">English</option>
                    <option value="Igbo">Igbo</option>
                    <option value="Bilingual">Bilingual</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="freeOnly"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="freeOnly" className="text-sm text-gray-700">
                  Show only free content
                </label>
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {audiobookCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-brand-gold text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-brand-gold hover:text-white hover:shadow-md border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Audiobooks Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedAudiobooks.map((audiobook) => (
              <div key={audiobook.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={audiobook.coverImage}
                    alt={audiobook.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      audiobook.isFree 
                        ? 'bg-green-500 text-white' 
                        : 'bg-brand-gold text-white'
                    }`}>
                      {audiobook.isFree ? 'Free' : 'Premium'}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-brand-forest text-white px-3 py-1 rounded-full text-sm font-medium">
                      {audiobook.category}
                    </span>
                  </div>
                  {audiobook.trending && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="bg-white text-brand-gold p-3 rounded-full hover:bg-brand-gold hover:text-white transition-colors">
                      <Play className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {audiobook.title}
                  </h3>
                  <p className="text-gray-600 mb-2 text-sm">
                    by {audiobook.author}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {audiobook.shortDescription}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDuration(audiobook.duration)}
                    </div>
                    <div className="flex items-center">
                      {renderStars(audiobook.rating)}
                      <span className="ml-1">({audiobook.totalRatings})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {audiobook.difficulty}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {audiobook.language}
                      </span>
                    </div>
                    <Link
                      href={`/audiobooks/${audiobook.id}`}
                      className="text-brand-gold hover:text-brand-gold-dark font-semibold transition-colors"
                    >
                      Listen Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {sortedAudiobooks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Headphones className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No audiobooks found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
