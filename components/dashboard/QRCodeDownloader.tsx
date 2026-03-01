'use client';

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { trackQRCodeDownload } from '@/lib/analytics';

interface QRCodeDownloaderProps {
    url: string;
    buildingName: string;
}


export default function QRCodeDownloader({ url, buildingName }: QRCodeDownloaderProps) {
    const qrRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        const svg = qrRef.current?.querySelector('svg');
        if (!svg) return;

        // Track the download event
        trackQRCodeDownload(buildingName, url);

        try {
            // First, load the logo image and convert it to data URL
            const logoImg = new Image();
            logoImg.crossOrigin = 'anonymous';

            await new Promise((resolve, reject) => {
                logoImg.onload = resolve;
                logoImg.onerror = reject;
                logoImg.src = '/logo-small.png';
            });

            // Create a canvas to convert logo to data URL
            const logoCanvas = document.createElement('canvas');
            logoCanvas.width = logoImg.width;
            logoCanvas.height = logoImg.height;
            const logoCtx = logoCanvas.getContext('2d');
            if (logoCtx) {
                logoCtx.drawImage(logoImg, 0, 0);
            }
            const logoDataUrl = logoCanvas.toDataURL('image/png');

            // Clone the SVG and replace the image href with data URL
            const svgClone = svg.cloneNode(true) as SVGElement;
            const imageElement = svgClone.querySelector('image');
            if (imageElement) {
                imageElement.setAttribute('href', logoDataUrl);
            }

            // Convert SVG to canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const svgData = new XMLSerializer().serializeToString(svgClone);
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (!blob) return;

                    // Create download link
                    const downloadUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    const filename = `${buildingName.toLowerCase().replace(/\s+/g, '-')}-qr-code.png`;

                    link.download = filename;
                    link.href = downloadUrl;
                    link.click();

                    // Cleanup
                    URL.revokeObjectURL(downloadUrl);
                });
            };

            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        } catch (error) {
            console.error('Error generating QR code with logo:', error);
            // Fallback: download without logo
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const svgData = new XMLSerializer().serializeToString(svg);
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (!blob) return;
                    const downloadUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    const filename = `${buildingName.toLowerCase().replace(/\s+/g, '-')}-qr-code.png`;
                    link.download = filename;
                    link.href = downloadUrl;
                    link.click();
                    URL.revokeObjectURL(downloadUrl);
                });
            };

            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="bg-brand-red hover:bg-brand-red-hover text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 inline-flex items-center"
        >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Download QR Code

            {/* Hidden Branded QR Code for download */}
            <div ref={qrRef} className="hidden">
                <QRCodeSVG
                    value={url}
                    size={512}
                    level="H"
                    fgColor="#0F172A"
                    bgColor="#FFFFFF"
                    includeMargin={true}
                    imageSettings={{
                        src: "/logo-small.png",
                        height: 80,
                        width: 80,
                        excavate: true,
                    }}
                />
            </div>
        </button>
    );
}
