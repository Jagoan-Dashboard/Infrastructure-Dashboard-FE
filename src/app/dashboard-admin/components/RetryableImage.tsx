"use client";
import { Skeleton } from '@/components/ui/skeleton';
import Image, { ImageProps } from 'next/image';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const timerRef = useRef<number | null>(null);

  const srcWithBust = useMemo(() => {
    const bust = `v=${Date.now()}-${attempt}`;
    return src.includes('?') ? `${src}&${bust}` : `${src}?${bust}`;
  }, [src, attempt]);

  useEffect(() => {
    setIsLoaded(false);
  }, [srcWithBust]);

  const scheduleRetry = useCallback(() => {
    if (attempt >= maxRetries) {
      setFailed(true);
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
        onError={() => scheduleRetry()}
        onLoadingComplete={() => {
          setFailed(false);
          setIsLoaded(true);
        }}
      />
      {!isLoaded && attempt > 0 && attempt < maxRetries && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        </div>
      )}
    </div>
  );
};

export default RetryableImage;
