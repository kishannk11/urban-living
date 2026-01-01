'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import imageCompression from 'browser-image-compression';

interface ImageUploaderProps {
    onUploadComplete: (url: string) => void;
    existingImageUrl?: string;
}

export default function ImageUploader({
    onUploadComplete,
    existingImageUrl
}: ImageUploaderProps) {
    const [user] = useAuthState(auth);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(existingImageUrl || null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(existingImageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateRandomId = () => {
        return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    };

    const compressImage = async (file: File): Promise<File> => {
        const options = {
            maxSizeMB: 1, // Maximum file size 1MB
            maxWidthOrHeight: 1024, // Max width 1024px
            useWebWorker: true,
            fileType: 'image/webp' as const, // Convert to WebP
        };

        try {
            console.log('Original file size:', file.size / 1024, 'KB');
            const compressedFile = await imageCompression(file, options);
            console.log('Compressed file size:', compressedFile.size / 1024, 'KB');

            // Create a new file with .webp extension
            const webpFile = new File(
                [compressedFile],
                file.name.replace(/\.[^/.]+$/, '.webp'),
                { type: 'image/webp' }
            );

            return webpFile;
        } catch (error) {
            console.error('Error compressing image:', error);
            throw error;
        }
    };

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        try {
            setUploading(true);
            setProgress(0);

            // Create preview
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            // Compress the image
            const compressedFile = await compressImage(file);

            // Create storage reference
            const randomId = generateRandomId();
            const storagePath = `uploads/${user.uid}/${randomId}.webp`;
            const storageRef = ref(storage, storagePath);

            // Upload file
            const uploadTask = uploadBytesResumable(storageRef, compressedFile);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Track upload progress
                    const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progressPercent);
                    console.log('Upload progress:', progressPercent.toFixed(0) + '%');
                },
                (error) => {
                    // Handle errors
                    console.error('Upload error:', error);
                    alert('Failed to upload image. Please try again.');
                    setUploading(false);
                    setProgress(0);
                    setPreviewUrl(imageUrl); // Revert to previous image
                },
                async () => {
                    // Upload completed successfully
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log('Upload complete! URL:', downloadURL);

                        setImageUrl(downloadURL);
                        setPreviewUrl(downloadURL);
                        setUploading(false);
                        setProgress(100);

                        // Pass URL back to parent component
                        onUploadComplete(downloadURL);

                        // Clean up object URL if it was created
                        if (objectUrl && objectUrl !== downloadURL) {
                            URL.revokeObjectURL(objectUrl);
                        }
                    } catch (error) {
                        console.error('Error getting download URL:', error);
                        alert('Upload completed but failed to get image URL');
                        setUploading(false);
                    }
                }
            );
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Failed to process image. Please try again.');
            setUploading(false);
            setProgress(0);
        }
    };

    const handleRemove = () => {
        setImageUrl(null);
        setPreviewUrl(null);
        setProgress(0);
        onUploadComplete(''); // Clear the URL in parent

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSelectClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
            />

            {/* Upload Area */}
            {!previewUrl ? (
                <div
                    onClick={handleSelectClick}
                    className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <div className="flex flex-col items-center justify-center">
                        <svg
                            className="w-12 h-12 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-gray-700 font-medium mb-1">
                            {uploading ? 'Processing...' : 'Click to upload image'}
                        </p>
                        <p className="text-gray-500 text-sm">
                            PNG, JPG, WebP up to 10MB (will be compressed to 1MB)
                        </p>
                    </div>
                </div>
            ) : (
                // Preview Area
                <div className="relative">
                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-64 object-cover"
                        />
                    </div>

                    {/* Remove button */}
                    {!uploading && (
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors"
                            title="Remove image"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}

                    {/* Change Image button */}
                    {!uploading && (
                        <button
                            onClick={handleSelectClick}
                            className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Change Image
                        </button>
                    )}
                </div>
            )}

            {/* Progress Bar */}
            {uploading && (
                <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                            {progress < 100 ? 'Uploading...' : 'Upload complete!'}
                        </span>
                        <span className="text-gray-900 font-medium">
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>
            )}

            {/* Info text */}
            <p className="text-xs text-gray-500">
                Images are automatically compressed to WebP format for optimal performance
            </p>
        </div>
    );
}
