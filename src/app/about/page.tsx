import Image from "next/image";
import { Heart, Users, Target, Globe } from "lucide-react";

export default function AboutPage() {
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
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="text-brand-gold">NDIGBO</span> <span className="text-brand-forest">VIVA</span>
          </h1>
          <p className="text-2xl md:text-3xl text-brand-gold font-semibold max-w-3xl mx-auto">
            Know Your Roots • Build Solidarity • Invest at Home
          </p>
          <p className="text-lg text-gray-200 mt-4">
            Umuigbo Kunienu!
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ndigbo Viva is dedicated to celebrating and preserving Igbo civilization while building 
              stronger communities and fostering economic development both in the homeland and 
              across the diaspora.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Cultural Preservation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We work to preserve and promote Igbo language, traditions, and values for future generations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Community Building
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We foster connections and solidarity among Igbo people worldwide through shared experiences and mutual support.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Economic Development
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We encourage and facilitate investment in our homeland to create opportunities and drive growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Founded in 2024, Ndigbo Viva emerged from a simple yet powerful realization: 
                  the Igbo people have always been known for their resilience, entrepreneurial spirit, 
                  and strong sense of community. However, in the modern world, these values needed 
                  a platform to thrive and connect across borders.
                </p>
                <p>
                  Our journey began with a YouTube channel dedicated to sharing stories, insights, 
                  and discussions about Igbo culture, community building, and economic development. 
                  What started as a passion project has grown into a movement that brings together 
                  Igbo people from all walks of life.
                </p>
                <p>
                  Today, we continue to build bridges between generations, cultures, and continents, 
                  ensuring that the rich heritage of the Igbo people remains vibrant and relevant 
                  in the 21st century.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/Ndigbo Viva Logo.jpg"
                  alt="Ndigbo Viva Logo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              These core principles guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Onye aghana nwanne ya
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                &ldquo;Never abandon your brother/sister&rdquo; - We believe in mutual support and standing together as a community.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Eziokwu bu ndu
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                &ldquo;Truth is life&rdquo; - We are committed to honesty, integrity, and transparency in all our endeavors.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Ike kwulu, ike akwudebe ya
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                &ldquo;When a man says yes, his chi says yes&rdquo; - We believe in the power of determination and personal responsibility.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Igwebuike
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                &ldquo;Strength in numbers&rdquo; - We understand that our collective power is greater than the sum of our individual efforts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Passionate individuals dedicated to our mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Content Creators
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Talented individuals who create engaging content about Igbo culture and community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Community Leaders
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dedicated leaders who organize events and foster connections within our community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Development Partners
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Strategic partners who help drive economic development and investment initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-yellow-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-yellow-100 mb-8">
            Be part of the movement that&apos;s building a stronger future for the Igbo people
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.youtube.com/@NDIGBOVIVA"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-colors"
            >
              Subscribe to Our Channel
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-yellow-600 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
