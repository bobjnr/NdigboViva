'use client'

import { useState, useEffect } from 'react'
import {
  nigerianStates,
  townsData,
  villagesData,
  continents,
  countries,
  continentCountries,
  countryStates,
  townHierarchy,
  type LocationData,
  type GenealogyFormData
} from '@/lib/location-data'
import { genealogyDB, type GenealogyFormSubmission } from '@/lib/genealogy-database'
import { PersonFormSubmission, Gender, SourceType, VerificationLevel, VisibilitySetting } from '@/lib/person-schema'
import { MapPin, User, Mail, Phone, FileText, ArrowRight, CheckCircle, ChevronDown, ChevronUp, Award, Calendar, Shield, Globe } from 'lucide-react'

interface GenealogyFormProps {
  onSubmit: (data: GenealogyFormSubmission) => void
}

export default function GenealogyForm({ onSubmit }: GenealogyFormProps) {
  const [formData, setFormData] = useState<GenealogyFormSubmission>({
    currentContinent: '',
    currentCountry: '',
    currentState: '',
    currentLGA: '',
    currentTown: '',
    currentVillage: '',
    originState: '',
    originLGA: '',
    originTown: '',
    originVillage: '',
    originTownQuarter: '',
    originObiAreas: '',
    originClan: '',
    kindred: '',
    familyName: '',
    personalName: '',
    umunna: '',
    email: '',
    phone: '',
    additionalInfo: '',
    extendedFamilyMembers: []
  })

  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [availableStates, setAvailableStates] = useState<LocationData[]>([])
  const [availableLGAs, setAvailableLGAs] = useState<string[]>([])
  const [availableTowns, setAvailableTowns] = useState<string[]>([])
  const [availableVillages, setAvailableVillages] = useState<string[]>([])

  // Deep hierarchy state
  const [availableQuarters, setAvailableQuarters] = useState<string[]>([])
  const [availableObis, setAvailableObis] = useState<string[]>([])
  const [availableClans, setAvailableClans] = useState<string[]>([])
  const [availableKindreds, setAvailableKindreds] = useState<string[]>([])
  const [availableUmunnas, setAvailableUmunnas] = useState<string[]>([])

  // Manual entry flags
  const [isManualQuarter, setIsManualQuarter] = useState(false)
  const [isManualObi, setIsManualObi] = useState(false)
  const [isManualClan, setIsManualClan] = useState(false)
  const [isManualVillage, setIsManualVillage] = useState(false)
  const [isManualKindred, setIsManualKindred] = useState(false)
  const [isManualUmunna, setIsManualUmunna] = useState(false)

  const [originLGAs, setOriginLGAs] = useState<string[]>([])
  const [originTowns, setOriginTowns] = useState<string[]>([])
  const [originVillages, setOriginVillages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // New person-centric fields state
  const [showAdvancedFields, setShowAdvancedFields] = useState({
    identity: false,
    cultural: false,
    lifeEvents: false,
    documentation: false,
    verification: false,
    diaspora: false,
  })
  
  // Person form data (for new API)
  const [personData, setPersonData] = useState<Partial<PersonFormSubmission>>({
    gender: 'UNKNOWN',
    consentStatus: false,
    isDiasporaRelative: false,
    verificationLevel: 0,
    visibilitySetting: 'PRIVATE',
  })

  // Filter countries when continent changes
  useEffect(() => {
    if (formData.currentContinent) {
      const countriesInContinent = continentCountries[formData.currentContinent] || []
      setAvailableCountries(countriesInContinent)
      setFormData(prev => ({ ...prev, currentCountry: '', currentState: '', currentLGA: '', currentTown: '', currentVillage: '' }))
    } else {
      setAvailableCountries([])
    }
  }, [formData.currentContinent])

  // Filter states when country changes
  useEffect(() => {
    if (formData.currentCountry) {
      const statesInCountry = countryStates[formData.currentCountry] || []
      setAvailableStates(statesInCountry)
      setFormData(prev => ({ ...prev, currentState: '', currentLGA: '', currentTown: '', currentVillage: '' }))
    } else {
      setAvailableStates([])
    }
  }, [formData.currentCountry])

  // Auto-fill logic for current location
  useEffect(() => {
    if (formData.currentState) {
      const stateData = availableStates.find(state => state.state === formData.currentState)
      if (stateData) {
        setAvailableLGAs(stateData.lgas)
        setFormData(prev => ({ ...prev, currentLGA: '', currentTown: '', currentVillage: '' }))
      }
    }
  }, [formData.currentState, availableStates])

  useEffect(() => {
    if (formData.currentLGA && townsData[formData.currentLGA]) {
      setAvailableTowns(townsData[formData.currentLGA])
      setFormData(prev => ({ ...prev, currentTown: '', currentVillage: '' }))
    }
  }, [formData.currentLGA])

  useEffect(() => {
    if (formData.currentTown && villagesData[formData.currentTown]) {
      setAvailableVillages(villagesData[formData.currentTown])
      setFormData(prev => ({ ...prev, currentVillage: '' }))
    }
  }, [formData.currentTown])

  // Auto-fill logic for origin location
  useEffect(() => {
    if (formData.originState) {
      const stateData = nigerianStates.find(state => state.state === formData.originState)
      if (stateData) {
        setOriginLGAs(stateData.lgas)
        setFormData(prev => ({ ...prev, originLGA: '', originTown: '', originVillage: '' }))
      }
    }
  }, [formData.originState])

  useEffect(() => {
    if (formData.originLGA && townsData[formData.originLGA]) {
      setOriginTowns(townsData[formData.originLGA])
      setFormData(prev => ({ ...prev, originTown: '', originVillage: '' }))
    }
  }, [formData.originLGA])

  // Deep cascading logic for Origin

  // Town -> Quarter
  useEffect(() => {
    if (formData.originTown && townHierarchy[formData.originTown]) {
      const quarters = Object.keys(townHierarchy[formData.originTown].quarters)
      setAvailableQuarters(quarters)
      setIsManualQuarter(quarters.length === 0)
    } else {
      setAvailableQuarters([])
      setIsManualQuarter(true)
    }
    // Reset dependent fields if town changes (unless it's initial load/same value)
    // Note: We might want to be careful not to clear if user is just typing in manual mode
  }, [formData.originTown])

  // Quarter -> Obi
  useEffect(() => {
    if (formData.originTown && formData.originTownQuarter && townHierarchy[formData.originTown]?.quarters[formData.originTownQuarter]) {
      const obis = Object.keys(townHierarchy[formData.originTown].quarters[formData.originTownQuarter].obis)
      setAvailableObis(obis)
      setIsManualObi(obis.length === 0)
    } else {
      setAvailableObis([])
      setIsManualObi(true)
    }
  }, [formData.originTown, formData.originTownQuarter])

  // Obi -> Clan
  useEffect(() => {
    if (formData.originTown && formData.originTownQuarter && formData.originObiAreas &&
      townHierarchy[formData.originTown]?.quarters[formData.originTownQuarter]?.obis[formData.originObiAreas]) {
      const clans = Object.keys(townHierarchy[formData.originTown].quarters[formData.originTownQuarter].obis[formData.originObiAreas].clans)
      setAvailableClans(clans)
      setIsManualClan(clans.length === 0)
    } else {
      setAvailableClans([])
      setIsManualClan(true)
    }
  }, [formData.originTown, formData.originTownQuarter, formData.originObiAreas])

  // Clan -> Village
  useEffect(() => {
    if (formData.originTown && formData.originTownQuarter && formData.originObiAreas && formData.originClan &&
      townHierarchy[formData.originTown]?.quarters[formData.originTownQuarter]?.obis[formData.originObiAreas]?.clans[formData.originClan]) {
      const villages = Object.keys(townHierarchy[formData.originTown].quarters[formData.originTownQuarter].obis[formData.originObiAreas].clans[formData.originClan].villages)
      setOriginVillages(villages) // Update originVillages instead of availableVillages to match existing pattern
      setIsManualVillage(villages.length === 0)
    } else if (formData.originTown && townsData[formData.originLGA]?.includes(formData.originTown)) {
      // Fallback to existing flat village data if deep hierarchy path is broken/missing
      // But only if we are not in a deep path that just happens to have no villages
      // Actually, if we are in deep mode, we should stick to it?
      // The user said "Filter those that are filled completely, then those that aren't, the users will fill them in the form"
      // So if deep path fails, we fall back to manual or flat list?
      // Existing logic uses villagesData[formData.originTown].
      if (villagesData[formData.originTown]) {
        setOriginVillages(villagesData[formData.originTown])
        setIsManualVillage(false)
      } else {
        setOriginVillages([])
        setIsManualVillage(true)
      }
    } else {
      setOriginVillages([])
      setIsManualVillage(true)
    }
  }, [formData.originTown, formData.originTownQuarter, formData.originObiAreas, formData.originClan, formData.originLGA])

  // Village -> Kindred
  useEffect(() => {
    if (!formData.originTown) {
      setAvailableKindreds([])
      setIsManualKindred(true)
      return
    }

    // Need to traverse full path to get kindreds
    const town = townHierarchy[formData.originTown]
    const quarter = formData.originTownQuarter ? town?.quarters[formData.originTownQuarter] : undefined
    const obi = formData.originObiAreas ? quarter?.obis[formData.originObiAreas] : undefined
    const clan = formData.originClan ? obi?.clans[formData.originClan] : undefined
    const village = formData.originVillage ? clan?.villages[formData.originVillage] : undefined

    if (village) {
      const kindreds = Object.keys(village.kindreds)
      setAvailableKindreds(kindreds)
      setIsManualKindred(kindreds.length === 0)
    } else {
      setAvailableKindreds([])
      setIsManualKindred(true)
    }
  }, [formData.originTown, formData.originTownQuarter, formData.originObiAreas, formData.originClan, formData.originVillage])

  // Kindred -> Umunna
  useEffect(() => {
    if (!formData.originTown) {
      setAvailableUmunnas([])
      setIsManualUmunna(true)
      return
    }

    const town = townHierarchy[formData.originTown]
    const quarter = formData.originTownQuarter ? town?.quarters[formData.originTownQuarter] : undefined
    const obi = formData.originObiAreas ? quarter?.obis[formData.originObiAreas] : undefined
    const clan = formData.originClan ? obi?.clans[formData.originClan] : undefined
    const village = formData.originVillage ? clan?.villages[formData.originVillage] : undefined
    const umunnas = formData.kindred ? village?.kindreds[formData.kindred] : undefined

    if (umunnas) {
      setAvailableUmunnas(umunnas)
      setIsManualUmunna(umunnas.length === 0)
    } else {
      setAvailableUmunnas([])
      setIsManualUmunna(true)
    }
  }, [formData.originTown, formData.originTownQuarter, formData.originObiAreas, formData.originClan, formData.originVillage, formData.kindred])

  const handleInputChange = (field: keyof GenealogyFormSubmission, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePersonFieldChange = (field: keyof PersonFormSubmission, value: any) => {
    setPersonData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayAdd = (field: keyof PersonFormSubmission, value: string) => {
    if (!value.trim()) return
    const current = (personData[field] as string[]) || []
    if (!current.includes(value.trim())) {
      setPersonData(prev => ({ 
        ...prev, 
        [field]: [...current, value.trim()] 
      }))
    }
  }

  const handleArrayRemove = (field: keyof PersonFormSubmission, index: number) => {
    const current = (personData[field] as string[]) || []
    setPersonData(prev => ({ 
      ...prev, 
      [field]: current.filter((_, i) => i !== index) 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Build person form submission from both old and new fields
      const fullName = `${formData.personalName} ${formData.familyName}`.trim()
      
      if (!fullName) {
        alert('Please enter your name')
        setIsSubmitting(false)
        return
      }

      if (!personData.consentStatus) {
        alert('You must provide consent to create a record')
        setIsSubmitting(false)
        return
      }

      // Create person record using new API
      const personSubmission: PersonFormSubmission = {
        // Identity
        fullName,
        alternateNames: personData.alternateNames,
        gender: personData.gender || 'UNKNOWN',
        dateOfBirth: personData.dateOfBirth,
        placeOfBirth: formData.originVillage || formData.originTown,
        photoUrl: personData.photoUrl,
        photoConsent: personData.photoConsent || false,
        
        // Lineage (from existing form)
        umunna: formData.umunna,
        clan: formData.originClan,
        village: formData.originVillage,
        kindred: formData.kindred,
        town: formData.originTown,
        townQuarter: formData.originTownQuarter,
        obiAreas: formData.originObiAreas,
        localGovernmentArea: formData.originLGA,
        state: formData.originState,
        nwaadaLineageLink: personData.nwaadaLineageLink,
        
        // Cultural
        titles: personData.titles,
        occupation: personData.occupation,
        familyTrade: personData.familyTrade,
        totem: personData.totem,
        ancestralHouseName: personData.ancestralHouseName,
        notableContributions: personData.notableContributions,
        roles: personData.roles,
        
        // Life Events
        marriageDate: personData.marriageDate,
        marriagePlace: personData.marriagePlace,
        deathDate: personData.deathDate,
        deathPlace: personData.deathPlace,
        isDeceased: personData.isDeceased || false,
        migrationHistory: personData.migrationHistory,
        displacementNotes: personData.displacementNotes,
        sensitiveHistoryPrivate: personData.sensitiveHistoryPrivate || false,
        
        // Documentation
        sourceType: personData.sourceType,
        sourceDetails: personData.sourceDetails,
        testifierNames: personData.testifierNames,
        testifierContact: personData.testifierContact,
        documentScanIds: personData.documentScanIds,
        documentUrls: personData.documentUrls,
        story: formData.additionalInfo || personData.story,
        notes: personData.notes,
        
        // Verification
        verificationLevel: personData.verificationLevel || 0,
        consentStatus: personData.consentStatus,
        visibilitySetting: personData.visibilitySetting || 'PRIVATE',
        
        // Diaspora
        isDiasporaRelative: personData.isDiasporaRelative || (formData.currentCountry !== 'Nigeria'),
        countryOfResidence: formData.currentCountry !== 'Nigeria' ? formData.currentCountry : personData.countryOfResidence,
        currentCity: formData.currentTown || personData.currentCity,
        currentState: formData.currentState || personData.currentState,
        diasporaConnectionCaseId: personData.diasporaConnectionCaseId,
        connectionStatus: personData.connectionStatus || 'NOT_APPLICABLE',
        returnVisitStatus: personData.returnVisitStatus,
        returnVisitDate: personData.returnVisitDate,
        returnVisitNotes: personData.returnVisitNotes,
        
        // Contact
        submitterEmail: formData.email,
        submitterPhone: formData.phone,
        submitterRelationship: personData.submitterRelationship,
      }

      // Create person record via new API
      const personResponse = await fetch('/api/persons/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personSubmission),
      })

      const personResult = await personResponse.json()

      if (!personResult.success) {
        throw new Error(personResult.error || 'Failed to create person record')
      }

      // Store person ID for success message
      setPersonData(prev => ({ ...prev, createdPersonId: personResult.personId }))

      // Also send email notification (keep old flow for now)
      try {
        await fetch('/api/genealogy/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      } catch (emailError) {
        console.warn('Email notification failed:', emailError)
      }

      // Call the onSubmit callback
      onSubmit(formData)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit form. Please try again.')
      setIsSubmitted(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    const personId = (personData as any).createdPersonId
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Thank You for Tracing Your Roots!
        </h3>
        <p className="text-gray-600 mb-4">
          Your genealogy information has been submitted successfully. A personalized email with your submission details and next steps will be sent to you shortly.
        </p>
        
        {personId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-blue-900 mb-2">Your Person Record ID:</p>
            <p className="text-xs font-mono text-blue-700 bg-blue-100 px-3 py-2 rounded mb-3">
              {personId}
            </p>
            <p className="text-xs text-blue-800 mb-3">
              Save this ID to view your family tree or update your information later.
            </p>
            <div className="flex gap-2 justify-center">
              <a
                href={`/genealogy/person/${personId}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                View My Record
              </a>
              <a
                href={`/genealogy/tree/${personId}`}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                View Family Tree
              </a>
              <a
                href="/genealogy/search"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Search Database
              </a>
            </div>
          </div>
        )}
        
        <button
          onClick={() => {
            setIsSubmitted(false)
            setFormData({
              currentContinent: '',
              currentCountry: '',
              currentState: '',
              currentLGA: '',
              currentTown: '',
              currentVillage: '',
              originState: '',
              originLGA: '',
              originTown: '',
              originVillage: '',
              originTownQuarter: '',
              originObiAreas: '',
              originClan: '',
              kindred: '',
              familyName: '',
              personalName: '',
              umunna: '',
              email: '',
              phone: '',
              additionalInfo: '',
              extendedFamilyMembers: []
            })
            setPersonData({
              gender: 'UNKNOWN',
              consentStatus: false,
              isDiasporaRelative: false,
              verificationLevel: 0,
              visibilitySetting: 'PRIVATE',
            })
          }}
          className="bg-brand-gold hover:bg-brand-gold-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Submit Another Entry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-brand-gold" />
          Current Location
        </h3>
        <p className="text-gray-600">Where do you currently live?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Continent *
          </label>
          <select
            value={formData.currentContinent}
            onChange={(e) => handleInputChange('currentContinent', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            required
          >
            <option value="">Select Continent</option>
            {[...new Set(continents)].map(continent => (
              <option key={continent} value={continent}>{continent}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <select
            value={formData.currentCountry}
            onChange={(e) => handleInputChange('currentCountry', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            required
            disabled={!availableCountries.length}
          >
            <option value="">Select Country</option>
            {[...new Set(availableCountries)].map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {formData.currentCountry === 'Nigeria' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State / County *
              </label>
              <select
                value={formData.currentState}
                onChange={(e) => handleInputChange('currentState', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                required
              >
                <option value="">Select State / County</option>
                {[...new Set(availableStates.map(s => s.state))].map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-brand-forest" />
          Origin Location
        </h3>
        <p className="text-gray-600">Where are your Igbo roots from?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State of Origin *
          </label>
          <select
            value={formData.originState}
            onChange={(e) => handleInputChange('originState', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            required
          >
            <option value="">Select State</option>
            {[...new Set(nigerianStates.map(s => s.state))].map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LGA of Origin *
          </label>
          <select
            value={formData.originLGA}
            onChange={(e) => handleInputChange('originLGA', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            required
            disabled={!originLGAs.length}
          >
            <option value="">Select LGA</option>
            {[...new Set(originLGAs)].map(lga => (
              <option key={lga} value={lga}>{lga}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Town of Origin *
          </label>
          <select
            value={formData.originTown}
            onChange={(e) => handleInputChange('originTown', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            required
            disabled={!originTowns.length}
          >
            <option value="">Select Town</option>
            {[...new Set(originTowns)].map(town => (
              <option key={town} value={town}>{town}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Town Quarter
          </label>
          {availableQuarters.length > 0 && !isManualQuarter ? (
            <div className="space-y-2">
              <select
                value={formData.originTownQuarter}
                onChange={(e) => {
                  if (e.target.value === 'OTHER') {
                    setIsManualQuarter(true)
                    handleInputChange('originTownQuarter', '')
                  } else {
                    handleInputChange('originTownQuarter', e.target.value)
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value="">Select Quarter</option>
                {[...new Set(availableQuarters)].map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
                <option value="OTHER">Other (Enter Manually)</option>
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={formData.originTownQuarter}
                onChange={(e) => handleInputChange('originTownQuarter', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                placeholder="e.g., EZI, UGBO, etc."
              />
              {availableQuarters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsManualQuarter(false)}
                  className="text-sm text-brand-gold hover:underline"
                >
                  Back to list
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Obi Areas (Optional)
          </label>
          {availableObis.length > 0 && !isManualObi ? (
            <div className="space-y-2">
              <select
                value={formData.originObiAreas}
                onChange={(e) => {
                  if (e.target.value === 'OTHER') {
                    setIsManualObi(true)
                    handleInputChange('originObiAreas', '')
                  } else {
                    handleInputChange('originObiAreas', e.target.value)
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value="">Select Obi Area</option>
                {[...new Set(availableObis)].map(obi => (
                  <option key={obi} value={obi}>{obi}</option>
                ))}
                <option value="OTHER">Other (Enter Manually)</option>
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={formData.originObiAreas}
                onChange={(e) => handleInputChange('originObiAreas', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                placeholder="e.g., AMAMU, etc."
              />
              {availableObis.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsManualObi(false)}
                  className="text-sm text-brand-gold hover:underline"
                >
                  Back to list
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clan
          </label>
          {availableClans.length > 0 && !isManualClan ? (
            <div className="space-y-2">
              <select
                value={formData.originClan}
                onChange={(e) => {
                  if (e.target.value === 'OTHER') {
                    setIsManualClan(true)
                    handleInputChange('originClan', '')
                  } else {
                    handleInputChange('originClan', e.target.value)
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value="">Select Clan</option>
                {[...new Set(availableClans)].map(clan => (
                  <option key={clan} value={clan}>{clan}</option>
                ))}
                <option value="OTHER">Other (Enter Manually)</option>
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={formData.originClan}
                onChange={(e) => handleInputChange('originClan', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                placeholder="e.g., DIOHA, etc."
              />
              {availableClans.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsManualClan(false)}
                  className="text-sm text-brand-gold hover:underline"
                >
                  Back to list
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Village of Origin
          </label>
          {availableVillages.length > 0 && !isManualVillage ? (
            <div className="space-y-2">
              <select
                value={formData.originVillage}
                onChange={(e) => {
                  if (e.target.value === 'OTHER') {
                    setIsManualVillage(true)
                    handleInputChange('originVillage', '')
                  } else {
                    handleInputChange('originVillage', e.target.value)
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                disabled={!originVillages.length && !availableVillages.length}
              >
                <option value="">Select Village</option>
                {[...new Set((originVillages.length > 0 ? originVillages : availableVillages))].map(village => (
                  <option key={village} value={village}>{village}</option>
                ))}
                <option value="OTHER">Other (Enter Manually)</option>
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={formData.originVillage}
                onChange={(e) => handleInputChange('originVillage', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                placeholder="Enter Village"
              />
              {(originVillages.length > 0 || availableVillages.length > 0) && (
                <button
                  type="button"
                  onClick={() => setIsManualVillage(false)}
                  className="text-sm text-brand-gold hover:underline"
                >
                  Back to list
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <User className="w-6 h-6 mr-2 text-brand-bronze" />
          Extended Family Information (Umunna)
        </h3>
        <p className="text-gray-600">Tell us about your extended family</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kindred/Hamlet *
          </label>
          {availableKindreds.length > 0 && !isManualKindred ? (
            <div className="space-y-2">
              <select
                value={formData.kindred}
                onChange={(e) => {
                  if (e.target.value === 'OTHER') {
                    setIsManualKindred(true)
                    handleInputChange('kindred', '')
                  } else {
                    handleInputChange('kindred', e.target.value)
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value="">Select Kindred</option>
                {[...new Set(availableKindreds)].map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
                <option value="OTHER">Other (Enter Manually)</option>
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={formData.kindred}
                onChange={(e) => handleInputChange('kindred', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                placeholder="e.g., UMUNNEBOGBU, UMUOKPARAUGHANZE"
                required={availableKindreds.length === 0}
              />
              {availableKindreds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsManualKindred(false)}
                  className="text-sm text-brand-gold hover:underline"
                >
                  Back to list
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Umunna (Extended Family Group)
          </label>
          {availableUmunnas.length > 0 && !isManualUmunna ? (
            <div className="space-y-2">
              <select
                value={formData.umunna}
                onChange={(e) => {
                  if (e.target.value === 'OTHER') {
                    setIsManualUmunna(true)
                    handleInputChange('umunna', '')
                  } else {
                    handleInputChange('umunna', e.target.value)
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value="">Select Umunna</option>
                {[...new Set(availableUmunnas)].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
                <option value="OTHER">Other (Enter Manually)</option>
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={formData.umunna}
                onChange={(e) => handleInputChange('umunna', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                placeholder="e.g., UMUAHIBAEKWE, UMUNNEMOLISA"
              />
              {availableUmunnas.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsManualUmunna(false)}
                  className="text-sm text-brand-gold hover:underline"
                >
                  Back to list
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Family Name *
          </label>
          <input
            type="text"
            value={formData.familyName}
            onChange={(e) => handleInputChange('familyName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            placeholder="Your surname"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personal Name *
          </label>
          <input
            type="text"
            value={formData.personalName}
            onChange={(e) => handleInputChange('personalName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            placeholder="Your first name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-5 h-5 inline mr-2" />
          Additional Information / Family Story
        </label>
        <textarea
          value={formData.additionalInfo}
          onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
          placeholder="Any additional information about your family history, traditions, or stories you'd like to share..."
        />
      </div>

      {/* Advanced Fields - Expandable Sections */}
      <div className="space-y-4 mb-8">
        <p className="text-sm text-gray-600 italic">
          💡 <strong>Optional:</strong> Expand the sections below to provide more detailed information about this person. 
          This helps build a more complete family tree and preserve Igbo cultural heritage.
        </p>

        {/* Identity Details */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setShowAdvancedFields(prev => ({ ...prev, identity: !prev.identity }))}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-brand-gold" />
              <span className="font-semibold text-gray-900">Identity Details</span>
            </div>
            {showAdvancedFields.identity ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {showAdvancedFields.identity && (
            <div className="p-6 space-y-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={personData.gender || 'UNKNOWN'}
                    onChange={(e) => handlePersonFieldChange('gender', e.target.value as Gender)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="UNKNOWN">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="text"
                    value={personData.dateOfBirth || ''}
                    onChange={(e) => handlePersonFieldChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="1945, 1945-03, or 1945-03-15"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Names / Spellings</label>
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
                {personData.alternateNames && personData.alternateNames.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {personData.alternateNames.map((name, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {name}
                        <button type="button" onClick={() => handleArrayRemove('alternateNames', idx)} className="text-blue-600">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cultural Identity */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setShowAdvancedFields(prev => ({ ...prev, cultural: !prev.cultural }))}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-brand-gold" />
              <span className="font-semibold text-gray-900">Cultural Identity</span>
            </div>
            {showAdvancedFields.cultural ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {showAdvancedFields.cultural && (
            <div className="p-6 space-y-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titles (Ozo, Nze, Lolo, Ichie, etc.)</label>
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
                    placeholder="Add title and press Enter"
                  />
                </div>
                {personData.titles && personData.titles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {personData.titles.map((title, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {title}
                        <button type="button" onClick={() => handleArrayRemove('titles', idx)} className="text-purple-600">×</button>
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
                    value={personData.occupation || ''}
                    onChange={(e) => handlePersonFieldChange('occupation', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Family Trade</label>
                  <input
                    type="text"
                    value={personData.familyTrade || ''}
                    onChange={(e) => handlePersonFieldChange('familyTrade', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Totem / Sacred Animal</label>
                <input
                  type="text"
                  value={personData.totem || ''}
                  onChange={(e) => handlePersonFieldChange('totem', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="LEOPARD, PYTHON, EAGLE, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ancestral House/Compound Name</label>
                <input
                  type="text"
                  value={personData.ancestralHouseName || ''}
                  onChange={(e) => handlePersonFieldChange('ancestralHouseName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Life Events */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setShowAdvancedFields(prev => ({ ...prev, lifeEvents: !prev.lifeEvents }))}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-brand-gold" />
              <span className="font-semibold text-gray-900">Life Events</span>
            </div>
            {showAdvancedFields.lifeEvents ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {showAdvancedFields.lifeEvents && (
            <div className="p-6 space-y-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marriage Date</label>
                  <input
                    type="text"
                    value={personData.marriageDate || ''}
                    onChange={(e) => handlePersonFieldChange('marriageDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="1970-05-20 or 1970"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marriage Place</label>
                  <input
                    type="text"
                    value={personData.marriagePlace || ''}
                    onChange={(e) => handlePersonFieldChange('marriagePlace', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Death Date</label>
                  <input
                    type="text"
                    value={personData.deathDate || ''}
                    onChange={(e) => handlePersonFieldChange('deathDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Death Place</label>
                  <input
                    type="text"
                    value={personData.deathPlace || ''}
                    onChange={(e) => handlePersonFieldChange('deathPlace', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDeceased"
                  checked={personData.isDeceased || false}
                  onChange={(e) => handlePersonFieldChange('isDeceased', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="isDeceased" className="text-sm text-gray-700">Person is deceased</label>
              </div>
            </div>
          )}
        </div>

        {/* Documentation & Sources */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setShowAdvancedFields(prev => ({ ...prev, documentation: !prev.documentation }))}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-brand-gold" />
              <span className="font-semibold text-gray-900">Documentation & Sources</span>
            </div>
            {showAdvancedFields.documentation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {showAdvancedFields.documentation && (
            <div className="p-6 space-y-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Type</label>
                <select
                  value={personData.sourceType || ''}
                  onChange={(e) => handlePersonFieldChange('sourceType', e.target.value as SourceType)}
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
                {personData.testifierNames && personData.testifierNames.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {personData.testifierNames.map((name, idx) => (
                      <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {name}
                        <button type="button" onClick={() => handleArrayRemove('testifierNames', idx)} className="text-green-600">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Verification & Privacy */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setShowAdvancedFields(prev => ({ ...prev, verification: !prev.verification }))}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-brand-gold" />
              <span className="font-semibold text-gray-900">Privacy & Verification</span>
            </div>
            {showAdvancedFields.verification ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {showAdvancedFields.verification && (
            <div className="p-6 space-y-4 border-t border-gray-200">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> You must provide consent to create a record. Verification level can be updated later by authorized validators.
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
                      checked={personData.consentStatus === true}
                      onChange={() => handlePersonFieldChange('consentStatus', true)}
                      className="w-4 h-4"
                    />
                    <span>I consent to storing this information</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="consentStatus"
                      checked={personData.consentStatus === false}
                      onChange={() => handlePersonFieldChange('consentStatus', false)}
                      className="w-4 h-4"
                    />
                    <span>I do not consent</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility Setting</label>
                <select
                  value={personData.visibilitySetting || 'PRIVATE'}
                  onChange={(e) => handlePersonFieldChange('visibilitySetting', e.target.value as VisibilitySetting)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="PRIVATE">Private (Only family/admins can see)</option>
                  <option value="PARTIAL">Partial (Some fields visible)</option>
                  <option value="PUBLIC">Public (All verified fields visible)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Diaspora Information */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setShowAdvancedFields(prev => ({ ...prev, diaspora: !prev.diaspora }))}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-brand-gold" />
              <span className="font-semibold text-gray-900">Diaspora Information</span>
            </div>
            {showAdvancedFields.diaspora ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {showAdvancedFields.diaspora && (
            <div className="p-6 space-y-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Is this person a diaspora relative?
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="isDiasporaRelative"
                      checked={personData.isDiasporaRelative === true || formData.currentCountry !== 'Nigeria'}
                      onChange={() => handlePersonFieldChange('isDiasporaRelative', true)}
                      className="w-4 h-4"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="isDiasporaRelative"
                      checked={personData.isDiasporaRelative === false && formData.currentCountry === 'Nigeria'}
                      onChange={() => handlePersonFieldChange('isDiasporaRelative', false)}
                      className="w-4 h-4"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              {(personData.isDiasporaRelative || formData.currentCountry !== 'Nigeria') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Visit Status</label>
                    <select
                      value={personData.returnVisitStatus || ''}
                      onChange={(e) => handlePersonFieldChange('returnVisitStatus', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select status</option>
                      <option value="PLANNED">Planned</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="NOT_PLANNED">Not Planned</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Visit Notes</label>
                    <textarea
                      value={personData.returnVisitNotes || ''}
                      onChange={(e) => handlePersonFieldChange('returnVisitNotes', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                      placeholder="Reconnection experience, visit story..."
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          * Required fields
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-gold hover:bg-brand-gold-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              Submit Genealogy Information
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
