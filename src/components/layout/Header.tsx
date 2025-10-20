'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-brand-gold-50 shadow-brand-gold border-b border-brand-gold-200 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg ring-2 ring-brand-gold ring-offset-2 ring-offset-white">
                <Image
                  src="/Ndigbo Viva Logo.jpg"
                  alt="Ndigbo Viva Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-2xl font-bold text-brand-gold">
                NDIGBO VIVA
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-warm-900 hover:text-brand-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="text-warm-900 hover:text-brand-forest px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/articles"
                className="text-warm-900 hover:text-brand-bronze px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Articles
              </Link>
              <Link
                href="/news"
                className="text-warm-900 hover:text-brand-red px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                News
              </Link>
              <Link
                href="/events"
                className="text-warm-900 hover:text-brand-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Events
              </Link>
              <Link
                href="/fashion"
                className="text-warm-900 hover:text-brand-forest px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Fashion
              </Link>
              <Link
                href="/about"
                className="text-warm-900 hover:text-brand-bronze px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-warm-900 hover:text-brand-red px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/admin"
                  className="p-2 rounded-md text-warm-900 hover:text-brand-bronze transition-colors"
                  title="Admin Dashboard"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
                <Link
                  href="/profile"
                  className="p-2 rounded-md text-warm-900 hover:text-brand-forest transition-colors"
                  title="Profile"
                >
                  <User size={20} />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-md text-warm-900 hover:text-brand-red transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-black hover:bg-brand-gold text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-warm-900 hover:text-brand-gold p-2 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-brand-gold-50 border-t border-brand-gold-200">
              <Link
                href="/"
                className="text-warm-900 hover:text-brand-gold block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="text-warm-900 hover:text-brand-forest block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/articles"
                className="text-warm-900 hover:text-brand-bronze block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Articles
              </Link>
              <Link
                href="/news"
                className="text-warm-900 hover:text-brand-red block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/events"
                className="text-warm-900 hover:text-brand-gold block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/fashion"
                className="text-warm-900 hover:text-brand-forest block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Fashion
              </Link>
              <Link
                href="/about"
                className="text-warm-900 hover:text-brand-bronze block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-warm-900 hover:text-brand-red block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex items-center justify-end px-3 py-2">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/profile"
                      className="text-warm-900 hover:text-brand-forest p-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                      title="Profile"
                    >
                      <User size={20} />
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-warm-900 hover:text-brand-red p-2 transition-colors"
                      title="Sign Out"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="bg-black hover:bg-brand-gold text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
