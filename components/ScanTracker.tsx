'use client';

import { useEffect } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ScanTrackerProps {
    buildingId: string;
}

/**
 * ScanTracker Component
 * 
 * Silently tracks page views by incrementing the scanViews field
 * in the building document. Runs once on component mount.
 * 
 * This component has no UI and handles errors gracefully without
 * displaying anything to the user.
 */
export default function ScanTracker({ buildingId }: ScanTrackerProps) {
    useEffect(() => {
        const trackScan = async () => {
            try {
                const buildingRef = doc(db, 'listing-groups', buildingId);

                // Atomically increment scanViews by 1
                // If the field doesn't exist, it will be created and set to 1
                await updateDoc(buildingRef, {
                    scanViews: increment(1)
                });

                // Optional: Log for debugging (remove in production if needed)
                if (process.env.NODE_ENV === 'development') {
                    console.log('Scan tracked for building:', buildingId);
                }
            } catch (error) {
                // Silent failure - we don't want to disrupt the user experience
                // if tracking fails
                console.error('Error tracking scan:', error);
            }
        };

        // Track the scan
        trackScan();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array - run only once on mount

    // This component renders nothing
    return null;
}
