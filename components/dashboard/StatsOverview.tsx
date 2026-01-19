'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Building, Unit, UnitStatus } from '@/types/firestore';

interface Stats {
    totalBuildings: number;
    activeInventory: number;
    totalScans: number;
}

/**
 * StatsOverview Component
 * 
 * Displays key performance metrics for the owner dashboard:
 * - Total Buildings: Count of buildings owned by the user
 * - Active Inventory: Count of units with status 'AVAILABLE'
 * - Total QR Scans: Sum of scanViews from all buildings
 */
export default function StatsOverview() {
    const [user] = useAuthState(auth);
    const [stats, setStats] = useState<Stats>({
        totalBuildings: 0,
        activeInventory: 0,
        totalScans: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Fetch all buildings owned by the current user
                const buildingsRef = collection(db, 'buildings');
                const buildingsQuery = query(
                    buildingsRef,
                    where('ownerId', '==', user?.uid)
                );
                const buildingsSnapshot = await getDocs(buildingsQuery);

                const buildings = buildingsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Building[];

                const totalBuildings = buildings.length;

                // Calculate total scans from all buildings
                const totalScans = buildings.reduce((sum, building) => {
                    return sum + (building.scanViews || 0);
                }, 0);

                // Fetch all units for these buildings
                const buildingIds = buildings.map((b) => b.id);
                let activeInventory = 0;

                if (buildingIds.length > 0) {
                    // Firestore 'in' queries support up to 10 items at a time
                    // If more than 10 buildings, we need to batch the queries
                    const batchSize = 10;
                    for (let i = 0; i < buildingIds.length; i += batchSize) {
                        const batch = buildingIds.slice(i, i + batchSize);
                        const unitsRef = collection(db, 'units');
                        const unitsQuery = query(
                            unitsRef,
                            where('buildingId', 'in', batch),
                            where('status', '==', UnitStatus.AVAILABLE)
                        );
                        const unitsSnapshot = await getDocs(unitsQuery);
                        activeInventory += unitsSnapshot.size;
                    }
                }

                setStats({
                    totalBuildings,
                    activeInventory,
                    totalScans,
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
                setError('Failed to load statistics');
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    // Format number with commas (e.g., 1,240)
    const formatNumber = (num: number): string => {
        return num.toLocaleString();
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                            <div className="ml-4 flex-1">
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-red-800 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Buildings */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-blue-600"
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
                        </div>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                            Total Buildings
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                            {formatNumber(stats.totalBuildings)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Active Inventory */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-green-600"
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
                        </div>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                            Active Inventory
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                            {formatNumber(stats.activeInventory)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Total QR Scans */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                            Total Scans
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                            {formatNumber(stats.totalScans)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
