/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://ndigboviva.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*'],
  additionalPaths: async (config) => {
    const result = [];

    // Add dynamic blog post paths from YouTube API
    try {
      const { getLatestVideos } = await import('./src/lib/youtube.ts');
      const videos = await getLatestVideos(50);
      
      videos.forEach((video) => {
        result.push({
          loc: `/blog/${video.slug}`,
          lastmod: new Date(video.publishedAt).toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
        });
      });
    } catch (error) {
      console.warn('Failed to fetch YouTube videos for sitemap:', error);
      
      // Fallback to static blog posts
      const blogPosts = [
        'power-of-igbo-culture',
        'building-economic-solidarity',
        'investing-in-our-homeland',
        'preserving-igbo-language',
        'igbo-traditional-leadership',
        'role-of-women-in-igbo-society',
      ];

      blogPosts.forEach((slug) => {
        result.push({
          loc: `/blog/${slug}`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
        });
      });
    }

    return result;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://ndigboviva.com'}/sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Custom transform for different page types
    const customConfig = {
      loc: path,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.7,
    };

    // Homepage
    if (path === '/') {
      customConfig.priority = 1.0;
      customConfig.changefreq = 'daily';
    }

    // Blog pages
    if (path.startsWith('/blog/')) {
      customConfig.priority = 0.8;
      customConfig.changefreq = 'weekly';
    }

    // Static pages
    if (['/about', '/contact', '/privacy-policy', '/terms'].includes(path)) {
      customConfig.priority = 0.6;
      customConfig.changefreq = 'monthly';
    }

    return customConfig;
  },
};
