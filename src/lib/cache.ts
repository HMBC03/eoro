const CACHE_KEY_PREFIX = "senado_cache_";
const CACHE_DURATION = 20 * 60 * 1000;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export function getCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  
  const stored = localStorage.getItem(CACHE_KEY_PREFIX + key);
  if (!stored) return null;
  
  try {
    const item: CacheItem<T> = JSON.parse(stored);
    if (Date.now() - item.timestamp < CACHE_DURATION) {
      return item.data;
    }
    localStorage.removeItem(CACHE_KEY_PREFIX + key);
    return null;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  
  const item: CacheItem<T> = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(item));
}

export function clearCache(key?: string): void {
  if (typeof window === "undefined") return;
  
  if (key) {
    localStorage.removeItem(CACHE_KEY_PREFIX + key);
  } else {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }
}