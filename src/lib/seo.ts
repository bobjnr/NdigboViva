import { Metadata } from 'next';

export const defaultSEO: Metadata = {
  title: 'Ndigbo Viva - Know Your Roots, Build Solidarity, Invest at Home',
  description: 'Join our community as we celebrate Igbo culture and build a stronger future together. Umuigbo Kunienu!',
  alternates: {
    canonical: 'https://ndigboviva.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ndigboviva.com',
    siteName: 'Ndigbo Viva',
    title: 'Ndigbo Viva - Know Your Roots, Build Solidarity, Invest at Home',
    description: 'Join our community as we celebrate Igbo culture and build a stronger future together. Umuigbo Kunienu!',
    images: [
      {
        url: 'https://ndigboviva.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ndigbo Viva - Know Your Roots, Build Solidarity, Invest at Home',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ndigboviva',
    creator: '@ndigboviva',
  },
  keywords: ['Igbo', 'culture', 'community', 'Nigeria', 'diaspora', 'investment', 'solidarity', 'Ndigbo Viva', 'Umuigbo Kunienu'],
  authors: [{ name: 'Ndigbo Viva' }],
};

export const blogPostSEO = (post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  thumbnail: string;
  videoId: string;
}): Metadata => ({
  title: `${post.title} | Ndigbo Viva`,
  description: post.description,
  alternates: {
    canonical: `https://ndigboviva.com/blog/${post.slug}`,
  },
  openGraph: {
    type: 'article',
    locale: 'en_US',
    url: `https://ndigboviva.com/blog/${post.slug}`,
    siteName: 'Ndigbo Viva',
    title: post.title,
    description: post.description,
    images: [
      {
        url: post.thumbnail,
        width: 1280,
        height: 720,
        alt: post.title,
      },
    ],
    publishedTime: post.publishedAt,
    authors: ['Ndigbo Viva'],
    tags: ['Igbo', 'Culture', 'Community', 'YouTube'],
  },
  // TikTok doesn't have card metadata like Twitter, so we'll keep this for other platforms
  twitter: {
    card: 'summary_large_image',
    site: '@ndigboviva',
    creator: '@ndigboviva',
  },
  keywords: [`Igbo`, `culture`, `community`, post.title, `Ndigbo Viva`, `YouTube`],
});

export const blogListSEO = (page: number = 1): Metadata => ({
  title: `Blog | Ndigbo Viva - Page ${page}`,
  description: 'Discover insights, stories, and discussions about Igbo culture, community building, and investing in our future together.',
  alternates: {
    canonical: `https://ndigboviva.com/blog${page > 1 ? `?page=${page}` : ''}`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `https://ndigboviva.com/blog${page > 1 ? `?page=${page}` : ''}`,
    siteName: 'Ndigbo Viva',
    title: `Blog | Ndigbo Viva - Page ${page}`,
    description: 'Discover insights, stories, and discussions about Igbo culture, community building, and investing in our future together.',
  },
});

export const aboutSEO: Metadata = {
  title: 'About Us | Ndigbo Viva',
  description: 'Learn about Ndigbo Viva\'s mission to celebrate Igbo culture, build community solidarity, and foster economic development.',
  alternates: {
    canonical: 'https://ndigboviva.com/about',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ndigboviva.com/about',
    siteName: 'Ndigbo Viva',
    title: 'About Us | Ndigbo Viva',
    description: 'Learn about Ndigbo Viva\'s mission to celebrate Igbo culture, build community solidarity, and foster economic development.',
  },
};

export const contactSEO: Metadata = {
  title: 'Contact Us | Ndigbo Viva',
  description: 'Get in touch with Ndigbo Viva. We\'d love to hear from you and answer any questions you might have.',
  alternates: {
    canonical: 'https://ndigboviva.com/contact',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ndigboviva.com/contact',
    siteName: 'Ndigbo Viva',
    title: 'Contact Us | Ndigbo Viva',
    description: 'Get in touch with Ndigbo Viva. We\'d love to hear from you and answer any questions you might have.',
  },
};

// JSON-LD Schema for blog posts
export const blogPostSchema = (post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  thumbnail: string;
  videoId: string;
  author: string;
  category: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.description,
  image: post.thumbnail,
  datePublished: post.publishedAt,
  dateModified: post.publishedAt,
  author: {
    '@type': 'Organization',
    name: post.author,
    url: 'https://ndigboviva.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Ndigbo Viva',
    url: 'https://ndigboviva.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://ndigboviva.com/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://ndigboviva.com/blog/${post.slug}`,
  },
  video: {
    '@type': 'VideoObject',
    name: post.title,
    description: post.description,
    thumbnailUrl: post.thumbnail,
    uploadDate: post.publishedAt,
    contentUrl: `https://www.youtube.com/watch?v=${post.videoId}`,
    embedUrl: `https://www.youtube.com/embed/${post.videoId}`,
  },
  articleSection: post.category,
  keywords: ['Igbo', 'Culture', 'Community', post.category],
});

// JSON-LD Schema for organization
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ndigbo Viva',
  url: 'https://ndigboviva.com',
  logo: 'https://ndigboviva.com/logo.png',
  description: 'Know Your Roots, Build Solidarity, Invest at Home. Join our community as we celebrate Igbo culture and build a stronger future together.',
  foundingDate: '2024',
  sameAs: [
    'https://www.youtube.com/@NDIGBOVIVA',
    'https://facebook.com/ndigboviva',
    'https://www.tiktok.com/@ndigboviva?is_from_webapp=1&sender_device=pc',
    'https://instagram.com/ndigboviva',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'customer service',
    email: 'ndigboviva@outlook.com',
  },
};

// JSON-LD Schema for breadcrumbs
export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// JSON-LD Schema for website with search action
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Ndigbo Viva',
  url: 'https://ndigboviva.com',
  description: 'Know Your Roots, Build Solidarity, Invest at Home. Join our community as we celebrate Igbo culture and build a stronger future together.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://ndigboviva.com/blog?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

// JSON-LD Schema for FAQ
export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

