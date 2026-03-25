'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PersonRecord } from '@/lib/person-schema'
import FamilyTreeViewer from '@/components/FamilyTreeViewer'
import { User, MapPin, Award, Calendar, FileText, Globe, Loader2, AlertCircle, Link2, ExternalLink } from 'lucide-react'

type RelationshipType = 'father' | 'mother' | 'spouse' | 'child'

export default function PersonDetailPage() {
  const params = useParams()
  const personId = params.personId as string
  const [person, setPerson] = useState<PersonRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTree, setShowTree] = useState(false)
  const [treeRefreshKey, setTreeRefreshKey] = useState(0)
  const [linkRelationship, setLinkRelationship] = useState<RelationshipType>('father')
  const [linkPersonId, setLinkPersonId] = useState('')
  const [linkStatus, setLinkStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ type: 'idle' })

  useEffect(() => {
    loadPerson()
  }, [personId])

  const loadPerson = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('Loading person with ID:', personId)
      const response = await fetch(`/api/persons/${personId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('API response:', data)

      if (data.success && data.person) {
        setPerson(data.person)
      } else {
        const errorMsg = data.error || 'Person not found'
        console.error('Error from API:', errorMsg)
        setError(errorMsg)
      }
    } catch (err) {
      console.error('Error loading person:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLinkFamily = async () => {
    const relatedId = linkPersonId.trim()
    if (!relatedId) {
      setLinkStatus({ type: 'error', message: 'Enter the other person’s Person ID.' })
      return
    }
    if (relatedId === personId) {
      setLinkStatus({ type: 'error', message: 'Cannot link a person to themselves.' })
      return
    }
    setLinkStatus({ type: 'loading' })
    try {
      const res = await fetch(`/api/persons/${personId}/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relationship: linkRelationship, relatedPersonId: relatedId }),
      })
      const result = await res.json()
      if (result.success) {
        setLinkStatus({ type: 'success', message: `${linkRelationship.charAt(0).toUpperCase() + linkRelationship.slice(1)} linked.` })
        setLinkPersonId('')
        await loadPerson()
        setTreeRefreshKey((k) => k + 1)
      } else {
        setLinkStatus({ type: 'error', message: result.error || 'Link failed.' })
      }
    } catch (err) {
      setLinkStatus({ type: 'error', message: err instanceof Error ? err.message : 'Link failed.' })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-gold" />
          <p className="text-gray-600">Loading person record...</p>
        </div>
      </div>
    )
  }

  if (error || !person) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600">{error || 'Person not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Person Details */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {person.identity.fullName}
            </h1>
            {person.identity.alternateNames && person.identity.alternateNames.length > 0 && (
              <p className="text-gray-600 text-sm">
                Also known as: {person.identity.alternateNames.join(', ')}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowTree(!showTree)}
            className="bg-brand-gold hover:bg-brand-gold-dark text-white px-4 py-2 rounded-lg font-medium"
          >
            {showTree ? 'Hide' : 'Show'} Family Tree
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-brand-gold" />
              Identity
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Gender:</strong> {person.identity.gender}</p>
              {person.identity.dateOfBirth && (
                <p><strong>Date of Birth:</strong> {person.identity.dateOfBirth}</p>
              )}
              {person.identity.placeOfBirth && (
                <p><strong>Place of Birth:</strong> {person.identity.placeOfBirth}</p>
              )}
            </div>
          </div>

          {/* Lineage */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-brand-forest" />
              Lineage
            </h3>
            <div className="space-y-2 text-sm">
              {person.lineage?.state && (
                <p><strong>State:</strong> {person.lineage.state}</p>
              )}
              {person.lineage?.town && (
                <p><strong>Town:</strong> {person.lineage.town}</p>
              )}
              {person.lineage?.village && (
                <p><strong>Village:</strong> {person.lineage.village}</p>
              )}
              {person.lineage?.umunna && (
                <p><strong>Umunna:</strong> {person.lineage.umunna}</p>
              )}
            </div>
          </div>

          {/* Cultural */}
          {person.cultural?.titles && person.cultural.titles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2 text-brand-bronze" />
                Cultural Identity
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex flex-wrap gap-2">
                  {person.cultural.titles.map((title, idx) => (
                    <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs">
                      {title}
                    </span>
                  ))}
                </div>
                {person.cultural.occupation && (
                  <p><strong>Occupation:</strong> {person.cultural.occupation}</p>
                )}
                {person.cultural.totem && (
                  <p><strong>Totem:</strong> {person.cultural.totem}</p>
                )}
              </div>
            </div>
          )}

          {/* Life Events */}
          {((person.lifeEvents?.marriageDate || person.lifeEvents?.deathDate)) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-brand-gold" />
                Life Events
              </h3>
              <div className="space-y-2 text-sm">
                {person.lifeEvents?.marriageDate && (
                  <p><strong>Marriage:</strong> {person.lifeEvents.marriageDate}</p>
                )}
                {person.lifeEvents?.deathDate && (
                  <p><strong>Death:</strong> {person.lifeEvents.deathDate}</p>
                )}
              </div>
            </div>
          )}

          {/* Diaspora */}
          {person.diaspora?.isDiasporaRelative && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Diaspora
              </h3>
              <div className="space-y-2 text-sm">
                {person.diaspora?.countryOfResidence && (
                  <p><strong>Country:</strong> {person.diaspora.countryOfResidence}</p>
                )}
                {person.diaspora?.currentCity && (
                  <p><strong>City:</strong> {person.diaspora.currentCity}</p>
                )}
              </div>
            </div>
          )}

          {/* Documentation */}
          {person.documentation?.story && (
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Family Story
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{person.documentation.story}</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Person ID: <code className="bg-gray-100 px-2 py-1 rounded">{person.identity.personId}</code>
          </p>
        </div>
      </div>

      {/* Link family members */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Link2 className="w-5 h-5 mr-2 text-brand-gold" />
          Link family members
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Add a father, mother, spouse, or child by entering that person’s <strong>Person ID</strong>. They must already exist in the database (e.g. from a submission or another record).
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Relationship</label>
            <select
              value={linkRelationship}
              onChange={(e) => setLinkRelationship(e.target.value as RelationshipType)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-gold focus:border-brand-gold"
            >
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="spouse">Spouse</option>
              <option value="child">Child</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Other person’s Person ID</label>
            <input
              type="text"
              value={linkPersonId}
              onChange={(e) => setLinkPersonId(e.target.value)}
              placeholder="e.g. P1771451755507_abc123"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-brand-gold focus:border-brand-gold"
            />
          </div>
          <button
            onClick={handleLinkFamily}
            disabled={linkStatus.type === 'loading'}
            className="px-4 py-2 rounded-lg bg-brand-gold text-white font-medium text-sm hover:bg-brand-gold-dark disabled:opacity-50"
          >
            {linkStatus.type === 'loading' ? 'Linking…' : 'Link'}
          </button>
        </div>
        {linkStatus.type === 'success' && (
          <p className="mt-3 text-sm text-green-700">{linkStatus.message}</p>
        )}
        {linkStatus.type === 'error' && (
          <p className="mt-3 text-sm text-red-700">{linkStatus.message}</p>
        )}
        <p className="mt-3 text-xs text-gray-500">
          Find Person IDs on the <Link href="/search" className="text-brand-gold hover:underline inline-flex items-center">Search page <ExternalLink className="w-3 h-3 ml-0.5" /></Link> or in the URL of a person’s record page.
        </p>
      </div>

      {/* Family Tree */}
      {showTree && (
        <FamilyTreeViewer key={treeRefreshKey} personId={personId} />
      )}
    </div>
  )
}

