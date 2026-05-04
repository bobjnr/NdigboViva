import dropdownData from './dropdown-data.json'

type DropdownDataShape = {
  wardsData?: Record<string, string[]>
  wardsByStateAndLga?: Record<string, Record<string, string[]>>
}

const data = dropdownData as DropdownDataShape

function normalizeLookupKey(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
}

function findMatchingKey<T>(map: Record<string, T> | undefined, key: string): string | null {
  if (!map) return null
  if (key in map) return key

  const normalizedKey = normalizeLookupKey(key)
  if (!normalizedKey) return null

  const exactMatch = Object.keys(map).find(
    (candidate) => normalizeLookupKey(candidate) === normalizedKey
  )
  if (exactMatch) return exactMatch

  const compactKey = normalizedKey.replace(/[^a-z0-9]/g, '')
  return (
    Object.keys(map).find((candidate) => {
      const compactCandidate = normalizeLookupKey(candidate).replace(/[^a-z0-9]/g, '')
      return compactCandidate === compactKey
    }) ?? null
  )
}

export function getWardOptions(state: string | null | undefined, lga: string | null | undefined): string[] {
  if (!lga) return []

  const stateKey = state ? findMatchingKey(data.wardsByStateAndLga, state) : null
  const stateMap = stateKey ? data.wardsByStateAndLga?.[stateKey] : undefined
  const lgaKeyWithinState = lga ? findMatchingKey(stateMap, lga) : null
  if (stateMap && lgaKeyWithinState) {
    return stateMap[lgaKeyWithinState] ?? []
  }
  if (stateMap) {
    return []
  }

  const flatLgaKey = findMatchingKey(data.wardsData, lga)
  return flatLgaKey ? data.wardsData?.[flatLgaKey] ?? [] : []
}
