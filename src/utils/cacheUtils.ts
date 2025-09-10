/**
 * Simple in-memory cache utility for API responses
 */

// Cache item interface
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Cache configuration
interface CacheConfig {
  defaultTTL: number; // Time to live in milliseconds
  maxSize: number;    // Maximum number of items in cache
}

// Default cache configuration
const defaultConfig: CacheConfig = {
  defaultTTL: 60 * 1000, // 1 minute
  maxSize: 100,          // 100 items
};

/**
 * Cache class for storing and retrieving data with expiration
 */
export class Cache<T = unknown> {
  private cache: Map<string, CacheItem<T>>;
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.cache = new Map<string, CacheItem<T>>();
  }

  /**
   * Set an item in the cache
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Optional TTL in milliseconds
   */
  set(key: string, data: T, ttl?: number): void {
    // Ensure cache doesn't exceed max size
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.removeOldest();
    }

    const timestamp = Date.now();
    const expiresAt = timestamp + (ttl || this.config.defaultTTL);

    this.cache.set(key, {
      data,
      timestamp,
      expiresAt,
    });
  }

  /**
   * Get an item from the cache
   * @param key Cache key
   * @returns The cached data or null if not found or expired
   */
  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if item is expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Check if an item exists in the cache and is not expired
   * @param key Cache key
   * @returns True if item exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Remove an item from the cache
   * @param key Cache key
   */
  remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the number of items in the cache
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Remove expired items from the cache
   */
  removeExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Remove the oldest item from the cache
   */
  private removeOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
}

// Create and export default cache instances
export const quotesCache = new Cache<unknown>({
  defaultTTL: 30 * 1000, // 30 seconds for quotes
});

export const historicalDataCache = new Cache<unknown>({
  defaultTTL: 5 * 60 * 1000, // 5 minutes for historical data
});

export const ordersCache = new Cache<unknown>({
  defaultTTL: 60 * 1000, // 1 minute for orders
});

/**
 * Utility function to create a cache key from parameters
 * @param prefix Key prefix
 * @param params Parameters to include in the key
 * @returns Cache key string
 */
export const createCacheKey = (prefix: string, params: Record<string, unknown> = {}): string => {
  const sortedParams = Object.entries(params)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join('&');

  return `${prefix}${sortedParams ? `:${sortedParams}` : ''}`;
};