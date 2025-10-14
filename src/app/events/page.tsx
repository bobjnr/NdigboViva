'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users, ArrowRight, Filter } from "lucide-react";

const eventCategories = ["All", "Cultural", "Business", "Educational", "Social", "Religious", "Sports"];

const upcomingEvents = [
  {
    id: 1,
    title: "Igbo Cultural Festival 2024",
    description: "Join us for a celebration of Igbo culture with traditional music, dance, food, and art exhibitions.",
    date: "2024-03-15",
    time: "10:00 AM - 6:00 PM",
    location: "Igbo Cultural Center, Lagos",
    category: "Cultural",
    image: "/Ndigbo Viva Logo.jpg",
    attendees: 250,
    price: "Free",
    featured: true
  },
  {
    id: 2,
    title: "Investment Summit: Building Wealth in Nigeria",
    description: "Learn about investment opportunities in Nigeria and network with successful entrepreneurs.",
    date: "2024-03-22",
    time: "9:00 AM - 4:00 PM",
    location: "Eko Hotel & Suites, Lagos",
    category: "Business",
    image: "/Ndigbo Viva Logo.jpg",
    attendees: 150,
    price: "₦25,000",
    featured: false
  },
  {
    id: 3,
    title: "Igbo Language Workshop",
    description: "Interactive workshop to learn and improve your Igbo language skills for all levels.",
    date: "2024-03-28",
    time: "2:00 PM - 5:00 PM",
    location: "Online Event",
    category: "Educational",
    image: "/Ndigbo Viva Logo.jpg",
    attendees: 75,
    price: "₦5,000",
    featured: false
  },
  {
    id: 4,
    title: "Youth Empowerment Conference",
    description: "Empowering the next generation with skills, mentorship, and opportunities for growth.",
    date: "2024-04-05",
    time: "8:00 AM - 3:00 PM",
    location: "University of Lagos",
    category: "Educational",
    image: "/Ndigbo Viva Logo.jpg",
    attendees: 300,
    price: "Free",
    featured: true
  },
  {
    id: 5,
    title: "Igbo Fashion Show",
    description: "Showcasing contemporary Igbo fashion and traditional attire with modern twists.",
    date: "2024-04-12",
    time: "7:00 PM - 10:00 PM",
    location: "The Oriental Hotel, Lagos",
    category: "Cultural",
    image: "/Ndigbo Viva Logo.jpg",
    attendees: 200,
    price: "₦15,000",
    featured: false
  },
  {
    id: 6,
    title: "Community Service Day",
    description: "Join us in giving back to our community through various service activities.",
    date: "2024-04-20",
    time: "8:00 AM - 2:00 PM",
    location: "Various Locations",
    category: "Social",
    image: "/Ndigbo Viva Logo.jpg",
    attendees: 100,
    price: "Free",
    featured: false
  }
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents = selectedCategory === "All" 
    ? upcomingEvents 
    : upcomingEvents.filter(event => event.category === selectedCategory);

  const featuredEvents = upcomingEvents.filter(event => event.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
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
              <span className="text-brand-gold">COMING</span> <span className="text-brand-forest">EVENTS</span>
            </h1>
            <p className="text-xl text-brand-gold font-semibold max-w-3xl mx-auto">
              Join our community events and connect with fellow Igbo people worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Events
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Don't miss these upcoming highlights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredEvents.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
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
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4 mr-2" />
                      {event.attendees} attendees
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-brand-gold">
                      {event.price}
                    </span>
                    <button className="bg-brand-forest hover:bg-brand-forest-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              {eventCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-brand-gold text-white shadow-lg"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-brand-gold hover:text-white hover:shadow-md border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-40">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-brand-forest text-white px-3 py-1 rounded-full text-sm font-medium">
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">
                    {event.description}
                  </p>
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3 mr-2" />
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3 h-3 mr-2" />
                      {event.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-brand-gold">
                      {event.price}
                    </span>
                    <button className="text-brand-forest hover:text-brand-forest-light font-semibold text-sm transition-colors">
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Events Message */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Calendar className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No events available in the {selectedCategory} category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Stay Updated on Events
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Get notified about upcoming events and never miss an opportunity to connect with our community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-gold focus:border-brand-gold"
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
