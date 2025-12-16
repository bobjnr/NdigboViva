# IGBO ANCESTRY NETWORK - IMPLEMENTATION GUIDE

**Complete guide to implementing and using the new Person-centric database system**

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [What's Been Created](#whats-been-created)
3. [How to Use](#how-to-use)
4. [API Endpoints](#api-endpoints)
5. [Migration Guide](#migration-guide)
6. [Next Steps](#next-steps)

---

## 🎯 OVERVIEW

The new database design transforms your genealogy system from a **family-group model** to an **individual person model** with full relationship linking. This enables:

- ✅ Building family trees automatically
- ✅ Preventing duplicate entries
- ✅ Preserving cultural identity
- ✅ Enabling diaspora reconnection
- ✅ Maintaining data integrity with verification levels

---

## 📦 WHAT'S BEEN CREATED

### 1. **Core Schema** (`src/lib/person-schema.ts`)
- Complete TypeScript interfaces for all 7 data layers
- 67 fields covering identity, lineage, culture, events, documentation, verification, and diaspora
- Helper functions for creating person records

### 2. **Database Operations** (`src/lib/person-database.ts`)
- Full CRUD operations for Firestore
- Search functions (by name, location, verification, diaspora)
- Family tree building
- Relationship linking
- Statistics and analytics

### 3. **API Endpoints** (`src/app/api/persons/`)
- `POST /api/persons/create` - Create new person record
- `GET /api/persons/search` - Search persons
- `GET /api/persons/[personId]` - Get person by ID
- `PUT /api/persons/[personId]` - Update person record
- `GET /api/persons/family-tree/[personId]` - Get family tree

### 4. **Form Component** (`src/components/PersonForm.tsx`)
- Multi-tab form interface
- All 7 data layers organized into tabs
- User-friendly with validation
- Progressive disclosure (optional fields)

### 5. **Migration Utility** (`src/lib/migration-utility.ts`)
- Converts old `GenealogyRecord` format to new `PersonRecord` format
- Batch migration support
- Migration reporting

### 6. **Documentation**
- `docs/DATA_DICTIONARY.md` - Complete field reference
- `docs/SPREADSHEET_TEMPLATE.md` - Spreadsheet structure for manual entry
- `docs/IMPLEMENTATION_GUIDE.md` - This guide

---

## 🚀 HOW TO USE

### Option 1: Use the New PersonForm Component

Replace or add the new form component to your pages:

```tsx
import PersonForm from '@/components/PersonForm'

export default function AddPersonPage() {
  const handleSubmit = (data: PersonFormSubmission) => {
    console.log('Person created:', data)
    // Handle success (redirect, show message, etc.)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add Person to Ancestry Network</h1>
      <PersonForm onSubmit={handleSubmit} />
    </div>
  )
}
```

### Option 2: Use API Endpoints Directly

#### Create a Person Record

```typescript
const response = await fetch('/api/persons/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'CHUKWUEMEKA OKAFOR',
    gender: 'MALE',
    dateOfBirth: '1945-03-15',
    umunna: 'UMUNNEBOGBU',
    village: 'ELEKECHEM',
    town: 'ACHINA',
    state: 'ANAMBRA',
    consentStatus: true,
    visibilitySetting: 'PRIVATE',
    isDiasporaRelative: false,
  })
})

const result = await response.json()
console.log('Person ID:', result.personId)
```

#### Search for Persons

```typescript
// Search by name
const response = await fetch('/api/persons/search?type=name&q=OKAFOR')
const result = await response.json()

// Search by location
const response = await fetch('/api/persons/search?type=location&state=ANAMBRA&town=ACHINA')
const result = await response.json()

// Search diaspora
const response = await fetch('/api/persons/search?type=diaspora&country=UNITED STATES')
const result = await response.json()
```

#### Get Family Tree

```typescript
const response = await fetch('/api/persons/family-tree/P1734567890_abc123?depth=3')
const result = await response.json()
console.log('Ancestors:', result.familyTree.ancestors)
console.log('Descendants:', result.familyTree.descendants)
```

### Option 3: Use Database Functions Directly

```typescript
import { 
  createPerson, 
  getPersonById, 
  searchPersonsByName,
  getFamilyTree 
} from '@/lib/person-database'

// Create person
const result = await createPerson(formData, userId)

// Get person
const person = await getPersonById('P1734567890_abc123')

// Search
const results = await searchPersonsByName('OKAFOR')

// Get family tree
const tree = await getFamilyTree('P1734567890_abc123', 3)
```

---

## 🔌 API ENDPOINTS

### POST `/api/persons/create`

Create a new person record.

**Request Body:**
```json
{
  "fullName": "CHUKWUEMEKA OKAFOR",
  "gender": "MALE",
  "consentStatus": true,
  "isDiasporaRelative": false,
  "visibilitySetting": "PRIVATE",
  // ... other optional fields
}
```

**Response:**
```json
{
  "success": true,
  "personId": "P1734567890_abc123",
  "message": "Person record created successfully"
}
```

### GET `/api/persons/search`

Search for persons.

**Query Parameters:**
- `type`: `name` | `location` | `diaspora`
- `q`: Search query (for name search)
- `state`, `lga`, `town`, `village`, `umunna`: Location filters
- `country`: Country filter (for diaspora search)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "results": [/* array of PersonRecord */]
}
```

### GET `/api/persons/[personId]`

Get a person by their ID.

**Response:**
```json
{
  "success": true,
  "person": {/* PersonRecord */}
}
```

### PUT `/api/persons/[personId]`

Update a person record.

**Request Body:**
```json
{
  "identity": {
    "fullName": "UPDATED NAME"
  },
  // ... partial updates
}
```

### GET `/api/persons/family-tree/[personId]`

Get family tree (ancestors and descendants).

**Query Parameters:**
- `depth`: Maximum depth (default: 3)

**Response:**
```json
{
  "success": true,
  "familyTree": {
    "person": {/* PersonRecord */},
    "ancestors": [/* array of PersonRecord */],
    "descendants": [/* array of PersonRecord */]
  }
}
```

---

## 🔄 MIGRATION GUIDE

### Migrating Old Records

If you have existing `GenealogyRecord` data, use the migration utility:

```typescript
import { 
  migrateGenealogyRecordToPersons,
  batchMigrateGenealogyRecords,
  generateMigrationReport
} from '@/lib/migration-utility'
import { genealogyDB } from '@/lib/genealogy-database'

// Get old records
const oldRecords = genealogyDB.getAllRecords()

// Migrate all records
const result = await batchMigrateGenealogyRecords(oldRecords, 'admin_user_id')

// Generate report
const report = generateMigrationReport(oldRecords, result)
console.log(report)
```

### Migration Process

1. **Backup existing data** - Export all old records to CSV/JSON
2. **Run migration** - Use `batchMigrateGenealogyRecords()`
3. **Review report** - Check for errors
4. **Verify data** - Spot-check migrated records
5. **Update forms** - Switch to new PersonForm component

### Migration Notes

- Old records with multiple individuals create multiple person records
- Gender defaults to `UNKNOWN` (can be updated later)
- Verification level set to 2 if old record was verified, else 0
- Family relationships not automatically linked (must be done manually)
- Cultural fields not migrated (old format didn't have them)

---

## 📝 NEXT STEPS

### Immediate Actions

1. **Test the Form**
   - Add the PersonForm component to a test page
   - Create a few test person records
   - Verify data is saved to Firestore

2. **Set Up Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /persons/{personId} {
         // Allow read if visibility is PUBLIC or user is admin
         allow read: if resource.data.verification.visibilitySetting == 'PUBLIC' 
                    || request.auth != null;
         
         // Allow create with consent
         allow create: if request.resource.data.verification.consentStatus == true;
         
         // Allow update if user is creator or admin
         allow update: if request.auth != null 
                      && (request.auth.uid == resource.data.verification.createdBy
                          || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
       }
     }
   }
   ```

3. **Create Admin Dashboard**
   - View all persons
   - Search and filter
   - Update verification levels
   - Manage relationships

4. **Build Family Tree Viewer**
   - Visual tree display
   - Interactive navigation
   - Relationship visualization

5. **Add Relationship Linking UI**
   - Search for existing persons
   - Link father/mother/spouse/children
   - Validate relationships

### Future Enhancements

- **Photo Upload**: Integrate with Firebase Storage
- **Document Management**: Upload and link documents
- **Advanced Search**: Full-text search with Algolia/Elasticsearch
- **Diaspora Matching**: Algorithm to match diaspora relatives
- **Export Tools**: Export family trees to PDF/GEDCOM
- **Mobile App**: React Native app for data entry
- **Elder Portal**: Special interface for elders to validate records

---

## 🛠 TROUBLESHOOTING

### Common Issues

**Issue**: "Consent status must be true"
- **Solution**: Ensure `consentStatus: true` in form submission

**Issue**: "Person not found" when linking relationships
- **Solution**: Create parent/spouse/child records first, then link

**Issue**: Firestore permission denied
- **Solution**: Check Firestore security rules and user authentication

**Issue**: Search not finding results
- **Solution**: Firestore text search is limited; consider adding search index or using external search service

---

## 📚 ADDITIONAL RESOURCES

- **Data Dictionary**: See `docs/DATA_DICTIONARY.md` for complete field reference
- **Spreadsheet Template**: See `docs/SPREADSHEET_TEMPLATE.md` for manual entry format
- **Schema Reference**: See `src/lib/person-schema.ts` for TypeScript types

---

## ✅ CHECKLIST

Before going live:

- [ ] Test form submission with all field types
- [ ] Verify Firestore security rules
- [ ] Test API endpoints
- [ ] Create sample data (10-20 person records)
- [ ] Test family tree building
- [ ] Test relationship linking
- [ ] Test search functionality
- [ ] Review privacy settings
- [ ] Train data entry staff
- [ ] Set up backup procedures

---

**Last Updated**: 2024
**Version**: 1.0

