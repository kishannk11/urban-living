/**
 * Firebase Collection Migration Script
 * 
 * Migrates data from:
 * - buildings → listing-groups
 * - units → listings
 * 
 * Usage: node scripts/migrate-collections.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK using environment variables
// Make sure your Firebase credentials are set up
try {
    // Try to use application default credentials or service account
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
    } else {
        // Use the project's Firebase config
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: "urban-living-4b969",
                // For security, these should be environment variables
                // But for quick migration, we'll use the web app config
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
            databaseURL: "https://urban-living-4b969.firebaseio.com"
        });
    }
} catch (error) {
    console.error('\n❌ Firebase initialization failed!');
    console.error('\nPlease set up Firebase credentials using ONE of these methods:\n');
    console.log('1. Download service account key from Firebase Console:');
    console.log('   - Go to Project Settings → Service Accounts');
    console.log('   - Click "Generate new private key"');
    console.log('   - Save as serviceAccountKey.json in project root');
    console.log('   - Set: export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"\n');
    console.log('2. Or set environment variables:');
    console.log('   - export FIREBASE_CLIENT_EMAIL="your-client-email"');
    console.log('   - export FIREBASE_PRIVATE_KEY="your-private-key"\n');
    process.exit(1);
}

const db = admin.firestore();

async function migrateCollections() {
    try {
        console.log('\n🚀 Starting Firebase Collection Migration...\n');

        // Step 1: Migrate buildings → listing-groups
        console.log('📦 Migrating buildings → listing-groups...');
        const buildingsSnapshot = await db.collection('buildings').get();
        console.log(`   Found ${buildingsSnapshot.size} buildings to migrate`);

        let migratedBuildings = 0;
        for (const doc of buildingsSnapshot.docs) {
            await db.collection('listing-groups').doc(doc.id).set(doc.data());
            migratedBuildings++;
            process.stdout.write(`   Progress: ${migratedBuildings}/${buildingsSnapshot.size}\r`);
        }
        console.log(`\n   ✅ Migrated ${migratedBuildings} buildings → listing-groups`);

        // Step 2: Migrate units → listings
        console.log('\n📦 Migrating units → listings...');
        const unitsSnapshot = await db.collection('units').get();
        console.log(`   Found ${unitsSnapshot.size} units to migrate`);

        let migratedUnits = 0;
        for (const doc of unitsSnapshot.docs) {
            await db.collection('listings').doc(doc.id).set(doc.data());
            migratedUnits++;
            process.stdout.write(`   Progress: ${migratedUnits}/${unitsSnapshot.size}\r`);
        }
        console.log(`\n   ✅ Migrated ${migratedUnits} units → listings`);

        // Summary
        console.log('\n✅ Migration Complete!\n');
        console.log('📊 Summary:');
        console.log(`   - listing-groups: ${migratedBuildings} documents`);
        console.log(`   - listings: ${migratedUnits} documents`);
        console.log('\n⚠️  Next Steps:');
        console.log('   1. Verify data in Firebase Console');
        console.log('   2. Test your application');
        console.log('   3. Deploy updated code: npm run build && firebase deploy');
        console.log('   4. Deploy security rules: firebase deploy --only firestore:rules');
        console.log('   5. Delete old collections manually after testing:');
        console.log('      - buildings');
        console.log('      - units');
        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateCollections();
