// src/hooks/useTempImageCache.ts
import { useEffect, useState } from 'react';
import localforage from 'localforage';

/**
 * Cache an image (Blob) in IndexedDB via localforage with a time‑to‑live.
 * Returns an object URL that can be used directly in <img> / <Image>.
 *
 * @param src Original image URL
 * @param ttlSeconds How long the cached entry is considered fresh (default 5 min)
 */
export function useTempImageCache(
  src: string,
  ttlSeconds: number = 300
): { url: string | null; loading: boolean; error: boolean } {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const cacheKey = `img_${src}`;

  useEffect(() => {
    let cancelled = false;
    async function fetchAndCache() {
      try {
        const cached = await localforage.getItem<any>(cacheKey);
        const now = Date.now();
        if (cached && cached.expires > now) {
          if (!cancelled) {
            setUrl(cached.objectUrl);
            setLoading(false);
          }
          return;
        }
        const resp = await fetch(src);
        if (!resp.ok) throw new Error('Network error');
        const blob = await resp.blob();
        const objectUrl = URL.createObjectURL(blob);
        await localforage.setItem(cacheKey, {
          objectUrl,
          expires: now + ttlSeconds * 1000,
        });
        if (!cancelled) {
          setUrl(objectUrl);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Image cache error:', e);
          setError(true);
          setLoading(false);
        }
      }
    }
    fetchAndCache();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [src, ttlSeconds, cacheKey]);

  // Periodic cleanup of expired entries (runs on mount)
  useEffect(() => {
    async function purgeExpired() {
      const keys = await localforage.keys();
      const now = Date.now();
      for (const key of keys) {
        if (!key.startsWith('img_')) continue;
        const entry = await localforage.getItem<any>(key);
        if (entry?.expires <= now) {
          await localforage.removeItem(key);
        }
      }
    }
    purgeExpired();
  }, []);

  return { url, loading, error };
}
