import { Unit, UnitStatus } from '@/types/firestore';

interface UnitCardProps {
    unit: Unit;
    onClick: () => void;
}

export default function UnitCard({ unit, onClick }: UnitCardProps) {
    const getStatusColor = (status: UnitStatus) => {
        switch (status) {
            case UnitStatus.AVAILABLE:
                return 'bg-green-100 text-green-800';
            case UnitStatus.OCCUPIED:
                return 'bg-red-100 text-red-800';
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

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        >
            {/* Unit Images */}
            {unit.images && unit.images.length > 0 && (
                <div className="w-full h-40 sm:h-48 relative bg-gray-200">
                    <img
                        src={unit.images[0]}
                        alt={`${unit.type} - Unit ${unit.unitNumber}`}
                        className="w-full h-full object-cover"
                    />
                    {unit.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                            +{unit.images.length - 1} more photos
                        </div>
                    )}
                </div>
            )}

            <div className="p-4">
                {/* Unit Header */}
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                            {unit.type}
                        </h3>
                        {unit.unitNumber && (
                            <p className="text-sm text-gray-600">Unit {unit.unitNumber}</p>
                        )}
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                            unit.status
                        )}`}
                    >
                        {unit.status}
                    </span>
                </div>

                {/* Rent */}
                <div className="mb-3">
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                        {formatCurrency(unit.rent)}
                        <span className="text-sm sm:text-base text-gray-600 font-normal">
                            /month
                        </span>
                    </p>
                </div>

                {/* Unit Details */}
                <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-600">
                    {unit.floor !== undefined && (
                        <div className="flex items-center">
                            <svg
                                className="w-4 h-4 mr-1"
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
                            Floor {unit.floor}
                        </div>
                    )}
                    {unit.area && (
                        <div className="flex items-center">
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                />
                            </svg>
                            {unit.area} sq ft
                        </div>
                    )}
                </div>

                {/* Description */}
                {unit.description && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {unit.description}
                    </p>
                )}

                {/* Unit Amenities */}
                {unit.amenities && unit.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
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

                {/* View Details Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    View Details & Photos
                </button>
            </div>
        </div>
    );
}
