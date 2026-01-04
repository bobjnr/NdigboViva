# 📊 Spreadsheet to Firebase Import Guide

This guide will help you migrate data from your Excel/CSV spreadsheet to Firebase Firestore.

## 📋 Prerequisites

1. ✅ Your new Firebase project is set up (see `FIREBASE_MIGRATION_GUIDE.md`)
2. ✅ Your `.env.local` file has the new Firebase credentials
3. ✅ Your spreadsheet is ready (Excel or CSV format)

## 🚀 Step-by-Step Import Process

### Step 1: Prepare Your Spreadsheet

Your spreadsheet should have column headers that match (or are similar to) the expected field names. The script will automatically map common variations.

**Required columns:**
- `fullName` (or `name`, `Full Name`, etc.)
- `gender` (MALE, FEMALE, OTHER, or UNKNOWN)
- `consentStatus` (TRUE/FALSE - must be TRUE)
- `visibilitySetting` (PRIVATE, PARTIAL, or PUBLIC)
- `isDiasporaRelative` (TRUE/FALSE)

**Optional columns:** See `docs/SPREADSHEET_TEMPLATE.md` for the complete list of supported columns.

### Step 2: Convert Excel to CSV (if needed)

If you have an Excel file (`NDIGBO VIVA DATABASE.xlsx`), convert it to CSV first:

**Option A: Using the existing Python script**
```bash
cd scripts
python combine_sheets.py
```
This will create `NDIGBO_VIVA_DATABASE_ALL.csv` with all sheets combined.

**Option B: Manual conversion**
1. Open your Excel file
2. Go to File → Save As
3. Choose "CSV (Comma delimited) (*.csv)"
4. Save with UTF-8 encoding

### Step 3: Install Required Dependencies

The import script uses Node.js built-in modules, but you'll need `tsx` to run TypeScript:

```bash
npm install --save-dev tsx
```

### Step 4: Place CSV File in Project

Place your CSV file in the `scripts/` directory or provide the full path when running the script.

### Step 5: Run the Import Script

```bash
npx tsx scripts/import-spreadsheet-to-firebase.ts scripts/NDIGBO_VIVA_DATABASE_ALL.csv
```

Or with a custom user ID for tracking who imported the data:

```bash
npx tsx scripts/import-spreadsheet-to-firebase.ts scripts/NDIGBO_VIVA_DATABASE_ALL.csv admin-user-id
```

### Step 6: Monitor the Import

The script will:
- ✅ Parse your CSV file
- ✅ Convert each row to a Person record
- ✅ Validate required fields
- ✅ Import in batches of 500 (Firestore limit)
- ✅ Show progress and summary

**Example output:**
```
🚀 Starting spreadsheet import...
📁 File: scripts/NDIGBO_VIVA_DATABASE_ALL.csv
📊 Parsing CSV...
✅ Found 1250 rows
🔄 Converting rows to person records...
✅ Converted 1245 valid records
⚠️  Skipped 5 invalid rows: 12, 45, 78, 120, 234
📤 Importing to Firebase...
📦 Processing batch 1/3 (500 records)...
✅ Batch 1 completed: 500 records imported
📦 Processing batch 2/3 (500 records)...
✅ Batch 2 completed: 500 records imported
📦 Processing batch 3/3 (245 records)...
✅ Batch 3 completed: 245 records imported

📊 Import Summary:
   Total rows in CSV: 1250
   Valid records: 1245
   Successfully imported: 1245
   Failed: 0

✅ Migration completed!
```

## 🔍 Column Name Mapping

The script automatically maps common column name variations. Here are some examples:

| Your Column Name | Maps To |
|-----------------|---------|
| `Full Name`, `Name`, `fullname` | `fullName` |
| `Gender`, `Sex`, `gender` | `gender` |
| `Date of Birth`, `DOB`, `Birth Date` | `dateOfBirth` |
| `LGA`, `Local Government Area` | `localGovernmentArea` |
| `Town`, `City` | `town` |
| `State`, `State/Province` | `state` |

**Note:** Column names are case-insensitive and spaces/special characters are ignored.

## ⚠️ Common Issues & Solutions

### Issue: "File not found"
**Solution:** Make sure the CSV file path is correct. Use absolute path if needed:
```bash
npx tsx scripts/import-spreadsheet-to-firebase.ts "C:\Users\YourName\Downloads\data.csv"
```

### Issue: "Missing required fields"
**Solution:** The script will skip rows missing `fullName`. Check your spreadsheet and ensure all required columns are present.

### Issue: "Permission denied" errors
**Solution:** 
1. Make sure your Firebase security rules allow writes (see `firestore.rules`)
2. Ensure your `.env.local` has the correct Firebase credentials
3. The script needs `consentStatus: true` for all records

### Issue: "Batch failed" errors
**Solution:**
- Check your internet connection
- Verify Firebase credentials in `.env.local`
- Check Firebase Console for any quota/limit issues
- Try running with a smaller batch size (edit the script)

### Issue: Data not appearing in Firebase
**Solution:**
1. Wait a few seconds for Firestore to sync
2. Refresh Firebase Console → Firestore Database → Data
3. Check the import summary for any failed records
4. Verify the `persons` collection exists (it's created automatically)

## 📊 Data Validation

The script validates and normalizes data:

- **Gender:** Converts "M", "Male", "MALE" → `MALE`
- **Booleans:** Converts "TRUE", "Yes", "1", "T" → `true`
- **Arrays:** Splits comma-separated values: "OZO,NZE" → `["OZO", "NZE"]`
- **Dates:** Preserves as-is (should be ISO format: "1945-03-15")
- **Numbers:** Parses integers for verification levels

## 🔄 Re-running the Import

If you need to re-import:

1. **Delete existing data** (if needed):
   - Go to Firebase Console → Firestore Database
   - Select all documents in `persons` collection
   - Delete them

2. **Or update existing records:**
   - The script will create new records with new Person IDs
   - If you want to update existing records, you'll need a custom script

## 📝 Post-Import Checklist

After importing:

- [ ] Check Firebase Console → Firestore Database → Data
- [ ] Verify `persons` collection exists
- [ ] Check a few sample records to ensure data looks correct
- [ ] Test searching for a person in your application
- [ ] Verify family relationships (fatherId, motherId, etc.) if you have them

## 🆘 Getting Help

If you encounter issues:

1. Check the error messages in the console output
2. Review the skipped rows list
3. Verify your CSV format matches the expected structure
4. Check Firebase Console for any error logs
5. Review `docs/SPREADSHEET_TEMPLATE.md` for column structure

## 📚 Related Documentation

- `docs/FIREBASE_MIGRATION_GUIDE.md` - Setting up new Firebase account
- `docs/SPREADSHEET_TEMPLATE.md` - Complete column structure reference
- `firestore.rules` - Security rules for Firestore

---

**Last Updated:** 2024


