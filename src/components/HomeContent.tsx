'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import VideoHover from "@/components/VideoHover";

interface HomeContentProps {
  latestVideo: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoId: string;
    publishedAt: string;
    duration: string;
  };
  recentPosts: {
    id: string;
    title: string;
    excerpt: string;
    thumbnail: string;
    publishedAt: string;
    slug: string;
  }[];
  showWelcome?: boolean;
}

export default function HomeContent({ latestVideo, recentPosts, showWelcome }: HomeContentProps) {
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(showWelcome);

  // Auto-dismiss welcome message after 5 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setIsWelcomeVisible(false);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  // Manual dismiss function
  const dismissWelcome = () => {
    setIsWelcomeVisible(false);
  };

  return (
    <div className="min-h-screen bg-cream ">
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
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="text-brand-gold">NDIGBO</span> <span className="text-brand-forest">VIVA</span>
          </h1>
          <p className="text-xl md:text-2xl font-semibold max-w-3xl mx-auto mb-4">
            <span className="text-brand-forest">IGBO</span> <span className="text-brand-gold">KUNIENU!</span>
          </p>
          <p className="text-2xl md:text-3xl text-brand-gold font-semibold max-w-3xl mx-auto">
            Know Your Roots • Build Solidarity • Invest at Home
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Explore Our Content
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Banner */}
      {isWelcomeVisible && (
        <section className="py-8 bg-green-50  border-b border-green-200  animate-in slide-in-from-top duration-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white  rounded-lg shadow-lg p-6 border border-green-200  relative">
              {/* Close button */}
              <button
                onClick={dismissWelcome}
                className="absolute top-4 right-4 text-green-600 hover:text-green-800   transition-colors"
                aria-label="Close welcome message"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-start space-x-4 pr-8">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎉</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-800  mb-2">
                    Welcome to Ndigbo Viva!
                  </h3>
                  <p className="text-green-700  mb-4">
                    You&apos;re now part of our community! Explore our latest content, join our discussions, 
                    and don&apos;t forget to subscribe to our YouTube channel for more insights and stories.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/blog"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
                    >
                      Explore Our Content
                      <ArrowRight className="ml-2" size={16} />
                    </Link>
                    <a
                      href="https://youtube.com/@ndigboviva"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
                    >
                      Subscribe on YouTube
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Video Section */}
      <section className="py-12 bg-warm-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-22 h-22 rounded-full mb-6 overflow-hidden">
              <Image
                src="/WhatsApp Image 2025-10-19 at 12.16.15_5596d555.jpg"
                alt="WhatsApp Channel"
                width={75}
                height={75}
                className="object-cover rounded-full"
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-warm-900  mb-6">
              Latest from Our Channel
            </h2>
            <p className="text-xl text-warm-600  max-w-2xl mx-auto">
              Stay updated with our latest videos and insights
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-cream  rounded-lg shadow-brand-gold overflow-hidden border border-brand-gold-200">
              <VideoHover
                videoId={latestVideo.videoId}
                thumbnail={latestVideo.thumbnail}
                title={latestVideo.title}
                showControls={true}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-warm-900  mb-2">
                  {latestVideo.title}
                </h3>
                <p className="text-warm-600  mb-4">
                  {latestVideo.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-warm-500 ">
                    {new Date(latestVideo.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <Link
                    href={`/blog/${latestVideo.id}`}
                    className="text-brand-gold hover:text-brand-gold-light font-bold text-lg transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-12 bg-cream ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-warm-900  mb-6">
              Recent Blog Posts
            </h2>
            <p className="text-xl text-warm-600  max-w-2xl mx-auto">
              Insights, stories, and discussions from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white  rounded-lg shadow-brand-bronze overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border border-brand-bronze-200 "
              >
                <VideoHover
                  videoId={post.id}
                  thumbnail={post.thumbnail}
                  title={post.title}
                  showControls={true}
                  enableAudio={true}
                  autoPlay={true}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-warm-900  mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-warm-600  mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-warm-500 ">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-brand-forest hover:text-brand-forest-light font-bold text-lg transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="bg-brand-forest hover:bg-brand-forest-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center shadow-brand-forest"
            >
              View All Posts
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16 bg-gray-50 ">
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
