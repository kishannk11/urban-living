import { Unit, UnitStatus } from '@/types/firestore';

interface UnitCardProps {
    unit: Unit;
    onEdit: (unit: Unit) => void;
    onDelete: (unitId: string) => void;
}

export default function UnitCard({ unit, onEdit, onDelete }: UnitCardProps) {
    const getStatusColor = (status: UnitStatus) => {
        switch (status) {
            case UnitStatus.AVAILABLE:
                return 'bg-green-100 text-green-800';
            case UnitStatus.OCCUPIED:
                return 'bg-gray-100 text-gray-800';
            case UnitStatus.MAINTENANCE:
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete unit ${unit.unitNumber || unit.type}?`)) {
            onDelete(unit.id);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Unit Image */}
            {unit.images && unit.images.length > 0 ? (
                <div className="w-full h-48 relative bg-gray-200">
                    <img
                        src={unit.images[0]}
                        alt={`${unit.type} - Unit ${unit.unitNumber}`}
                        className="w-full h-full object-cover"
                    />
                    {unit.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                            +{unit.images.length - 1} more
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </div>
            )}

            <div className="p-5">
                {/* Unit Header */}
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            {unit.type}
                        </h3>
                        {unit.unitNumber && (
                            <p className="text-sm text-gray-600">Unit {unit.unitNumber}</p>
                        )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                        {unit.status}
                    </span>
                </div>

                {/* Rent & Deposit */}
                <div className="mb-4">
                    <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(unit.rent)}
                        <span className="text-sm text-gray-600 font-normal">/month</span>
                    </p>
                    {unit.deposit && (
                        <p className="text-sm text-gray-600 mt-1">
                            Deposit: {formatCurrency(unit.deposit)}
                        </p>
                    )}
                </div>

                {/* Unit Details */}
                <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
                    {unit.floor !== undefined && (
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Floor {unit.floor}
                        </div>
                    )}
                    {unit.area && (
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            {unit.area} sq ft
                        </div>
                    )}
                </div>

                {/* Description */}
                {unit.description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                        {unit.description}
                    </p>
                )}

                {/* Amenities */}
                {unit.amenities && unit.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {unit.amenities.slice(0, 3).map((amenity, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                                {amenity}
                            </span>
                        ))}
                        {unit.amenities.length > 3 && (
                            <span className="px-2 py-1 text-gray-500 text-xs">
                                +{unit.amenities.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => onEdit(unit)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
