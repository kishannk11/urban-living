import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Building, Unit } from '@/types/firestore';

/**
 * Convert Firestore Timestamp to JavaScript Date
 * Firestore Timestamps can't be passed to client components directly
 */
function convertTimestamps<T extends Record<string, any>>(data: T): T {
    const converted: any = { ...data };

    // Convert createdAt and updatedAt if they exist
    if (converted.createdAt && typeof converted.createdAt.toDate === 'function') {
        converted.createdAt = converted.createdAt.toDate();
    }
    if (converted.updatedAt && typeof converted.updatedAt.toDate === 'function') {
        converted.updatedAt = converted.updatedAt.toDate();
    }

    return converted;
}

/**
 * Server-side helper to fetch building and unit data by slug
 * 
 * @param slug - Building slug from URL
 * @returns Object containing building and units, or null building if not found
 */
export async function fetchBuildingData(slug: string): Promise<{
    building: Building | null;
    units: Unit[];
}> {
    try {
        // Fetch building by slug
        const buildingsRef = collection(db, 'listing-groups');
        const buildingQuery = query(buildingsRef, where('slug', '==', slug));
        const buildingSnapshot = await getDocs(buildingQuery);

        if (buildingSnapshot.empty) {
            return {
                building: null,
                units: [],
            };
        }

        const buildingDoc = buildingSnapshot.docs[0];
        const buildingData = {
            id: buildingDoc.id,
            ...buildingDoc.data(),
        };

        // Convert Firestore Timestamps to Date objects
        const building = convertTimestamps(buildingData) as Building;

        // Fetch units for this building
        const unitsRef = collection(db, 'listings');
        const unitsQuery = query(unitsRef, where('buildingId', '==', buildingDoc.id));
        const unitsSnapshot = await getDocs(unitsQuery);

        const units = unitsSnapshot.docs.map((doc) => {
            const unitData = {
                id: doc.id,
                ...doc.data(),
            };
            // Convert Firestore Timestamps to Date objects
            return convertTimestamps(unitData) as Unit;
        });

        return {
            building,
            units,
        };
    } catch (error) {
        console.error('Error fetching building data:', error);
        // Return null building on error - will trigger 404
        return {
            building: null,
            units: [],
        };
    }
}
