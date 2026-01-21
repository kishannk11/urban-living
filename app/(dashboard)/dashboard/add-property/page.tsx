'use client';

import { useState, FormEvent } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';
import { Building } from '@/types/firestore';

export default function AddPropertyPage() {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'search' | 'create'>('search');

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Building[]>([]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    // Create Form State
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        slug: '',
        description: '',
        imageUrl: '',
        amenities: '',
    });

    // --- Search Logic ---

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearchPerformed(false);
        setSearchResults([]);

        try {
            // Note: firestore text search is limited. 
            // We'll do a simple equality check or startAt/endAt if possible, 
            // but for now let's query all listing-groups and filter client-side 
            // (assuming low volume initially) OR simple exact match.
            // Better approach for scaling: Algolia or simple "name" text match query.
            // Let's try to match by name (case-sensitive) or just partial match client side for MVP.

            // MVP Strategy: Fetch all (limit 100) and filter client side.
            // NOT SCALABLE but works for < 1000 buildings.
            const q = query(collection(db, 'listing-groups'));
            const snapshot = await getDocs(q);

            const results = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Building))
                .filter(b =>
                    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    b.address.toLowerCase().includes(searchQuery.toLowerCase())
                );

            setSearchResults(results);
            setSearchPerformed(true);
        } catch (error) {
            console.error('Error searching buildings:', error);
            alert('Failed to search buildings.');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinBuilding = async (buildingId: string) => {
        if (!user) return;

        try {
            setLoading(true);

            // Check if user is already a member
            const membersRef = collection(db, 'building_members');
            const memberQuery = query(
                membersRef,
                where('userId', '==', user.uid),
                where('buildingId', '==', buildingId)
            );
            const existingMembership = await getDocs(memberQuery);

            if (existingMembership.empty) {
                // Create membership
                await addDoc(membersRef, {
                    userId: user.uid,
                    buildingId: buildingId,
                    joinedAt: serverTimestamp(),
                });
            }

            // Redirect to building dashboard
            router.push(`/dashboard/buildings/${buildingId}`);
        } catch (error) {
            console.error('Error joining building:', error);
            alert('Failed to join building. Please try again.');
            setLoading(false);
        }
    };

    // --- Create Logic ---

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

            // Create the building
            const buildingRef = await addDoc(collection(db, 'listing-groups'), {
                name: formData.name,
                address: formData.address,
                slug: formData.slug,
                description: formData.description || '',
                imageUrl: formData.imageUrl || '',
                amenities: amenitiesArray,
                ownerId: user.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                updatedBy: user.uid, // Track who created it
            });

            // Automatically join the building as a member
            await addDoc(collection(db, 'building_members'), {
                userId: user.uid,
                buildingId: buildingRef.id,
                joinedAt: serverTimestamp(),
            });

            alert('Building added successfully!');
            router.push('/dashboard/my-buildings');
        } catch (error) {
            console.error('Error adding building:', error);
            alert('Failed to add building. Please try again.');
            setLoading(false);
        }
    };

    if (step === 'search') {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Find Your Building</h1>
                    <p className="text-gray-600 mt-2">
                        Search for your building to join it. If it doesn't exist, you can create a new one.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter Building Name, Address, or Pincode"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </div>

                {searchPerformed && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {searchResults.length} Results Found
                            </h2>
                            <button
                                onClick={() => setStep('create')}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Can't find it? Create New Building &rarr;
                            </button>
                        </div>

                        {searchResults.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {searchResults.map((building) => (
                                    <div key={building.id} className="bg-white p-5 rounded-lg shadow border border-gray-200 flex gap-4">
                                        {building.imageUrl ? (
                                            <img
                                                src={building.imageUrl}
                                                alt={building.name}
                                                className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-gray-900">{building.name}</h3>
                                            <p className="text-sm text-gray-500 mb-3">{building.address}</p>
                                            <button
                                                onClick={() => handleJoinBuilding(building.id)}
                                                disabled={loading}
                                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                                            >
                                                Join this Building
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                                <p className="text-yellow-800 mb-4">
                                    No buildings found matching "{searchQuery}".
                                </p>
                                <button
                                    onClick={() => setStep('create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                                >
                                    Create New Building
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {!searchPerformed && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setStep('create')}
                            className="text-gray-500 hover:text-gray-700 underline"
                        >
                            Skip Search & Create New Building
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <button
                    onClick={() => setStep('search')}
                    className="text-sm text-blue-600 hover:underline mb-4 flex items-center"
                >
                    &larr; Back to Search
                </button>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
                    <p className="text-gray-600 mt-2">
                        Create a new building listing
                    </p>
                </div>
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
