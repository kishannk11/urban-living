'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const navigation = [
    { name: 'My Buildings', href: '/dashboard/my-buildings', icon: '🏢' },
    { name: 'Add Property', href: '/dashboard/add-property', icon: '➕' },
    { name: 'Account', href: '/dashboard/account', icon: '⚙️' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [user] = useAuthState(auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">Urban Living</h1>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {isMobileMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 transition-transform duration-300 ease-in-out`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 px-4 bg-gray-800">
                        <h1 className="text-xl font-bold text-white">Urban Living</h1>
                    </div>

                    {/* User Info */}
                    <div className="px-4 py-4 border-b border-gray-800">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                {user?.email?.[0].toUpperCase() || 'U'}
                            </div>
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.displayName || 'Property Owner'}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`${isActive
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        } flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200`}
                                >
                                    <span className="text-xl mr-3">{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sign Out */}
                    <div className="px-4 py-4 border-t border-gray-800">
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200"
                        >
                            <svg
                                className="w-5 h-5 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
