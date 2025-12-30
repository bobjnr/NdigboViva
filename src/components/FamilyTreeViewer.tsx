/**
 * Family Tree Viewer Component
 * Displays family tree (ancestors and descendants) for a person
 */

'use client'

import { useState, useEffect } from 'react'
import { TreePine, User, Users, ArrowUp, ArrowDown, Loader2, AlertCircle } from 'lucide-react'
import { PersonRecord } from '@/lib/person-schema'

interface FamilyTreeViewerProps {
  personId: string
}

export default function FamilyTreeViewer({ personId }: FamilyTreeViewerProps) {
  const [person, setPerson] = useState<PersonRecord | null>(null)
  const [ancestors, setAncestors] = useState<PersonRecord[]>([])
  const [descendants, setDescendants] = useState<PersonRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [depth, setDepth] = useState(3)

  useEffect(() => {
    loadFamilyTree()
  }, [personId, depth])

  const loadFamilyTree = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('Loading family tree for person:', personId)
      const response = await fetch(`/api/persons/family-tree/${personId}?depth=${depth}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Family tree API response:', data)

      if (data.success && data.familyTree) {
        setPerson(data.familyTree.person)
        setAncestors(data.familyTree.ancestors || [])
        setDescendants(data.familyTree.descendants || [])
      } else {
        const errorMsg = data.error || 'Failed to load family tree'
        console.error('Error from API:', errorMsg)
        setError(errorMsg)
      }
    } catch (err) {
      console.error('Error loading family tree:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-gold" />
        <p className="text-gray-600">Loading family tree...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadFamilyTree}
          className="bg-brand-gold hover:bg-brand-gold-dark text-white px-6 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!person) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-600">Person not found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <TreePine className="w-6 h-6 mr-2 text-brand-gold" />
          Family Tree
        </h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Depth:</label>
          <select
            value={depth}
            onChange={(e) => setDepth(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg"
          >
            <option value={1}>1 Generation</option>
            <option value={2}>2 Generations</option>
            <option value={3}>3 Generations</option>
            <option value={4}>4 Generations</option>
            <option value={5}>5 Generations</option>
          </select>
        </div>
      </div>

      {/* Ancestors Section */}
      {ancestors.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ArrowUp className="w-5 h-5 mr-2 text-brand-forest" />
            Ancestors ({ancestors.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ancestors.map((ancestor) => (
              <PersonCard key={ancestor.identity.personId} person={ancestor} />
            ))}
          </div>
        </div>
      )}

      {/* Current Person */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-brand-gold" />
          This Person
        </h3>
        <PersonCard person={person} isMainPerson />
      </div>

      {/* Descendants Section */}
      {descendants.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ArrowDown className="w-5 h-5 mr-2 text-brand-bronze" />
            Descendants ({descendants.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {descendants.map((descendant) => (
              <PersonCard key={descendant.identity.personId} person={descendant} />
            ))}
          </div>
        </div>
      )}

      {ancestors.length === 0 && descendants.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No family relationships found yet.</p>
          <p className="text-sm mt-2">Link family members to build your tree!</p>
        </div>
      )}
    </div>
  )
}

function PersonCard({ person, isMainPerson = false }: { person: PersonRecord; isMainPerson?: boolean }) {
  return (
    <div
      className={`border rounded-lg p-4 ${
        isMainPerson
          ? 'border-brand-gold border-2 bg-yellow-50'
          : 'border-gray-200 hover:shadow-md'
      } transition-shadow`}
    >
      <h4 className={`font-semibold mb-2 ${isMainPerson ? 'text-lg' : 'text-base'}`}>
        {person.identity.fullName}
        {isMainPerson && <span className="ml-2 text-brand-gold">(You)</span>}
      </h4>
      <div className="space-y-1 text-sm text-gray-600">
        {person.identity.dateOfBirth && (
          <p>Born: {person.identity.dateOfBirth}</p>
        )}
        {person.lineage.town && person.lineage.state && (
          <p>
            {person.lineage.town}, {person.lineage.state}
          </p>
        )}
        {person.lineage.umunna && (
          <p className="text-xs text-gray-500">Umunna: {person.lineage.umunna}</p>
        )}
        {person.cultural.titles && person.cultural.titles.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {person.cultural.titles.map((title, idx) => (
              <span
                key={idx}
                className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs"
              >
                {title}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-400">
        ID: {person.identity.personId.substring(0, 12)}...
      </div>
    </div>
  )
}

