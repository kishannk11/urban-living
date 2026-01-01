'use client';

import type { Metadata } from "next";
import AuthGuard from '@/components/dashboard/AuthGuard';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex h-screen bg-gray-100">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top padding for mobile menu */}
                    <div className="lg:hidden h-16" />

                    {/* Content Area */}
                    <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
