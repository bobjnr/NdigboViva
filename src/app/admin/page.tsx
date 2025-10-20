import Link from 'next/link'
import { FileText, Mail, Rss, Users, Settings } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your Ndigbo Viva blog content and settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Video Credits Management */}
          <Link
            href="/admin/credits"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-brand-gold rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">Video Credits</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Manage credits and references for your YouTube videos
            </p>
            <div className="text-brand-gold group-hover:text-brand-gold-dark font-medium">
              Manage Credits →
            </div>
          </Link>

          {/* Email Management */}
          <Link
            href="/admin/email"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-brand-forest rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">Email System</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Test and manage email functionality
            </p>
            <div className="text-brand-forest group-hover:text-brand-forest-dark font-medium">
              Manage Emails →
            </div>
          </Link>

          {/* RSS Feeds Management */}
          <Link
            href="/admin/rss-feeds"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-brand-red rounded-lg">
                <Rss className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">RSS Feeds</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Manage news RSS feeds and sources
            </p>
            <div className="text-brand-red group-hover:text-brand-red-dark font-medium">
              Manage Feeds →
            </div>
          </Link>

          {/* Subscribers Management */}
          <Link
            href="/admin/subscribers"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-brand-bronze rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">Subscribers</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View and manage newsletter subscribers
            </p>
            <div className="text-brand-bronze group-hover:text-brand-bronze-dark font-medium">
              Manage Subscribers →
            </div>
          </Link>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gray-600 rounded-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Link
                href="/acknowledgements"
                className="block text-gray-600 hover:text-brand-gold transition-colors"
              >
                View Public Acknowledgements →
              </Link>
              <Link
                href="/blog"
                className="block text-gray-600 hover:text-brand-gold transition-colors"
              >
                View Blog →
              </Link>
              <Link
                href="/"
                className="block text-gray-600 hover:text-brand-gold transition-colors"
              >
                View Homepage →
              </Link>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use Video Credits Management</h3>
          <div className="text-blue-800 space-y-2">
            <p>1. <strong>Access:</strong> Click on "Video Credits" above or go directly to <code className="bg-blue-100 px-2 py-1 rounded">/admin/credits</code></p>
            <p>2. <strong>Select Video:</strong> Choose any video from your YouTube channel</p>
            <p>3. <strong>Add Credits:</strong> Fill in the details for each category (Images, Music, Research, Interviews)</p>
            <p>4. <strong>Save:</strong> Click "Save Credits" to store the information</p>
            <p>5. <strong>View:</strong> Check the public acknowledgements page to see how it looks</p>
          </div>
        </div>
      </div>
    </div>
  )
}
