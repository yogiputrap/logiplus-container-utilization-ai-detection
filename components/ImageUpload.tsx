'use client';

import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    onImageSelect: (file: File, preview: string) => void;
    selectedImage: string | null;
    onClear: () => void;
}

export default function ImageUpload({ onImageSelect, selectedImage, onClear }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = useCallback(
        (file: File) => {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = e.target?.result as string;
                onImageSelect(file, preview);
            };
            reader.readAsDataURL(file);
        },
        [onImageSelect]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            const file = e.dataTransfer.files[0];
            if (file) {
                handleFile(file);
            }
        },
        [handleFile]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                handleFile(file);
            }
        },
        [handleFile]
    );

    if (selectedImage) {
        return (
            <div className="relative group">
                <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-auto rounded-xl shadow-lg"
                />
                <Button
                    onClick={onClear}
                    variant="destructive"
                    size="icon"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
                'border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer',
                isDragging
                    ? 'border-indigo-500 bg-indigo-50 scale-105'
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            )}
        >
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileInput}
            />

            <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                    <div className={cn(
                        'w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300',
                        isDragging
                            ? 'bg-[#203864] scale-110'
                            : 'bg-[#203864]'
                    )}>
                        {isDragging ? (
                            <Upload className="w-10 h-10 text-white animate-bounce" />
                        ) : (
                            <ImageIcon className="w-10 h-10 text-white" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-gray-700">
                            {isDragging ? 'Drop your image here' : 'Upload Container Image'}
                        </p>
                        <p className="text-sm text-gray-500">
                            Drag and drop or click to browse
                        </p>
                        <p className="text-xs text-gray-400">
                            Supports: JPG, PNG, JPEG (Max 10MB)
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="mt-2 bg-[#FF5722] hover:bg-[#E64A19]"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                    </Button>
                </div>
            </label>
        </div>
    );
}
