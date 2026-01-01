import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

// Generic event tracking function using Firebase Analytics
export const trackEvent = (
    eventName: string,
    eventParams?: Record<string, any>
) => {
    if (typeof window !== 'undefined' && analytics) {
        try {
            logEvent(analytics, eventName, eventParams);
        } catch (error) {
            console.error('Error logging analytics event:', error);
        }
    } else {
        // Fallback or dev logging
        console.log('Analytics Event (Mock):', eventName, eventParams);
    }
};

// Specific tracking functions
export const trackQRCodeDownload = (buildingName: string, url: string) => {
    trackEvent('qr_code_download', {
        event_category: 'engagement',
        event_label: buildingName,
        building_name: buildingName,
        qr_url: url,
    });
};
