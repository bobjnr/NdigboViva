'use client'

import { useState, useEffect } from "react";
import { RSSFeedConfig, RSS_FEEDS } from "@/lib/rss-feeds";
import { RefreshCw, Plus, Trash2, Edit, Check, X, ExternalLink } from "lucide-react";

export default function RSSFeedManagementPage() {
  const [feeds, setFeeds] = useState<RSSFeedConfig[]>(RSS_FEEDS);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFeed, setEditingFeed] = useState<string | null>(null);
  const [newFeed, setNewFeed] = useState<Partial<RSSFeedConfig>>({
    name: '',
    url: '',
    category: 'Community',
    priority: 10,
    enabled: true
  });

  const testFeed = async (feedUrl: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/news/rss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'test_feed',
          feedUrl: feedUrl
        })
      });

      const data = await response.json();
      setTestResults(prev => ({
        ...prev,
        [feedUrl]: data
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [feedUrl]: { success: false, error: 'Network error' }
      }));
    } finally {
      setLoading(false);
    }
  };

  const refreshAllFeeds = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/news/rss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'refresh'
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Successfully refreshed feeds. Found ${data.total} articles.`);
      }
    } catch (error) {
      alert('Error refreshing feeds');
    } finally {
      setLoading(false);
    }
  };

  const addFeed = () => {
    if (newFeed.name && newFeed.url) {
      const feed: RSSFeedConfig = {
        name: newFeed.name!,
        url: newFeed.url!,
        category: newFeed.category!,
        priority: newFeed.priority!,
        enabled: newFeed.enabled!
      };
      
      setFeeds(prev => [...prev, feed]);
      setNewFeed({
        name: '',
        url: '',
        category: 'Community',
        priority: 10,
        enabled: true
      });
      setShowAddForm(false);
    }
  };

  const toggleFeed = (index: number) => {
    setFeeds(prev => prev.map((feed, i) => 
      i === index ? { ...feed, enabled: !feed.enabled } : feed
    ));
  };

  const deleteFeed = (index: number) => {
    setFeeds(prev => prev.filter((_, i) => i !== index));
  };

  const updateFeed = (index: number, updatedFeed: Partial<RSSFeedConfig>) => {
    setFeeds(prev => prev.map((feed, i) => 
      i === index ? { ...feed, ...updatedFeed } : feed
    ));
    setEditingFeed(null);
  };

  return (
    <div className="min-h-screen bg-white ">
      {/* Header */}
      <section className="relative bg-gradient-to-r from-black to-gray-900 text-white py-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-brand-gold">RSS</span> <span className="text-brand-forest">FEED</span> <span className="text-brand-gold">MANAGEMENT</span>
            </h1>
            <p className="text-xl text-brand-gold font-semibold max-w-3xl mx-auto">
              Manage RSS feeds for automatic news aggregation
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-8 bg-gray-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={refreshAllFeeds}
                disabled={loading}
                className="bg-brand-gold hover:bg-brand-gold-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh All Feeds
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-brand-forest hover:bg-brand-forest-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Feed
              </button>
            </div>
            <div className="text-sm text-gray-600 ">
              {feeds.filter(f => f.enabled).length} of {feeds.length} feeds enabled
            </div>
          </div>
        </div>
      </section>

      {/* Add Feed Form */}
      {showAddForm && (
        <section className="py-8 bg-white  border-b border-gray-200 ">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-50  rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900  mb-4">Add New RSS Feed</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">
                    Feed Name
                  </label>
                  <input
                    type="text"
                    value={newFeed.name || ''}
                    onChange={(e) => setNewFeed(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  text-gray-900  focus:ring-brand-gold focus:border-brand-gold"
                    placeholder="e.g., Vanguard Nigeria"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">
                    Feed URL
                  </label>
                  <input
                    type="url"
                    value={newFeed.url || ''}
                    onChange={(e) => setNewFeed(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  text-gray-900  focus:ring-brand-gold focus:border-brand-gold"
                    placeholder="https://example.com/feed.xml"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">
                    Category
                  </label>
                  <select
                    value={newFeed.category || 'Community'}
                    onChange={(e) => setNewFeed(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  text-gray-900  focus:ring-brand-gold focus:border-brand-gold"
                  >
                    <option value="Politics">Politics</option>
                    <option value="Business">Business</option>
                    <option value="Culture">Culture</option>
                    <option value="Sports">Sports</option>
                    <option value="Technology">Technology</option>
                    <option value="International">International</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">
                    Priority
                  </label>
                  <input
                    type="number"
                    value={newFeed.priority || 10}
                    onChange={(e) => setNewFeed(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  text-gray-900  focus:ring-brand-gold focus:border-brand-gold"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newFeed.enabled || false}
                    onChange={(e) => setNewFeed(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 ">Enabled</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={addFeed}
                    className="bg-brand-gold hover:bg-brand-gold-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Add Feed
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Feeds List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6">
            {feeds.map((feed, index) => (
              <div key={index} className="bg-white  rounded-lg shadow-lg p-6 border border-gray-200 ">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 ">
                        {feed.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        feed.enabled 
                          ? 'bg-green-100 text-green-800  ' 
                          : 'bg-gray-100 text-gray-800  '
                      }`}>
                        {feed.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-gold text-white">
                        {feed.category}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-forest text-white">
                        Priority: {feed.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600  mb-3 break-all">
                      {feed.url}
                    </p>
                    {testResults[feed.url] && (
                      <div className={`text-sm p-2 rounded ${
                        testResults[feed.url].success 
                          ? 'bg-green-100 text-green-800  ' 
                          : 'bg-red-100 text-red-800  '
                      }`}>
                        {testResults[feed.url].success 
                          ? `✓ Test successful: ${testResults[feed.url].total} articles found`
                          : `✗ Test failed: ${testResults[feed.url].error}`
                        }
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => testFeed(feed.url)}
                      disabled={loading}
                      className="p-2 text-brand-gold hover:text-brand-gold-dark transition-colors"
                      title="Test Feed"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleFeed(index)}
                      className={`p-2 transition-colors ${
                        feed.enabled 
                          ? 'text-green-600 hover:text-green-700' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={feed.enabled ? 'Disable Feed' : 'Enable Feed'}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingFeed(editingFeed === feed.url ? null : feed.url)}
                      className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                      title="Edit Feed"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteFeed(index)}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      title="Delete Feed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {feeds.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400  mb-4">
                <RefreshCw className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900  mb-2">
                No RSS feeds configured
              </h3>
              <p className="text-gray-600 ">
                Add your first RSS feed to start aggregating news automatically.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
