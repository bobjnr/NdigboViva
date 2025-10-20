'use client'

import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';

interface NewsletterSignupProps {
  className?: string;
  variant?: 'default' | 'minimal';
}

export default function NewsletterSignup({ className = '', variant = 'default' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Successfully subscribed to our newsletter!');
        setEmail('');
        setFirstName('');
        setLastName('');
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setIsSuccess(false);
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-lg border border-warm-300 bg-white text-warm-900 placeholder-black focus:ring-2 focus:ring-brand-gold focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-brand-forest hover:bg-brand-forest-dark disabled:bg-warm-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center shadow-brand-forest"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Mail className="mr-2" size={20} />
                Subscribe
              </>
            )}
          </button>
        </form>
        {message && (
          <p className={`mt-2 text-sm text-center ${isSuccess ? 'text-brand-forest' : 'text-brand-red'}`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-warm-300  bg-cream  text-warm-900  placeholder-warm-500 focus:ring-2 focus:ring-brand-gold focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-warm-300  bg-cream  text-warm-900  placeholder-warm-500 focus:ring-2 focus:ring-brand-gold focus:border-transparent"
          />
        </div>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-4 py-3 rounded-lg border border-warm-300 bg-white text-warm-900 placeholder-black focus:ring-2 focus:ring-brand-gold focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-brand-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-gold-dark transition-colors inline-flex items-center justify-center disabled:bg-warm-400 disabled:text-warm-600 shadow-brand-gold"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Mail className="mr-2" size={20} />
              Subscribe
            </>
          )}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm text-center ${isSuccess ? 'text-brand-forest' : 'text-brand-red'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
