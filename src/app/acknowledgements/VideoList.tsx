"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'

type Episode = {
  videoId: string
  slug: string
  title: string
  thumbnail: string
  publishedAt: string
  duration?: string
}

export default function VideoList({ episodes }: { episodes: Episode[] }) {
  const [query, setQuery] = useState<string>("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return episodes
    return episodes.filter((e) => e.title?.toLowerCase().includes(q))
  }, [episodes, query])

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos by title..."
          className="w-full rounded-md border border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
        />
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" strokeWidth="2" />
          <path d="m21 21-4.3-4.3" strokeWidth="2" />
        </svg>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-600">No videos match your search.</p>
      ) : (
        <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
          {filtered.map((episode) => (
            <li key={episode.videoId} className="p-4">
              <Link href={`/acknowledgements/${episode.slug}`} className="flex items-center gap-4 group">
                <div className="relative h-20 w-36 flex-shrink-0 overflow-hidden rounded">
                  <Image src={episode.thumbnail} alt={episode.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-brand-gold truncate">{episode.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(episode.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="text-brand-gold font-medium">View Credits →</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


