/**
 * IGBO ANCESTRY NETWORK - COMPREHENSIVE PERSON FORM
 * 
 * Multi-step form for collecting all person data across 7 data layers
 * Uses tabbed interface for better user experience
 */

'use client'

import { useState } from 'react'
import { PersonFormSubmission, Gender, SourceType, VerificationLevel, VisibilitySetting } from '@/lib/person-schema'
import { User, Users, Award, Calendar, FileText, Shield, Globe, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'

interface PersonFormProps {
  onSubmit?: (data: PersonFormSubmission) => void
}

const FORM_TABS = [
  { id: 'identity', label: 'Identity', icon: User },
  { id: 'origin', label: 'Origin Info', icon: Users },
  { id: 'diaspora', label: 'Current Location', icon: Globe },
  { id: 'cultural', label: 'Cultural', icon: Award },
  { id: 'events', label: 'Life Events', icon: Calendar },
  { id: 'documentation', label: 'Sources', icon: FileText },
  { id: 'verification', label: 'Privacy', icon: Shield },
]

export default function PersonForm({ onSubmit }: PersonFormProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [formData, setFormData] = useState<PersonFormSubmission>({
    // Identity (Required)
    fullName: '',
    gender: 'UNKNOWN',
    consentStatus: false,
    isDiasporaRelative: false,

    // Defaults
    verificationLevel: 0,
    visibilitySetting: 'PRIVATE',
    connectionStatus: 'NOT_APPLICABLE',
  })

  const handleInputChange = (field: keyof PersonFormSubmission, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayAdd = (field: keyof PersonFormSubmission, value: string) => {
    if (!value.trim()) return
    const current = (formData[field] as string[]) || []
    if (!current.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...current, value.trim()]
      }))
    }
  }

  const handleArrayRemove = (field: keyof PersonFormSubmission, index: number) => {
    const current = (formData[field] as string[]) || []
    setFormData(prev => ({
      ...prev,
      [field]: current.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.fullName.trim()) {
      alert('Please enter a full name')
      return
    }

    if (!formData.consentStatus) {
      alert('You must provide consent to create a record')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/persons/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to create person record')
      }

      if (onSubmit) {
        onSubmit(formData)
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextTab = () => {
    if (activeTab < FORM_TABS.length - 1) {
      setActiveTab(activeTab + 1)
    }
  }

  const prevTab = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Person Record Created Successfully!
        </h3>
        <p className="text-gray-600 mb-6">
          Thank you for contributing to the Igbo Ancestry Network.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false)
            setFormData({
              fullName: '',
              gender: 'UNKNOWN',
              consentStatus: false,
              isDiasporaRelative: false,
              verificationLevel: 0,
              visibilitySetting: 'PRIVATE',
              connectionStatus: 'NOT_APPLICABLE',
            })
            setActiveTab(0)
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Another Person
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {FORM_TABS.map((tab, index) => {
            const Icon = tab.icon
            const isActive = index === activeTab
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* 1. IDENTITY TAB */}
        {activeTab === 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Identity Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CHUKWUEMEKA OKAFOR"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternate Names / Spellings
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleArrayAdd('alternateNames', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Add alternate name and press Enter"
                />
              </div>
              {formData.alternateNames && formData.alternateNames.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.alternateNames.map((name, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('alternateNames', idx)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value as Gender)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="UNKNOWN">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="1945, 1945-03, or 1945-03-15"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Place of Birth
              </label>
              <input
                type="text"
                value={formData.placeOfBirth || ''}
                onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Town or Village"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
              <input
                type="url"
                value={formData.photoUrl || ''}
                onChange={(e) => handleInputChange('photoUrl', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="photoConsent"
                checked={formData.photoConsent || false}
                onChange={(e) => handleInputChange('photoConsent', e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="photoConsent" className="text-sm text-gray-700">
                I consent to storing/displaying a photo (if provided)
              </label>
            </div>
          </div>
        )}

        {/* 2. LINEAGE TAB */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Lineage & Family Relationships</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Person ID
                </label>
                <input
                  type="text"
                  value={formData.fatherId || ''}
                  onChange={(e) => handleInputChange('fatherId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="P1234567890_abc123"
                />
                <p className="text-xs text-gray-500 mt-1">Enter if father already has a record</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mother's Person ID
                </label>
                <input
                  type="text"
                  value={formData.motherId || ''}
                  onChange={(e) => handleInputChange('motherId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="P1234567890_abc123"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Umunna <span className="text-yellow-600">(Highly Recommended)</span>
              </label>
              <input
                type="text"
                value={formData.umunna || ''}
                onChange={(e) => handleInputChange('umunna', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Extended family group"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={formData.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="ANAMBRA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LGA</label>
                <input
                  type="text"
                  value={formData.localGovernmentArea || ''}
                  onChange={(e) => handleInputChange('localGovernmentArea', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="AGUATA"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Town</label>
                <input
                  type="text"
                  value={formData.town || ''}
                  onChange={(e) => handleInputChange('town', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="ACHINA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                <input
                  type="text"
                  value={formData.village || ''}
                  onChange={(e) => handleInputChange('village', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <input
                  type="text"
                  value={formData.region || ''}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., SOUTH-EAST, SOUTH-SOUTH"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub-region</label>
                <input
                  type="text"
                  value={formData.subRegion || ''}
                  onChange={(e) => handleInputChange('subRegion', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Sub-region within larger region"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senatorial District</label>
                <input
                  type="text"
                  value={formData.senatorialDistrict || ''}
                  onChange={(e) => handleInputChange('senatorialDistrict', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., ANAMBRA SOUTH"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Federal Constituency</label>
                <input
                  type="text"
                  value={formData.federalConstituency || ''}
                  onChange={(e) => handleInputChange('federalConstituency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., AGUATA FEDERAL CONSTITUENCY"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nwaada Lineage Link (Maternal Village)
              </label>
              <input
                type="text"
                value={formData.nwaadaLineageLink || ''}
                onChange={(e) => handleInputChange('nwaadaLineageLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Maternal village for lineage tracking"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clan</label>
                <input
                  type="text"
                  value={formData.clan || ''}
                  onChange={(e) => handleInputChange('clan', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="DIOHA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kindred</label>
                <input
                  type="text"
                  value={formData.kindred || ''}
                  onChange={(e) => handleInputChange('kindred', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="UMUOKPARAUGHANZE"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Town Quarter</label>
                <input
                  type="text"
                  value={formData.townQuarter || ''}
                  onChange={(e) => handleInputChange('townQuarter', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="EZI"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Obi Areas</label>
                <input
                  type="text"
                  value={formData.obiAreas || ''}
                  onChange={(e) => handleInputChange('obiAreas', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="AMAMU"
                />
              </div>
            </div>

            {/* NEW ORIGIN FIELDS - Complete Hierarchy */}
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold mb-3 text-blue-900">Origin Information (Ancestral Location)</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Continent</label>
                  <input
                    type="text"
                    value={formData.originContinent || ''}
                    onChange={(e) => handleInputChange('originContinent', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="AFRICA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub-continent</label>
                  <input
                    type="text"
                    value={formData.originSubContinent || ''}
                    onChange={(e) => handleInputChange('originSubContinent', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="WEST AFRICA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub-region</label>
                  <input
                    type="text"
                    value={formData.originSubRegion || ''}
                    onChange={(e) => handleInputChange('originSubRegion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Sub-region"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={formData.originNationality || ''}
                    onChange={(e) => handleInputChange('originNationality', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="NIGERIA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                  <input
                    type="text"
                    value={formData.originRegion || ''}
                    onChange={(e) => handleInputChange('originRegion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="SOUTH-EAST"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.originState || ''}
                    onChange={(e) => handleInputChange('originState', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="ANAMBRA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Senatorial District</label>
                  <input
                    type="text"
                    value={formData.originSenatorialDistrict || ''}
                    onChange={(e) => handleInputChange('originSenatorialDistrict', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="ANAMBRA SOUTH"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Federal Constituency</label>
                  <input
                    type="text"
                    value={formData.originFederalConstituency || ''}
                    onChange={(e) => handleInputChange('originFederalConstituency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="AGUATA FEDERAL CONSTITUENCY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Local Government Area</label>
                  <input
                    type="text"
                    value={formData.originLocalGovernmentArea || ''}
                    onChange={(e) => handleInputChange('originLocalGovernmentArea', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="AGUATA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State Constituency</label>
                  <input
                    type="text"
                    value={formData.originStateConstituency || ''}
                    onChange={(e) => handleInputChange('originStateConstituency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="State Constituency"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Town</label>
                  <input
                    type="text"
                    value={formData.originTown || ''}
                    onChange={(e) => handleInputChange('originTown', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="ACHINA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Town Division</label>
                  <input
                    type="text"
                    value={formData.originTownDivision || ''}
                    onChange={(e) => handleInputChange('originTownDivision', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Town Division"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Town Quarter</label>
                <input
                  type="text"
                  value={formData.originTownQuarter || ''}
                  onChange={(e) => handleInputChange('originTownQuarter', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="EZI, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clan</label>
                  <input
                    type="text"
                    value={formData.originClan || ''}
                    onChange={(e) => handleInputChange('originClan', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="DIOHA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                  <input
                    type="text"
                    value={formData.originVillage || ''}
                    onChange={(e) => handleInputChange('originVillage', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Village"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hamlet</label>
                  <input
                    type="text"
                    value={formData.originHamlet || ''}
                    onChange={(e) => handleInputChange('originHamlet', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Hamlet"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kindred</label>
                  <input
                    type="text"
                    value={formData.originKindred || ''}
                    onChange={(e) => handleInputChange('originKindred', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="UMUOKPARAUGHANZE"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Umunna</label>
                <input
                  type="text"
                  value={formData.originUmunna || ''}
                  onChange={(e) => handleInputChange('originUmunna', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Extended family group"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Person IDs</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleArrayAdd('spouseIds', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter spouse Person ID and press Enter"
                />
              </div>
              {formData.spouseIds && formData.spouseIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.spouseIds.map((id, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {id}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('spouseIds', idx)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Children Person IDs</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleArrayAdd('childrenIds', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter child Person ID and press Enter"
                />
              </div>
              {formData.childrenIds && formData.childrenIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.childrenIds.map((id, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {id}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('childrenIds', idx)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. CULTURAL TAB */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Cultural & Social Identity</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titles</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleArrayAdd('titles', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="OZO, NZE, LOLO, ICHIE (press Enter to add)"
                />
              </div>
              {formData.titles && formData.titles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.titles.map((title, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {title}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('titles', idx)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input
                  type="text"
                  value={formData.occupation || ''}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Family Trade</label>
                <input
                  type="text"
                  value={formData.familyTrade || ''}
                  onChange={(e) => handleInputChange('familyTrade', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
                <input
                  type="text"
                  value={formData.ethnicity || ''}
                  onChange={(e) => handleInputChange('ethnicity', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., IGBO, YORUBA, HAUSA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Totem / Sacred Animal</label>
                <input
                  type="text"
                  value={formData.totem || ''}
                  onChange={(e) => handleInputChange('totem', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="LEOPARD, PYTHON, EAGLE, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ancestral House/Compound Name</label>
              <input
                type="text"
                value={formData.ancestralHouseName || ''}
                onChange={(e) => handleInputChange('ancestralHouseName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language(s)</label>
              <input
                type="text"
                value={formData.language || ''}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="IGBO, ENGLISH, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notable Contributions</label>
              <textarea
                value={formData.notableContributions || ''}
                onChange={(e) => handleInputChange('notableContributions', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Achievements, roles, contributions to community..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Roles</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleArrayAdd('roles', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="ELDER, CHIEF, COMMUNITY LEADER (press Enter to add)"
                />
              </div>
              {formData.roles && formData.roles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.roles.map((role, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('roles', idx)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. LIFE EVENTS TAB */}
        {activeTab === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Life Events</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marriage Date</label>
                <input
                  type="text"
                  value={formData.marriageDate || ''}
                  onChange={(e) => handleInputChange('marriageDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="1970-05-20 or 1970"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marriage Place</label>
                <input
                  type="text"
                  value={formData.marriagePlace || ''}
                  onChange={(e) => handleInputChange('marriagePlace', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Death Date</label>
                <input
                  type="text"
                  value={formData.deathDate || ''}
                  onChange={(e) => handleInputChange('deathDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Death Place</label>
                <input
                  type="text"
                  value={formData.deathPlace || ''}
                  onChange={(e) => handleInputChange('deathPlace', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDeceased"
                checked={formData.isDeceased || false}
                onChange={(e) => handleInputChange('isDeceased', e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="isDeceased" className="text-sm text-gray-700">
                Person is deceased
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Migration History</label>
              <div className="space-y-3 mb-4">
                {(formData.migrationHistory || []).map((migration, idx) => (
                  <div key={idx} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">From</label>
                        <input
                          type="text"
                          value={migration.from || ''}
                          onChange={(e) => {
                            const updated = [...(formData.migrationHistory || [])]
                            updated[idx] = { ...updated[idx], from: e.target.value }
                            handleInputChange('migrationHistory', updated)
                          }}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Origin location"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">To</label>
                        <input
                          type="text"
                          value={migration.to || ''}
                          onChange={(e) => {
                            const updated = [...(formData.migrationHistory || [])]
                            updated[idx] = { ...updated[idx], to: e.target.value }
                            handleInputChange('migrationHistory', updated)
                          }}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Destination"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Date</label>
                        <input
                          type="text"
                          value={migration.date || ''}
                          onChange={(e) => {
                            const updated = [...(formData.migrationHistory || [])]
                            updated[idx] = { ...updated[idx], date: e.target.value }
                            handleInputChange('migrationHistory', updated)
                          }}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                          placeholder="1960"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Reason</label>
                        <input
                          type="text"
                          value={migration.reason || ''}
                          onChange={(e) => {
                            const updated = [...(formData.migrationHistory || [])]
                            updated[idx] = { ...updated[idx], reason: e.target.value }
                            handleInputChange('migrationHistory', updated)
                          }}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Employment, education, etc."
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (formData.migrationHistory || []).filter((_, i) => i !== idx)
                        handleInputChange('migrationHistory', updated)
                      }}
                      className="mt-2 text-xs text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = [...(formData.migrationHistory || []), { from: '', to: '', date: '', reason: '' }]
                  handleInputChange('migrationHistory', updated)
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Migration Entry
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Other Life Events</label>
              <p className="text-xs text-gray-500 mb-2">Add other significant life events (e.g., Graduation, Coronation, Initiation, etc.)</p>
              <div className="space-y-3 mb-4">
                {(formData.otherLifeEvents || []).map((event, idx) => (
                  <div key={idx} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Event Name</label>
                        <input
                          type="text"
                          value={event.eventName || ''}
                          onChange={(e) => {
                            const updated = [...(formData.otherLifeEvents || [])]
                            updated[idx] = { ...updated[idx], eventName: e.target.value }
                            handleInputChange('otherLifeEvents', updated)
                          }}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                          placeholder="e.g., Graduation, Coronation"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Date</label>
                        <input
                          type="text"
                          value={event.eventDate || ''}
                          onChange={(e) => {
                            const updated = [...(formData.otherLifeEvents || [])]
                            updated[idx] = { ...updated[idx], eventDate: e.target.value }
                            handleInputChange('otherLifeEvents', updated)
                          }}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                          placeholder="1980 or 1980-05-20"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Place</label>
                        <input
                          type="text"
                          value={event.eventPlace || ''}
                          onChange={(e) => {
                            const updated = [...(formData.otherLifeEvents || [])]
                            updated[idx] = { ...updated[idx], eventPlace: e.target.value }
                            handleInputChange('otherLifeEvents', updated)
                          }}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Location"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Description</label>
                        <input
                          type="text"
                          value={event.eventDescription || ''}
                          onChange={(e) => {
                            const updated = [...(formData.otherLifeEvents || [])]
                            updated[idx] = { ...updated[idx], eventDescription: e.target.value }
                            handleInputChange('otherLifeEvents', updated)
                          }}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Brief description"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (formData.otherLifeEvents || []).filter((_, i) => i !== idx)
                        handleInputChange('otherLifeEvents', updated)
                      }}
                      className="mt-2 text-xs text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = [...(formData.otherLifeEvents || []), { eventName: '', eventDate: '', eventPlace: '', eventDescription: '' }]
                  handleInputChange('otherLifeEvents', updated)
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Life Event
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Displacement / Migration Notes</label>
              <textarea
                value={formData.displacementNotes || ''}
                onChange={(e) => handleInputChange('displacementNotes', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Historical displacement, migration, slave trade notes..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sensitiveHistoryPrivate"
                checked={formData.sensitiveHistoryPrivate || false}
                onChange={(e) => handleInputChange('sensitiveHistoryPrivate', e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="sensitiveHistoryPrivate" className="text-sm text-gray-700">
                Mark sensitive history as private
              </label>
            </div>
          </div>
        )}

        {/* 5. DOCUMENTATION TAB */}
        {activeTab === 5 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Documentation & Sources</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source Type</label>
              <select
                value={formData.sourceType || ''}
                onChange={(e) => handleInputChange('sourceType', e.target.value as SourceType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select source type</option>
                <option value="ORAL">Oral Tradition</option>
                <option value="CHURCH_RECORD">Church Record</option>
                <option value="PALACE_ARCHIVE">Palace Archive</option>
                <option value="CIVIL_REGISTRY">Civil Registry</option>
                <option value="FAMILY_DOCUMENT">Family Document</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source Details</label>
              <input
                type="text"
                value={formData.sourceDetails || ''}
                onChange={(e) => handleInputChange('sourceDetails', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., St. Mary's Catholic Church, Achina, Baptism Register 1945"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                value={formData.year || ''}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 1945, 1980"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Testifier Names (Elders/Validators)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleArrayAdd('testifierNames', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Add testifier name and press Enter"
                />
              </div>
              {formData.testifierNames && formData.testifierNames.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.testifierNames.map((name, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('testifierNames', idx)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Testifier Contact</label>
              <input
                type="text"
                value={formData.testifierContact || ''}
                onChange={(e) => handleInputChange('testifierContact', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Phone, email, or address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Scan IDs</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleArrayAdd('documentScanIds', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Add document ID and press Enter"
                />
              </div>
              {formData.documentScanIds && formData.documentScanIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.documentScanIds.map((id, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {id}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('documentScanIds', idx)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document URLs</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleArrayAdd('documentUrls', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Add document URL and press Enter"
                />
              </div>
              {formData.documentUrls && formData.documentUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.documentUrls.map((url, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Doc {idx + 1}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('documentUrls', idx)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Family Story / Narrative</label>
              <textarea
                value={formData.story || ''}
                onChange={(e) => handleInputChange('story', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={5}
                placeholder="Oral history, family narratives, important stories..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* 6. VERIFICATION TAB */}
        {activeTab === 6 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Verification & Privacy</h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Contact Information (Form Submitter)</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                  <input
                    type="email"
                    value={formData.submitterEmail || ''}
                    onChange={(e) => handleInputChange('submitterEmail', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Phone</label>
                  <input
                    type="tel"
                    value={formData.submitterPhone || ''}
                    onChange={(e) => handleInputChange('submitterPhone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="+234 801 234 5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Relationship to This Person</label>
                  <input
                    type="text"
                    value={formData.submitterRelationship || ''}
                    onChange={(e) => handleInputChange('submitterRelationship', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Self, Son, Daughter, Grandchild, etc."
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> You must provide consent to create a record.
                Verification level can be updated later by authorized validators.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consent Status <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="consentStatus"
                    checked={formData.consentStatus === true}
                    onChange={() => handleInputChange('consentStatus', true)}
                    className="w-4 h-4"
                  />
                  <span>I consent to storing this information</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="consentStatus"
                    checked={formData.consentStatus === false}
                    onChange={() => handleInputChange('consentStatus', false)}
                    className="w-4 h-4"
                  />
                  <span>I do not consent</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibility Setting</label>
              <select
                value={formData.visibilitySetting}
                onChange={(e) => handleInputChange('visibilitySetting', e.target.value as VisibilitySetting)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="PRIVATE">Private (Only family/admins can see)</option>
                <option value="PARTIAL">Partial (Some fields visible)</option>
                <option value="PUBLIC">Public (All verified fields visible)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Level</label>
              <select
                value={formData.verificationLevel}
                onChange={(e) => handleInputChange('verificationLevel', parseInt(e.target.value) as VerificationLevel)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value={0}>0 - Unverified (New entry)</option>
                <option value={1}>1 - Basic (Self-reported)</option>
                <option value={2}>2 - Verified (Checked by authority)</option>
                <option value={3}>3 - Authoritative (Multiple sources)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Level can be upgraded later by validators
              </p>
            </div>
          </div>
        )}

        {/* 2. CURRENT/DIASPORA LOCATION TAB */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Current/Diaspora Location</h3>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Is this person a diaspora relative? <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isDiasporaRelative"
                    checked={formData.isDiasporaRelative === true}
                    onChange={() => handleInputChange('isDiasporaRelative', true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Yes, in Diaspora</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isDiasporaRelative"
                    checked={formData.isDiasporaRelative === false}
                    onChange={() => handleInputChange('isDiasporaRelative', false)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>No, in Homeland</span>
                </label>
              </div>
            </div>

            {/* Current Location Hierarchy */}
            <div className="bg-green-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold mb-3 text-green-900">Current Residence (Hierarchical)</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Continent</label>
                  <input
                    type="text"
                    value={formData.currentContinent || ''}
                    onChange={(e) => handleInputChange('currentContinent', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="NORTH AMERICA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Sub-continent</label>
                  <input
                    type="text"
                    value={formData.currentSubContinent || ''}
                    onChange={(e) => handleInputChange('currentSubContinent', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="WEST AFRICA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Sub-region</label>
                  <input
                    type="text"
                    value={formData.currentSubRegion || ''}
                    onChange={(e) => handleInputChange('currentSubRegion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Nationality</label>
                  <input
                    type="text"
                    value={formData.currentNationality || ''}
                    onChange={(e) => handleInputChange('currentNationality', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="UNITED STATES"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Region</label>
                  <input
                    type="text"
                    value={formData.currentRegion || ''}
                    onChange={(e) => handleInputChange('currentRegion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current State</label>
                  <input
                    type="text"
                    value={formData.currentState || ''}
                    onChange={(e) => handleInputChange('currentState', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="TEXAS"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Senatorial District</label>
                  <input
                    type="text"
                    value={formData.currentSenatorialDistrict || ''}
                    onChange={(e) => handleInputChange('currentSenatorialDistrict', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Federal Constituency</label>
                  <input
                    type="text"
                    value={formData.currentFederalConstituency || ''}
                    onChange={(e) => handleInputChange('currentFederalConstituency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Local Govt Area</label>
                  <input
                    type="text"
                    value={formData.currentLocalGovernmentArea || ''}
                    onChange={(e) => handleInputChange('currentLocalGovernmentArea', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current State Constituency</label>
                  <input
                    type="text"
                    value={formData.currentStateConstituency || ''}
                    onChange={(e) => handleInputChange('currentStateConstituency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Town/City</label>
                  <input
                    type="text"
                    value={formData.currentTown || ''}
                    onChange={(e) => handleInputChange('currentTown', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="HOUSTON"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Town Division</label>
                  <input
                    type="text"
                    value={formData.currentTownDivision || ''}
                    onChange={(e) => handleInputChange('currentTownDivision', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Town Quarter</label>
                <input
                  type="text"
                  value={formData.currentTownQuarter || ''}
                  onChange={(e) => handleInputChange('currentTownQuarter', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Clan</label>
                  <input
                    type="text"
                    value={formData.currentClan || ''}
                    onChange={(e) => handleInputChange('currentClan', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Village</label>
                  <input
                    type="text"
                    value={formData.currentVillage || ''}
                    onChange={(e) => handleInputChange('currentVillage', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Hamlet</label>
                  <input
                    type="text"
                    value={formData.currentHamlet || ''}
                    onChange={(e) => handleInputChange('currentHamlet', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Kindred</label>
                  <input
                    type="text"
                    value={formData.currentKindred || ''}
                    onChange={(e) => handleInputChange('currentKindred', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Umunna</label>
                <input
                  type="text"
                  value={formData.currentUmunna || ''}
                  onChange={(e) => handleInputChange('currentUmunna', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {formData.isDiasporaRelative && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
                <h4 className="font-semibold mb-3 text-yellow-900">Diaspora & Connection</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Connection Status</label>
                    <select
                      value={formData.connectionStatus || 'NOT_APPLICABLE'}
                      onChange={(e) => handleInputChange('connectionStatus', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="NOT_APPLICABLE">Not Applicable</option>
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="CONNECTED">Connected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Case ID (if any)</label>
                    <input
                      type="text"
                      value={formData.diasporaConnectionCaseId || ''}
                      onChange={(e) => handleInputChange('diasporaConnectionCaseId', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Visit Status</label>
                    <select
                      value={formData.returnVisitStatus || 'NOT_PLANNED'}
                      onChange={(e) => handleInputChange('returnVisitStatus', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="NOT_PLANNED">Not Planned</option>
                      <option value="PLANNED">Planned</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Visit Date</label>
                    <input
                      type="text"
                      value={formData.returnVisitDate || ''}
                      onChange={(e) => handleInputChange('returnVisitDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Visit Notes</label>
                  <textarea
                    value={formData.returnVisitNotes || ''}
                    onChange={(e) => handleInputChange('returnVisitNotes', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={prevTab}
          disabled={activeTab === 0}
          className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {activeTab < FORM_TABS.length - 1 ? (
          <button
            type="button"
            onClick={nextTab}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || !formData.consentStatus}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Person Record'}
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  )
}

