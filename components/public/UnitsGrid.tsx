'use client';

import { useState } from 'react';
import { Building, Unit } from '@/types/firestore';
import UnitCard from './UnitCard';
import UnitDetailsModal from './UnitDetailsModal';

interface UnitsGridProps {
    units: Unit[];
    building: Building;
}

/**
 * UnitsGrid Component
 * 
 * Client component to handle unit selection and modal display.
 * Separated from the server component to enable interactive state management.
 */
export default function UnitsGrid({ units, building }: UnitsGridProps) {
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    return (
        <>
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
        </>
    );
}
