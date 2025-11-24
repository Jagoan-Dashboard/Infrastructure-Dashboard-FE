"use client";
import Image, { ImageProps } from 'next/image';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Props = Omit<ImageProps, 'src' | 'onError'> & {
  src: string;
  alt: string;
  maxRetries?: number;
  baseDelayMs?: number;
  onFinalError?: () => void;
};

const RetryableImage: React.FC<Props> = ({
  src,
  alt,
  maxRetries = 10,
  baseDelayMs = 500,
  onFinalError,
  ...rest
}) => {
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<number | null>(null);

  const srcWithBust = useMemo(() => {
    if (attempt === 0) {
      return src;
    }
    const bust = `v=${Date.now()}-${attempt}`;
    return src.includes('?') ? `${src}&${bust}` : `${src}?${bust}`;
  }, [src, attempt]);

  const scheduleRetry = useCallback(() => {
    if (attempt >= maxRetries) {
      onFinalError?.();
      return;
    }
    const delay = baseDelayMs * Math.pow(2, Math.max(0, attempt - 1));
    timerRef.current = window.setTimeout(() => {
      setAttempt((a) => a + 1);
    }, delay) as unknown as number;
  }, [attempt, maxRetries, baseDelayMs, onFinalError]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <Image
        {...rest}
        src={srcWithBust}
        alt={alt}
        onError={() => {
          setLoaded(false);
          scheduleRetry();
        }}
        onLoadingComplete={() => {
          setLoaded(true);
        }}
      />
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
    </div>
  );
};

export default RetryableImage;
