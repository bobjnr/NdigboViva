import Link from 'next/link'
import Image from 'next/image'
import { getLatestVideos } from '@/lib/youtube'
import VideoList from './VideoList'

export default async function AcknowledgementsPage() {
  // Fetch real YouTube videos
  let videoEpisodes: any[] = []
  
  try {
    videoEpisodes = await getLatestVideos(20)
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    // Fallback to empty array if YouTube API fails
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-black to-gray-900 text-white py-16">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/Ndigbo Viva Logo.jpg"
            alt="Ndigbo Viva Logo Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-brand-gold">ACKNOWLEDGEMENTS</span> <span className="text-brand-forest">& REFERENCES</span>
            </h1>
            <p className="text-xl text-brand-gold font-semibold max-w-3xl mx-auto">
              Respecting copyright, fair use, and originality.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Giving credit to all authors, creators and collaborators
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Copyright & Fair Use
            </h3>
            <p className="text-gray-700 mb-4">
              We strive to properly acknowledge all sources and respect copyright laws associated with our content. If any author feels they have not been adequately acknowledged or if you believe your copyright has not been fairly used, please contact us.
            </p>
            <div className="bg-brand-gold-50 border border-brand-gold-200 rounded-lg p-4">
              <p className="text-gray-700 font-medium">
                Contact us at:
                <a 
                  href="mailto:ndigbovivalimited@gmail.com" 
                  className="text-brand-gold hover:text-brand-gold-dark ml-2 font-semibold"
                >
                  ndigbovivalimited@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Link Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Statement of Ethics & Disclaimer
            </h3>
            <p className="text-gray-700 mb-6">
              Read our full statement on ethics, transparency, and public trust.
            </p>
            <Link
              href="/disclaimer"
              className="inline-flex items-center px-6 py-3 bg-brand-gold text-white font-semibold rounded-md hover:bg-brand-gold-dark transition-colors"
            >
              View Full Disclaimer →
            </Link>
          </div>
        </div>
      </section>

      {/* Video Episodes - Searchable List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Video Episodes</h2>
          <VideoList episodes={videoEpisodes} />
        </div>
      </section>
      {/* End */}
    </div>
  )
}
