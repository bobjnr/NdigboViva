import BlogContent from "@/components/BlogContent";
import { getBlogData } from "@/components/BlogData";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Ndigbo Viva',
  description: 'Discover insights, stories, and discussions about Igbo culture, community building, and investing in our future together.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ndigboviva.com/blog',
    siteName: 'Ndigbo Viva',
    title: 'Blog | Ndigbo Viva',
    description: 'Discover insights, stories, and discussions about Igbo culture, community building, and investing in our future together.',
  },
};

export default async function BlogPage() {
  const { blogPosts } = await getBlogData();

  return (
    <BlogContent blogPosts={blogPosts} />
  );
}
