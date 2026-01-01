'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Building } from '@/types/firestore';
import ImageUploader from '@/components/ImageUploader';

interface EditBuildingModalProps {
    building: Building | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (buildingId: string, buildingData: any) => Promise<void>;
}

export default function EditBuildingModal({ building, isOpen, onClose, onSubmit }: EditBuildingModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        amenities: '',
        imageUrl: '',
        ownerName: '',
        ownerPhone: '',
        ownerWhatsApp: '',
    });

    // Populate form when building changes
    useEffect(() => {
        if (building) {
            setFormData({
                name: building.name || '',
                address: building.address || '',
                description: building.description || '',
                amenities: building.amenities?.join(', ') || '',
                imageUrl: building.imageUrl || '',
                ownerName: building.ownerName || '',
                ownerPhone: building.ownerPhone || '',
                ownerWhatsApp: building.ownerWhatsApp || '',
            });
        }
    }, [building]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!building) return;

        setLoading(true);

        try {
            const amenitiesArray = formData.amenities
                .split(',')
                .map((a) => a.trim())
                .filter((a) => a.length > 0);

            const buildingData: any = {
                name: formData.name,
                address: formData.address,
            };

            // Only add optional fields if they have values
            if (formData.description) buildingData.description = formData.description;
            if (amenitiesArray.length > 0) buildingData.amenities = amenitiesArray;
            if (formData.imageUrl) buildingData.imageUrl = formData.imageUrl;
            if (formData.ownerName) buildingData.ownerName = formData.ownerName;
            if (formData.ownerPhone) buildingData.ownerPhone = formData.ownerPhone;
            if (formData.ownerWhatsApp) buildingData.ownerWhatsApp = formData.ownerWhatsApp;

            await onSubmit(building.id, buildingData);
            onClose();
        } catch (error) {
            console.error('Error updating building:', error);
            alert('Failed to update building. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !building) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                        <h2 className="text-2xl font-bold text-gray-900">Edit Building Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Building Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Building Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address *
                            </label>
                            <textarea
                                required
                                rows={2}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                        </div>

                        {/* Amenities */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amenities (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={formData.amenities}
                                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                placeholder="Parking, Elevator, Security, CCTV"
                            />
                        </div>

                        {/* Building Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Building Image
                            </label>
                            <ImageUploader
                                onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
                                existingImageUrl={formData.imageUrl}
                            />
                        </div>

                        {/* Owner Information Section */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Contact Information</h3>

                            <div className="space-y-4">
                                {/* Owner Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Owner Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ownerName}
                                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        placeholder="John Doe"
                                    />
                                </div>

                                {/* Owner Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.ownerPhone}
                                        onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        placeholder="9876543210"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">10-digit Indian mobile number</p>
                                </div>

                                {/* WhatsApp Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        WhatsApp Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.ownerWhatsApp}
                                        onChange={(e) => setFormData({ ...formData, ownerWhatsApp: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        placeholder="9876543210"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Visitors can contact you via WhatsApp from the public page
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                {loading ? 'Updating...' : 'Update Building'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
