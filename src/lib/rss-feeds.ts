import Parser from 'rss-parser';
import { format, parseISO } from 'date-fns';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  image: string;
  breaking: boolean;
  trending: boolean;
  views: number;
  likes: number;
  source: string;
  link: string;
}

export interface RSSFeedConfig {
  name: string;
  url: string;
  category: string;
  priority: number;
  enabled: boolean;
}

// RSS Feed configurations for Igbo news sources
export const RSS_FEEDS: RSSFeedConfig[] = [
  {
    name: "BBC News - Nigeria",
    url: "https://feeds.bbci.co.uk/news/world/africa/rss.xml",
    category: "International",
    priority: 1,
    enabled: true
  },
  {
    name: "AllAfrica - Nigeria",
    url: "https://allafrica.com/tools/headlines/rdf/nigeria/headlines.rdf",
    category: "Politics",
    priority: 2,
    enabled: true
  },
  {
    name: "Premium Times Nigeria",
    url: "https://www.premiumtimesng.com/feed/",
    category: "Politics",
    priority: 3,
    enabled: true
  },
  {
    name: "Vanguard Nigeria",
    url: "https://www.vanguardngr.com/feed/",
    category: "Politics",
    priority: 4,
    enabled: true
  },
  {
    name: "Punch Nigeria",
    url: "https://punchng.com/feed/",
    category: "Politics",
    priority: 5,
    enabled: true
  },
  {
    name: "The Guardian Nigeria",
    url: "https://guardian.ng/feed/",
    category: "Culture",
    priority: 6,
    enabled: true
  },
  {
    name: "ThisDay Nigeria",
    url: "https://www.thisdaylive.com/index.php/feed/",
    category: "Business",
    priority: 7,
    enabled: true
  },
  {
    name: "Daily Trust Nigeria",
    url: "https://dailytrust.com/feed/",
    category: "Community",
    priority: 8,
    enabled: true
  }
];

// Keywords to filter Igbo-related content
const IGBO_KEYWORDS = [
  'igbo', 'ndigbo', 'umuigbo', 'igbo culture', 'igbo people', 'igbo community',
  'south east', 'southeast', 'enugu', 'anambra', 'abia', 'ebonyi', 'imo',
  'ohanaeze', 'igbo language', 'igbo tradition', 'igbo history', 'igbo diaspora',
  'biafra', 'biafran', 'eastern nigeria', 'eastern region', 'igbo land',
  'igbo state', 'igbo nation', 'igbo identity', 'igbo heritage', 'igbo values',
  // Additional broader terms
  'nigerian', 'nigeria', 'african', 'africa', 'diaspora', 'community',
  'cultural', 'tradition', 'heritage', 'language', 'business', 'entrepreneur',
  'investment', 'development', 'education', 'technology', 'innovation'
];

export class RSSFeedService {
  private parser: Parser;

  constructor() {
    this.parser = new Parser({
      timeout: 10000,
      headers: {
        'User-Agent': 'Ndigbo Viva News Aggregator 1.0'
      }
    });
  }

  // Check if content is Igbo-related or Nigerian-related
  private isIgboRelated(content: string): boolean {
    const lowerContent = content.toLowerCase();
    
    // First check for specific Igbo keywords (highest priority)
    const specificIgboKeywords = [
      'igbo', 'ndigbo', 'umuigbo', 'igbo culture', 'igbo people', 'igbo community',
      'south east', 'southeast', 'enugu', 'anambra', 'abia', 'ebonyi', 'imo',
      'ohanaeze', 'igbo language', 'igbo tradition', 'igbo history', 'igbo diaspora',
      'biafra', 'biafran', 'eastern nigeria', 'eastern region', 'igbo land'
    ];
    
    const hasSpecificIgboKeywords = specificIgboKeywords.some(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    );
    
    if (hasSpecificIgboKeywords) return true;
    
    // Check for Nigerian content with relevant topics
    const nigerianKeywords = ['nigerian', 'nigeria'];
    const hasNigerianKeywords = nigerianKeywords.some(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    );
    
    if (hasNigerianKeywords) {
      const relevantTopics = [
        'culture', 'business', 'community', 'development', 'education', 'technology', 
        'innovation', 'entrepreneur', 'investment', 'economy', 'society', 'politics', 
        'government', 'health', 'sports', 'entertainment', 'diaspora', 'heritage',
        'tradition', 'language', 'arts', 'music', 'festival', 'celebration'
      ];
      return relevantTopics.some(topic => lowerContent.includes(topic.toLowerCase()));
    }
    
    // Check for African content with relevant topics
    const africanKeywords = ['african', 'africa'];
    const hasAfricanKeywords = africanKeywords.some(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    );
    
    if (hasAfricanKeywords) {
      const relevantTopics = [
        'culture', 'business', 'community', 'development', 'education', 'technology', 
        'innovation', 'entrepreneur', 'investment', 'diaspora', 'heritage', 'tradition'
      ];
      return relevantTopics.some(topic => lowerContent.includes(topic.toLowerCase()));
    }
    
    // Include some general content that might be relevant to the Igbo community
    const generalRelevantTopics = [
      'diaspora', 'immigration', 'cultural', 'heritage', 'tradition', 'language',
      'community', 'business', 'entrepreneur', 'investment', 'development'
    ];
    
    return generalRelevantTopics.some(topic => lowerContent.includes(topic.toLowerCase()));
  }

  // Extract image from content or use default
  private extractImage(item: any): string {
    // Try to extract image from content
    const content = item.content || item.description || item.summary || '';
    const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i);
    if (imgMatch) {
      return imgMatch[1];
    }

    // Try to get image from media:content or enclosure
    if (item['media:content'] && item['media:content']['$'] && item['media:content']['$'].url) {
      return item['media:content']['$'].url;
    }

    if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image/')) {
      return item.enclosure.url;
    }

    // Return default Igbo cultural image
    return '/Ndigbo Viva Logo.jpg';
  }

  // Generate excerpt from content
  private generateExcerpt(content: string, maxLength: number = 150): string {
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    if (cleanContent.length <= maxLength) {
      return cleanContent;
    }
    return cleanContent.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  }

  // Calculate read time based on content length
  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }

  // Categorize content based on keywords
  private categorizeContent(title: string, content: string): string {
    const text = `${title} ${content}`.toLowerCase();
    
    if (text.includes('business') || text.includes('economy') || text.includes('investment') || text.includes('trade')) {
      return 'Business';
    }
    if (text.includes('culture') || text.includes('tradition') || text.includes('heritage') || text.includes('festival')) {
      return 'Culture';
    }
    if (text.includes('sport') || text.includes('football') || text.includes('athletics') || text.includes('competition')) {
      return 'Sports';
    }
    if (text.includes('technology') || text.includes('innovation') || text.includes('digital') || text.includes('tech')) {
      return 'Technology';
    }
    if (text.includes('education') || text.includes('school') || text.includes('university') || text.includes('learning')) {
      return 'Education';
    }
    if (text.includes('health') || text.includes('medical') || text.includes('hospital') || text.includes('healthcare')) {
      return 'Health';
    }
    if (text.includes('international') || text.includes('diaspora') || text.includes('global') || text.includes('worldwide')) {
      return 'International';
    }
    
    return 'Community';
  }

  // Safely parse date
  private safeParseDate(dateString: string | undefined): string {
    if (!dateString) {
      return new Date().toISOString();
    }

    try {
      const parsed = parseISO(dateString);
      if (isNaN(parsed.getTime())) {
        // Try alternative date parsing
        const altParsed = new Date(dateString);
        if (isNaN(altParsed.getTime())) {
          return new Date().toISOString();
        }
        return altParsed.toISOString();
      }
      return parsed.toISOString();
    } catch (error) {
      console.warn(`Failed to parse date: ${dateString}`, error);
      return new Date().toISOString();
    }
  }

  // Fetch and parse RSS feed
  async fetchFeed(feedConfig: RSSFeedConfig): Promise<NewsItem[]> {
    try {
      const feed = await this.parser.parseURL(feedConfig.url);
      const newsItems: NewsItem[] = [];

      for (const item of feed.items.slice(0, 10)) { // Limit to 10 items per feed
        const content = item.contentSnippet || item.content || item.description || '';
        const title = item.title || '';
        
        // Only include Igbo-related content
        if (this.isIgboRelated(`${title} ${content}`)) {
          const newsItem: NewsItem = {
            id: `rss_${feedConfig.name.replace(/\s+/g, '_')}_${item.guid || item.link || Math.random().toString(36).substr(2, 9)}`,
            title: title,
            excerpt: this.generateExcerpt(content),
            content: content,
            author: item.creator || item.author || feedConfig.name,
            publishedAt: this.safeParseDate(item.pubDate),
            readTime: this.calculateReadTime(content),
            category: this.categorizeContent(title, content),
            image: this.extractImage(item),
            breaking: false, // Could be enhanced with keyword detection
            trending: false, // Could be enhanced with engagement metrics
            views: Math.floor(Math.random() * 5000) + 100, // Random for demo
            likes: Math.floor(Math.random() * 500) + 10, // Random for demo
            source: feedConfig.name,
            link: item.link || '#'
          };

          newsItems.push(newsItem);
        }
      }

      return newsItems;
    } catch (error) {
      console.error(`Error fetching feed ${feedConfig.name}:`, error);
      return [];
    }
  }

  // Fetch all enabled feeds
  async fetchAllFeeds(): Promise<NewsItem[]> {
    const enabledFeeds = RSS_FEEDS.filter(feed => feed.enabled);
    const allNewsItems: NewsItem[] = [];

    // Fetch feeds sequentially to avoid overwhelming servers
    for (const feed of enabledFeeds) {
      try {
        const items = await this.fetchFeed(feed);
        allNewsItems.push(...items);
        
        // Add delay between feeds to be respectful to servers
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error fetching feed ${feed.name}:`, error);
        // Continue with other feeds even if one fails
      }
    }

    // Sort by publication date (newest first)
    return allNewsItems.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  // Get cached news items (you could implement Redis or file-based caching here)
  async getCachedNews(): Promise<NewsItem[]> {
    // For now, just fetch fresh data
    // In production, you'd want to implement proper caching
    return this.fetchAllFeeds();
  }
}

// Singleton instance
export const rssFeedService = new RSSFeedService();
