"use client";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
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
    <div className="w-full h-full relative bg-muted/10">
      <Image
        {...rest}
        src={srcWithBust}
        onError={() => scheduleRetry()}
        onLoadingComplete={() => {
          setFailed(false);
          setIsLoaded(true);
        }}
        className={cn("transition-opacity duration-300", isLoaded ? "opacity-100" : "opacity-0", rest.className)}
      />
      {!isLoaded && !failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-12 w-12 animate-spin" />
          <span className="text-xs font-medium">
            Loading... {Math.round((Math.min(attempt + 1, maxRetries) / maxRetries) * 100)}%
          </span>
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 text-xs text-muted-foreground">
          Failed
        </div>
      )}
    </div>
  );
};

export default RetryableImage;
