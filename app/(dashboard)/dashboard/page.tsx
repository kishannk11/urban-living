'use client';

import StatsOverview from '@/components/dashboard/StatsOverview';

export default function DashboardPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">
                    Welcome to your property management dashboard
                </p>
            </div>

            {/* Stats Overview - Dynamic Analytics */}
            <StatsOverview />

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <a
                        href="/dashboard/add-property"
                        className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                        <div className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center text-white text-xl mr-4">
                            ➕
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Add New Property</p>
                            <p className="text-sm text-gray-600">Create a new building</p>
                        </div>
                    </a>

                    <a
                        href="/dashboard/my-buildings"
                        className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
                    >
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl mr-4">
                            🏢
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">View Buildings</p>
                            <p className="text-sm text-gray-600">Manage your properties</p>
                        </div>
                    </a>

                    <a
                        href="/dashboard/account"
                        className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white text-xl mr-4">
                            ⚙️
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Account Settings</p>
                            <p className="text-sm text-gray-600">Update your profile</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
