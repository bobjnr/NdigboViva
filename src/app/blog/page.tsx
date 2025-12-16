import BlogContent from "@/components/BlogContent";
import { getBlogData } from "@/components/BlogData";
import { blogListSEO } from '@/lib/seo';

export const metadata = blogListSEO(1);

export default async function BlogPage() {
  const { blogPosts } = await getBlogData();

  return (
    <BlogContent blogPosts={blogPosts} />
  );
}
