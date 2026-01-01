import { Building } from '@/types/firestore';

interface BuildingHeaderProps {
    building: Building;
}

export default function BuildingHeader({ building }: BuildingHeaderProps) {
    const getWhatsAppUrl = (phoneNumber: string) => {
        // Remove all non-digit characters
        const cleaned = phoneNumber.replace(/\D/g, '');
        // Add country code if not present
        const number = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
        return `https://wa.me/${number}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Building Image */}
            {building.imageUrl && (
                <div className="w-full h-48 sm:h-64 relative">
                    <img
                        src={building.imageUrl}
                        alt={building.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Building Info */}
            <div className="p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {building.name}
                </h1>

                <div className="flex items-start text-gray-600 mb-3">
                    <svg
                        className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
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
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    <span className="text-sm sm:text-base">{building.address}</span>
                </div>

                {building.description && (
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                        {building.description}
                    </p>
                )}

                {building.amenities && building.amenities.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            Amenities
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {building.amenities.map((amenity, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm"
                                >
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Owner Contact Section */}
                {(building.ownerName || building.ownerWhatsApp) && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Owner</h3>
                        {building.ownerName && (
                            <p className="text-gray-700 mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {building.ownerName}
                            </p>
                        )}
                        {building.ownerWhatsApp && (
                            <a
                                href={getWhatsAppUrl(building.ownerWhatsApp)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-md"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413. 248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                Chat on WhatsApp
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
