'use client'

import { useState, useEffect } from 'react';
import { NewsItem } from '@/lib/rss-feeds';

interface UseRSSNewsOptions {
  category?: string;
  limit?: number;
  refresh?: boolean;
}

interface UseRSSNewsReturn {
  newsItems: NewsItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  total: number;
}

export function useRSSNews(options: UseRSSNewsOptions = {}): UseRSSNewsReturn {
  const { category = 'All', limit = 20, refresh = false } = options;
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        category,
        limit: limit.toString(),
        refresh: refresh.toString()
      });

      const response = await fetch(`/api/news/rss?${params}`);
      const data = await response.json();

      if (data.success) {
        setNewsItems(data.data);
        setTotal(data.total);
      } else {
        setError(data.error || 'Failed to fetch news');
      }
    } catch (_err) {
      setError('Network error occurred while fetching news');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchNews();
  };

  useEffect(() => {
    fetchNews();
  }, [fetchNews]); // Add fetchNews to dependency array

  return {
    newsItems,
    loading,
    error,
    refetch,
    total
  };
}
