'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { PersonRecord } from '@/lib/person-schema'
import FamilyTreeViewer from '@/components/FamilyTreeViewer'
import { User, MapPin, Award, Calendar, FileText, Globe, Loader2, AlertCircle } from 'lucide-react'

export default function PersonDetailPage() {
  const params = useParams()
  const personId = params.personId as string
  const [person, setPerson] = useState<PersonRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTree, setShowTree] = useState(false)

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
              {person.lineage.state && (
                <p><strong>State:</strong> {person.lineage.state}</p>
              )}
              {person.lineage.town && (
                <p><strong>Town:</strong> {person.lineage.town}</p>
              )}
              {person.lineage.village && (
                <p><strong>Village:</strong> {person.lineage.village}</p>
              )}
              {person.lineage.umunna && (
                <p><strong>Umunna:</strong> {person.lineage.umunna}</p>
              )}
            </div>
          </div>

          {/* Cultural */}
          {person.cultural.titles && person.cultural.titles.length > 0 && (
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
          {(person.lifeEvents.marriageDate || person.lifeEvents.deathDate) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-brand-gold" />
                Life Events
              </h3>
              <div className="space-y-2 text-sm">
                {person.lifeEvents.marriageDate && (
                  <p><strong>Marriage:</strong> {person.lifeEvents.marriageDate}</p>
                )}
                {person.lifeEvents.deathDate && (
                  <p><strong>Death:</strong> {person.lifeEvents.deathDate}</p>
                )}
              </div>
            </div>
          )}

          {/* Diaspora */}
          {person.diaspora.isDiasporaRelative && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Diaspora
              </h3>
              <div className="space-y-2 text-sm">
                {person.diaspora.countryOfResidence && (
                  <p><strong>Country:</strong> {person.diaspora.countryOfResidence}</p>
                )}
                {person.diaspora.currentCity && (
                  <p><strong>City:</strong> {person.diaspora.currentCity}</p>
                )}
              </div>
            </div>
          )}

          {/* Documentation */}
          {person.documentation.story && (
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

      {/* Family Tree */}
      {showTree && (
        <FamilyTreeViewer personId={personId} />
      )}
    </div>
  )
}

