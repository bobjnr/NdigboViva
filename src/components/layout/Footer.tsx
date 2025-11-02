import Link from 'next/link'
import Image from 'next/image'
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Heart,
  Users,
  Globe,
  ArrowRight,
  TreePine,
  BookOpen,
  Award
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-2xl ring-4 ring-yellow-500 ring-offset-4 ring-offset-gray-900">
                <Image
                  src="/Ndigbo Viva Logo.jpg"
                  alt="Ndigbo Viva Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-500 mb-2">
                  NDIGBO VIVA
                </div>
                <div className="text-lg text-yellow-400 font-semibold">
                  IGBO KUNIENU!
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-lg text-lg leading-relaxed">
              Know Your Roots, Build Solidarity, Invest at Home. Join our global community 
              as we celebrate Igbo culture, trace our heritage, and build a stronger future together.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="w-5 h-5 mr-3 text-yellow-500" />
                <a href="mailto:ndigbovivalimited@gmail.com" className="hover:text-yellow-500 transition-colors">
                  ndigbovivalimited@gmail.com
                </a>
              </div>
              <div className="flex items-center text-gray-300">
                <Globe className="w-5 h-5 mr-3 text-yellow-500" />
                <span>Global Igbo Community</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-500 flex items-center">
              <ArrowRight className="w-5 h-5 mr-2" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/our-community" className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Our Community
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Resources */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-500 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Community
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/our-community" className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center group">
                  <TreePine className="w-4 h-4 mr-2 text-green-400" />
                  Trace Your Roots
                </Link>
              </li>
              <li>
                <Link href="/acknowledgements" className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center group">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-400" />
                  Acknowledgements
                </Link>
              </li>
              <li>
                <Link href="/fashion" className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center group">
                  <Award className="w-4 h-4 mr-2 text-purple-400" />
                  Igbo Fashion
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center group">
                  <BookOpen className="w-4 h-4 mr-2 text-orange-400" />
                  Articles
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            {/* Social Media Links */}
            <div className="mb-6 lg:mb-0">
              <h4 className="text-lg font-semibold text-yellow-500 mb-4 text-center lg:text-left">
                Follow Our Journey
              </h4>
              <div className="flex space-x-6">
                <a
                  href="https://www.facebook.com/profile.php?id=61560926495882"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-500 transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook size={28} />
                </a>
                <a
                  href="https://www.tiktok.com/@ndigboviva?is_from_webapp=1&sender_device=pc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-500 transition-all duration-300 hover:scale-110"
                  aria-label="TikTok"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/ndigboviva99/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-500 transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram size={28} />
                </a>
                <a
                  href="https://youtube.com/@ndigboviva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-500 transition-all duration-300 hover:scale-110"
                  aria-label="YouTube"
                >
                  <Youtube size={28} />
                </a>
                <a
                  href="mailto:ndigbovivalimited@gmail.com"
                  className="text-gray-400 hover:text-yellow-500 transition-all duration-300 hover:scale-110"
                  aria-label="Email"
                >
                  <Mail size={28} />
                </a>
              </div>
            </div>

            {/* Copyright and Legal */}
            <div className="text-center lg:text-right">
              <div className="text-gray-400 text-sm mb-2">
                © {new Date().getFullYear()} Ndigbo Viva Limited. All rights reserved.
              </div>
              <div className="flex flex-wrap justify-center lg:justify-end gap-4 text-xs text-gray-500">
                <Link href="/privacy-policy" className="hover:text-yellow-500 transition-colors">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-yellow-500 transition-colors">
                  Terms of Service
                </Link>
                <span>•</span>
                <Link href="/disclaimer" className="hover:text-yellow-500 transition-colors">
                  Disclaimer
                </Link>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Built with ❤️ for the global Igbo community
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
