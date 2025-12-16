/**
 * Person Search Component
 * Allows users to search for persons in the genealogy database
 */

'use client'

import { useState } from 'react'
import { Search, User, MapPin, Users, Globe, Loader2 } from 'lucide-react'
import { PersonRecord } from '@/lib/person-schema'

export default function PersonSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'name' | 'location' | 'diaspora'>('name')
  const [results, setResults] = useState<PersonRecord[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  
  // Location filters
  const [locationFilters, setLocationFilters] = useState({
    state: '',
    lga: '',
    town: '',
    village: '',
    umunna: '',
  })

  const handleSearch = async () => {
    if (!searchTerm && searchType === 'name') {
      alert('Please enter a search term')
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      let url = '/api/persons/search?'
      
      if (searchType === 'name') {
        url += `type=name&q=${encodeURIComponent(searchTerm)}`
      } else if (searchType === 'location') {
        url += 'type=location'
        if (locationFilters.state) url += `&state=${encodeURIComponent(locationFilters.state)}`
        if (locationFilters.lga) url += `&lga=${encodeURIComponent(locationFilters.lga)}`
        if (locationFilters.town) url += `&town=${encodeURIComponent(locationFilters.town)}`
        if (locationFilters.village) url += `&village=${encodeURIComponent(locationFilters.village)}`
        if (locationFilters.umunna) url += `&umunna=${encodeURIComponent(locationFilters.umunna)}`
      } else if (searchType === 'diaspora') {
        url += 'type=diaspora'
        if (searchTerm) url += `&country=${encodeURIComponent(searchTerm)}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setResults(data.results || [])
      } else {
        alert('Search failed: ' + (data.error || 'Unknown error'))
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Failed to search. Please try again.')
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const viewPerson = (personId: string) => {
    window.location.href = `/genealogy/person/${personId}`
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Search className="w-6 h-6 mr-2 text-brand-gold" />
        Search Genealogy Database
      </h2>

      {/* Search Type Selection */}
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setSearchType('name')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              searchType === 'name'
                ? 'bg-brand-gold text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Search by Name
          </button>
          <button
            onClick={() => setSearchType('location')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              searchType === 'location'
                ? 'bg-brand-gold text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Search by Location
          </button>
          <button
            onClick={() => setSearchType('diaspora')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              searchType === 'diaspora'
                ? 'bg-brand-gold text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Globe className="w-4 h-4 inline mr-2" />
            Search Diaspora
          </button>
        </div>
      </div>

      {/* Search Input */}
      {searchType === 'name' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
              placeholder="Enter full name or surname (e.g., OKAFOR)"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-brand-gold hover:bg-brand-gold-dark text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center"
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Location Filters */}
      {searchType === 'location' && (
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={locationFilters.state}
                onChange={(e) => setLocationFilters(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="ANAMBRA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LGA</label>
              <input
                type="text"
                value={locationFilters.lga}
                onChange={(e) => setLocationFilters(prev => ({ ...prev, lga: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="AGUATA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Town</label>
              <input
                type="text"
                value={locationFilters.town}
                onChange={(e) => setLocationFilters(prev => ({ ...prev, town: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="ACHINA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
              <input
                type="text"
                value={locationFilters.village}
                onChange={(e) => setLocationFilters(prev => ({ ...prev, village: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="ELEKECHEM"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center"
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Search by Location
              </>
            )}
          </button>
        </div>
      )}

      {/* Diaspora Search */}
      {searchType === 'diaspora' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country (Optional - leave blank to see all diaspora)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
              placeholder="UNITED STATES (optional)"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-brand-gold hover:bg-brand-gold-dark text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center"
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Results ({results.length})
          </h3>
          
          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No results found. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((person) => (
                <div
                  key={person.identity.personId}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => viewPerson(person.identity.personId)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-gray-900 mb-1">
                        {person.identity.fullName}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {person.lineage.state && (
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {person.lineage.state}
                            {person.lineage.town && `, ${person.lineage.town}`}
                          </span>
                        )}
                        {person.lineage.umunna && (
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {person.lineage.umunna}
                          </span>
                        )}
                        {person.diaspora.isDiasporaRelative && person.diaspora.countryOfResidence && (
                          <span className="flex items-center">
                            <Globe className="w-4 h-4 mr-1" />
                            {person.diaspora.countryOfResidence}
                          </span>
                        )}
                      </div>
                      {person.cultural.titles && person.cultural.titles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {person.cultural.titles.map((title, idx) => (
                            <span
                              key={idx}
                              className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium"
                            >
                              {title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {person.identity.personId.substring(0, 15)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

