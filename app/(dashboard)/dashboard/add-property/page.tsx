'use client';

import { useState, FormEvent } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

export default function AddPropertyPage() {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        slug: '',
        description: '',
        imageUrl: '',
        amenities: '',
    });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name),
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setLoading(true);

            const amenitiesArray = formData.amenities
                .split(',')
                .map((a) => a.trim())
                .filter((a) => a.length > 0);

            await addDoc(collection(db, 'buildings'), {
                name: formData.name,
                address: formData.address,
                slug: formData.slug,
                description: formData.description || '',
                imageUrl: formData.imageUrl || '',
                amenities: amenitiesArray,
                ownerId: user.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            alert('Building added successfully!');
            router.push('/dashboard/my-buildings');
        } catch (error) {
            console.error('Error adding building:', error);
            alert('Failed to add building. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
                <p className="text-gray-600 mt-2">
                    Create a new building listing
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Building Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Building Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleNameChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="e.g., Tower Heights Mumbai"
                        />
                    </div>

                    {/* Slug (Auto-generated) */}
                    <div>
                        <label
                            htmlFor="slug"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            URL Slug * (Auto-generated, editable)
                        </label>
                        <input
                            type="text"
                            id="slug"
                            required
                            value={formData.slug}
                            onChange={(e) =>
                                setFormData({ ...formData, slug: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="tower-heights-mumbai"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            QR code will link to: /p/{formData.slug || 'your-slug'}
                        </p>
                    </div>

                    {/* Address */}
                    <div>
                        <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Address *
                        </label>
                        <input
                            type="text"
                            id="address"
                            required
                            value={formData.address}
                            onChange={(e) =>
                                setFormData({ ...formData, address: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="123 Main Street, Mumbai, Maharashtra 400001"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={4}
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="Describe your property..."
                        />
                    </div>

                    {/* Building Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Building Image (Optional)
                        </label>
                        <ImageUploader
                            onUploadComplete={(url) =>
                                setFormData({ ...formData, imageUrl: url })
                            }
                            existingImageUrl={formData.imageUrl}
                        />
                    </div>

                    {/* Amenities */}
                    <div>
                        <label
                            htmlFor="amenities"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Amenities (comma-separated)
                        </label>
                        <input
                            type="text"
                            id="amenities"
                            value={formData.amenities}
                            onChange={(e) =>
                                setFormData({ ...formData, amenities: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="Parking, Gym, Swimming Pool, Security"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200"
                        >
                            {loading ? 'Adding...' : 'Add Building'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-8 py-3 rounded-lg transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
