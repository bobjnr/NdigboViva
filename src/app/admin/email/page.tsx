'use client'

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Mail, Send, Loader2, Users, CheckCircle, XCircle } from 'lucide-react';

export default function AdminEmailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    slug: '',
    thumbnail: '',
    videoId: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/email/blog-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(`Blog post notification sent successfully! Campaign ID: ${data.campaignId}`);
        setFormData({
          title: '',
          excerpt: '',
          slug: '',
          thumbnail: '',
          videoId: '',
        });
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'Failed to send notification');
      }
    } catch {
      setIsSuccess(false);
      setMessage('Failed to send notification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubscriberCount = async () => {
    try {
      const response = await fetch('/api/email/subscribers');
      const data = await response.json();
      if (data.success) {
        setSubscriberCount(data.total);
      }
    } catch (error) {
      console.error('Failed to get subscriber count:', error);
    }
  };

  useEffect(() => {
    getSubscriberCount();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Mail className="w-8 h-8 mr-3 text-yellow-500" />
                Email Notifications
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Send blog post notifications to your subscribers
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <Users className="w-5 h-5 mr-2" />
                <span className="font-semibold">{subscriberCount} subscribers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blog Post Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter the blog post title"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter a brief excerpt of the blog post"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="blog-post-slug"
                />
              </div>

              <div>
                <label htmlFor="videoId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  YouTube Video ID (optional)
                </label>
                <input
                  type="text"
                  id="videoId"
                  name="videoId"
                  value={formData.videoId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="dQw4w9WgXcQ"
                />
              </div>
            </div>

            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thumbnail URL (optional)
              </label>
              <input
                type="url"
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg flex items-center ${
                isSuccess 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
              }`}>
                {isSuccess ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 mr-2" />
                )}
                {message}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                {isSubmitting ? 'Sending...' : 'Send Notification'}
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
            How to use this feature:
          </h3>
          <ul className="text-blue-700 dark:text-blue-300 space-y-2">
            <li>• Fill in the required fields (title, excerpt, slug)</li>
            <li>• Add a YouTube video ID if the post has an associated video</li>
            <li>• Include a thumbnail URL for better email presentation</li>
            <li>• Click &quot;Send Notification&quot; to email all subscribers</li>
            <li>• The email will be sent to all active subscribers in your Mailchimp list</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
