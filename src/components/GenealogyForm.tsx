'use client'

import { useState, useEffect } from 'react'
import { 
  nigerianStates, 
  townsData, 
  villagesData, 
  continents,
  countries, 
  type GenealogyFormData 
} from '@/lib/location-data'
import { genealogyDB, type GenealogyFormSubmission } from '@/lib/genealogy-database'
import { MapPin, User, Mail, Phone, FileText, ArrowRight, CheckCircle } from 'lucide-react'

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

  const [availableLGAs, setAvailableLGAs] = useState<string[]>([])
  const [availableTowns, setAvailableTowns] = useState<string[]>([])
  const [availableVillages, setAvailableVillages] = useState<string[]>([])
  const [originLGAs, setOriginLGAs] = useState<string[]>([])
  const [originTowns, setOriginTowns] = useState<string[]>([])
  const [originVillages, setOriginVillages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Auto-fill logic for current location
  useEffect(() => {
    if (formData.currentState) {
      const stateData = nigerianStates.find(state => state.state === formData.currentState)
      if (stateData) {
        setAvailableLGAs(stateData.lgas)
        setFormData(prev => ({ ...prev, currentLGA: '', currentTown: '', currentVillage: '' }))
      }
    }
  }, [formData.currentState])

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

  useEffect(() => {
    if (formData.originTown && villagesData[formData.originTown]) {
      setOriginVillages(villagesData[formData.originTown])
      setFormData(prev => ({ ...prev, originVillage: '' }))
    }
  }, [formData.originTown])

  const handleInputChange = (field: keyof GenealogyFormSubmission, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Convert form data to database record
      const record = genealogyDB.convertFormToRecord(formData)
      
      // Add to database
      genealogyDB.addRecord(record)
      
      // Send email via Mailchimp
      const emailResponse = await fetch('/api/genealogy/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const emailResult = await emailResponse.json()

      if (!emailResult.success) {
        console.error('Email sending failed:', emailResult.error)
        // Still show success for form submission, but log email error
      }
      
      // Call the onSubmit callback
      onSubmit(formData)
      setIsSubmitted(true)
      
      console.log('Genealogy record added:', record)
      console.log('Current database records:', genealogyDB.getAllRecords().length)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Thank You for Tracing Your Roots!
        </h3>
        <p className="text-gray-600 mb-6">
          Your genealogy information has been submitted successfully. A personalized email with your submission details and next steps will be sent to you shortly.
        </p>
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
            {continents.map(continent => (
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
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {formData.currentCountry === 'Nigeria' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                value={formData.currentState}
                onChange={(e) => handleInputChange('currentState', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                required
              >
                <option value="">Select State</option>
                {nigerianStates.map(state => (
                  <option key={state.state} value={state.state}>{state.state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LGA *
              </label>
              <select
                value={formData.currentLGA}
                onChange={(e) => handleInputChange('currentLGA', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                required
                disabled={!availableLGAs.length}
              >
                <option value="">Select LGA</option>
                {availableLGAs.map(lga => (
                  <option key={lga} value={lga}>{lga}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Town *
              </label>
              <select
                value={formData.currentTown}
                onChange={(e) => handleInputChange('currentTown', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                required
                disabled={!availableTowns.length}
              >
                <option value="">Select Town</option>
                {availableTowns.map(town => (
                  <option key={town} value={town}>{town}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Village
              </label>
              <select
                value={formData.currentVillage}
                onChange={(e) => handleInputChange('currentVillage', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                disabled={!availableVillages.length}
              >
                <option value="">Select Village</option>
                {availableVillages.map(village => (
                  <option key={village} value={village}>{village}</option>
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
            {nigerianStates.map(state => (
              <option key={state.state} value={state.state}>{state.state}</option>
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
            {originLGAs.map(lga => (
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
            {originTowns.map(town => (
              <option key={town} value={town}>{town}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Town Quarter
          </label>
          <input
            type="text"
            value={formData.originTownQuarter}
            onChange={(e) => handleInputChange('originTownQuarter', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            placeholder="e.g., EZI, UGBO, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Village of Origin
          </label>
          <select
            value={formData.originVillage}
            onChange={(e) => handleInputChange('originVillage', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            disabled={!originVillages.length}
          >
            <option value="">Select Village</option>
            {originVillages.map(village => (
              <option key={village} value={village}>{village}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Obi Areas (Optional)
          </label>
          <input
            type="text"
            value={formData.originObiAreas}
            onChange={(e) => handleInputChange('originObiAreas', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            placeholder="e.g., AMAMU, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clan
          </label>
          <input
            type="text"
            value={formData.originClan}
            onChange={(e) => handleInputChange('originClan', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            placeholder="e.g., DIOHA, etc."
          />
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
          <input
            type="text"
            value={formData.kindred}
            onChange={(e) => handleInputChange('kindred', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            placeholder="e.g., UMUNNEBOGBU, UMUOKPARAUGHANZE"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Umunna (Extended Family Group)
          </label>
          <input
            type="text"
            value={formData.umunna}
            onChange={(e) => handleInputChange('umunna', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            placeholder="e.g., UMUAHIBAEKWE, UMUNNEMOLISA"
          />
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
          Additional Information
        </label>
        <textarea
          value={formData.additionalInfo}
          onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
          placeholder="Any additional information about your family history, traditions, or stories you'd like to share..."
        />
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
