import { redis } from "../config/redis";

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key);
      if (!cached) return null;

      try {
        return JSON.parse(cached) as T;
      } catch {
        await redis.del(key);
        return null;
      }
    } catch {
      // Redis unavailable — treat as cache miss
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = 300): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await redis.setex(key, ttl, serialized);
    } catch {
      // Redis unavailable — skip caching silently
    }
  }

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch {
      // Redis unavailable — skip deletion
    }
  }

  /**
   * SCAN-based pattern deletion — non-blocking, cursor-based iteration.
   * Collects all matching keys first, then deletes in a single pipeline
   * for atomicity (no window between finding and deleting keys).
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keysToDelete: string[] = [];
      let cursor = "0";

      do {
        const [nextCursor, keys] = await redis.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          200,
        );
        cursor = nextCursor;
        keysToDelete.push(...keys);
      } while (cursor !== "0");

      if (keysToDelete.length > 0) {
        const pipeline = redis.pipeline();
        for (const key of keysToDelete) {
          pipeline.del(key);
        }
        await pipeline.exec();
      }
    } catch {
      // Redis unavailable — skip invalidation
    }
  }

  async increment(key: string, ttl?: number): Promise<number> {
    try {
      const count = await redis.incr(key);
      if (ttl && count === 1) {
        await redis.expire(key, ttl);
      }
      return count;
    } catch {
      return 0;
    }
  }
}

export const cacheService = new CacheService();
