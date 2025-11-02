import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { getLatestVideos } from '@/lib/youtube'

// Define interface for video credits structure
interface VideoCredit {
  title: string;
  thumbnail: string;
  credits: {
    books: { citation: string }[];
    visualSources: { title: string; source: string; link: string }[];
    teamAcknowledgements?: string;
    aiAssistance?: string;
  };
}

interface VideoCredits {
  [key: string]: VideoCredit;
}

// Load credits for this specific video
function getVideoCredits(): VideoCredits {
  return {
    'shocking-reasons-europeans-promoted-igbo-hatred': {
      title: "Shocking Reasons Europeans Promoted Igbo Hatred",
      thumbnail: "https://i.ytimg.com/vi/1OpMb3BPU1M/maxresdefault.jpg",
      credits: {
        books: [
          { citation: "Achebe, C. Things Fall Apart. William Heinemann Ltd, 1958." },
          { citation: "Afigbo, A. E. The Abolition of the Slave Trade in Southeastern Nigeria, 1885–1950. University of Rochester Press, 2005." },
          { citation: "Basden, G. T. Among the Igbos of Nigeria. Kessinger Legacy Reprint, 1921." },
          { citation: "Buxton, T. F. The African Slave Trade and Its Remedy. John Murray, London, 1840." },
          { citation: "Ekechi, F. K. Missionary Enterprise and Rivalry in Igboland, 1857–1914. Frank Cass, 1972." },
          { citation: "Equiano, O. The Interesting Narrative of the Life of Olaudah Equiano. London, 1789." },
          { citation: "Falola, T., & Njoku, R. C. (Eds.). Igbo in the Atlantic World: African Origin and Diasporic Destination. Indiana University Press, 2016." }
        ],
        visualSources: [
          { title: "images-african-slavery-and-slave-trade (1)", source: "ThoughtCo", link: "https://www.thoughtco.com/images-afri..." },
          { title: "images-african-slavery-and-slave-trade (2)", source: "ThoughtCo", link: "https://www.thoughtco.com/images-afri..." },
          { title: "images-african-slavery-and-slave-trade (3)", source: "Getty Images", link: "https://www.gettyimages.com/photos/sl..." },
          { title: "Image of Work of Christian Missionaries in Igboland", source: "Odogwublog", link: "https://www.odogwublog.com/164-years-..." },
          { title: "Image of Early Christian Missionaries in Igboland", source: "Afriklens", link: "https://www.afriklens.com/how-christi..." },
          { title: "Image of White Christian Missionaries", source: "Al Jazeera", link: "https://www.aljazeera.com/opinions/20..." },
          { title: "Footage of Nigerian Flag Flying", source: "Pexels", link: "https://www.pexels.com/video/low-angl..." }
        ],
        aiAssistance: "AI research support (ChatGPT by OpenAI, 2025 and Perplexity AI. (2025). Generative AI chat. https://www.perplexity.ai) for data organization, language clarity, or fact structuring; all creative interpretation remains original to Ndigbo Viva Channel."
      }
    },
    'hear-values-that-make-ndigbo-great-by-prof-casmir-ck-ani-part-2': {
      title: "Hear Values that make Ndigbo Great by Prof. Casmir C.K. Ani Part 2",
      thumbnail: "",
      credits: {
        books: [
          { citation: "Ikejiani-Clark, M. (2009). Peace studies and conflict resolution in Nigeria: A reader. Ibadan, Nigeria: Spectrum Books." }
        ],
        visualSources: [
          { 
            title: "Prof. Miriam Ikejiani-Clark (2011, October 11).testingonlyon25jan2012.", 
            source: "Testing Only on 25 Jan 2012", 
            link: "https://testingonlyon25jan2012.wordpress.com/" 
          },
          { 
            title: "Monsignor Obiora Ike (Producer). (May 27, 2018). Lohmann, M. Image [Video screenshot]. YouTube.", 
            source: "Obiora Ike Christentum & Islam", 
            link: "https://www.youtube.com/" 
          },
          { 
            title: "Ngozi Okonjo-Iweala, Managing Director, World Bank Fund. (July 28, 2010). International Monetary [Photograph]. IMF Photographic Archives.", 
            source: "Wikipedia", 
            link: "https://yo.wikipedia.org/wiki/Ngozi_Okonjo-Iweala" 
          },
          { 
            title: "Chimamanda Ngozi Adichie. (2025, February 17). Nwebonyi OliverJunior [Photograph]. Facebook group \"Nigerian Teachers\".", 
            source: "Facebook", 
            link: "https://www.facebook.com/groups/4959580914267255" 
          },
          { 
            title: "Dr. Chuba Okadigbo (2024, February 8).Wikipedia.", 
            source: "Wikimedia Commons", 
            link: "https://commons.wikimedia.org/wiki/File:" 
          }
        ],
        teamAcknowledgements: `Host: Akachukwu Nwankpo (Oputaifeadi)
Visual Editing: Emeka Okorie
Blog Website Mgt: Chukwukadibia Ekene
Research support: Esther Ime
Recorded at Ndigbo Viva Studios, Enugu.`
      }
    }
  }
}

interface PageProps {
  params: {
    slug: string
  }
}

export default async function VideoCreditsPage({ params }: PageProps) {
  // Get the credits data directly using the slug
  const allCredits = getVideoCredits()
  let videoCredits = allCredits[params.slug]
  
  // If not found by slug, try to find by matching title (for variations)
  if (!videoCredits) {
    try {
      const videos = await getLatestVideos(50)
      const ytVideo = videos.find(v => v.slug === params.slug)
      
      if (ytVideo) {
        // Try to find credits by matching title keywords
        const titleLower = ytVideo.title.toLowerCase()
        for (const [slug, credits] of Object.entries(allCredits)) {
          const creditsTitleLower = credits.title.toLowerCase()
          // Check if titles match (allowing for some variation)
          if (titleLower.includes('casmir') && titleLower.includes('ani') && 
              titleLower.includes('values') && titleLower.includes('ndigbo')) {
            videoCredits = credits
            break
          }
        }
      }
    } catch (error) {
      console.error('Error fetching video data:', error)
    }
  }
  
  // Get YouTube video data for title and thumbnail
  let ytVideo = null
  try {
    const videos = await getLatestVideos(50)
    ytVideo = videos.find(v => v.slug === params.slug)
  } catch (error) {
    console.error('Error fetching video data:', error)
  }
  
  let video = {
    title: ytVideo?.title || videoCredits?.title || '',
    thumbnail: ytVideo?.thumbnail || videoCredits?.thumbnail || '/Ndigbo Viva Logo.jpg',
    credits: videoCredits?.credits || {
      books: [],
      visualSources: [],
      aiAssistance: ytVideo ? "Video data sourced from YouTube API" : undefined
    }
  }

  if (!video.title) {
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

  const credits = video.credits

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Thumbnail on the left */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Credits on the right */}
            <div className="w-full md:w-2/3">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{video.title}</h1>
              
              {/* Books and Articles */}
              {credits?.books && credits.books.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">1. BOOKS AND ARTICLES:</h3>
                  <div className="space-y-3">
                    {credits.books.map((book: any, index: number) => (
                      <div key={index} className="border-l-4 border-brand-gold pl-4">
                        <p className="text-gray-800">{book.citation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Sources */}
              {credits?.visualSources && credits.visualSources.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">2. VISUAL SOURCES:</h3>
                  <div className="space-y-4">
                    {credits.visualSources.map((source: any, index: number) => (
                      <div key={index} className="border-l-4 border-brand-forest pl-4">
                        <h4 className="font-semibold text-gray-900">{source.title}</h4>
                        <p className="text-gray-600">Original Source: {source.source}</p>
                        <p className="text-gray-600">
                          Source Link: <a href={source.link} className="text-brand-gold hover:underline" target="_blank" rel="noopener noreferrer">{source.link}</a>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Acknowledgements */}
              {credits?.teamAcknowledgements && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">TEAM ACKNOWLEDGEMENTS:</h3>
                  <div className="border-l-4 border-brand-bronze pl-4">
                    <pre className="text-gray-800 whitespace-pre-wrap font-sans">{credits.teamAcknowledgements}</pre>
                  </div>
                </div>
              )}

              {/* AI Assistance */}
              {credits?.aiAssistance && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">AI ASSISTANCE:</h3>
                  <div className="border-l-4 border-brand-gold pl-4">
                    <p className="text-gray-800">{credits.aiAssistance}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

