'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Building } from '@/types/firestore';
import Link from 'next/link';

export default function MyBuildingsPage() {
    const [user] = useAuthState(auth);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchBuildings = async () => {
            try {
                setLoading(true);
                const buildingsRef = collection(db, 'buildings');
                const q = query(buildingsRef, where('ownerId', '==', user.uid));
                const snapshot = await getDocs(q);

                const buildingsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Building[];

                setBuildings(buildingsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching buildings:', error);
                setLoading(false);
            }
        };

        fetchBuildings();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Buildings</h1>
                    <p className="text-gray-600 mt-2">
                        Manage your property listings
                    </p>
                </div>
                <Link
                    href="/dashboard/add-property"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                >
                    + Add Building
                </Link>
            </div>

            {buildings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <svg
                        className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No buildings yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Get started by adding your first property
                    </p>
                    <Link
                        href="/dashboard/add-property"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                    >
                        Add Your First Building
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buildings.map((building) => (
                        <div
                            key={building.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                        >
                            {building.imageUrl && (
                                <div className="h-48 bg-gray-200">
                                    <img
                                        src={building.imageUrl}
                                        alt={building.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {building.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 flex items-start">
                                    <svg
                                        className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                    </svg>
                                    {building.address}
                                </p>
                                {building.description && (
                                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                                        {building.description}
                                    </p>
                                )}
                                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                                    <Link
                                        href={`/dashboard/buildings/${building.id}`}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center text-sm"
                                    >
                                        Manage Units
                                    </Link>
                                    <Link
                                        href={`/p/${building.slug}`}
                                        target="_blank"
                                        className="w-full text-blue-600 hover:text-blue- 700 text-sm font-medium text-center"
                                    >
                                        View Public Page →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
