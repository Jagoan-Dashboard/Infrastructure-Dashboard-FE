"use client";

import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';
import RetryableImage from '@/app/dashboard-admin/components/RetryableImage';

interface ImagePreviewModalProps {
    isOpen: boolean;
    imageUrl: string | null;
    altText?: string;
    onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
    isOpen,
    imageUrl,
    altText = "Preview Image",
    onClose,
}) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !imageUrl) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-50"
                aria-label="Close preview"
            >
                <Icon icon="mdi:close" className="w-8 h-8" />
            </button>

            <div
                className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full h-full">
                    <RetryableImage
                        src={imageUrl}
                        alt={altText}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                        maxRetries={10}
                        unoptimized
                    />
                </div>
            </div>
        </div>
    );
};
