# Firebase Collection Migration

## Step 1: Download Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `urban-living-4b969`
3. Click ⚙️ (Settings) → Project settings
4. Go to "Service accounts" tab
5. Click "Generate new private key"
6. Save the file as `serviceAccountKey.json` in the project root

> **Important**: Add `serviceAccountKey.json` to `.gitignore` to avoid committing credentials!

## Step 2: Install Dependencies

```bash
npm install firebase-admin
```

## Step 3: Run Migration

```bash
node scripts/migrate-collections.js
```

This will:
- Copy all `buildings` → `listing-groups`
- Copy all `units` → `listings`
- Preserve all document IDs and data

## Step 4: Verify Migration

1. Check Firebase Console → Firestore Database
2. Verify `listing-groups` and `listings` collections exist
3. Verify document counts match original collections

## Step 5: Test Application

```bash
npm run dev
```

Test:
- Dashboard loads properly
- Create new listing-group
- Create new listing
- Edit/delete operations work

## Step 6: Delete Old Collections

**Only after thorough testing:**

1. Go to Firebase Console → Firestore Database
2. Delete `buildings` collection
3. Delete `units` collection

## Rollback Instructions

If anything goes wrong:

```bash
# Simply revert code changes
git revert HEAD

# Old collections are untouched - app will work with them again
```
