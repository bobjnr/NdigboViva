import Link from "next/link";
import { Calendar, Clock, Eye, Youtube } from "lucide-react";
import { getLatestVideos, getVideoById } from "@/lib/youtube";
import { generateFullSummary } from "@/lib/video-summaries";
import { blogPostSchema } from "@/lib/seo";
import { Metadata } from 'next';
import ShareButtons from "@/components/ShareButtons";
import VideoHover from "@/components/VideoHover";

// Fallback data in case YouTube API fails
const fallbackPost = {
  id: "power-of-igbo-culture",
  title: "The Power of Igbo Culture in Modern Times",
  excerpt: "Exploring how traditional Igbo values can guide us in contemporary society and help build stronger communities.",
  content: `
    <p>In today's rapidly changing world, the wisdom embedded in Igbo culture continues to provide valuable guidance for building strong, resilient communities. Our traditional values of hard work, mutual support, and collective responsibility are more relevant than ever.</p>
    
    <p>The concept of "Igwebuike" (strength in numbers) teaches us that we are stronger together. This principle has guided Igbo communities for generations and remains a powerful tool for addressing modern challenges.</p>
    
    <h2>Key Cultural Values</h2>
    <p>Several core Igbo values continue to shape our approach to modern life:</p>
    <ul>
      <li><strong>Onye aghana nwanne ya</strong> - Never abandon your brother/sister</li>
      <li><strong>Eziokwu bu ndu</strong> - Truth is life</li>
      <li><strong>Ike kwulu, ike akwudebe ya</strong> - When a man says yes, his chi (personal god) says yes</li>
    </ul>
    
    <p>These values encourage us to support one another, maintain integrity, and take responsibility for our actions and their impact on our community.</p>
    
    <h2>Building Modern Communities</h2>
    <p>In the diaspora, these traditional values have helped Igbo communities establish themselves and thrive. From mutual aid societies to business networks, the spirit of collective support continues to drive success.</p>
    
    <p>As we look to the future, it's essential that we preserve these cultural foundations while adapting to new circumstances. Our children need to understand where they come from to know where they're going.</p>
  `,
  thumbnail: "https://img.youtube.com/vi/sample1/maxresdefault.jpg",
  videoId: "sample1",
  publishedAt: "2024-01-10T10:00:00Z",
  duration: "12:45",
  views: "1.2K",
  category: "Culture",
  author: "Ndigbo Viva Team",
  tags: ["Culture", "Community", "Values", "Tradition", "Modern Life"]
};

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Try to find video by slug from YouTube API
  const videos = await getLatestVideos(50);
  const video = videos.find(v => v.slug === slug);
  const videoById = video || await getVideoById(slug);
  
  if (videoById) {
    return {
      title: `${videoById.title} | Ndigbo Viva`,
      description: videoById.description.substring(0, 160),
      openGraph: {
        type: 'article',
        locale: 'en_US',
        url: `https://ndigboviva.com/blog/${slug}`,
        siteName: 'Ndigbo Viva',
        title: videoById.title,
        description: videoById.description.substring(0, 160),
        images: [{
          url: videoById.thumbnail,
          width: 1280,
          height: 720,
          alt: videoById.title,
        }],
      },
      // TikTok doesn't have card metadata like Twitter, so we'll keep this for other platforms
      twitter: {
        card: 'summary_large_image',
        site: '@ndigboviva',
        creator: '@ndigboviva',
      },
    };
  }
  
  // Fallback metadata
  return {
    title: 'The Power of Igbo Culture in Modern Times | Ndigbo Viva',
    description: 'Exploring how traditional Igbo values can guide us in contemporary society and help build stronger communities.',
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  // Try to find video by slug from YouTube API
  const videos = await getLatestVideos(50); // Get more videos to find the right one
  const video = videos.find(v => v.slug === slug);
  
  // If not found, try to get by video ID (in case slug is actually a video ID)
  const videoById = video || await getVideoById(slug);
  
  const blogPost = videoById ? {
    id: videoById.id,
    title: videoById.title,
    excerpt: generateFullSummary(videoById.title, videoById.description, videoById.category, videoById.duration),
    content: `<p>${videoById.description.replace(/\n/g, '</p><p>')}</p>`,
    thumbnail: videoById.thumbnail,
    videoId: videoById.videoId,
    publishedAt: videoById.publishedAt,
    duration: videoById.duration,
    views: videoById.viewCount,
    category: videoById.category || "General",
    author: "Ndigbo Viva Team",
    tags: [videoById.category || "General", "YouTube", "Igbo Culture"]
  } : fallbackPost;


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostSchema({
            title: blogPost.title,
            description: blogPost.excerpt,
            slug: blogPost.id,
            publishedAt: blogPost.publishedAt,
            thumbnail: blogPost.thumbnail,
            videoId: blogPost.videoId,
            author: blogPost.author,
            category: blogPost.category
          }))
        }}
      />
      <div className="min-h-screen bg-white ">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4">
              <span className="bg-white text-yellow-600 px-4 py-2 rounded-full text-sm font-medium">
                {blogPost.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {blogPost.title}
            </h1>
            <p className="text-xl text-yellow-100 mb-6">
              {blogPost.excerpt}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                {new Date(blogPost.publishedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                {blogPost.duration}
              </div>
              <div className="flex items-center">
                <Eye size={16} className="mr-2" />
                {blogPost.views} views
              </div>
              <div className="flex items-center">
                <span>By {blogPost.author}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-gray-50 ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white  rounded-lg shadow-lg overflow-hidden">
            <VideoHover
              videoId={blogPost.videoId}
              thumbnail={blogPost.thumbnail}
              title={blogPost.title}
              showControls={true}
              enableAudio={true}
              autoPlay={false}
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 ">
                  {blogPost.title}
                </h3>
                <a
                  href={`https://www.youtube.com/watch?v=${blogPost.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center text-sm"
                >
                  <Youtube className="mr-2" size={16} />
                  Watch on YouTube
                </a>
              </div>
              <p className="text-gray-600  mb-4">
                Click play to watch the video here, or visit YouTube for the full experience with comments and related videos.
              </p>
              <div className="pt-4 border-t border-gray-200 ">
                <a
                  href="https://www.youtube.com/@NDIGBOVIVA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-600 hover:text-yellow-700 font-semibold inline-flex items-center"
                >
                  <Youtube className="mr-2" size={18} />
                  Subscribe to Our Channel
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="prose prose-lg max-w-none ">
                <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
              </article>

              {/* Tags */}
              <div className="mt-8 pt-8 border-t border-gray-200 ">
                <h3 className="text-lg font-semibold text-gray-900  mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blogPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100  text-gray-700  px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Share Buttons */}
                <ShareButtons
                  url={`https://ndigboviva.com/blog/${blogPost.id}`}
                />

                {/* Related Posts */}
                <div className="bg-gray-50  rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900  mb-4">
                    Related Posts
                  </h3>
                  <div className="space-y-4">
                    <Link
                      href="/blog/building-economic-solidarity"
                      className="block hover:text-yellow-600 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 ">
                        Building Economic Solidarity
                      </h4>
                      <p className="text-sm text-gray-600 ">
                        How Igbo communities create opportunities...
                      </p>
                    </Link>
                    <Link
                      href="/blog/investing-in-our-homeland"
                      className="block hover:text-yellow-600 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 ">
                        Investing in Our Homeland
                      </h4>
                      <p className="text-sm text-gray-600 ">
                        Success stories from the diaspora...
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 bg-gray-50 ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between">
            <Link
              href="/blog"
              className="text-yellow-600 hover:text-yellow-700 font-semibold"
            >
              ← Back to Blog
            </Link>
            <Link
              href="/blog"
              className="text-yellow-600 hover:text-yellow-700 font-semibold"
            >
              Next Post →
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
