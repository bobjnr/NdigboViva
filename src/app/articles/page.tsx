'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight, BookOpen, TrendingUp, Star } from "lucide-react";
import AudiobooksSection from "@/components/AudiobooksSection";

const articleCategories = ["All", "Culture", "History", "Business", "Education", "Technology", "Health", "Lifestyle"];

const articles = [
  {
    id: 1,
    title: "The Rich History of Igbo Traditional Architecture",
    excerpt: "Explore the unique architectural styles of the Igbo people and how they reflect our cultural values and environmental adaptation.",
    content: "Full article content here...",
    author: "Dr. Adaora Nwosu",
    publishedAt: "2024-03-10",
    readTime: "8 min read",
    category: "Culture",
    image: "/Ndigbo Viva Logo.jpg",
    featured: true,
    trending: true,
    views: 1250,
    likes: 89
  },
  {
    id: 2,
    title: "Building Wealth Through Igbo Business Principles",
    excerpt: "Learn how traditional Igbo business practices can guide modern entrepreneurship and wealth creation strategies.",
    content: "Full article content here...",
    author: "Chinedu Okonkwo",
    publishedAt: "2024-03-08",
    readTime: "12 min read",
    category: "Business",
    image: "/Ndigbo Viva Logo.jpg",
    featured: false,
    trending: true,
    views: 2100,
    likes: 156
  },
  {
    id: 3,
    title: "The Future of Igbo Language in the Digital Age",
    excerpt: "How technology is helping preserve and promote the Igbo language among younger generations worldwide.",
    content: "Full article content here...",
    author: "Prof. Ifeoma Eze",
    publishedAt: "2024-03-05",
    readTime: "6 min read",
    category: "Education",
    image: "/Ndigbo Viva Logo.jpg",
    featured: false,
    trending: false,
    views: 890,
    likes: 67
  },
  {
    id: 4,
    title: "Traditional Igbo Medicine: Ancient Wisdom for Modern Health",
    excerpt: "Discover the healing properties of traditional Igbo herbs and their potential integration with modern medicine.",
    content: "Full article content here...",
    author: "Dr. Ngozi Okafor",
    publishedAt: "2024-03-03",
    readTime: "10 min read",
    category: "Health",
    image: "/Ndigbo Viva Logo.jpg",
    featured: true,
    trending: false,
    views: 1450,
    likes: 112
  },
  {
    id: 5,
    title: "Igbo Women in Tech: Breaking Barriers and Building Futures",
    excerpt: "Celebrating the achievements of Igbo women in technology and their contributions to innovation.",
    content: "Full article content here...",
    author: "Adaora Uche",
    publishedAt: "2024-03-01",
    readTime: "7 min read",
    category: "Technology",
    image: "/Ndigbo Viva Logo.jpg",
    featured: false,
    trending: true,
    views: 1800,
    likes: 134
  },
  {
    id: 6,
    title: "The Art of Igbo Storytelling: Preserving Our Oral Traditions",
    excerpt: "Understanding the importance of storytelling in Igbo culture and its role in passing down wisdom.",
    content: "Full article content here...",
    author: "Chinwe Nwankwo",
    publishedAt: "2024-02-28",
    readTime: "9 min read",
    category: "Culture",
    image: "/Ndigbo Viva Logo.jpg",
    featured: false,
    trending: false,
    views: 720,
    likes: 45
  },
  {
    id: 7,
    title: "Sustainable Living: Lessons from Igbo Environmental Practices",
    excerpt: "How traditional Igbo environmental practices can guide modern sustainable living approaches.",
    content: "Full article content here...",
    author: "Emeka Onyema",
    publishedAt: "2024-02-25",
    readTime: "11 min read",
    category: "Lifestyle",
    image: "/Ndigbo Viva Logo.jpg",
    featured: false,
    trending: false,
    views: 950,
    likes: 78
  },
  {
    id: 8,
    title: "The Igbo Diaspora: Maintaining Cultural Identity Abroad",
    excerpt: "Strategies for preserving Igbo culture and identity while living in different countries around the world.",
    content: "Full article content here...",
    author: "Dr. Uche Nwosu",
    publishedAt: "2024-02-22",
    readTime: "13 min read",
    category: "Culture",
    image: "/Ndigbo Viva Logo.jpg",
    featured: true,
    trending: true,
    views: 2200,
    likes: 189
  }
];

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const filteredArticles = selectedCategory === "All" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case "oldest":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      case "popular":
        return b.views - a.views;
      case "trending":
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const featuredArticles = articles.filter(article => article.featured);
  const trendingArticles = articles.filter(article => article.trending);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black to-gray-900 text-white py-16">
        {/* Background Logo */}
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
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-brand-gold">ARTICLES</span> <span className="text-brand-forest">&</span> <span className="text-brand-gold">INSIGHTS</span>
            </h1>
            <p className="text-xl text-brand-gold font-semibold max-w-3xl mx-auto">
              Deep dive into Igbo culture, history, and contemporary issues through our curated articles
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-gray-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900  mb-4">
              Featured Articles
            </h2>
            <p className="text-lg text-gray-600 ">
              Our most important and impactful pieces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <div key={article.id} className="bg-white  rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={article.image}
                    alt={article.title}
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
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900  mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600  mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500  mb-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {article.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 ">
                      {new Date(article.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <Link
                      href={`/articles/${article.id}`}
                      className="text-brand-gold hover:text-brand-gold-light font-semibold transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters and Sort */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {articleCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-brand-gold text-white shadow-lg"
                        : "bg-white  text-gray-700  hover:bg-brand-gold hover:text-white hover:shadow-md border border-gray-200 "
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 ">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900  focus:ring-brand-gold focus:border-brand-gold"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedArticles.map((article) => (
              <div key={article.id} className="bg-white  rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-40">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-brand-forest text-white px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                  </div>
                  {article.trending && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900  mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600  mb-4 line-clamp-2 text-sm">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500  mb-4">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {article.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 ">
                      <span>{article.views} views</span>
                      <span className="flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        {article.likes}
                      </span>
                    </div>
                    <Link
                      href={`/articles/${article.id}`}
                      className="text-brand-gold hover:text-brand-gold-light font-semibold text-sm transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Articles Message */}
          {sortedArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400  mb-4">
                <BookOpen className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900  mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 ">
                No articles available in the {selectedCategory} category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Audiobooks Section */}
      <AudiobooksSection showFullSection={false} />

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-50 ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900  mb-4">
            Stay Informed
          </h2>
          <p className="text-lg text-gray-600  mb-8">
            Get notified when we publish new articles and insights about Igbo culture and community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300  bg-white  text-gray-900  focus:ring-brand-gold focus:border-brand-gold"
            />
            <button className="bg-brand-gold hover:bg-brand-gold-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
