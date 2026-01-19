/**
 * Simplified Firebase Collection Migration
 * Loads service account directly from file
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrate() {
    try {
        console.log('\n🚀 Starting Firebase Collection Migration...\n');

        // Migrate buildings → listing-groups
        console.log('📦 Migrating buildings → listing-groups...');
        const buildings = await db.collection('buildings').get();
        console.log(`   Found ${buildings.size} buildings`);

        for (const doc of buildings.docs) {
            await db.collection('listing-groups').doc(doc.id).set(doc.data());
        }
        console.log(`   ✅ Migrated ${buildings.size} buildings\n`);

        // Migrate units → listings
        console.log('📦 Migrating units → listings...');
        const units = await db.collection('units').get();
        console.log(`   Found ${units.size} units`);

        for (const doc of units.docs) {
            await db.collection('listings').doc(doc.id).set(doc.data());
        }
        console.log(`   ✅ Migrated ${units.size} units\n`);

        console.log('✅ Migration Complete!\n');
        console.log('Next steps:');
        console.log('  1. Test your app');
        console.log('  2. Deploy: firebase deploy');
        console.log('  3. Delete old collections in Firebase Console\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
