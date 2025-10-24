// NOTE: Memory cache works for single-instance development only
// For production with multiple Azure instances set CACHE_TYPE=redis and implement RedisCache
// Consider using ioredis library for Redis implementation

interface CacheEntry {
  value: any;
  expires: number;
}

class MemoryCache {
  private store: Map<string, CacheEntry> = new Map();

  async get(key: string): Promise<any | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    this.store.set(key, {
      value,
      expires: Date.now() + ttlSeconds * 1000,
    });
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

class RedisCache {
  async get(key: string): Promise<any | null> {
    // TODO: Implement Redis connection when moving to production
    // For now throw error to make it clear this needs implementation
    throw new Error('Redis cache not yet implemented - set CACHE_TYPE=memory');
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    throw new Error('Redis cache not yet implemented - set CACHE_TYPE=memory');
  }

  async clear(): Promise<void> {
    throw new Error('Redis cache not yet implemented - set CACHE_TYPE=memory');
  }
}

function createCache() {
  const cacheType = process.env.CACHE_TYPE || 'memory';
  if (cacheType === 'redis') {
    return new RedisCache();
  }
  return new MemoryCache();
}

export const cache = createCache();
