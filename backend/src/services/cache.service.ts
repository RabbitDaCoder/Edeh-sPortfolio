import { redis } from "../config/redis";

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const cached = await redis.get(key);
    if (!cached) return null;

    try {
      return JSON.parse(cached) as T;
    } catch {
      await redis.del(key);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = 300): Promise<void> {
    const serialized = JSON.stringify(value);
    await redis.setex(key, ttl, serialized);
  }

  async del(key: string): Promise<void> {
    await redis.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  async increment(key: string, ttl?: number): Promise<number> {
    const count = await redis.incr(key);
    if (ttl && count === 1) {
      await redis.expire(key, ttl);
    }
    return count;
  }
}

export const cacheService = new CacheService();
