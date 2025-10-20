'use client'

import { useState, useEffect } from 'react'
import { getLatestVideos } from '@/lib/youtube'
import { Plus, Edit, Save, X, Trash2 } from 'lucide-react'

interface VideoCredit {
  id: string
  videoId: string
  title: string
  thumbnail: string
  duration: string
  publishedAt: string
  credits: {
    images: Array<{
      source: string
      photographer: string
      license: string
      timestamp: string
    }>
    music: Array<{
      title: string
      artist?: string
      source?: string
      license: string
      timestamp: string
    }>
    research: Array<{
      title: string
      author: string
      publication: string
      year: string
    }>
    guests: Array<{
      name: string
      title: string
      location: string
      topics: string
    }>
  }
}

export default function CreditsAdminPage() {
  const [videos, setVideos] = useState<any[]>([])
  const [credits, setCredits] = useState<{ [key: string]: VideoCredit }>({})
  const [editingVideo, setEditingVideo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    loadVideos()
    loadCredits()
  }, [])

  const loadVideos = async () => {
    try {
      setError(null)
      const response = await fetch('/api/videos')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      setVideos(data.videos || [])
      console.log('Loaded videos:', data.videos?.length || 0)
      
      if (data.videos?.length === 0) {
        setError('No videos found. Please check your YouTube API configuration.')
      }
    } catch (error) {
      console.error('Error loading videos:', error)
      setError('Failed to load videos. Please check your internet connection and try again.')
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  const loadCredits = () => {
    // Load from localStorage (in a real app, this would be from a database)
    const savedCredits = localStorage.getItem('video-credits')
    if (savedCredits) {
      setCredits(JSON.parse(savedCredits))
    }
  }

  const saveCredits = (videoId: string, videoCredits: VideoCredit) => {
    const newCredits = { ...credits, [videoId]: videoCredits }
    setCredits(newCredits)
    localStorage.setItem('video-credits', JSON.stringify(newCredits))
    setEditingVideo(null)
    setSuccessMessage(`Credits saved successfully for "${videoCredits.title}"`)
    console.log('Credits saved for video:', videoId, videoCredits)
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const addCreditItem = (videoId: string, type: keyof VideoCredit['credits'], item: any) => {
    const videoCredit = credits[videoId] || {
      id: videoId,
      videoId,
      title: videos.find(v => v.videoId === videoId)?.title || '',
      thumbnail: videos.find(v => v.videoId === videoId)?.thumbnail || '',
      duration: videos.find(v => v.videoId === videoId)?.duration || '',
      publishedAt: videos.find(v => v.videoId === videoId)?.publishedAt || '',
      credits: { images: [], music: [], research: [], guests: [] }
    }
    
    videoCredit.credits[type].push(item)
    saveCredits(videoId, videoCredit)
  }

  const removeCreditItem = (videoId: string, type: keyof VideoCredit['credits'], index: number) => {
    const videoCredit = credits[videoId]
    if (videoCredit) {
      videoCredit.credits[type].splice(index, 1)
      saveCredits(videoId, videoCredit)
    }
  }

  const updateCreditItem = (videoId: string, type: keyof VideoCredit['credits'], index: number, field: string, value: string) => {
    const videoCredit = credits[videoId]
    if (videoCredit && videoCredit.credits[type][index]) {
      (videoCredit.credits[type][index] as any)[field] = value
      saveCredits(videoId, videoCredit)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading videos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Credits Management</h1>
          <p className="text-gray-600">Manage credits and references for your YouTube videos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Videos List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Videos</h2>
              <button
                onClick={loadVideos}
                className="text-sm text-brand-gold hover:text-brand-gold-dark"
              >
                Refresh
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="text-red-800 font-medium mb-2">Error Loading Videos</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <div className="mt-3 text-xs text-red-600">
                  <p><strong>Debug Info:</strong></p>
                  <p>• Check if YouTube API key is configured in environment variables</p>
                  <p>• Check if YouTube Channel ID is set correctly</p>
                  <p>• Verify your YouTube channel has videos</p>
                  <p>• Check browser console for detailed error messages</p>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="text-green-800 font-medium mb-2">Success!</h3>
                <p className="text-green-700 text-sm">{successMessage}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {videos.length > 0 ? (
                videos.map((video) => (
                  <div key={video.videoId} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-20 h-15 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{video.title}</h3>
                        <p className="text-sm text-gray-500">{video.duration} • {new Date(video.publishedAt).toLocaleDateString()}</p>
                        <div className="mt-2">
                          <button
                            onClick={() => setEditingVideo(editingVideo === video.videoId ? null : video.videoId)}
                            className="text-brand-gold hover:text-brand-gold-dark text-sm font-medium"
                          >
                            {editingVideo === video.videoId ? 'Cancel' : 'Edit Credits'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : !loading && !error ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Videos Found</h3>
                  <p className="text-gray-600 mb-4">
                    Unable to load videos from your YouTube channel.
                  </p>
                  <button
                    onClick={loadVideos}
                    className="bg-brand-gold text-white px-4 py-2 rounded-lg hover:bg-brand-gold-dark transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Credits Editor */}
          <div>
            {editingVideo ? (
              <CreditsEditor
                video={videos.find(v => v.videoId === editingVideo)}
                credits={credits[editingVideo]}
                onSave={(credits) => saveCredits(editingVideo, credits)}
                onCancel={() => setEditingVideo(null)}
                onAddItem={(type, item) => addCreditItem(editingVideo, type, item)}
                onRemoveItem={(type, index) => removeCreditItem(editingVideo, type, index)}
                onUpdateItem={(type, index, field, value) => updateCreditItem(editingVideo, type, index, field, value)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">Select a video to edit its credits</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface CreditsEditorProps {
  video: any
  credits: VideoCredit | undefined
  onSave: (credits: VideoCredit) => void
  onCancel: () => void
  onAddItem: (type: keyof VideoCredit['credits'], item: any) => void
  onRemoveItem: (type: keyof VideoCredit['credits'], index: number) => void
  onUpdateItem: (type: keyof VideoCredit['credits'], index: number, field: string, value: string) => void
}

function CreditsEditor({ video, credits, onSave, onCancel, onAddItem, onRemoveItem, onUpdateItem }: CreditsEditorProps) {
  const [localCredits, setLocalCredits] = useState<VideoCredit['credits']>(
    credits?.credits || { images: [], music: [], research: [], guests: [] }
  )

  // Update local state when credits prop changes
  useEffect(() => {
    setLocalCredits(credits?.credits || { images: [], music: [], research: [], guests: [] })
  }, [credits])

  const handleSave = () => {
    const videoCredits: VideoCredit = {
      id: video.videoId,
      videoId: video.videoId,
      title: video.title,
      thumbnail: video.thumbnail,
      duration: video.duration,
      publishedAt: video.publishedAt,
      credits: localCredits
    }
    console.log('Saving credits:', videoCredits)
    onSave(videoCredits)
  }

  const addItem = (type: keyof VideoCredit['credits']) => {
    const newItem = type === 'images' ? { source: '', photographer: '', license: '', timestamp: '' } :
                   type === 'music' ? { title: '', artist: '', license: '', timestamp: '' } :
                   type === 'research' ? { title: '', author: '', publication: '', year: '' } :
                   { name: '', title: '', location: '', topics: '' }
    
    setLocalCredits(prev => ({
      ...prev,
      [type]: [...prev[type], newItem]
    }))
  }

  const removeItem = (type: keyof VideoCredit['credits'], index: number) => {
    setLocalCredits(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const updateItem = (type: keyof VideoCredit['credits'], index: number, field: string, value: string) => {
    setLocalCredits(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? { ...item, [field]: value } : item)
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">{video?.title}</h3>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-brand-gold text-white rounded hover:bg-brand-gold-dark"
          >
            Save Credits
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Images */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900">Images</h4>
            <button
              onClick={() => addItem('images')}
              className="text-brand-gold hover:text-brand-gold-dark text-sm"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Add Image
            </button>
          </div>
          <div className="space-y-3">
            {localCredits.images.map((item, index) => (
              <div key={index} className="border rounded p-3">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Source/Description"
                    value={item.source}
                    onChange={(e) => updateItem('images', index, 'source', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Photographer"
                    value={item.photographer}
                    onChange={(e) => updateItem('images', index, 'photographer', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="License"
                    value={item.license}
                    onChange={(e) => updateItem('images', index, 'license', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Timestamp (e.g., 2:15)"
                    value={item.timestamp}
                    onChange={(e) => updateItem('images', index, 'timestamp', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                </div>
                <button
                  onClick={() => removeItem('images', index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Music */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900">Music & Audio</h4>
            <button
              onClick={() => addItem('music')}
              className="text-brand-gold hover:text-brand-gold-dark text-sm"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Add Music
            </button>
          </div>
          <div className="space-y-3">
            {localCredits.music.map((item, index) => (
              <div key={index} className="border rounded p-3">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => updateItem('music', index, 'title', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Artist"
                    value={item.artist || ''}
                    onChange={(e) => updateItem('music', index, 'artist', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Source"
                    value={item.source || ''}
                    onChange={(e) => updateItem('music', index, 'source', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="License"
                    value={item.license}
                    onChange={(e) => updateItem('music', index, 'license', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Timestamp (e.g., 0:00-3:20)"
                    value={item.timestamp}
                    onChange={(e) => updateItem('music', index, 'timestamp', e.target.value)}
                    className="text-sm border rounded px-2 py-1 col-span-2"
                  />
                </div>
                <button
                  onClick={() => removeItem('music', index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Research */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900">Research References</h4>
            <button
              onClick={() => addItem('research')}
              className="text-brand-gold hover:text-brand-gold-dark text-sm"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Add Reference
            </button>
          </div>
          <div className="space-y-3">
            {localCredits.research.map((item, index) => (
              <div key={index} className="border rounded p-3">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => updateItem('research', index, 'title', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Author"
                    value={item.author}
                    onChange={(e) => updateItem('research', index, 'author', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Publication"
                    value={item.publication}
                    onChange={(e) => updateItem('research', index, 'publication', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={item.year}
                    onChange={(e) => updateItem('research', index, 'year', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                </div>
                <button
                  onClick={() => removeItem('research', index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Guests */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900">Guests</h4>
            <button
              onClick={() => addItem('guests')}
              className="text-brand-gold hover:text-brand-gold-dark text-sm"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Add Guest
            </button>
          </div>
          <div className="space-y-3">
            {localCredits.guests.map((item, index) => (
              <div key={index} className="border rounded p-3">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={item.name}
                    onChange={(e) => updateItem('guests', index, 'name', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Title/Position"
                    value={item.title}
                    onChange={(e) => updateItem('guests', index, 'title', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={item.location}
                    onChange={(e) => updateItem('guests', index, 'location', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Topics Discussed"
                    value={item.topics}
                    onChange={(e) => updateItem('guests', index, 'topics', e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  />
                </div>
                <button
                  onClick={() => removeItem('guests', index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
