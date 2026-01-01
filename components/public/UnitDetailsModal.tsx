'use client';

import { useState } from 'react';
import { Unit, UnitStatus, Building } from '@/types/firestore';

interface UnitDetailsModalProps {
    unit: Unit | null;
    building: Building | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function UnitDetailsModal({ unit, building, isOpen, onClose }: UnitDetailsModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!isOpen || !unit) return null;

    const images = unit.images || [];
    const hasImages = images.length > 0;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

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

    const getWhatsAppUrl = () => {
        if (!building?.ownerWhatsApp) return '';
        const cleaned = building.ownerWhatsApp.replace(/\D/g, '');
        const number = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
        const message = `Hi, I'm interested in ${unit.type}${unit.unitNumber ? ` - Unit ${unit.unitNumber}` : ''} at ${building.name}`;
        return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75">
            {/* Close button */}
            <button
                onClick={onClose}
                className="fixed top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Modal Content */}
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Image Gallery */}
                    {hasImages ? (
                        <div className="relative bg-black">
                            <img
                                src={images[currentImageIndex]}
                                alt={`${unit.type} - Image ${currentImageIndex + 1}`}
                                className="w-full h-96 object-contain"
                            />

                            {/* Image Counter */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm">
                                {currentImageIndex + 1} / {images.length}
                            </div>

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all"
                                    >
                                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all"
                                    >
                                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}

                            {/* Thumbnail Strip */}
                            {images.length > 1 && (
                                <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${index === currentImageIndex ? 'border-white' : 'border-transparent opacity-60'
                                                }`}
                                        >
                                            <img src={img} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-96 bg-gray-200 flex items-center justify-center">
                            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                    )}

                    {/* Unit Details */}
                    <div className="p-6 md:p-8">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">{unit.type}</h2>
                                {unit.unitNumber && (
                                    <p className="text-lg text-gray-600">Unit {unit.unitNumber}</p>
                                )}
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(unit.status)}`}>
                                {unit.status}
                            </span>
                        </div>

                        {/* Rent & Deposit */}
                        <div className="bg-blue-50 rounded-lg p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(unit.rent)}</p>
                                </div>
                                {unit.deposit && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Security Deposit</p>
                                        <p className="text-2xl font-semibold text-gray-900">{formatCurrency(unit.deposit)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {unit.floor !== undefined && (
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <p className="text-sm text-gray-600">Floor</p>
                                    <p className="text-lg font-semibold text-gray-900">{unit.floor}</p>
                                </div>
                            )}
                            {unit.area && (
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                    <p className="text-sm text-gray-600">Area</p>
                                    <p className="text-lg font-semibold text-gray-900">{unit.area} sq ft</p>
                                </div>
                            )}
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <p className="text-sm text-gray-600">Type</p>
                                <p className="text-lg font-semibold text-gray-900">{unit.type}</p>
                            </div>
                        </div>

                        {/* Description */}
                        {unit.description && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                <p className="text-gray-700 leading-relaxed">{unit.description}</p>
                            </div>
                        )}

                        {/* Amenities */}
                        {unit.amenities && unit.amenities.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                                <div className="flex flex-wrap gap-2">
                                    {unit.amenities.map((amenity, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact Section */}
                        {(building?.ownerWhatsApp || building?.ownerPhone) ? (
                            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white text-center">
                                <h3 className="text-xl font-bold mb-2">Interested in this unit?</h3>
                                <p className="mb-4 text-green-100">Contact the property owner</p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
                                    {building?.ownerWhatsApp && (
                                        <a
                                            href={getWhatsAppUrl()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-gray-100 text-green-600 font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                            Chat on WhatsApp
                                        </a>
                                    )}
                                    {building?.ownerPhone && (
                                        <a
                                            href={`tel:${building.ownerPhone.replace(/\D/g, '')}`}
                                            className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-gray-100 text-green-600 font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            Talk to Owner
                                        </a>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center">
                                <h3 className="text-xl font-semibold mb-2">Interested in this unit?</h3>
                                <p className="mb-4 text-blue-100">Contact the property owner for more details</p>
                                <button
                                    onClick={onClose}
                                    className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
                                >
                                    Close & Continue Browsing
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
