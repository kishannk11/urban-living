'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Unit, UnitType, UnitStatus } from '@/types/firestore';
import MultiImageUploader from '@/components/MultiImageUploader';

interface EditUnitModalProps {
    unit: Unit | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (unitId: string, unitData: any) => Promise<void>;
}

const unitTypes: UnitType[] = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', 'PG-Bed', 'Studio'];

export default function EditUnitModal({ unit, isOpen, onClose, onSubmit }: EditUnitModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        unitNumber: '',
        type: '1BHK' as UnitType,
        rent: '',
        deposit: '',
        floor: '',
        area: '',
        status: UnitStatus.AVAILABLE,
        description: '',
        amenities: '',
        images: [] as string[],
    });

    // Populate form when unit changes
    useEffect(() => {
        if (unit) {
            setFormData({
                unitNumber: unit.unitNumber || '',
                type: unit.type,
                rent: unit.rent.toString(),
                deposit: unit.deposit?.toString() || '',
                floor: unit.floor?.toString() || '',
                area: unit.area?.toString() || '',
                status: unit.status,
                description: unit.description || '',
                amenities: unit.amenities?.join(', ') || '',
                images: unit.images || [],
            });
        }
    }, [unit]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!unit) return;

        setLoading(true);

        try {
            const amenitiesArray = formData.amenities
                .split(',')
                .map((a) => a.trim())
                .filter((a) => a.length > 0);

            const unitData: any = {
                unitNumber: formData.unitNumber,
                type: formData.type,
                rent: Number(formData.rent),
                status: formData.status,
            };

            // Only add optional fields if they have values
            if (formData.deposit) unitData.deposit = Number(formData.deposit);
            if (formData.floor) unitData.floor = Number(formData.floor);
            if (formData.area) unitData.area = Number(formData.area);
            if (formData.description) unitData.description = formData.description;
            if (amenitiesArray.length > 0) unitData.amenities = amenitiesArray;
            if (formData.images.length > 0) unitData.images = formData.images;

            await onSubmit(unit.id, unitData);
            onClose();
        } catch (error) {
            console.error('Error updating unit:', error);
            alert('Failed to update unit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !unit) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Edit Unit</h2>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Unit Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit Number *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.unitNumber}
                                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type *
                                </label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as UnitType })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                >
                                    {unitTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Rent */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rent (₹/month) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.rent}
                                    onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            {/* Deposit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deposit (₹)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.deposit}
                                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            {/* Floor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Floor
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.floor}
                                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            {/* Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Area (sq ft)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.area}
                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as UnitStatus })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            >
                                <option value={UnitStatus.AVAILABLE}>Available</option>
                                <option value={UnitStatus.OCCUPIED}>Occupied</option>
                                <option value={UnitStatus.MAINTENANCE}>Maintenance</option>
                            </select>
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
                            />
                        </div>

                        {/* Photos */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Unit Photos
                            </label>
                            <MultiImageUploader
                                onUploadComplete={(urls) => setFormData({ ...formData, images: urls })}
                                existingImages={formData.images}
                                storagePath={`uploads/${unit.buildingId}/units`}
                                maxImages={5}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                {loading ? 'Updating...' : 'Update Unit'}
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
