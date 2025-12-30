/**
 * IGBO ANCESTRY NETWORK - FIREBASE FIRESTORE DATABASE OPERATIONS
 * 
 * This module handles all database operations for Person records in Firestore.
 * Collection: "persons"
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  QueryConstraint,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  PersonRecord, 
  PersonFormSubmission, 
  createPersonFromForm,
  generatePersonId,
  VerificationLevel,
  VisibilitySetting
} from './person-schema';

const COLLECTION_NAME = 'persons';

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

/**
 * Save a new person record to Firestore
 */
export async function createPerson(
  formData: PersonFormSubmission,
  createdBy?: string
): Promise<{ success: boolean; personId?: string; error?: string }> {
  try {
    const person = createPersonFromForm(formData, createdBy);
    const personRef = doc(db, COLLECTION_NAME, person.identity.personId);
    
    // Convert Timestamps for Firestore
    const firestoreData = {
      ...person,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(personRef, firestoreData);
    
    return { 
      success: true, 
      personId: person.identity.personId 
    };
  } catch (error) {
    console.error('Error creating person:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Create multiple person records in a batch
 */
export async function createPersonsBatch(
  persons: PersonFormSubmission[],
  createdBy?: string
): Promise<{ success: boolean; created: number; errors: string[] }> {
  const batch = writeBatch(db);
  const errors: string[] = [];
  let created = 0;
  
  try {
    for (const formData of persons) {
      const person = createPersonFromForm(formData, createdBy);
      const personRef = doc(db, COLLECTION_NAME, person.identity.personId);
      
      const firestoreData = {
        ...person,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      batch.set(personRef, firestoreData);
      created++;
    }
    
    await batch.commit();
    return { success: true, created, errors };
  } catch (error) {
    console.error('Error in batch create:', error);
    errors.push(error instanceof Error ? error.message : 'Unknown error');
    return { success: false, created, errors };
  }
}

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Get a person by their Person ID
 */
export async function getPersonById(personId: string): Promise<PersonRecord | null> {
  try {
    const personRef = doc(db, COLLECTION_NAME, personId);
    const personSnap = await getDoc(personRef);
    
    if (!personSnap.exists()) {
      console.log('Person document does not exist:', personId);
      return null;
    }
    
    const data = personSnap.data();
    
    // Firestore returns data, but we need to ensure it's properly structured
    // Convert Firestore Timestamps to the format we expect
    const person: PersonRecord = {
      ...data,
      createdAt: data.createdAt || Timestamp.now(),
      updatedAt: data.updatedAt || Timestamp.now(),
    } as PersonRecord;
    
    return person;
  } catch (error) {
    console.error('Error getting person:', error);
    console.error('PersonId was:', personId);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
}

/**
 * Get multiple persons by their IDs
 */
export async function getPersonsByIds(personIds: string[]): Promise<PersonRecord[]> {
  try {
    const persons: PersonRecord[] = [];
    
    // Firestore 'in' queries are limited to 10 items
    const chunks: string[][] = [];
    for (let i = 0; i < personIds.length; i += 10) {
      chunks.push(personIds.slice(i, i + 10));
    }
    
    for (const chunk of chunks) {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('identity.personId', 'in', chunk)
      );
      
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        persons.push(doc.data() as PersonRecord);
      });
    }
    
    return persons;
  } catch (error) {
    console.error('Error getting persons by IDs:', error);
    return [];
  }
}

/**
 * Get all persons (with pagination)
 */
export async function getAllPersons(
  pageSize: number = 50,
  lastPersonId?: string
): Promise<PersonRecord[]> {
  try {
    const constraints: QueryConstraint[] = [
      orderBy('identity.personId'),
      limit(pageSize)
    ];
    
    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const persons: PersonRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure timestamps are properly set
      const person: PersonRecord = {
        ...data,
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || Timestamp.now(),
      } as PersonRecord;
      persons.push(person);
    });
    
    return persons;
  } catch (error) {
    console.error('Error getting all persons:', error);
    return [];
  }
}

// ============================================================================
// SEARCH OPERATIONS
// ============================================================================

/**
 * Search persons by name (full name or alternate names)
 */
export async function searchPersonsByName(searchTerm: string): Promise<PersonRecord[]> {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic prefix search - for production, consider Algolia or similar
    const searchUpper = searchTerm.toUpperCase().trim();
    const q = query(
      collection(db, COLLECTION_NAME),
      where('identity.fullName', '>=', searchUpper),
      where('identity.fullName', '<=', searchUpper + '\uf8ff'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    const persons: PersonRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const person = doc.data() as PersonRecord;
      // Also check alternate names
      const matchesAlternate = person.identity.alternateNames?.some(
        name => name.toUpperCase().includes(searchUpper)
      );
      
      if (person.identity.fullName.toUpperCase().includes(searchUpper) || matchesAlternate) {
        persons.push(person);
      }
    });
    
    return persons;
  } catch (error) {
    console.error('Error searching persons by name:', error);
    return [];
  }
}

/**
 * Get persons by location (state, LGA, town, village)
 */
export async function getPersonsByLocation(
  filters: {
    state?: string;
    lga?: string;
    town?: string;
    village?: string;
    umunna?: string;
  }
): Promise<PersonRecord[]> {
  try {
    const constraints: QueryConstraint[] = [];
    
    if (filters.state) {
      constraints.push(where('lineage.state', '==', filters.state.toUpperCase()));
    }
    if (filters.lga) {
      constraints.push(where('lineage.localGovernmentArea', '==', filters.lga.toUpperCase()));
    }
    if (filters.town) {
      constraints.push(where('lineage.town', '==', filters.town.toUpperCase()));
    }
    if (filters.village) {
      constraints.push(where('lineage.village', '==', filters.village.toUpperCase()));
    }
    if (filters.umunna) {
      constraints.push(where('lineage.umunna', '==', filters.umunna.toUpperCase()));
    }
    
    constraints.push(limit(100));
    
    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const persons: PersonRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure timestamps are properly set
      const person: PersonRecord = {
        ...data,
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || Timestamp.now(),
      } as PersonRecord;
      persons.push(person);
    });
    
    return persons;
  } catch (error) {
    console.error('Error getting persons by location:', error);
    return [];
  }
}

/**
 * Get persons by family relationship
 */
export async function getPersonsByRelationship(
  personId: string,
  relationship: 'father' | 'mother' | 'spouse' | 'children'
): Promise<PersonRecord[]> {
  try {
    const person = await getPersonById(personId);
    if (!person) return [];
    
    let relatedIds: string[] = [];
    
    switch (relationship) {
      case 'father':
        if (person.lineage.fatherId) relatedIds = [person.lineage.fatherId];
        break;
      case 'mother':
        if (person.lineage.motherId) relatedIds = [person.lineage.motherId];
        break;
      case 'spouse':
        relatedIds = person.lineage.spouseIds || [];
        break;
      case 'children':
        relatedIds = person.lineage.childrenIds || [];
        break;
    }
    
    if (relatedIds.length === 0) return [];
    
    return await getPersonsByIds(relatedIds);
  } catch (error) {
    console.error('Error getting persons by relationship:', error);
    return [];
  }
}

/**
 * Get diaspora persons
 */
export async function getDiasporaPersons(
  country?: string
): Promise<PersonRecord[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('diaspora.isDiasporaRelative', '==', true),
      limit(100)
    ];
    
    if (country) {
      constraints.unshift(where('diaspora.countryOfResidence', '==', country));
    }
    
    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const persons: PersonRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure timestamps are properly set
      const person: PersonRecord = {
        ...data,
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || Timestamp.now(),
      } as PersonRecord;
      persons.push(person);
    });
    
    return persons;
  } catch (error) {
    console.error('Error getting diaspora persons:', error);
    return [];
  }
}

/**
 * Get persons by verification level
 */
export async function getPersonsByVerificationLevel(
  level: VerificationLevel,
  visibility?: VisibilitySetting
): Promise<PersonRecord[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('verification.verificationLevel', '==', level),
      limit(100)
    ];
    
    if (visibility) {
      constraints.push(where('verification.visibilitySetting', '==', visibility));
    }
    
    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const persons: PersonRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure timestamps are properly set
      const person: PersonRecord = {
        ...data,
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || Timestamp.now(),
      } as PersonRecord;
      persons.push(person);
    });
    
    return persons;
  } catch (error) {
    console.error('Error getting persons by verification level:', error);
    return [];
  }
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update a person record
 */
export async function updatePerson(
  personId: string,
  updates: Partial<PersonRecord>,
  modifiedBy?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const personRef = doc(db, COLLECTION_NAME, personId);
    const person = await getPersonById(personId);
    
    if (!person) {
      return { success: false, error: 'Person not found' };
    }
    
    // Check if record is locked
    if (person.verification.recordLockDate) {
      return { success: false, error: 'Record is locked and cannot be modified' };
    }
    
    // Add to edit history
    const editHistory = person.verification.editHistory || [];
    editHistory.push({
      editedBy: modifiedBy || 'SYSTEM',
      editedAt: Timestamp.now(),
      changes: JSON.stringify(updates),
    });
    
    const updateData = {
      ...updates,
      'verification.lastModifiedBy': modifiedBy,
      'verification.editHistory': editHistory,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(personRef, updateData);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating person:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Update verification level
 */
export async function updateVerificationLevel(
  personId: string,
  level: VerificationLevel,
  validatedBy?: string,
  authority?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const updates: Partial<PersonRecord> = {
      verification: {
        verificationLevel: level,
        verified: level >= 2,
        validatedBy,
        validatedAt: Timestamp.now(),
      } as any,
    };
    
    if (authority) {
      (updates.verification as any).validationAuthority = authority;
    }
    
    return await updatePerson(personId, updates, validatedBy);
  } catch (error) {
    console.error('Error updating verification level:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Link family relationships
 */
export async function linkFamilyRelationship(
  personId: string,
  relationship: 'father' | 'mother' | 'spouse' | 'child',
  relatedPersonId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const person = await getPersonById(personId);
    if (!person) {
      return { success: false, error: 'Person not found' };
    }
    
    const updates: Partial<PersonRecord> = {};
    
    switch (relationship) {
      case 'father':
        updates.lineage = { ...person.lineage, fatherId: relatedPersonId };
        break;
      case 'mother':
        updates.lineage = { ...person.lineage, motherId: relatedPersonId };
        break;
      case 'spouse':
        const spouseIds = person.lineage.spouseIds || [];
        if (!spouseIds.includes(relatedPersonId)) {
          updates.lineage = { ...person.lineage, spouseIds: [...spouseIds, relatedPersonId] };
        }
        break;
      case 'child':
        const childrenIds = person.lineage.childrenIds || [];
        if (!childrenIds.includes(relatedPersonId)) {
          updates.lineage = { ...person.lineage, childrenIds: [...childrenIds, relatedPersonId] };
        }
        break;
    }
    
    return await updatePerson(personId, updates);
  } catch (error) {
    console.error('Error linking family relationship:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ============================================================================
// FAMILY TREE OPERATIONS
// ============================================================================

/**
 * Get family tree (ancestors and descendants)
 */
export async function getFamilyTree(
  personId: string,
  maxDepth: number = 3
): Promise<{
  person: PersonRecord;
  ancestors: PersonRecord[];
  descendants: PersonRecord[];
}> {
  try {
    const person = await getPersonById(personId);
    if (!person) {
      throw new Error('Person not found');
    }
    
    const ancestors: PersonRecord[] = [];
    const descendants: PersonRecord[] = [];
    
    // Get ancestors (parents, grandparents, etc.)
    async function getAncestors(currentPerson: PersonRecord, depth: number) {
      if (depth >= maxDepth) return;
      
      const parentIds: string[] = [];
      if (currentPerson.lineage.fatherId) parentIds.push(currentPerson.lineage.fatherId);
      if (currentPerson.lineage.motherId) parentIds.push(currentPerson.lineage.motherId);
      
      if (parentIds.length > 0) {
        const parents = await getPersonsByIds(parentIds);
        ancestors.push(...parents);
        
        for (const parent of parents) {
          await getAncestors(parent, depth + 1);
        }
      }
    }
    
    // Get descendants (children, grandchildren, etc.)
    async function getDescendants(currentPerson: PersonRecord, depth: number) {
      if (depth >= maxDepth) return;
      
      if (currentPerson.lineage.childrenIds && currentPerson.lineage.childrenIds.length > 0) {
        const children = await getPersonsByIds(currentPerson.lineage.childrenIds);
        descendants.push(...children);
        
        for (const child of children) {
          await getDescendants(child, depth + 1);
        }
      }
    }
    
    await Promise.all([
      getAncestors(person, 0),
      getDescendants(person, 0)
    ]);
    
    return { person, ancestors, descendants };
  } catch (error) {
    console.error('Error getting family tree:', error);
    throw error;
  }
}

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

/**
 * Get database statistics
 */
export async function getDatabaseStats(): Promise<{
  totalPersons: number;
  verifiedPersons: number;
  diasporaPersons: number;
  byState: Record<string, number>;
}> {
  try {
    const allPersons = await getAllPersons(10000); // Get large batch for stats
    
    const stats = {
      totalPersons: allPersons.length,
      verifiedPersons: allPersons.filter(p => p.verification.verified).length,
      diasporaPersons: allPersons.filter(p => p.diaspora.isDiasporaRelative).length,
      byState: {} as Record<string, number>,
    };
    
    allPersons.forEach(person => {
      const state = person.lineage.state || 'UNKNOWN';
      stats.byState[state] = (stats.byState[state] || 0) + 1;
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting database stats:', error);
    return {
      totalPersons: 0,
      verifiedPersons: 0,
      diasporaPersons: 0,
      byState: {},
    };
  }
}

