'use client';

import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { trackQRCodeDownload } from '@/lib/analytics';

interface QRCodeDownloaderProps {
    url: string;
    buildingName: string;
}


export default function QRCodeDownloader({ url, buildingName }: QRCodeDownloaderProps) {
    const qrRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (!canvas) return;

        // Track the download event
        trackQRCodeDownload(buildingName, url);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
            if (!blob) return;

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const filename = `${buildingName.toLowerCase().replace(/\s+/g, '-')}-qr-code.png`;

            link.download = filename;
            link.href = url;
            link.click();

            // Cleanup
            URL.revokeObjectURL(url);
        });
    };

    return (
        <button
            onClick={handleDownload}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 inline-flex items-center"
        >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Generate QR Code

            {/* Hidden QR Code for download */}
            <div ref={qrRef} className="hidden">
                <QRCodeCanvas
                    value={url}
                    size={512}
                    level="H"
                    includeMargin={true}
                />
            </div>
        </button>
    );
}
