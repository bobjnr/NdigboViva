'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import VideoHover from "@/components/VideoHover";

const categories = ["All", "Culture", "Economics", "Investment", "Education", "Leadership", "Society"];

interface BlogContentProps {
  blogPosts: {
    id: string;
    title: string;
    excerpt: string;
    thumbnail: string;
    publishedAt: string;
    slug: string;
    duration: string;
    views: string;
    category: string;
  }[];
}

export default function BlogContent({ blogPosts }: BlogContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter posts based on selected category
  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
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
              <span className="text-brand-gold">OUR</span> <span className="text-brand-forest">BLOG</span>
            </h1>
            <p className="text-xl text-brand-gold font-semibold max-w-3xl mx-auto">
              Discover insights, stories, and discussions about Igbo culture, 
              community building, and investing in our future together.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-yellow-500 text-white shadow-lg"
                    : "bg-white  text-gray-700  hover:bg-yellow-500 hover:text-white hover:shadow-md"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results count */}
          <div className="mb-8 text-center">
            <p className="text-gray-600 ">
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} 
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          </div>
          
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white  rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative">
                  <VideoHover
                    videoId={post.id}
                    thumbnail={post.thumbnail}
                    title={post.title}
                    showControls={true}
                    enableAudio={true}
                    autoPlay={true}
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 z-20 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                    {post.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900  mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600  mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500  mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString('en-US')}
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {post.views} views
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-brand-gold hover:text-brand-gold-light font-bold text-lg inline-flex items-center group-hover:translate-x-1 transition-all"
                  >
                    Read More
                    <ArrowRight className="ml-1" size={16} />
                  </Link>
                </div>
              </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400  mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900  mb-2">
                No posts found
              </h3>
              <p className="text-gray-600 ">
                No posts available in the {selectedCategory} category yet.
              </p>
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Load More Posts
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900  mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-gray-600  mb-8">
            Get notified when we publish new content and join our growing community
          </p>
          <NewsletterSignup variant="minimal" />
        </div>
      </section>
    </div>
  );
}
