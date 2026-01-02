'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import imageCompression from 'browser-image-compression';

interface MultiImageUploaderProps {
    onUploadComplete: (urls: string[]) => void;
    existingImages?: string[];
    storagePath?: string;
    maxImages?: number;
}

export default function MultiImageUploader({
    onUploadComplete,
    existingImages = [],
    storagePath,
    maxImages = 5
}: MultiImageUploaderProps) {
    const [user] = useAuthState(auth);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imageUrls, setImageUrls] = useState<string[]>(existingImages);
    const [previewUrls, setPreviewUrls] = useState<string[]>(existingImages);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateRandomId = () => {
        return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    };

    const compressImage = async (file: File): Promise<File> => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
            fileType: 'image/webp' as const,
        };

        try {
            const compressedFile = await imageCompression(file, options);
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
        const files = e.target.files;
        if (!files || files.length === 0 || !user) return;

        const remainingSlots = maxImages - imageUrls.length;
        if (remainingSlots <= 0) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots);

        try {
            setUploading(true);
            setProgress(0);

            const uploadedUrls: string[] = [];

            for (let i = 0; i < filesToUpload.length; i++) {
                const file = filesToUpload[i];

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    console.warn('Skipping non-image file:', file.name);
                    continue;
                }

                // Compress image
                const compressedFile = await compressImage(file);

                // Create storage reference
                const randomId = generateRandomId();
                const path = storagePath
                    ? `${storagePath}/${randomId}.webp`
                    : `uploads/${user.uid}/${randomId}.webp`;
                const storageRef = ref(storage, path);

                // Upload file
                const uploadTask = uploadBytesResumable(storageRef, compressedFile);

                await new Promise<void>((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            const totalProgress = ((i + fileProgress / 100) / filesToUpload.length) * 100;
                            setProgress(totalProgress);
                        },
                        (error) => {
                            console.error('Upload error:', error);
                            reject(error);
                        },
                        async () => {
                            try {
                                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                uploadedUrls.push(downloadURL);
                                resolve();
                            } catch (error) {
                                reject(error);
                            }
                        }
                    );
                });
            }

            const newUrls = [...imageUrls, ...uploadedUrls];
            setImageUrls(newUrls);
            setPreviewUrls(newUrls);
            onUploadComplete(newUrls);

            setUploading(false);
            setProgress(0);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload images. Please try again.');
            setUploading(false);
            setProgress(0);
        }
    };

    const handleRemove = (index: number) => {
        const newUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newUrls);
        setPreviewUrls(newUrls);
        onUploadComplete(newUrls);
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
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading || imageUrls.length >= maxImages}
            />

            {/* Image Previews */}
            {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {previewUrls.map((url, index) => (
                        <div key={index} className="relative">
                            <div className="border-2 border-gray-300 rounded-lg overflow-hidden aspect-square">
                                <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Remove button */}
                            {!uploading && (
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg transition-colors"
                                    title="Remove image"
                                >
                                    <svg
                                        className="w-4 h-4"
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
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {imageUrls.length < maxImages && (
                <button
                    type="button"
                    onClick={handleSelectClick}
                    disabled={uploading}
                    className={`w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <div className="flex flex-col items-center justify-center">
                        <svg
                            className="w-10 h-10 text-gray-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        <p className="text-gray-700 font-medium text-sm">
                            {uploading ? 'Uploading...' : `Add Photos (${imageUrls.length}/${maxImages})`}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            Click to select multiple images
                        </p>
                    </div>
                </button>
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
                        <span className="text-gray-600">Uploading images...</span>
                        <span className="text-gray-900 font-medium">{Math.round(progress)}%</span>
                    </div>
                </div>
            )}

            {/* Info text */}
            <p className="text-xs text-gray-500">
                {maxImages - imageUrls.length > 0
                    ? `You can add ${maxImages - imageUrls.length} more image${maxImages - imageUrls.length !== 1 ? 's' : ''}`
                    : 'Maximum images reached'}
            </p>
        </div>
    );
}
