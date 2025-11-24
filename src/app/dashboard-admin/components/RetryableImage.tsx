"use client";
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
        onLoadingComplete={() => setFailed(false)}
      />
      {attempt > 0 && attempt < maxRetries && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="px-3 py-1 text-xs rounded bg-black/50 text-white">
            Memuat ulang gambar... (percobaan {attempt}/{maxRetries})
          </div>
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button
            type="button"
            className="px-3 py-2 text-sm rounded bg-white shadow"
            onClick={() => {
              setFailed(false);
              setAttempt((a) => a + 1);
            }}
          >
            Coba lagi
          </button>
        </div>
      )}
    </div>
  );
};

export default RetryableImage;
