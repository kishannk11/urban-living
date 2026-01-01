'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    doc,
    getDoc,
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Building, Unit } from '@/types/firestore';
import UnitCard from '@/components/dashboard/UnitCard';
import AddUnitModal from '@/components/dashboard/AddUnitModal';
import EditUnitModal from '@/components/dashboard/EditUnitModal';
import EditBuildingModal from '@/components/dashboard/EditBuildingModal';
import QRCodeDownloader from '@/components/dashboard/QRCodeDownloader';
import Link from 'next/link';

export default function BuildingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [user] = useAuthState(auth);
    const buildingId = params.buildingId as string;

    const [building, setBuilding] = useState<Building | null>(null);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [showEditBuildingModal, setShowEditBuildingModal] = useState(false);

    // Fetch building data
    useEffect(() => {
        if (!buildingId) return;

        const fetchBuilding = async () => {
            try {
                const buildingRef = doc(db, 'buildings', buildingId);
                const buildingSnap = await getDoc(buildingRef);

                if (buildingSnap.exists()) {
                    setBuilding({
                        id: buildingSnap.id,
                        ...buildingSnap.data()
                    } as Building);
                } else {
                    alert('Building not found');
                    router.push('/dashboard/my-buildings');
                }
            } catch (error) {
                console.error('Error fetching building:', error);
                alert('Failed to load building details');
            } finally {
                setLoading(false);
            }
        };

        fetchBuilding();
    }, [buildingId, router]);

    // Real-time units listener
    useEffect(() => {
        if (!buildingId) return;

        const unitsRef = collection(db, 'units');
        const q = query(unitsRef, where('buildingId', '==', buildingId));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const unitsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Unit[];

            setUnits(unitsData);
        }, (error) => {
            console.error('Error listening to units:', error);
        });

        return () => unsubscribe();
    }, [buildingId]);

    // Add unit handler
    const handleAddUnit = async (unitData: any) => {
        try {
            await addDoc(collection(db, 'units'), {
                ...unitData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error adding unit:', error);
            throw error;
        }
    };

    // Update unit handler  
    const handleUpdateUnit = async (unitId: string, unitData: any) => {
        try {
            const unitRef = doc(db, 'units', unitId);
            await updateDoc(unitRef, {
                ...unitData,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error updating unit:', error);
            throw error;
        }
    };

    // Delete unit handler
    const handleDeleteUnit = async (unitId: string) => {
        try {
            await deleteDoc(doc(db, 'units', unitId));
        } catch (error) {
            console.error('Error deleting unit:', error);
            alert('Failed to delete unit');
        }
    };

    // Update building handler
    const handleUpdateBuilding = async (buildingId: string, buildingData: any) => {
        try {
            const buildingRef = doc(db, 'buildings', buildingId);
            await updateDoc(buildingRef, {
                ...buildingData,
                updatedAt: serverTimestamp(),
            });

            // Refresh building data
            const updatedSnap = await getDoc(buildingRef);
            if (updatedSnap.exists()) {
                setBuilding({
                    id: updatedSnap.id,
                    ...updatedSnap.data()
                } as Building);
            }
        } catch (error) {
            console.error('Error updating building:', error);
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!building) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Link href="/dashboard/my-buildings" className="hover:text-blue-600">
                    My Buildings
                </Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium">{building.name}</span>
            </div>

            {/* Building Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                    {/* Building Image */}
                    {building.imageUrl ? (
                        <div className="md:w-1/3">
                            <img
                                src={building.imageUrl}
                                alt={building.name}
                                className="w-full h-64 md:h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="md:w-1/3 h-64 md:h-auto bg-gray-200 flex items-center justify-center">
                            <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    )}

                    {/* Building Info */}
                    <div className="p-6 md:w-2/3">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{building.name}</h1>
                        <p className="text-gray-600 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {building.address}
                        </p>

                        {building.description && (
                            <p className="text-gray-700 mb-4">{building.description}</p>
                        )}

                        {building.amenities && building.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {building.amenities.map((amenity, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setShowEditBuildingModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 inline-flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Building
                            </button>
                            <QRCodeDownloader
                                url={`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${building.slug}`}
                                buildingName={building.name}
                            />
                            <Link
                                href={`/p/${building.slug}`}
                                target="_blank"
                                className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 inline-flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Public Page
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Units Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Units ({units.length})
                    </h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 inline-flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Unit
                    </button>
                </div>

                {/* Units Grid */}
                {units.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {units.map((unit) => (
                            <UnitCard
                                key={unit.id}
                                unit={unit}
                                onEdit={setEditingUnit}
                                onDelete={handleDeleteUnit}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No units yet</h3>
                        <p className="text-gray-600 mb-6">Get started by adding your first unit to this building.</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 inline-flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add First Unit
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddUnitModal
                buildingId={buildingId}
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddUnit}
            />

            <EditUnitModal
                unit={editingUnit}
                isOpen={!!editingUnit}
                onClose={() => setEditingUnit(null)}
                onSubmit={handleUpdateUnit}
            />

            <EditBuildingModal
                building={building}
                isOpen={showEditBuildingModal}
                onClose={() => setShowEditBuildingModal(false)}
                onSubmit={handleUpdateBuilding}
            />
        </div>
    );
}
