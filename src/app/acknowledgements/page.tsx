import Link from 'next/link'
import Image from 'next/image'
import { getLatestVideos } from '@/lib/youtube'

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
              Credits and image sources for all our video content
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Giving Credit Where It's Due
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We believe in transparency and giving proper credit to all sources, images, 
              and references used in our video content. Each episode below contains a 
              comprehensive list of acknowledgements and references.
            </p>
          </div>
        </div>
      </section>

      {/* Video Episodes Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Video Episodes
            </h2>
            <p className="text-lg text-gray-600">
              Click on any episode to view its complete acknowledgements and references
            </p>
          </div>

          {videoEpisodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoEpisodes.map((episode) => (
                <Link
                  key={episode.videoId}
                  href={`/acknowledgements/${episode.slug}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={episode.thumbnail}
                      alt={episode.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {episode.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-gold transition-colors">
                      {episode.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {episode.description ? episode.description.substring(0, 150) + '...' : 'No description available'}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {new Date(episode.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="text-brand-gold font-semibold">
                        View Credits →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No videos found
              </h3>
              <p className="text-gray-600">
                Unable to load videos from YouTube. Please check your API configuration.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* General Acknowledgements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            General Acknowledgements
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Music & Audio
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Traditional Igbo music samples from various cultural archives</li>
                  <li>• Background music licensed from Epidemic Sound</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Images & Graphics
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Cultural images from Wikimedia Commons (Creative Commons)</li>
                  <li>• Custom graphics created by our design team</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Research & References
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Academic papers and research studies</li>
                  <li>• Historical documents and archives</li>
                  <li>• Interviews with community elders and experts</li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Copyright & Fair Use
                </h3>
                <p className="text-gray-600 mb-4">
                  We strive to properly acknowledge all sources and respect copyright laws. 
                  If any author feels they have not been adequately acknowledged or if you 
                  believe your copyright has not been fairly used, please contact us.
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
          </div>
        </div>
      </section>
    </div>
  )
}
