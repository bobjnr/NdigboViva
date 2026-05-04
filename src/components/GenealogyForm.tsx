'use client'

import { useState, useEffect } from 'react'
import csvDropdownData from '@/lib/csv-dropdown-data.json'
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
import { getWardOptions } from '@/lib/nigeria-dropdown-utils'
import { genealogyDB, type GenealogyFormSubmission } from '@/lib/genealogy-database'
import diasporaOriginData from '@/lib/diaspora-origin-data.json'
import {
  continentSubContinents,
  culturalRegionsByContinent,
  geopoliticalBlocs,
  nigerianGeoZones,
  getRegionByState,
  senatorialDistricts,
  federalConstituencies,
  federalConstituenciesByStateAndSenatorialDistrict,
  stateConstituenciesByState,
  stateConstituenciesByStateAndFederalConstituency
} from '@/lib/extended-location-data'
import { PersonFormSubmission, Gender, SourceType, VerificationLevel, VisibilitySetting } from '@/lib/person-schema'
import type { OntologyEntity } from '@/lib/ontology-types'
import { useOntologyChildren } from '@/lib/use-ontology-children'
import { MapPin, User, Mail, Phone, FileText, ArrowRight, CheckCircle, ChevronDown, ChevronUp, Award, Calendar, Shield, Globe, Trash2, Plus } from 'lucide-react'
interface GenealogyFormProps {
  onSubmit: (data: GenealogyFormSubmission) => void
}

function normalizeOntologyLabel(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
}

function getOntologyEntityLabel(entity: OntologyEntity): string {
  return entity.displayName || entity.name
}

function findOntologyEntityByLabel(entities: OntologyEntity[], value: string | null | undefined): OntologyEntity | null {
  const normalizedValue = normalizeOntologyLabel(value)
  if (!normalizedValue) return null
  return (
    entities.find((entity) => normalizeOntologyLabel(getOntologyEntityLabel(entity)) === normalizedValue) ?? null
  )
}

export default function GenealogyForm({ onSubmit }: GenealogyFormProps) {
  const [formData, setFormData] = useState<GenealogyFormSubmission>({
    // Default to Nigeria flow (non-diaspora) on first load
    currentContinent: 'Africa',
    currentSubContinent: '',
    currentNationality: '',
    currentCountry: 'Nigeria',
    currentRegion: '',
    currentSubRegion: '',
    currentState: '',
    currentSenatorialDistrict: '',
    currentFederalConstituency: '',
    currentLGA: '',
    currentTown: '',
    currentVillage: '',
    currentStateConstituency: '',
    currentTownQuarter: '',
    currentPoliticalWard: '',
    currentIgboOrganizations: '',
    citizenshipStatus: '',

    originContinent: 'Africa',
    originSubContinent: '',
    originEconomicRegion: '',
    originGeopoliticalBloc: '',
    originNationality: '',
    originRegion: '',
    originSubRegion: '',
    originState: '',
    originSenatorialDistrict: '',
    originFederalConstituency: '',
    originStateConstituency: '',
    originLGA: '',
    originTown: '',
    originTownDivision: '',
    originTownLevel1: '',
    originTownLevel2: '',
    originTownLevel3: '',
    originTownLevel4: '',
    originWard: '',
    originTownQuarter: '',
    originObiAreas: '',
    originClan: '',
    originVillage: '',
    originHamlet: '',
    originKindred: '',
    originUmunna: '',

    // Diaspora Origin fields
    originType: 'nigerian',
    diasporaAncestralCountry: '',
    diasporaAncestralRegion: '',
    diasporaAncestralDistrict: '',
    diasporaAncestralTown: '',
    diasporaEthnicIdentity: '',
    diasporaAssociatedEthnicIdentity: '',
    diasporaMigrationNarrative: '',
    diasporaSpeaksIgbo: '',
    diasporaSpeaksEthnicLanguage: '',
    diasporaVisitedNigeria: '',
    diasporaKnowsAncestralTown: '',

    kindred: '',
    familyName: '',
    personalName: '',
    fatherName: '',
    motherName: '',
    umunna: '',
    email: '',
    phone: '',
    additionalInfo: '', // Kept for state compatibility, UI removed
    dualCitizenshipCountry: '',
    originNationalityCustom: '',
    extendedFamilyMembers: []
  })

  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [availableStates, setAvailableStates] = useState<LocationData[]>([])
  const [availableLGAs, setAvailableLGAs] = useState<string[]>([])
  const [availableTowns, setAvailableTowns] = useState<string[]>([])
  const [availableWards, setAvailableWards] = useState<string[]>([])
  const [availableVillages, setAvailableVillages] = useState<string[]>([])

  // Ontology (Firestore) data for dropdowns — used when political data has been imported
  const useOntologyForNigeria = formData.currentCountry === 'Nigeria' || formData.originType !== 'diaspora'
  const ontologyStates = useOntologyChildren(useOntologyForNigeria ? 'CO-NGA' : null, 'STATE')
  const currentStateId = ontologyStates.data?.find((e) => (e.displayName || e.name) === formData.currentState)?.id ?? null
  const ontologyLgasCurrent = useOntologyChildren(currentStateId, 'LGA')
  const currentLgaId = ontologyLgasCurrent.data?.find((e) => (e.displayName || e.name) === formData.currentLGA)?.id ?? null
  const ontologyWardsCurrent = useOntologyChildren(currentLgaId, 'WARD')
  const ontologyTownsCurrent = useOntologyChildren(currentLgaId, 'TOWN')
  const originStateId = ontologyStates.data?.find((e) => (e.displayName || e.name) === formData.originState)?.id ?? null
  const ontologyLgasOrigin = useOntologyChildren(originStateId, 'LGA')
  const originLgaId = ontologyLgasOrigin.data?.find((e) => (e.displayName || e.name) === formData.originLGA)?.id ?? null
  const ontologyWardsOrigin = useOntologyChildren(originLgaId, 'WARD')
  const ontologyTownsOrigin = useOntologyChildren(originLgaId, 'TOWN')
  const originTownEntity = findOntologyEntityByLabel(ontologyTownsOrigin.data, formData.originTown)
  const originTownId = originTownEntity?.id ?? null
  const ontologyClansOrigin = useOntologyChildren(originTownId, 'CLAN')
  const originClanEntity = findOntologyEntityByLabel(ontologyClansOrigin.data, formData.originClan)
  const originClanId = originClanEntity?.id ?? null
  const ontologyVillagesOrigin = useOntologyChildren(originClanId, 'VILLAGE')
  const originVillageEntity = findOntologyEntityByLabel(ontologyVillagesOrigin.data, formData.originVillage)
  const originVillageId = originVillageEntity?.id ?? null
  const ontologyHamletsOrigin = useOntologyChildren(originVillageId, 'HAMLET')
  const ontologyVillageKindredsOrigin = useOntologyChildren(originVillageId, 'KINDRED')
  const originHamletEntity = findOntologyEntityByLabel(ontologyHamletsOrigin.data, formData.originHamlet)
  const originHamletId = originHamletEntity?.id ?? null
  const ontologyKindredsOrigin = useOntologyChildren(originHamletId, 'KINDRED')
  const selectedKindredValue = formData.kindred || formData.originKindred || ''
  const originKindredEntity =
    findOntologyEntityByLabel(ontologyKindredsOrigin.data, selectedKindredValue) ??
    findOntologyEntityByLabel(ontologyVillageKindredsOrigin.data, selectedKindredValue)
  const originKindredId = originKindredEntity?.id ?? null
  const ontologyExtendedFamiliesOrigin = useOntologyChildren(originKindredId, 'EXTENDED_FAMILY')
  const selectedExtendedFamilyValue = formData.umunna || formData.originUmunna || ''
  const originExtendedFamilyEntity = findOntologyEntityByLabel(
    ontologyExtendedFamiliesOrigin.data,
    selectedExtendedFamilyValue
  )
  const originExtendedFamilyId = originExtendedFamilyEntity?.id ?? null
  const originWardEntity = findOntologyEntityByLabel(ontologyWardsOrigin.data, formData.originWard)

  // Deep hierarchy state (genealogy-hierarchy.json based)
  const [availableQuarters, setAvailableQuarters] = useState<string[]>([])
  const [availableObis, setAvailableObis] = useState<string[]>([])
  const [availableClans, setAvailableClans] = useState<string[]>([])
  const [availableKindreds, setAvailableKindreds] = useState<string[]>([])
  const [availableUmunnas, setAvailableUmunnas] = useState<string[]>([])

  // CSV-driven deep hierarchy state
  const [availableLevel1s, setAvailableLevel1s] = useState<string[]>([])
  const [availableLevel2s, setAvailableLevel2s] = useState<string[]>([])
  const [availableHamlets, setAvailableHamlets] = useState<string[]>([])

  // Manual entry flags
  const [isManualQuarter, setIsManualQuarter] = useState(false)
  const [isManualObi, setIsManualObi] = useState(false)
  const [isManualClan, setIsManualClan] = useState(false)
  const [isManualVillage, setIsManualVillage] = useState(false)
  const [isManualHamlet, setIsManualHamlet] = useState(false)
  const [isManualKindred, setIsManualKindred] = useState(false)
  const [isManualUmunna, setIsManualUmunna] = useState(false)

  const [originLGAs, setOriginLGAs] = useState<string[]>([])
  const [originTowns, setOriginTowns] = useState<string[]>([])
  const [originWards, setOriginWards] = useState<string[]>([])
  const [originVillages, setOriginVillages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Diaspora Origin Cascading Data State
  const [availableAncestralCountries, setAvailableAncestralCountries] = useState<any[]>([])
  const [availableAncestralRegions, setAvailableAncestralRegions] = useState<any[]>([])
  const [availableAncestralDistricts, setAvailableAncestralDistricts] = useState<any[]>([])
  const [availableAncestralTowns, setAvailableAncestralTowns] = useState<any[]>([])

  // Diaspora Origin — kick off country list from diaspora-origin-data.json
  // (loaded once; does NOT depend on isDiasporaRelative)
  const diasporaOriginCountries: any[] = (diasporaOriginData as any).countryOfAncestralOrigin ?? []

  // Diaspora Residence Cascading (for DIASPORA_UNKNOWN branch)
  const [availableOriginAdmin1, setAvailableOriginAdmin1] = useState<any[]>([])
  const [availableOriginAdmin2, setAvailableOriginAdmin2] = useState<any[]>([])
  const [availableOriginAdmin3, setAvailableOriginAdmin3] = useState<any[]>([])

  // New person-centric fields state
  const [showAdvancedFields, setShowAdvancedFields] = useState({
    identity: false,
    cultural: false,
    lifeEvents: false,
    documentation: false,
    verification: false,
    diaspora: false,
  })


  // State for new custom life event input
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    eventDate: '',
    eventPlace: '',
    eventDescription: ''
  })

  // Identity document options (user ticks which they have; no upload)
  const identityDocumentOptions: { id: string; label: string }[] = [
    { id: 'birthCertificate', label: 'Birth Certificate' },
    { id: 'nin', label: 'National Identification Number (NIN) Slip/Card' },
    { id: 'nationalIdentityCard', label: 'National Identity Card' },
    { id: 'internationalPassport', label: 'International Passport' },
    { id: 'votersCard', label: 'Voter’s Card' },
    { id: 'driversLicense', label: 'Driver’s License' },
    { id: 'personalBankAccount', label: 'Personal Bank Account (Statement/Proof)' },
    { id: 'taxIdentificationNumber', label: 'Tax Identification Number (TIN)' },
    { id: 'bvn', label: 'Bank Verification Number (BVN)' },
  ]

  // Person form data (for new API)
  const [personData, setPersonData] = useState<Partial<PersonFormSubmission>>({
    gender: 'UNKNOWN',
    consentStatus: false,
    isDiasporaRelative: false,
    verificationLevel: 0,
    visibilitySetting: 'PRIVATE',
  })

  // Diaspora Location Data State
  const [diasporaData, setDiasporaData] = useState<any>(null)
  const [isLoadingDiaspora, setIsLoadingDiaspora] = useState(false)

  // Fetch Diaspora Location Data
  useEffect(() => {
    if (personData.isDiasporaRelative && !diasporaData && !isLoadingDiaspora) {
      setIsLoadingDiaspora(true)
      fetch('/data/diaspora-location-data.json')
        .then(res => res.json())
        .then(data => {
          setDiasporaData(data)
          setIsLoadingDiaspora(false)
        })
        .catch(err => {
          console.error("Failed to load Diaspora location data:", err)
          setIsLoadingDiaspora(false)
        })
    }
  }, [personData.isDiasporaRelative, diasporaData, isLoadingDiaspora])

  const handleDiasporaLocationChange = (field: keyof GenealogyFormSubmission, value: string) => {
    if (field === 'currentContinent') {
      setFormData(prev => ({
        ...prev,
        currentContinent: value,
        currentSubContinent: '',
        currentCountry: '',
        currentState: '',
        currentLGA: '',
        currentTown: '',
      }))
    } else if (field === 'currentSubContinent') {
      setFormData(prev => ({
        ...prev,
        currentSubContinent: value,
        currentCountry: '',
        currentState: '',
        currentLGA: '',
        currentTown: '',
      }))
    } else if (field === 'currentCountry') {
      setFormData(prev => ({
        ...prev,
        currentCountry: value,
        currentNationality: value, // Sync nationality with country name
        currentState: '',
        currentLGA: '',
        currentTown: '',
      }))
    } else if (field === 'currentState') { // FLAD
      setFormData(prev => ({
        ...prev,
        currentState: value,
        currentRegion: value, // Sync region with state name
        currentLGA: '',
        currentTown: '',
      }))
    } else if (field === 'currentLGA') { // SLAD / District
      setFormData(prev => ({
        ...prev,
        currentLGA: value,
        currentTown: '',
      }))
    } else {
      handleInputChange(field, value)
    }
  }

  const normalizeLookupKey = (v: string | null | undefined): string =>
    (v ?? '').replace(/\s+/g, ' ').trim()

  const mergeOptionLists = (...lists: Array<string[] | undefined>): string[] => {
    const seen = new Set<string>()
    const merged: string[] = []

    for (const list of lists) {
      for (const item of list ?? []) {
        const normalized = normalizeLookupKey(item).toLowerCase()
        if (!normalized || seen.has(normalized)) continue
        seen.add(normalized)
        merged.push(item)
      }
    }

    return merged
  }

  const getMappedOptions = (map: { [key: string]: string[] }, key: string): string[] => {
    const exact = map[key]
    if (exact?.length) return exact

    const normalizedKey = normalizeLookupKey(key).toLowerCase()
    const matchedEntry = Object.entries(map).find(
      ([candidate]) => normalizeLookupKey(candidate).toLowerCase() === normalizedKey
    )
    if (matchedEntry?.[1]?.length) return matchedEntry[1]

    const compactKey = normalizedKey.replace(/[^a-z0-9]/g, '')
    const fuzzyMatch = Object.entries(map).find(([candidate]) => {
      const compactCandidate = normalizeLookupKey(candidate).toLowerCase().replace(/[^a-z0-9]/g, '')
      return compactCandidate.includes(compactKey) || compactKey.includes(compactCandidate)
    })

    return fuzzyMatch?.[1] ?? []
  }

  const getUniqueOptions = (options: string[] | undefined): string[] =>
    mergeOptionLists(options)

  const mergeLocationStateLists = (...lists: LocationData[]): LocationData[] => {
    const byName = new Map<string, LocationData>()
    for (const item of lists) {
      if (!item?.state) continue
      const existing = byName.get(item.state)
      if (!existing) {
        byName.set(item.state, item)
        continue
      }
      const merged: LocationData = {
        state: existing.state,
        lgas: (existing.lgas?.length ? existing.lgas : item.lgas) ?? [],
      }
      byName.set(item.state, merged)
    }
    return Array.from(byName.values()).sort((a, b) => a.state.localeCompare(b.state))
  }

  const toOntologyLocationData = (): LocationData[] =>
    ontologyStates.data?.map((e) => ({ state: e.displayName || e.name, lgas: [] })) ?? []

  // Filter countries when continent changes
  useEffect(() => {
    // Only relevant for diaspora flow where user selects continent/country.
    if (!personData.isDiasporaRelative) return;
    if (formData.currentContinent) {
      const countriesInContinent = continentCountries[formData.currentContinent] || []
      setAvailableCountries(countriesInContinent)
      setFormData(prev => ({ ...prev, currentSubContinent: '', currentCountry: '', currentState: '', currentLGA: '', currentTown: '', currentVillage: '' }))
    } else {
      setAvailableCountries([])
    }
  }, [formData.currentContinent, personData.isDiasporaRelative])

  // Filter states when country changes
  useEffect(() => {
    // Only relevant for diaspora flow. In Nigeria flow, Region controls the state list.
    if (!personData.isDiasporaRelative) return;
    if (formData.currentCountry) {
      // Prefer ontology (imported spreadsheet data) when Nigeria and states exist in Firestore,
      // but always merge with the shipped Nigeria list so we don't hide states when ontology is partial.
      if (formData.currentCountry === 'Nigeria' && ontologyStates.data?.length) {
        const merged = mergeLocationStateLists(...nigerianStates, ...toOntologyLocationData())
        setAvailableStates(merged)
      } else {
        let statesInCountry = countryStates[formData.currentCountry] || []
        if (formData.currentCountry === 'Nigeria' && statesInCountry.length === 0) statesInCountry = nigerianStates
        setAvailableStates(statesInCountry)
      }
      setFormData(prev => ({ ...prev, currentState: '', currentLGA: '', currentTown: '', currentVillage: '' }))
    } else {
      setAvailableStates([])
    }
  }, [formData.currentCountry, personData.isDiasporaRelative, ontologyStates.data])

  // Filter states by region when Region is selected (Nigeria only)
  useEffect(() => {
    if (personData.isDiasporaRelative) return;
    if (formData.currentRegion) {
      const stateNamesInRegion = nigerianGeoZones[formData.currentRegion] || []
      const staticStatesInRegion = nigerianStates.filter((s) => stateNamesInRegion.includes(s.state))
      const ontologyStatesInRegion =
        ontologyStates.data?.filter((e) => stateNamesInRegion.includes(e.displayName || e.name)).map((e) => ({ state: e.displayName || e.name, lgas: [] })) ?? []
      setAvailableStates(mergeLocationStateLists(...staticStatesInRegion, ...ontologyStatesInRegion))
      setFormData(prev => ({
        ...prev,
        currentState: '',
        currentLGA: '',
        currentTown: '',
        currentVillage: '',
        currentSenatorialDistrict: '',
        currentFederalConstituency: '',
        currentStateConstituency: ''
      }))
    } else {
      // If Region isn't chosen, show full state list (merge ontology + static).
      setAvailableStates(mergeLocationStateLists(...nigerianStates, ...toOntologyLocationData()))
    }
  }, [formData.currentRegion, personData.isDiasporaRelative, ontologyStates.data])

  // Reset dependent current constituencies when parent changes
  useEffect(() => {
    setFormData((prev) => {
      if (!prev.currentFederalConstituency && !prev.currentStateConstituency) return prev
      return { ...prev, currentFederalConstituency: '', currentStateConstituency: '' }
    })
  }, [formData.currentSenatorialDistrict])

  useEffect(() => {
    setFormData((prev) => {
      if (!prev.currentStateConstituency) return prev
      return { ...prev, currentStateConstituency: '' }
    })
  }, [formData.currentFederalConstituency])

  // Reset dependent origin constituencies when parent changes
  useEffect(() => {
    setFormData((prev) => {
      if (!prev.originFederalConstituency && !prev.originStateConstituency) return prev
      return { ...prev, originFederalConstituency: '', originStateConstituency: '' }
    })
  }, [formData.originSenatorialDistrict])

  useEffect(() => {
    setFormData((prev) => {
      if (!prev.originStateConstituency) return prev
      return { ...prev, originStateConstituency: '' }
    })
  }, [formData.originFederalConstituency])

  // Auto-fill logic for current location (LGA list from ontology or static)
  useEffect(() => {
    if (formData.currentState) {
      const stateName = (formData.currentState.toLowerCase() === 'abuja' || formData.currentState.toLowerCase() === 'fct') ? 'FCT Abuja' : formData.currentState;
      const stateData = availableStates.find((state) => state.state === stateName) || nigerianStates.find((state) => state.state === stateName)
      const staticLgas = stateData?.lgas ?? []
      const ontologyLgas = ontologyLgasCurrent.data?.map((e) => e.displayName || e.name) ?? []
      setAvailableLGAs(mergeOptionLists(staticLgas, ontologyLgas))
      setFormData(prev => ({
        ...prev,
        currentLGA: '',
        currentTown: '',
        currentVillage: '',
        currentSenatorialDistrict: '',
        currentFederalConstituency: '',
        currentStateConstituency: ''
      }))
    } else {
      setAvailableLGAs([])
    }
  }, [formData.currentState, availableStates, ontologyStates.data, ontologyLgasCurrent.data])

  useEffect(() => {
    if (formData.currentLGA) {
      const staticTowns = getMappedOptions(townsData, formData.currentLGA)
      const staticWards = getWardOptions(formData.currentState, formData.currentLGA)
      const ontologyTowns = ontologyTownsCurrent.data?.map((e) => e.displayName || e.name) ?? []
      const ontologyWards = ontologyWardsCurrent.data?.map((e) => e.displayName || e.name) ?? []

      setAvailableTowns(mergeOptionLists(staticTowns, ontologyTowns))
      setAvailableWards(mergeOptionLists(staticWards, ontologyWards))
      setFormData(prev => ({ ...prev, currentTown: '', currentVillage: '', currentPoliticalWard: '' }))
    } else {
      setAvailableTowns([])
      setAvailableWards([])
    }
  }, [formData.currentLGA, ontologyTownsCurrent.data, ontologyWardsCurrent.data])

  useEffect(() => {
    if (formData.currentTown && villagesData[formData.currentTown]) {
      setAvailableVillages(villagesData[formData.currentTown])
      setFormData(prev => ({ ...prev, currentVillage: '' }))
    }
  }, [formData.currentTown])

  // Auto-fill logic for origin location

  // 1. Continent -> Economic / Cultural regions
  useEffect(() => {
    if (formData.originContinent) {
      // Logic to reset sub-continent if continent changes
      setFormData(prev => ({
        ...prev,
        originSubContinent: '',
        originEconomicRegion: '',
        originCulturalRegion: '',
        originGeopoliticalBloc: ''
      }))
    }
  }, [formData.originContinent])

  // Sync Sub-Continent -> Region
  useEffect(() => {
    // If Sub-Continent is NOT West Africa, clear Region as Nigerian Regions don't apply
    if (formData.originSubContinent && formData.originSubContinent !== 'West Africa') {
      setFormData(prev => ({ ...prev, originRegion: '' }))
    }
  }, [formData.originSubContinent])

  // 2. Region -> State (Reset State if Region changes)
  useEffect(() => {
    if (formData.originRegion) {
      // If current state (if any) is not in the new region, clear it.
      // Or simpler: just always clear state when region changes manually.
      // However, we must be careful: if state auto-filled the region, we don't want to clear state!
      // Scenario A: User selects State -> Region auto-fills. Hook fires? Yes.
      // If hook clears state, we have a loop!
      // Check: State Change -> set Region. -> Region Change detected -> Clear State. -> State Change detected -> set Region...
      // Loop!

      // Guard: Only clear state if the current state doesn't match the new region.
      if (formData.originState) {
        const correctRegion = getRegionByState(formData.originState)
        if (correctRegion && correctRegion !== formData.originRegion) {
          // Providing user changed region to something incompatible with current state
          setFormData(prev => ({ ...prev, originState: '', originLGA: '', originTown: '' }))
        }
      }

      // Sync Region -> Sub-Continent/Continent
      if (nigerianGeoZones[formData.originRegion]) {
        // If a valid Nigerian region is selected, ensure Context is Nigeria/West Africa
        setFormData(prev => {
          const updates: any = {};
          if (prev.originSubContinent !== 'West Africa') updates.originSubContinent = 'West Africa';
          if (prev.originContinent !== 'Africa') updates.originContinent = 'Africa';
          return { ...prev, ...updates };
        })
      }
    }
  }, [formData.originRegion])

  // 3. State -> Senatorial, Federal Const, Region, LGAs (from ontology or static)
  useEffect(() => {
    if (formData.originState) {
      const region = getRegionByState(formData.originState)
      setFormData(prev => ({
        ...prev,
        originRegion: region || prev.originRegion,
        originNationality: nigerianStates.some((s) => s.state === formData.originState) ? 'Nigerian' : prev.originNationality,
        originSenatorialDistrict: '',
        originFederalConstituency: '',
        originStateConstituency: ''
      }))
      const stateData = nigerianStates.find((state) => state.state === formData.originState)
      const staticLgas = stateData?.lgas ?? []
      const ontologyLgas = ontologyLgasOrigin.data?.map((e) => e.displayName || e.name) ?? []
      setOriginLGAs(mergeOptionLists(staticLgas, ontologyLgas))
      setFormData(prev => ({ ...prev, originLGA: '', originTown: '', originVillage: '' }))
    }
  }, [formData.originState, ontologyStates.data, ontologyLgasOrigin.data])

  useEffect(() => {
    if (formData.originLGA) {
      const staticTowns = getMappedOptions(townsData, formData.originLGA)
      const staticWards = getWardOptions(formData.originState, formData.originLGA)
      const ontologyTowns = ontologyTownsOrigin.data?.map((e) => e.displayName || e.name) ?? []
      const ontologyWards = ontologyWardsOrigin.data?.map((e) => e.displayName || e.name) ?? []

      setOriginTowns(mergeOptionLists(staticTowns, ontologyTowns))
      setOriginWards(mergeOptionLists(staticWards, ontologyWards))
      setFormData(prev => ({ ...prev, originTown: '', originVillage: '', originWard: '' }))
    } else {
      setOriginTowns([])
      setOriginWards([])
    }
  }, [formData.originLGA, ontologyTownsOrigin.data, ontologyWardsOrigin.data])

  // Deep cascading logic for Origin (Flattened for UI without Quarter/Obi)
  useEffect(() => {
    if (!formData.originTown) {
      setAvailableQuarters([])
      setAvailableObis([])
      setAvailableClans([])
      setOriginVillages([])
      setAvailableKindreds([])
      setAvailableUmunnas([])
      setIsManualQuarter(true)
      setIsManualObi(true)
      setIsManualClan(true)
      setIsManualVillage(true)
      setIsManualKindred(true)
      setIsManualUmunna(true)
      return
    }

    const town = townHierarchy[formData.originTown]
    
    // If town exists in hierarchy json, flatten the deep structure.
    if (town) {
      const clansSet = new Set<string>()
      const villagesSet = new Set<string>()
      const kindredsSet = new Set<string>()
      const umunnasSet = new Set<string>()

      Object.values(town.quarters || {}).forEach(q => {
        Object.values(q.obis || {}).forEach(o => {
          Object.entries(o.clans || {}).forEach(([clanName, clanObj]) => {
            clansSet.add(clanName)
            if (formData.originClan && formData.originClan !== clanName) return

            Object.entries(clanObj.villages || {}).forEach(([villageName, villageObj]) => {
              villagesSet.add(villageName)
              if (formData.originVillage && formData.originVillage !== villageName) return

              Object.entries(villageObj.kindreds || {}).forEach(([kindredName, umunnaList]) => {
                kindredsSet.add(kindredName)
                if (formData.kindred && formData.kindred !== kindredName) return

                umunnaList.forEach(u => umunnasSet.add(u))
              })
            })
          })
        })
      })

      const cArr = Array.from(clansSet)
      const vArr = Array.from(villagesSet)
      const kArr = Array.from(kindredsSet)
      const uArr = Array.from(umunnasSet)

      setAvailableClans(cArr)
      setOriginVillages(vArr)
      setAvailableKindreds(kArr)
      setAvailableUmunnas(uArr)

      setIsManualClan(cArr.length === 0)
      setIsManualVillage(vArr.length === 0)
      setIsManualKindred(kArr.length === 0)
      setIsManualUmunna(uArr.length === 0)
    } else {
      // Fallback for towns not mapped in genealogy-hierarchy.json
      setAvailableClans([])
      setIsManualClan(true)
      setAvailableKindreds([])
      setIsManualKindred(true)
      setAvailableUmunnas([])
      setIsManualUmunna(true)

      const flatVillages = villagesData[formData.originTown]
      if (flatVillages && flatVillages.length > 0) {
        setOriginVillages(flatVillages)
        setIsManualVillage(false)
      } else {
        setOriginVillages([])
        setIsManualVillage(true)
      }
    }
  }, [formData.originTown, formData.originClan, formData.originVillage, formData.kindred])

  // ── CSV-driven cascades ──────────────────────────────────────────────────

  // Town → TownAdminLevel1
  useEffect(() => {
    const csv = csvDropdownData as any
    const level1s = (csv.level1sByTownName?.[formData.originTown] as string[]) ?? []
    setAvailableLevel1s(level1s)
  }, [formData.originTown])

  // TownAdminLevel1 → TownAdminLevel2
  useEffect(() => {
    if (!formData.originTownLevel1) { setAvailableLevel2s([]); return }
    const csv = csvDropdownData as any
    const level2s = (csv.level2sByLevel1Name?.[formData.originTownLevel1] as string[]) ?? []
    setAvailableLevel2s(level2s)
    setFormData(prev => ({ ...prev, originTownLevel2: '' }))
  }, [formData.originTownLevel1])

  // TownAdminLevel2 → Clans (CSV-driven, overrides genealogy-hierarchy)
  useEffect(() => {
    if (!formData.originTownLevel2) return
    const csv = csvDropdownData as any
    const clans = (csv.clansByLevel2Name?.[formData.originTownLevel2] as string[]) ?? []
    if (clans.length > 0) {
      setAvailableClans(clans)
      setIsManualClan(false)
    }
    // don't clear if already set from another source — only override if CSV has data
  }, [formData.originTownLevel2])

  // Clan → Villages (CSV-driven)
  useEffect(() => {
    if (!formData.originClan) { return }
    const csv = csvDropdownData as any
    const villages = (csv.villagesByClanName?.[formData.originClan] as string[]) ?? []
    if (villages.length > 0) {
      setOriginVillages(villages)
      setIsManualVillage(false)
    }
  }, [formData.originClan])

  // Village → Hamlets (CSV-driven)
  useEffect(() => {
    if (!formData.originVillage) { setAvailableHamlets([]); return }
    const csv = csvDropdownData as any
    const hamlets = (csv.hamletsByVillageName?.[formData.originVillage] as string[]) ?? []
    setAvailableHamlets(hamlets)
    setIsManualHamlet(hamlets.length === 0)
    setFormData(prev => ({ ...prev, originHamlet: '' }))
  }, [formData.originVillage])

  // Hamlet → Kindreds (CSV-driven, overrides genealogy-hierarchy)
  useEffect(() => {
    if (!formData.originHamlet) return
    const csv = csvDropdownData as any
    const kindreds = (csv.kindredsByHamletName?.[formData.originHamlet] as string[]) ?? []
    if (kindreds.length > 0) {
      setAvailableKindreds(kindreds)
      setIsManualKindred(false)
    }
  }, [formData.originHamlet])

  // Kindred → Umunnas (CSV-driven, overrides genealogy-hierarchy)
  useEffect(() => {
    if (!formData.kindred) return
    const csv = csvDropdownData as any
    const umunnas = (csv.umunnasByKindredName?.[formData.kindred] as string[]) ?? []
    if (umunnas.length > 0) {
      setAvailableUmunnas(umunnas)
      setIsManualUmunna(false)
    }
  }, [formData.kindred])

  // Ontology-driven deep origin cascade overrides legacy JSON/CSV sources when present.
  useEffect(() => {
    const ontologyClans = getUniqueOptions(ontologyClansOrigin.data?.map(getOntologyEntityLabel))
    if (ontologyClans.length > 0) {
      setAvailableClans(ontologyClans)
      setIsManualClan(false)
    }
  }, [ontologyClansOrigin.data])

  useEffect(() => {
    const ontologyVillages = getUniqueOptions(ontologyVillagesOrigin.data?.map(getOntologyEntityLabel))
    if (ontologyVillages.length > 0) {
      setOriginVillages(ontologyVillages)
      setIsManualVillage(false)
    }
  }, [ontologyVillagesOrigin.data])

  useEffect(() => {
    const ontologyHamlets = getUniqueOptions(ontologyHamletsOrigin.data?.map(getOntologyEntityLabel))
    if (ontologyHamlets.length > 0) {
      setAvailableHamlets(ontologyHamlets)
      setIsManualHamlet(false)
    }
  }, [ontologyHamletsOrigin.data])

  useEffect(() => {
    const ontologyKindreds = getUniqueOptions(
      (formData.originHamlet ? ontologyKindredsOrigin.data : ontologyVillageKindredsOrigin.data).map(getOntologyEntityLabel)
    )
    if (ontologyKindreds.length > 0) {
      setAvailableKindreds(ontologyKindreds)
      setIsManualKindred(false)
    }
  }, [formData.originHamlet, ontologyKindredsOrigin.data, ontologyVillageKindredsOrigin.data])

  useEffect(() => {
    const ontologyExtendedFamilies = getUniqueOptions(
      ontologyExtendedFamiliesOrigin.data?.map(getOntologyEntityLabel)
    )
    if (ontologyExtendedFamilies.length > 0) {
      setAvailableUmunnas(ontologyExtendedFamilies)
      setIsManualUmunna(false)
    }
  }, [ontologyExtendedFamiliesOrigin.data])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      originClan: '',
      originVillage: '',
      originHamlet: '',
      kindred: '',
      originKindred: '',
      umunna: '',
      originUmunna: '',
    }))
  }, [formData.originTown])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      originVillage: '',
      originHamlet: '',
      kindred: '',
      originKindred: '',
      umunna: '',
      originUmunna: '',
    }))
  }, [formData.originClan])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      originHamlet: '',
      kindred: '',
      originKindred: '',
      umunna: '',
      originUmunna: '',
    }))
  }, [formData.originVillage])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      kindred: '',
      originKindred: '',
      umunna: '',
      originUmunna: '',
    }))
  }, [formData.originHamlet])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      umunna: '',
      originUmunna: '',
    }))
  }, [formData.kindred])

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

  const handleAddLifeEvent = () => {
    if (!newEvent.eventName.trim()) return

    const currentEvents = personData.otherLifeEvents || []
    setPersonData(prev => ({
      ...prev,
      otherLifeEvents: [...currentEvents, { ...newEvent }]
    }))

    // Reset inputs
    setNewEvent({
      eventName: '',
      eventDate: '',
      eventPlace: '',
      eventDescription: ''
    })
  }


  const handleRemoveLifeEvent = (index: number) => {
    const currentEvents = personData.otherLifeEvents || []
    setPersonData(prev => ({
      ...prev,
      otherLifeEvents: currentEvents.filter((_, i) => i !== index)
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
        genotype: personData.genotype,
        bloodGroup: personData.bloodGroup,

        // Lineage (Expanded with new hierarchy)
        originContinent: formData.originContinent,
        originSubContinent: formData.originSubContinent,
        originNationality: formData.originNationality === 'Dual Citizenship' && formData.dualCitizenshipCountry
          ? `Dual Citizenship (${formData.dualCitizenshipCountry})`
          : formData.originNationality,
        originRegion: formData.originRegion,
        originState: formData.originState,
        originSenatorialDistrict: formData.originSenatorialDistrict,
        originFederalConstituency: formData.originFederalConstituency,
        originLocalGovernmentArea: formData.originLGA,
        originStateConstituency: formData.originStateConstituency,
        originTown: formData.originTown,
        originTownDivision: formData.originTownDivision,
        originTownLevel1: formData.originTownLevel1,
        originTownLevel2: formData.originTownLevel2,
        originTownLevel3: formData.originTownLevel3,
        originTownLevel4: formData.originTownLevel4,
        originWard: formData.originWard,
        originTownQuarter: formData.originTownQuarter,
        originClan: formData.originClan,
        originVillage: formData.originVillage,
        originHamlet: formData.originHamlet,
        originKindred: formData.kindred, 
        originUmunna: formData.umunna,
        originStateId: originStateId || undefined,
        originLgaId: originLgaId || undefined,
        originTownId: originTownId || undefined,
        originWardId: originWardEntity?.id,
        originClanId: originClanId || undefined,
        originVillageId: originVillageId || undefined,
        originHamletId: originHamletId || undefined,
        originKindredId: originKindredId || undefined,
        originExtendedFamilyId: originExtendedFamilyId || undefined,

        // Parents
        fatherName: formData.fatherName,
        motherName: formData.motherName,

        // Legacy Lineage fields (for backward compatibility)
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
        identityDocumentsHeld: personData.identityDocumentsHeld,
        story: formData.additionalInfo || personData.story,
        notes: personData.notes,

        // Verification
        verificationLevel: personData.verificationLevel || 0,
        consentStatus: personData.consentStatus,
        visibilitySetting: personData.visibilitySetting || 'PRIVATE',

        // Diaspora & Current Location (Expanded with new hierarchy)
        isDiasporaRelative: personData.isDiasporaRelative || (formData.currentCountry !== 'Nigeria'),

        // Map new hierarchical fields
        currentContinent: formData.currentContinent,
        currentSubContinent: formData.currentSubContinent,
        currentNationality: formData.currentNationality,
        currentCountry: formData.currentCountry, // Maps to currentCountry (new field)
        currentRegion: formData.currentRegion,
        currentState: formData.currentState,     // Maps to currentState (new field)
        currentSenatorialDistrict: formData.currentSenatorialDistrict,
        currentFederalConstituency: formData.currentFederalConstituency,
        currentLocalGovernmentArea: formData.currentLGA,
        currentStateConstituency: formData.currentStateConstituency,
        currentTown: formData.currentTown,
        currentTownDivision: formData.currentTownDivision,
        currentTownQuarter: formData.currentTownQuarter,
        currentClan: formData.currentClan,
        currentVillage: formData.currentVillage,
        currentHamlet: formData.currentHamlet,
        currentKindred: formData.currentKindred,
        currentUmunna: formData.currentUmunna,
        currentPoliticalWard: formData.currentPoliticalWard,
        currentIgboOrganizations: formData.currentIgboOrganizations,
        citizenshipStatus: formData.citizenshipStatus,

        // Legacy Diaspora fields mapping
        countryOfResidence: formData.currentCountry !== 'Nigeria' ? formData.currentCountry : personData.countryOfResidence,
        currentCity: formData.currentTown || personData.currentCity,
        // currentState already mapped above

        // Connection Details
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

      // Create submission record via new API
      const response = await fetch('/api/submissions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personSubmission),
      })

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON error (${response.status}): ${text.slice(0, 100)}...`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit form')
      }

      // Store submission ID for success message
      const submissionId = result.submissionId
      setPersonData(prev => ({ ...prev, createdPersonId: submissionId })) // Reusing this field to store submission ID temporarily

      if (typeof window !== 'undefined' && submissionId) {
        sessionStorage.setItem('lastSubmissionId', submissionId)
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
    // Get submissionId from state or storage
    const submissionId = (personData as any).createdPersonId ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('lastSubmissionId') : null)

    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Submission Received
        </h3>
        <p className="text-gray-600 mb-4">
          Thank you for contributing to the Ndigbo Viva genealogy project. Your submission has been received and is pending review by our editors.
        </p>

        {submissionId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-blue-900 mb-2">Your Submission Reference ID:</p>
            <p className="text-xs font-mono text-blue-700 bg-blue-100 px-3 py-2 rounded mb-3">
              {submissionId}
            </p>
            <p className="text-xs text-blue-800">
              Please save this ID. We will notify you once your information has been verified and added to the database.
            </p>
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
              originWard: '',
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
        <a
          href="/my-submissions"
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          View My Submissions
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Globe className="w-6 h-6 mr-2 text-brand-gold" />
          Current Location Information
        </h3>
        <p className="text-gray-600 mb-6">Please provide details about where you currently live.</p>

        {/* Diaspora Toggle */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-8">
          <span className="block text-sm font-medium text-blue-900 mb-3">Where do you live?</span>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="isDiaspora"
                checked={personData.isDiasporaRelative === false}
                onChange={() => {
                  handlePersonFieldChange('isDiasporaRelative', false)
                  // Auto-set for Nigeria
                  setFormData(prev => ({
                    ...prev,
                    currentContinent: 'Africa',
                    currentCountry: 'Nigeria',
                    currentNationality: 'Nigerian'
                  }))
                }}
                className="text-brand-gold focus:ring-brand-gold h-4 w-4"
              />
              <span className="text-gray-800">Nigeria</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="isDiaspora"
                checked={personData.isDiasporaRelative === true}
                onChange={() => {
                  handlePersonFieldChange('isDiasporaRelative', true)
                  // Reset fields when switching to Diaspora so user can select
                  setFormData(prev => ({
                    ...prev,
                    currentContinent: '',
                    currentCountry: '',
                    currentNationality: ''
                  }))
                }}
                className="text-brand-gold focus:ring-brand-gold h-4 w-4"
              />
              <span className="text-gray-800">Diaspora</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!personData.isDiasporaRelative ? (
            // NIGERIA LAYOUT
            <>
              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region *</label>
                <select
                  value={formData.currentRegion || ''}
                  onChange={(e) => handleInputChange('currentRegion', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  required
                >
                  <option value="">Select Region</option>
                  {Object.keys(nigerianGeoZones).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                {availableStates.length > 0 ? (
                  <select
                    value={formData.currentState}
                    onChange={(e) => handleInputChange('currentState', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                    required
                  >
                    <option value="">Select State</option>
                    {availableStates.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.currentState || ''}
                    onChange={(e) => handleInputChange('currentState', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                    placeholder="State"
                    required
                  />
                )}
              </div>

              {/* Senatorial District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senatorial District</label>
                <select
                  value={formData.currentSenatorialDistrict || ''}
                  onChange={(e) => handleInputChange('currentSenatorialDistrict', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                >
                  <option value="">Select Senatorial District</option>
                  {(() => {
                    const districts = formData.currentState && senatorialDistricts[formData.currentState]
                      ? getUniqueOptions(senatorialDistricts[formData.currentState])
                      : (formData.currentState ? [
                        `${formData.currentState} North`,
                        `${formData.currentState} South`,
                        `${formData.currentState} Central`
                      ] : []);

                    return districts.map((sd, index) => <option key={`${sd}-${index}`} value={sd}>{sd}</option>);
                  })()}
                </select>
              </div>

              {/* Federal Constituency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Federal Constituency</label>
                {(() => {
                  const stateKey = normalizeLookupKey(formData.currentState)
                  const zoneKey = normalizeLookupKey(formData.currentSenatorialDistrict)
                  const byState = stateKey ? federalConstituencies[stateKey] : undefined
                  const byZone = stateKey && zoneKey
                    ? federalConstituenciesByStateAndSenatorialDistrict[stateKey]?.[zoneKey]
                    : undefined
                  const options = getUniqueOptions((byZone?.length ? byZone : byState) ?? [])
                  return (
                    <select
                      value={formData.currentFederalConstituency || ''}
                      onChange={(e) => handleInputChange('currentFederalConstituency', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                      disabled={!formData.currentState || options.length === 0}
                    >
                      {!formData.currentState ? (
                        <option value="">Select Federal Constituency</option>
                      ) : options.length === 0 ? (
                        <option value="">Select Federal Constituency</option>
                      ) : (
                        <>
                          <option value="">Select Federal Constituency</option>
                          {options.map((fc, index) => <option key={`${fc}-${index}`} value={fc}>{fc}</option>)}
                        </>
                      )}
                    </select>
                  )
                })()}
              </div>

              {/* LGA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LGA</label>
                <select
                  value={formData.currentLGA}
                  onChange={(e) => handleInputChange('currentLGA', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  disabled={!availableLGAs.length}
                >
                  {!formData.currentState ? (
                    <option value="">Select LGA</option>
                  ) : (
                    <>
                      <option value="">Select LGA</option>
                      {availableLGAs.map(lga => <option key={lga} value={lga}>{lga}</option>)}
                    </>
                  )}
                </select>
              </div>

              {/* State Constituency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State Constituency</label>
                {(() => {
                  const stateKey = normalizeLookupKey(formData.currentState)
                  const fedKey = normalizeLookupKey(formData.currentFederalConstituency)
                  const byState = stateKey ? stateConstituenciesByState[stateKey] : undefined
                  const byFederal = stateKey && fedKey
                    ? stateConstituenciesByStateAndFederalConstituency[stateKey]?.[fedKey]
                    : undefined
                  const options = getUniqueOptions((byFederal?.length ? byFederal : byState) ?? [])
                  return (
                    <select
                      value={formData.currentStateConstituency || ''}
                      onChange={(e) => handleInputChange('currentStateConstituency', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                      disabled={!formData.currentState || options.length === 0}
                    >
                      {!formData.currentState ? (
                        <option value="">Select State Constituency</option>
                      ) : options.length === 0 ? (
                        <option value="">Select State Constituency</option>
                      ) : (
                        <>
                          <option value="">Select State Constituency</option>
                          {options.map((sc, index) => <option key={`${sc}-${index}`} value={sc}>{sc}</option>)}
                        </>
                      )}
                    </select>
                  )
                })()}
              </div>

              {/* Town */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Town</label>
                <select
                  value={formData.currentTown}
                  onChange={(e) => handleInputChange('currentTown', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  disabled={!availableTowns.length}
                >
                  {!formData.currentLGA ? (
                    <option value="">Select Town</option>
                  ) : (
                    <>
                      <option value="">Select Town</option>
                      {availableTowns.map(t => <option key={t} value={t}>{t}</option>)}
                    </>
                  )}
                </select>
              </div>

              {/* Political Ward */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Political Ward</label>
                <select
                  value={formData.currentPoliticalWard || ''}
                  onChange={(e) => handleInputChange('currentPoliticalWard', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                  disabled={!availableWards.length}
                >
                  {!formData.currentLGA ? (
                    <option value="">Select Political Ward</option>
                  ) : (
                    <>
                      <option value="">Select Political Ward</option>
                      {availableWards.map(w => <option key={w} value={w}>{w}</option>)}
                    </>
                  )}
                </select>
              </div>

            </>
          ) : (
            // DIASPORA LAYOUT
            <>
              {/* Continent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Continent *</label>
                <select
                  value={formData.currentContinent}
                  onChange={(e) => handleDiasporaLocationChange('currentContinent', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  required
                >
                  <option value="">{isLoadingDiaspora ? 'Loading...' : 'Select Continent'}</option>
                  {diasporaData?.continents ? diasporaData.continents.map((c: any) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  )) : continents.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Sub-Continent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Continent</label>
                {diasporaData ? (
                  <select
                    value={formData.currentSubContinent || ''}
                    onChange={(e) => handleDiasporaLocationChange('currentSubContinent', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  >
                    <option value="">Select Sub-Continent</option>
                    {(() => {
                      const continent = diasporaData?.continents?.find((c: any) => c.name === formData.currentContinent);
                      if (!continent) return null;
                      return (diasporaData?.subContinents?.[continent.id] || []).map((sc: any) => (
                        <option key={sc.id} value={sc.name}>{sc.name}</option>
                      ));
                    })()}
                  </select>
                ) : formData.currentContinent && continentSubContinents[formData.currentContinent] ? (
                  <select
                    value={formData.currentSubContinent || ''}
                    onChange={(e) => handleInputChange('currentSubContinent', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  >
                    <option value="">Select Sub-Continent</option>
                    {continentSubContinents[formData.currentContinent].map(sc => <option key={sc} value={sc}>{sc}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.currentSubContinent || ''}
                    onChange={(e) => handleInputChange('currentSubContinent', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                    placeholder="e.g. West Africa"
                  />
                )}
              </div>

              {/* Citizenship Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Citizenship Status</label>
                {diasporaData ? (
                  <select
                    value={formData.citizenshipStatus || ''}
                    onChange={(e) => handleInputChange('citizenshipStatus', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  >
                    <option value="">Select Citizenship Status</option>
                    {(diasporaData?.citizenshipStatuses || []).map((status: any) => (
                      <option key={status.id} value={status.name}>{status.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.citizenshipStatus || ''}
                    onChange={(e) => handleInputChange('citizenshipStatus', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                    placeholder="e.g. Citizen, Permanent Resident"
                  />
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country of Residence *</label>
                <select
                  value={formData.currentCountry}
                  onChange={(e) => handleDiasporaLocationChange('currentCountry', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  required
                >
                  <option value="">Select Country</option>
                  {diasporaData ? (() => {
                    const continent = diasporaData?.continents?.find((c: any) => c.name === formData.currentContinent);
                    if (!continent) return null;
                    const subContinent = diasporaData?.subContinents?.[continent.id]?.find((sc: any) => sc.name === formData.currentSubContinent);
                    if (!subContinent) return null;
                    return (diasporaData?.countries?.[subContinent.id] || []).map((c: any) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ));
                  })() : availableCountries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* First-Level Administrative Division */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First-Level Administrative Division *</label>
                {diasporaData ? (
                  <select
                    value={formData.currentState}
                    onChange={(e) => handleDiasporaLocationChange('currentState', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                    required
                  >
                    <option value="">Select First-Level Admin</option>
                    {(() => {
                      const continent = diasporaData?.continents?.find((c: any) => c.name === formData.currentContinent);
                      if (!continent) return null;
                      const subContinent = diasporaData?.subContinents?.[continent.id]?.find((sc: any) => sc.name === formData.currentSubContinent);
                      if (!subContinent) return null;
                      const country = diasporaData?.countries?.[subContinent.id]?.find((c: any) => c.name.trim().toLowerCase() === formData.currentCountry?.trim().toLowerCase());
                      if (!country) return null;
                      return (diasporaData?.firstLevel?.[country.id] || []).map((flad: any) => (
                        <option key={flad.id} value={flad.name}>{flad.name}</option>
                      ));
                    })()}
                  </select>
                ) : availableStates.length > 0 ? (
                  <select
                    value={formData.currentState}
                    onChange={(e) => handleInputChange('currentState', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                    required
                  >
                    <option value="">Select State</option>
                    {availableStates.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.currentState || ''}
                    onChange={(e) => handleInputChange('currentState', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                    placeholder="First-level Admin"
                    required
                  />
                )}
              </div>

              {/* Town/City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Town/City</label>
                {(() => {
                  if (!diasporaData) {
                    return (
                      <input
                        type="text"
                        value={formData.currentTown || ''}
                        onChange={(e) => handleInputChange('currentTown', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                        placeholder="City or Town"
                      />
                    );
                  }

                  const continent = diasporaData?.continents?.find((c: any) => c.name === formData.currentContinent);
                  const subContinent = continent ? diasporaData?.subContinents?.[continent.id]?.find((sc: any) => sc.name === formData.currentSubContinent) : null;
                  const country = subContinent ? diasporaData?.countries?.[subContinent.id]?.find((c: any) => c.name.trim().toLowerCase() === formData.currentCountry?.trim().toLowerCase()) : null;
                  const flad = country ? diasporaData?.firstLevel?.[country.id]?.find((f: any) => 
                    f.name.trim().toLowerCase() === formData.currentState?.trim().toLowerCase()
                  ) : null;
                  
                  const key = flad ? flad.id : (country ? `COUNTRY_${country.id}` : null);
                  const cityOptions = key ? (diasporaData?.cities?.[key] || []) : [];
                  
                  // Final list of options, falling back to local Nigerian data if Diaspora data is missing for Nigeria
                  let finalCityOptions = [...cityOptions];
                  if (finalCityOptions.length === 0 && country?.name === 'Nigeria' && flad) {
                    const stateName = flad.name.replace(' (State)', '').trim().toLowerCase();
                    const nigeriaState = nigerianStates.find(s => 
                      s.state.toLowerCase() === stateName || 
                      s.state.toLowerCase().includes(stateName)
                    );
                    if (nigeriaState) {
                      // Get all LGAs for this state
                      const lgas = nigeriaState.lgas || [];
                      // Combine LGAs with any towns data available
                      finalCityOptions = lgas.map((lga: string) => ({ 
                        id: `NGA_LGA_${lga}`, 
                        name: lga, 
                        type: 'LGA' 
                      }));
                    }
                  }

                  if (finalCityOptions.length > 0) {
                    return (
                      <select
                        value={formData.currentTown || ''}
                        onChange={(e) => handleInputChange('currentTown', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                      >
                        <option value="">Select City/Town</option>
                        {finalCityOptions.map((city: any) => (
                          <option key={city.id} value={city.name}>{city.name}</option>
                        ))}
                      </select>
                    );
                  }

                  return (
                    <input
                      type="text"
                      value={formData.currentTown || ''}
                      onChange={(e) => handleInputChange('currentTown', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                      placeholder="City or Town"
                    />
                  );
                })()}
              </div>

              </>
          )}

        </div>


      </div>

      <div className="mb-8 pt-6 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-brand-forest" />
          Origin Information
        </h3>
        <p className="text-gray-600 mb-6">Please provide details about your ancestral roots and place of origin.</p>

        {/* ── Origin Type Toggle (mirrors Current Location toggle) ── */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-8">
          <span className="block text-sm font-medium text-green-900 mb-3">What is your ancestral origin?</span>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="originType"
                checked={formData.originType !== 'diaspora'}
                onChange={() => handleInputChange('originType', 'nigerian')}
                className="text-brand-gold focus:ring-brand-gold h-4 w-4"
              />
              <span className="text-gray-800">Nigerian Origin</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="originType"
                checked={formData.originType === 'diaspora'}
                onChange={() => handleInputChange('originType', 'diaspora')}
                className="text-brand-gold focus:ring-brand-gold h-4 w-4"
              />
              <span className="text-gray-800">Diaspora Origin</span>
            </label>
          </div>
        </div>

        {formData.originType !== 'diaspora' ? (
        /* ==========================================
            NIGERIAN ORIGIN 
           ========================================== */
        <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Nigerian Ancestry Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nationality (Static for Direct) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <input type="text" value="Nigerian" disabled className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500" />
              </div>

              {/* State of Origin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State of Origin *</label>
                <select
                  value={formData.originState}
                  onChange={(e) => handleInputChange('originState', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  required={formData.originType === 'nigerian'}
                >
                  <option value="">Select State</option>
                  {nigerianStates.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
                </select>
              </div>

              {/* Senatorial District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senatorial District</label>
                <select
                  value={formData.originSenatorialDistrict || ''}
                  onChange={(e) => handleInputChange('originSenatorialDistrict', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  disabled={!formData.originState}
                >
                  <option value="">Select Senatorial District</option>
                  {getUniqueOptions(senatorialDistricts[formData.originState] ?? []).map((sd, index) => <option key={`${sd}-${index}`} value={sd}>{sd}</option>)}
                </select>
              </div>

              {/* Federal Constituency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Federal Constituency</label>
                {(() => {
                  const stateKey = normalizeLookupKey(formData.originState)
                  const zoneKey = normalizeLookupKey(formData.originSenatorialDistrict)
                  const byState = stateKey ? federalConstituencies[stateKey] : undefined
                  const byZone = stateKey && zoneKey
                    ? federalConstituenciesByStateAndSenatorialDistrict[stateKey]?.[zoneKey]
                    : undefined
                  const opts = getUniqueOptions((byZone?.length ? byZone : byState) ?? [])
                  return (
                    <select
                      value={formData.originFederalConstituency || ''}
                      onChange={(e) => handleInputChange('originFederalConstituency', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                      disabled={!formData.originState || opts.length === 0}
                    >
                      <option value="">Select Federal Constituency</option>
                      {opts.map((fc, index) => <option key={`${fc}-${index}`} value={fc}>{fc}</option>)}
                    </select>
                  )
                })()}
              </div>

              {/* LGA of Origin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LGA of Origin *</label>
                <select
                  value={formData.originLGA}
                  onChange={(e) => handleInputChange('originLGA', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  required={formData.originType === 'nigerian'}
                  disabled={!originLGAs.length}
                >
                  <option value="">Select LGA</option>
                  {originLGAs.map(lga => <option key={lga} value={lga}>{lga}</option>)}
                </select>
              </div>

              {/* State Constituency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State Constituency</label>
                {(() => {
                  const stateKey = normalizeLookupKey(formData.originState)
                  const fedKey = normalizeLookupKey(formData.originFederalConstituency)
                  const byState = stateKey ? stateConstituenciesByState[stateKey] : undefined
                  const byFederal = stateKey && fedKey
                    ? stateConstituenciesByStateAndFederalConstituency[stateKey]?.[fedKey]
                    : undefined
                  const opts = getUniqueOptions((byFederal?.length ? byFederal : byState) ?? [])
                  return (
                    <select
                      value={formData.originStateConstituency || ''}
                      onChange={(e) => handleInputChange('originStateConstituency', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                      disabled={!formData.originState || opts.length === 0}
                    >
                      <option value="">Select State Constituency</option>
                      {opts.map((sc, index) => <option key={`${sc}-${index}`} value={sc}>{sc}</option>)}
                    </select>
                  )
                })()}
              </div>

              {/* Town of Origin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Town of Origin *</label>
                <select
                  value={formData.originTown}
                  onChange={(e) => handleInputChange('originTown', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  required={formData.originType === 'nigerian'}
                  disabled={!originTowns.length}
                >
                  <option value="">Select Town</option>
                  {originTowns.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Ward */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Political Ward</label>
                <select
                  value={formData.originWard || ''}
                  onChange={(e) => handleInputChange('originWard', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  disabled={!originWards.length}
                >
                  <option value="">Select Ward</option>
                  {originWards.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              {/* Clan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clan</label>
                {availableClans.length > 0 && !isManualClan ? (
                  <select
                    value={formData.originClan || ''}
                    onChange={(e) => e.target.value === 'OTHER' ? setIsManualClan(true) : handleInputChange('originClan', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Clan</option>
                    {availableClans.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.originClan || ''}
                    onChange={(e) => handleInputChange('originClan', e.target.value)}
                    placeholder="Enter Clan"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                )}
              </div>

              {/* Village */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village (Ogbe)</label>
                {originVillages.length > 0 && !isManualVillage ? (
                  <select
                    value={formData.originVillage}
                    onChange={(e) => e.target.value === 'OTHER' ? setIsManualVillage(true) : handleInputChange('originVillage', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">{formData.originClan ? 'Select Village' : 'Select Clan first'}</option>
                    {originVillages.map(v => <option key={v} value={v}>{v}</option>)}
                    <option value="OTHER">Other (Manual)</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.originVillage}
                    onChange={(e) => handleInputChange('originVillage', e.target.value)}
                    placeholder={formData.originClan ? 'Enter Village' : 'Select or enter clan first'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
        /* ==========================================
            DIASPORA ORIGIN
           ========================================== */
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Diaspora Ancestry Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Country of Ancestral Origin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country of Ancestral Origin *</label>
              <select
                value={formData.diasporaAncestralCountry || ''}
                onChange={(e) => {
                  const val = e.target.value
                  handleInputChange('diasporaAncestralCountry', val)
                  handleInputChange('diasporaAncestralRegion', '')
                  handleInputChange('diasporaAncestralDistrict', '')
                  handleInputChange('diasporaAncestralTown', '')
                  // Populate regions for selected country
                  const countryObj = diasporaOriginCountries.find((c: any) => c.name === val)
                  if (countryObj) {
                    const regions = ((diasporaOriginData as any).adminLevel1 ?? []).filter((a: any) => a.countryId === countryObj.id)
                    setAvailableAncestralRegions(regions)
                    setAvailableAncestralDistricts([])
                    setAvailableAncestralTowns([])
                  } else {
                    setAvailableAncestralRegions([])
                    setAvailableAncestralDistricts([])
                    setAvailableAncestralTowns([])
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
              >
                <option value="">Select Country</option>
                {diasporaOriginCountries.map((c: any) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">e.g. Jamaica, Sierra Leone, United Kingdom, United States</p>
            </div>

            {/* Ancestral Region / Province / State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ancestral Region / Province / State</label>
              {availableAncestralRegions.length > 0 ? (
                <select
                  value={formData.diasporaAncestralRegion || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    handleInputChange('diasporaAncestralRegion', val)
                    handleInputChange('diasporaAncestralDistrict', '')
                    handleInputChange('diasporaAncestralTown', '')
                    const regionObj = availableAncestralRegions.find((r: any) => r.name === val)
                    if (regionObj) {
                      const districts = ((diasporaOriginData as any).adminLevel2 ?? []).filter((a: any) => a.adminLevel1Id === regionObj.id)
                      setAvailableAncestralDistricts(districts)
                      setAvailableAncestralTowns([])
                    } else {
                      setAvailableAncestralDistricts([])
                      setAvailableAncestralTowns([])
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  disabled={!formData.diasporaAncestralCountry}
                >
                  <option value="">{formData.diasporaAncestralCountry ? 'Select Region / Province / State' : 'Select Country first'}</option>
                  {availableAncestralRegions.map((r: any) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.diasporaAncestralRegion || ''}
                  onChange={(e) => handleInputChange('diasporaAncestralRegion', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  placeholder={formData.diasporaAncestralCountry ? 'Enter Region / Province / State' : 'Select Country first'}
                  disabled={!formData.diasporaAncestralCountry}
                />
              )}
            </div>

            {/* District / Parish / County */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District / Parish / County</label>
              {availableAncestralDistricts.length > 0 ? (
                <select
                  value={formData.diasporaAncestralDistrict || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    handleInputChange('diasporaAncestralDistrict', val)
                    handleInputChange('diasporaAncestralTown', '')
                    const districtObj = availableAncestralDistricts.find((d: any) => d.name === val)
                    if (districtObj) {
                      const towns = ((diasporaOriginData as any).adminLevel3 ?? []).filter((a: any) => a.adminLevel2Id === districtObj.id)
                      setAvailableAncestralTowns(towns)
                    } else {
                      setAvailableAncestralTowns([])
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  disabled={!formData.diasporaAncestralRegion}
                >
                  <option value="">{formData.diasporaAncestralRegion ? 'Select District / Parish / County' : 'Select Region first'}</option>
                  {availableAncestralDistricts.map((d: any) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.diasporaAncestralDistrict || ''}
                  onChange={(e) => handleInputChange('diasporaAncestralDistrict', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                  placeholder={formData.diasporaAncestralRegion ? 'Enter District / Parish / County' : 'Select Region first'}
                  disabled={!formData.diasporaAncestralRegion}
                />
              )}
            </div>

            {/* Town / City / Settlement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Town / City / Settlement</label>
              <input
                type="text"
                value={formData.diasporaAncestralTown || ''}
                onChange={(e) => handleInputChange('diasporaAncestralTown', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                placeholder={formData.diasporaAncestralCountry ? 'Enter Town / City / Settlement' : 'Select Country first'}
                disabled={!formData.diasporaAncestralCountry}
              />
            </div>

            {/* Ethnic Identity (Self-Declared) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ethnic Identity (Self-Declared)</label>
              <select
                value={formData.diasporaEthnicIdentity || ''}
                onChange={(e) => handleInputChange('diasporaEthnicIdentity', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
              >
                <option value="">Select Ethnic Identity</option>
                <option value="Igbo">Igbo</option>
                <option value="Igbo-descendant">Igbo-descendant</option>
                <option value="Mixed (Igbo + other)">Mixed (Igbo + other)</option>
                <option value="Not sure">Not sure</option>
              </select>
            </div>

            {/* Associated Ethnic Identity - Open Ended */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Associated Ethnic Identity (Open-ended)</label>
              <input
                type="text"
                value={formData.diasporaAssociatedEthnicIdentity || ''}
                onChange={(e) => handleInputChange('diasporaAssociatedEthnicIdentity', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
                placeholder="e.g. Krio, Creole, Afro-Caribbean, Maroon..."
              />
            </div>

          </div>

          {/* Migration Path / Narrative */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Migration Path / Narrative (optional)</label>
            <textarea
              value={formData.diasporaMigrationNarrative || ''}
              onChange={(e) => handleInputChange('diasporaMigrationNarrative', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold resize-y"
              rows={3}
              placeholder="Describe how your family migrated, e.g. 'Igbo ancestors enslaved in the 18th century, resettled in Jamaica...' or structured tags like [Nigeria → Jamaica → UK]"
            />
          </div>

          {/* Cultural Connection Indicators */}
          <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
            <h5 className="text-sm font-semibold text-amber-900 mb-4">Cultural Connection Indicators</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Do you speak Igbo? */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Do you speak Igbo?</label>
                <div className="flex gap-4">
                  {(['Yes', 'No'] as const).map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="diasporaSpeaksIgbo"
                        value={opt}
                        checked={formData.diasporaSpeaksIgbo === opt}
                        onChange={() => handleInputChange('diasporaSpeaksIgbo', opt)}
                        className="h-4 w-4 text-brand-gold focus:ring-brand-gold"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Do you speak your associated ethnic language? */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Do you speak your associated ethnic language?</label>
                <div className="flex gap-4">
                  {(['Yes', 'No'] as const).map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="diasporaSpeaksEthnicLanguage"
                        value={opt}
                        checked={formData.diasporaSpeaksEthnicLanguage === opt}
                        onChange={() => handleInputChange('diasporaSpeaksEthnicLanguage', opt)}
                        className="h-4 w-4 text-brand-gold focus:ring-brand-gold"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Have you visited Nigeria? */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Have you visited Nigeria?</label>
                <div className="flex gap-4">
                  {(['Yes', 'No'] as const).map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="diasporaVisitedNigeria"
                        value={opt}
                        checked={formData.diasporaVisitedNigeria === opt}
                        onChange={() => handleInputChange('diasporaVisitedNigeria', opt)}
                        className="h-4 w-4 text-brand-gold focus:ring-brand-gold"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Do you know your ancestral town? */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Do you know your ancestral town?</label>
                <div className="flex gap-4">
                  {(['Yes', 'No'] as const).map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="diasporaKnowsAncestralTown"
                        value={opt}
                        checked={formData.diasporaKnowsAncestralTown === opt}
                        onChange={() => handleInputChange('diasporaKnowsAncestralTown', opt)}
                        className="h-4 w-4 text-brand-gold focus:ring-brand-gold"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <User className="w-6 h-6 mr-2 text-brand-bronze" />
          Your kinship information(Bloodline)
        </h3>
        <p className="text-gray-600">Tell us about your kinship system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 1. Hamlet (Kindred Group) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hamlet (Ama)
          </label>
          {availableHamlets.length > 0 && !isManualHamlet ? (
            <div className="space-y-2">
              <select
                value={formData.originHamlet || ''}
                onChange={(e) => {
                  if (e.target.value === 'OTHER') {
                    setIsManualHamlet(true)
                    handleInputChange('originHamlet', '')
                  } else {
                    handleInputChange('originHamlet', e.target.value)
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value="">Select Hamlet</option>
                {[...new Set(availableHamlets)].map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
                <option value="OTHER">Other (Enter Manually)</option>
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={formData.originHamlet || ''}
                onChange={(e) => handleInputChange('originHamlet', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                placeholder={formData.originVillage ? 'Enter Hamlet' : 'Select or enter village first'}
              />
            </div>
          )}
        </div>

        {/* 2. Kindred */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kindred (Umunna) *
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
                value={formData.kindred || ''}
                onChange={(e) => handleInputChange('kindred', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                placeholder={
                  formData.originHamlet || formData.originVillage
                    ? 'Enter Kindred'
                    : 'Select or enter hamlet first'
                }
              />
            </div>
          )}
        </div>

        {/* 3. Umunna Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Extended Family (Ikwu nibe)
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
                value={formData.umunna || ''}
                onChange={(e) => handleInputChange('umunna', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                placeholder={formData.kindred ? 'Enter Extended Family' : 'Select or enter kindred first'}
              />
            </div>
          )}
        </div>

        {/* 4. Surname */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nuclear Family (Ezinụlọ) *
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

        {/* 5. Personal Name */}
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

        {/* 6. Alternate Names */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Names</label>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
              placeholder="Add name and press Enter"
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

        {/* 7. Father */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Father
          </label>
          <input
            type="text"
            value={formData.fatherName || ''}
            onChange={(e) => handleInputChange('fatherName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            placeholder="Father's Name"
          />
        </div>

        {/* 8. Mother */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mother
          </label>
          <input
            type="text"
            value={formData.motherName || ''}
            onChange={(e) => handleInputChange('motherName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
            placeholder="Mother's Name"
          />
        </div>

        {/* 9. Email */}
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

        {/* 10. Phone Number */}
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



      {/* Advanced Fields - Expandable Sections */}
      <div className="space-y-4 mb-8">


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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genotype</label>
                  <select
                    value={personData.genotype || ''}
                    onChange={(e) => handlePersonFieldChange('genotype', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select genotype</option>
                    <option value="AA">AA</option>
                    <option value="AS">AS</option>
                    <option value="AC">AC</option>
                    <option value="SS">SS</option>
                    <option value="SC">SC</option>
                    <option value="CC">CC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <select
                    value={personData.bloodGroup || ''}
                    onChange={(e) => handlePersonFieldChange('bloodGroup', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="text"
                    value={personData.dateOfBirth || ''}
                    onChange={(e) => handlePersonFieldChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="YYYY-MM-DD or Year"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                  <input
                    type="text"
                    value={personData.placeOfBirth || ''}
                    onChange={(e) => handlePersonFieldChange('placeOfBirth', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Town/Village of Birth"
                  />
                </div>
              </div>
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

              {/* Other Life Events - Dynamic Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <label className="block text-sm font-medium text-brand-gold mb-3">Other Significant Life Events</label>

                {/* List of added events */}
                {personData.otherLifeEvents && personData.otherLifeEvents.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {personData.otherLifeEvents.map((event, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">{event.eventName}</p>
                          <div className="text-sm text-gray-600 flex gap-3 mt-1">
                            {event.eventDate && <span>📅 {event.eventDate}</span>}
                            {event.eventPlace && <span>📍 {event.eventPlace}</span>}
                          </div>
                          {event.eventDescription && <p className="text-xs text-gray-500 mt-1">{event.eventDescription}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLifeEvent(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new event inputs */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <input
                        type="text"
                        value={newEvent.eventName}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, eventName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                        placeholder="Event Name (e.g. Chieftaincy)"
                      />
                      <input
                        type="date"
                        value={newEvent.eventDate}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, eventDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newEvent.eventPlace}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, eventPlace: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                        placeholder="Location"
                      />
                      <input
                        type="text"
                        value={newEvent.eventDescription}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, eventDescription: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="Description (Optional)"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLifeEvent}
                    className="flex items-center text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    disabled={!newEvent.eventName.trim()}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Event
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
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

              {/* Identity documents held (tick which they have; no upload) */}
              <div className="border-t border-gray-200 pt-4 mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Identity documents (tick any you have)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {identityDocumentOptions.map((opt) => {
                    const held = personData.identityDocumentsHeld ?? []
                    const checked = held.includes(opt.id)
                    return (
                      <label
                        key={opt.id}
                        className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked
                              ? held.filter((id) => id !== opt.id)
                              : [...held, opt.id]
                            setPersonData((prev) => ({ ...prev, identityDocumentsHeld: next }))
                          }}
                          className="rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                        />
                        <span className="text-sm text-gray-700">{opt.label}</span>
                      </label>
                    )
                  })}
                </div>
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
