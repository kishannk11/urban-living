'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function AccountPage() {
    const [user] = useAuthState(auth);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-600 mt-2">
                    Manage your account information
                </p>
            </div>

            <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Profile Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="text-gray-900">{user?.email}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Display Name
                            </label>
                            <div className="text-gray-900">
                                {user?.displayName || 'Not set'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                User ID
                            </label>
                            <div className="text-gray-600 text-sm font-mono">{user?.uid}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Verified
                            </label>
                            <div>
                                {user?.emailVerified ? (
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                        ✓ Verified
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                        Not Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Account Actions
                    </h2>
                    <div className="space-y-3">
                        <button
                            onClick={handleSignOut}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* App Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        About Urban Living
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Urban Living is a B2B2C property management platform that helps
                        property owners manage their buildings and units efficiently.
                    </p>
                    <div className="text-sm text-gray-500">
                        Version 1.0.0
                    </div>
                </div>
            </div>
        </div>
    );
}
