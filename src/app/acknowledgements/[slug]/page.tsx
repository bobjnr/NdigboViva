import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, Calendar, Clock } from 'lucide-react'
import { getLatestVideos } from '@/lib/youtube'

// Load credits from localStorage (in production, this would be from a database)
function getVideoCredits() {
  if (typeof window !== 'undefined') {
    const savedCredits = localStorage.getItem('video-credits')
    return savedCredits ? JSON.parse(savedCredits) : {}
  }
  return {}
}

// Sample video data - you can replace this with actual data from your CMS or API
const videoData: { [key: string]: any } = {
  'understanding-igbo-culture-traditions': {
    id: 'episode-1',
    title: 'Understanding Igbo Culture and Traditions',
    slug: 'understanding-igbo-culture-traditions',
    thumbnail: '/Ndigbo Viva Logo.jpg',
    duration: '15:30',
    publishedAt: '2024-01-15',
    description: 'A deep dive into the rich cultural heritage of the Igbo people',
    videoUrl: 'https://youtube.com/watch?v=example1',
    credits: {
      images: [
        {
          source: 'Traditional Igbo wedding ceremony',
          photographer: 'Dr. Ngozi Okonkwo',
          license: 'Used with permission',
          timestamp: '2:15'
        },
        {
          source: 'Igbo masquerade performance',
          photographer: 'Cultural Heritage Foundation',
          license: 'Creative Commons BY-SA 4.0',
          timestamp: '5:30'
        },
        {
          source: 'Historical Igbo architecture',
          photographer: 'National Museum of Nigeria',
          license: 'Public Domain',
          timestamp: '8:45'
        }
      ],
      music: [
        {
          title: 'Traditional Igbo Flute Music',
          artist: 'Onyeka Onwenu',
          license: 'Used with permission',
          timestamp: '0:00-3:20'
        },
        {
          title: 'Background Ambience',
          source: 'Epidemic Sound',
          license: 'Commercial License',
          timestamp: '3:20-15:30'
        }
      ],
      research: [
        {
          title: 'Igbo Culture and Society: A Historical Perspective',
          author: 'Prof. Chinua Achebe',
          publication: 'African Cultural Studies Journal',
          year: '2019'
        },
        {
          title: 'Traditional Igbo Governance Systems',
          author: 'Dr. Ifeoma Nwankwo',
          publication: 'Nigerian Historical Review',
          year: '2020'
        }
      ],
      interviews: [
        {
          name: 'Chief Nnamdi Okoro',
          title: 'Traditional Ruler',
          location: 'Enugu State',
          topics: 'Traditional governance and cultural practices'
        },
        {
          name: 'Dr. Adaora Uche',
          title: 'Cultural Anthropologist',
          location: 'University of Nigeria, Nsukka',
          topics: 'Modern interpretations of Igbo traditions'
        }
      ]
    }
  },
  'economic-development-igbo-land': {
    id: 'episode-2',
    title: 'Economic Development in Igbo Land',
    slug: 'economic-development-igbo-land',
    thumbnail: '/Ndigbo Viva Logo.jpg',
    duration: '22:45',
    publishedAt: '2024-01-22',
    description: 'Exploring investment opportunities and economic growth in Igbo communities',
    videoUrl: 'https://youtube.com/watch?v=example2',
    credits: {
      images: [
        {
          source: 'Onitsha Market aerial view',
          photographer: 'Lagos Business School',
          license: 'Used with permission',
          timestamp: '1:30'
        },
        {
          source: 'Igbo entrepreneurs at work',
          photographer: 'Tony Okafor',
          license: 'Creative Commons BY 2.0',
          timestamp: '7:15'
        }
      ],
      music: [
        {
          title: 'Modern Igbo Business Theme',
          artist: 'Phyno',
          license: 'Used with permission',
          timestamp: '0:00-2:00'
        }
      ],
      research: [
        {
          title: 'Igbo Entrepreneurship: Past and Present',
          author: 'Prof. Peter Eze',
          publication: 'African Business Review',
          year: '2021'
        }
      ],
      interviews: [
        {
          name: 'Mr. Emeka Okafor',
          title: 'CEO, Igbo Investment Group',
          location: 'Lagos',
          topics: 'Investment opportunities in Igbo land'
        }
      ]
    }
  }
}

interface PageProps {
  params: {
    slug: string
  }
}

export default async function VideoCreditsPage({ params }: PageProps) {
  // Try to find video in YouTube data first
  let video = null
  let credits = null
  
  try {
    const videos = await getLatestVideos(50) // Get more videos to find the right one
    video = videos.find(v => v.slug === params.slug)
    
    if (video) {
      // Load credits from admin system
      const allCredits = getVideoCredits()
      credits = allCredits[video.videoId]
    }
  } catch (error) {
    console.error('Error fetching video data:', error)
  }

  // Fallback to sample data if not found in YouTube
  if (!video) {
    video = videoData[params.slug]
    if (video) {
      credits = video.credits
    }
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Video Not Found</h1>
          <p className="text-gray-600 mb-8">The requested video credits page could not be found.</p>
          <Link
            href="/acknowledgements"
            className="bg-brand-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-gold-dark transition-colors inline-flex items-center"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Acknowledgements
          </Link>
        </div>
      </div>
    )
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
          <div className="flex items-center mb-6">
            <Link
              href="/acknowledgements"
              className="text-brand-gold hover:text-brand-gold-light transition-colors inline-flex items-center"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Acknowledgements
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              <span className="text-brand-gold">Credits & References</span>
            </h1>
            <p className="text-xl text-brand-gold font-semibold">
              {video.title}
            </p>
          </div>
        </div>
      </section>

      {/* Video Thumbnail Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md h-64 rounded-lg overflow-hidden">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credits Sections */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Images Credits */}
            {credits?.images && credits.images.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Images</h3>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="space-y-4">
                    {credits.images.map((image: any, index: number) => (
                      <div key={index} className="border-l-4 border-brand-gold pl-4">
                        <h4 className="font-semibold text-gray-900">{image.source}</h4>
                        <p className="text-gray-600">Photographer: {image.photographer}</p>
                        <p className="text-gray-600">License: {image.license}</p>
                        <p className="text-sm text-gray-500">Timestamp: {image.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Music Credits */}
            {credits?.music && credits.music.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Music & Audio</h3>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="space-y-4">
                    {credits.music.map((music: any, index: number) => (
                      <div key={index} className="border-l-4 border-brand-forest pl-4">
                        <h4 className="font-semibold text-gray-900">{music.title}</h4>
                        {music.artist && <p className="text-gray-600">Artist: {music.artist}</p>}
                        {music.source && <p className="text-gray-600">Source: {music.source}</p>}
                        <p className="text-gray-600">License: {music.license}</p>
                        <p className="text-sm text-gray-500">Timestamp: {music.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Research References */}
            {credits?.research && credits.research.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Research References</h3>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="space-y-4">
                    {credits.research.map((research: any, index: number) => (
                      <div key={index} className="border-l-4 border-brand-bronze pl-4">
                        <h4 className="font-semibold text-gray-900">{research.title}</h4>
                        <p className="text-gray-600">Author: {research.author}</p>
                        <p className="text-gray-600">Publication: {research.publication}</p>
                        <p className="text-gray-600">Year: {research.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Guest Credits */}
            {credits?.guests && credits.guests.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Guests</h3>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="space-y-4">
                    {credits.guests.map((guest: any, index: number) => (
                      <div key={index} className="border-l-4 border-brand-red pl-4">
                        <h4 className="font-semibold text-gray-900">{guest.name}</h4>
                        <p className="text-gray-600">Title: {guest.title}</p>
                        <p className="text-gray-600">Location: {guest.location}</p>
                        <p className="text-gray-600">Topics: {guest.topics}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
