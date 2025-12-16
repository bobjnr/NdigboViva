'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Users,
  ArrowRight,
  Heart,
  Award,
  BookOpen,
  TreePine,
  Globe,
  FileText,
  CheckCircle,
  Search,
  Share2,
  Users2,
  History,
  Activity,
  Calendar,
  Shirt,
  Sparkles,
  Menu
} from "lucide-react";
import GenealogyForm from "@/components/GenealogyForm";
import SubscriptionGate from "@/components/SubscriptionGate";
import { type GenealogyFormSubmission } from "@/lib/genealogy-database";

type CommunitySection = 'genealogy' | 'health' | 'lifestyle' | 'events' | 'fashion';

export default function OurCommunityPage() {
  const [activeSection, setActiveSection] = useState<CommunitySection>('genealogy');
  const [showForm, setShowForm] = useState(false);

  const handleFormSubmit = (data: GenealogyFormSubmission) => {
    void data;
  };

  const navigationItems = [
    { id: 'genealogy' as CommunitySection, label: 'Igbo Genealogy', icon: TreePine },
    { id: 'health' as CommunitySection, label: 'Igbo Health', icon: Activity },
    { id: 'lifestyle' as CommunitySection, label: 'Igbo Lifestyle', icon: Sparkles },
    { id: 'events' as CommunitySection, label: 'Events', icon: Calendar },
    { id: 'fashion' as CommunitySection, label: 'Fashion', icon: Shirt },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'genealogy':
        return (
          <div className="space-y-8">
            {/* Genealogy Overview */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Igbo Genealogy Project
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  A comprehensive initiative to help Igbo people worldwide trace their roots,
                  connect with their ancestral communities, and preserve their cultural heritage.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="bg-brand-gold-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-8 h-8 text-brand-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Trace Your Lineage</h3>
                  <p className="text-gray-600 text-sm">
                    Discover your ancestral villages, kindred, and family connections through our comprehensive database.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="bg-brand-forest-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users2 className="w-8 h-8 text-brand-forest" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Connect with Family</h3>
                  <p className="text-gray-600 text-sm">
                    Find and connect with relatives across the globe who share your ancestral roots.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="bg-brand-bronze-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-brand-bronze" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Preserve Heritage</h3>
                  <p className="text-gray-600 text-sm">
                    Document and preserve your family history, traditions, and cultural practices for future generations.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="bg-brand-red-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Share2 className="w-8 h-8 text-brand-red" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Share Stories</h3>
                  <p className="text-gray-600 text-sm">
                    Share your family stories, traditions, and cultural knowledge with the global Igbo community.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  How It Works
                </h3>
                <p className="text-lg text-gray-600">
                  Simple steps to trace your Igbo roots and connect with your heritage
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-brand-gold text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Fill the Form</h4>
                  <p className="text-gray-600">
                    Provide your current location and what you know about your ancestral origins.
                    Our smart form will help guide you through the process.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-brand-forest text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">We Research</h4>
                  <p className="text-gray-600">
                    Our team will research your lineage using our comprehensive database of Igbo
                    communities, villages, and family connections.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-brand-bronze text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Get Connected</h4>
                  <p className="text-gray-600">
                    Receive your family tree, ancestral information, and connections to
                    relatives and cultural communities worldwide.
                  </p>
                </div>
              </div>
            </div>

            {/* Genealogy Form - Protected by Subscription Gate */}
            <SubscriptionGate>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Start Tracing Your Roots
                  </h3>
                  <p className="text-lg text-gray-600">
                    Fill out the form below to begin your journey of discovering your Igbo heritage
                  </p>
                </div>

                <GenealogyForm onSubmit={handleFormSubmit} />
              </div>
            </SubscriptionGate>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Why Trace Your Roots?
                </h3>
                <p className="text-lg text-gray-600">
                  Discover the benefits of connecting with your Igbo heritage
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Heart className="w-6 h-6 text-brand-gold mr-3" />
                    <h4 className="text-xl font-bold text-gray-900">Cultural Identity</h4>
                  </div>
                  <p className="text-gray-600">
                    Strengthen your connection to Igbo culture, traditions, and values that have been passed down through generations.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Users className="w-6 h-6 text-brand-forest mr-3" />
                    <h4 className="text-xl font-bold text-gray-900">Family Connections</h4>
                  </div>
                  <p className="text-gray-600">
                    Find and connect with relatives you never knew existed, building a stronger global Igbo family network.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Award className="w-6 h-6 text-brand-bronze mr-3" />
                    <h4 className="text-xl font-bold text-gray-900">Personal Pride</h4>
                  </div>
                  <p className="text-gray-600">
                    Take pride in your heritage and share your family's story with future generations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'health':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Igbo Health – Online Medical Assistance
                </h2>
                <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                  An innovative, locally adapted program connecting you with relevant medical experts
                  who help optimize diagnosis, investigations, treatment options, and access to the
                  right medications and facilities near you.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">What you get</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>Expert review by specialists in the relevant field of medicine.</li>
                      <li>Guidance to reach a comprehensive clinical diagnosis.</li>
                      <li>Recommendations for local centers to conduct appropriate investigations.</li>
                      <li>Advice on optimal medical or surgical treatment pathways.</li>
                      <li>Direction to the nearest pharmacy for correct medication brands.</li>
                      <li>Support with follow‑up, diabetes/hypertension long‑term care, and elder care.</li>
                      <li>Vaccination guidance across age groups and conditions.</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Quality & Feedback</h3>
                    <p className="text-gray-700">
                      Every six months, we conduct a computer‑based feedback review from users and
                      continuously improve the service based on comprehensive results. We also act as a
                      strong pathway for second medical opinions before optional procedures—verifying
                      necessity, diagnosis, alternatives, and the best place to have it done.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Why this matters</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>Reduce diagnostic and medical errors in Nigeria.</li>
                      <li>Ensure patients receive correct diagnoses at the nearest suitable facility.</li>
                      <li>Improve access to the right medication brands and care continuity.</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-b from-brand-gold/10 to-brand-forest/10 rounded-lg shadow-lg p-6 h-fit">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Simple monthly access</h3>
                  <p className="text-3xl font-extrabold text-brand-gold mb-2">₦50,000</p>
                  <p className="text-gray-700 mb-4">Per month per case, paid online.</p>
                  <div className="flex flex-col gap-3">
                    <a
                      href="/auth/register"
                      className="bg-brand-gold text-white px-6 py-3 rounded-lg font-semibold text-center hover:opacity-90 transition"
                    >
                      Register & Get Expert Support
                    </a>
                    <a
                      href="/contact"
                      className="border border-brand-gold text-brand-gold px-6 py-3 rounded-lg font-semibold text-center hover:bg-brand-gold hover:text-white transition"
                    >
                      Ask Questions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'lifestyle':
        return (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Sparkles className="w-16 h-16 text-brand-gold mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Igbo Lifestyle</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover and celebrate the vibrant Igbo lifestyle, traditions, and cultural practices.
            </p>
            <p className="text-gray-500 mt-4">Content coming soon...</p>
          </div>
        );

      case 'events':
        return (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Calendar className="w-16 h-16 text-brand-forest mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Events</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay connected with upcoming Igbo community events, celebrations, and gatherings.
            </p>
            <p className="text-gray-500 mt-4">Content coming soon...</p>
          </div>
        );

      case 'fashion':
        return (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Shirt className="w-16 h-16 text-brand-bronze mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fashion</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore traditional and modern Igbo fashion, attire, and cultural wear.
            </p>
            <p className="text-gray-500 mt-4">Content coming soon...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-brand-gold">OUR</span> <span className="text-brand-forest">COMMUNITY</span>
            </h1>
            <p className="text-xl text-brand-gold font-semibold max-w-3xl mx-auto mb-6">
              Building and supporting the global Igbo community through genealogy, health, lifestyle, events, and more
            </p>
            <p className="text-lg text-gray-200 max-w-4xl mx-auto mb-8">
              Explore our diverse range of community services designed to preserve Igbo heritage,
              connect families, promote health and wellness, and celebrate our rich cultural traditions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-brand-gold-20 px-4 py-2 rounded-full">
                <TreePine className="w-4 h-4 mr-2" />
                <span>Genealogy</span>
              </div>
              <div className="flex items-center bg-brand-gold-20 px-4 py-2 rounded-full">
                <Activity className="w-4 h-4 mr-2" />
                <span>Health</span>
              </div>
              <div className="flex items-center bg-brand-gold-20 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Lifestyle</span>
              </div>
              <div className="flex items-center bg-brand-gold-20 px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Events</span>
              </div>
              <div className="flex items-center bg-brand-gold-20 px-4 py-2 rounded-full">
                <Shirt className="w-4 h-4 mr-2" />
                <span>Fashion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">Community Sections</h3>
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors text-left ${activeSection === item.id
                            ? 'bg-brand-gold text-white font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
              {renderContent()}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}