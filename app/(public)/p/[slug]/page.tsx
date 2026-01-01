'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Building, Unit } from '@/types/firestore';
import BuildingHeader from '@/components/public/BuildingHeader';
import UnitCard from '@/components/public/UnitCard';
import UnitDetailsModal from '@/components/public/UnitDetailsModal';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function BuildingPage({ params }: PageProps) {
    const [building, setBuilding] = useState<Building | null>(null);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [slug, setSlug] = useState<string | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    // Unwrap params
    useEffect(() => {
        params.then((p) => setSlug(p.slug));
    }, [params]);

    useEffect(() => {
        if (!slug) return;

        const fetchBuildingData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch building by slug
                const buildingsRef = collection(db, 'buildings');
                const buildingQuery = query(buildingsRef, where('slug', '==', slug));
                const buildingSnapshot = await getDocs(buildingQuery);

                if (buildingSnapshot.empty) {
                    setError('Building not found');
                    setLoading(false);
                    return;
                }

                const buildingDoc = buildingSnapshot.docs[0];
                const buildingData = {
                    id: buildingDoc.id,
                    ...buildingDoc.data(),
                } as Building;

                setBuilding(buildingData);

                // Fetch units for this building
                const unitsRef = collection(db, 'units');
                const unitsQuery = query(unitsRef, where('buildingId', '==', buildingDoc.id));
                const unitsSnapshot = await getDocs(unitsQuery);

                const unitsData = unitsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Unit[];

                setUnits(unitsData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching building data:', err);
                setError('Failed to load building information');
                setLoading(false);
            }
        };

        fetchBuildingData();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !building) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
                <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {error || 'Building Not Found'}
                </h2>
                <p className="text-gray-600">
                    The property you're looking for doesn't exist or has been removed.
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Building Header */}
            <BuildingHeader building={building} />

            {/* Available Units Section */}
            <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Available Units
                </h2>

                {units.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <svg
                            className="w-12 h-12 text-gray-400 mx-auto mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        <p className="text-gray-600 text-sm sm:text-base">
                            No units available at this property currently.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {units.map((unit) => (
                            <UnitCard
                                key={unit.id}
                                unit={unit}
                                onClick={() => setSelectedUnit(unit)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Unit Details Modal */}
            <UnitDetailsModal
                unit={selectedUnit}
                building={building}
                isOpen={!!selectedUnit}
                onClose={() => setSelectedUnit(null)}
            />
        </div>
    );
}
