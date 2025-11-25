"use client";

import { Skeleton } from '@/components/ui/skeleton';
import Image, { ImageProps } from 'next/image';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTempImageCache } from '@/hooks/useTempImageCache';

type Props = Omit<ImageProps, 'src' | 'onError'> & {
  src: string;
  maxRetries?: number;
  baseDelayMs?: number;
  onFinalError?: () => void;
};

const RetryableImage: React.FC<Props> = ({
  src,
  maxRetries = 10,
  baseDelayMs = 500,
  onFinalError,
  ...rest
}) => {
  // cache with 5‑minute TTL (adjust as needed)
  const { url: cachedUrl, loading: cacheLoading } = useTempImageCache(src, 300);

  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const timerRef = useRef<number | null>(null);

  const srcWithBust = useMemo(() => {
    const bust = `v=${Date.now()}-${attempt}`;
    return src.includes('?') ? `${src}&${bust}` : `${src}?${bust}`;
  }, [src, attempt]);

  const scheduleRetry = useCallback(() => {
    if (attempt >= maxRetries) {
      setFailed(true);
      onFinalError?.();
      return;
    }
    const delay = baseDelayMs * Math.pow(2, Math.max(0, attempt - 1));
    timerRef.current = window.setTimeout(() => setAttempt(a => a + 1), delay) as unknown as number;
  }, [attempt, maxRetries, baseDelayMs, onFinalError]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  // Choose source: cached URL if available, otherwise bust‑enabled src for retry logic
  const finalSrc = !cacheLoading && cachedUrl ? cachedUrl : srcWithBust;

  return (
    <div className="w-full h-full relative">
      <Image
        {...rest}
        src={finalSrc}
        onError={() => scheduleRetry()}
        onLoadingComplete={() => setFailed(false)}
      />
      {/* Show skeleton while retrying (only when not using cached image) */}
      {attempt > 0 && attempt < maxRetries && !cachedUrl && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30" />
      )}
    </div>
  );
};

export default RetryableImage;
