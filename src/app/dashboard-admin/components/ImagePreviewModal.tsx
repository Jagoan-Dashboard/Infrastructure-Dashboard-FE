"use client";
import React, { useEffect, useRef } from 'react';
import RetryableImage from './RetryableImage';

interface ImagePreviewModalProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ src, alt = '', onClose }) => {
  const backdropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={onBackdropClick}
      className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative max-h-full max-w-7xl w-full">
        <button
          aria-label="Tutup pratinjau"
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/90 hover:text-white text-sm"
        >
          Tutup ✕
        </button>
        <div className="relative w-full" style={{ height: '80vh' }}>
          <RetryableImage
            src={src}
            alt={alt}
            fill
            unoptimized
            className="object-contain bg-black"
            sizes="100vw"
            maxRetries={10}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
