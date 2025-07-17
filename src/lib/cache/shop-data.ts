import { getRedis } from "@/lib/utils/redis";
import { IShopData } from "@/lib/types.client";

const CACHE_TTL = 10 * 60; // 10 minutes in seconds
const CACHE_KEY_PREFIX = "shop_data:";

export const getCachedShopData = async (
  userId: string
): Promise<IShopData | null> => {
  try {
    const redis = getRedis();
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for shop data: ${userId}`);
      return cachedData as IShopData;
    }

    console.log(`Cache miss for shop data: ${userId}`);
    return null;
  } catch (error) {
    console.error("Error getting cached shop data:", error);
    return null;
  }
};

export const setCachedShopData = async (
  userId: string,
  data: IShopData
): Promise<void> => {
  try {
    const redis = getRedis();
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;

    await redis.set(cacheKey, JSON.stringify(data), {
      ex: CACHE_TTL,
    });

    console.log(`Cached shop data for: ${userId} (TTL: ${CACHE_TTL}s)`);
  } catch (error) {
    console.error("Error setting cached shop data:", error);
  }
};

export const invalidateCachedShopData = async (
  userId: string
): Promise<void> => {
  try {
    const redis = getRedis();
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;
    await redis.del(cacheKey);
    console.log(`Invalidated cache for shop data: ${userId}`);
  } catch (error) {
    console.error("Error invalidating cached shop data:", error);
  }
};

export const refreshCachedShopData = async (
  userId: string,
  freshData: IShopData
): Promise<void> => {
  try {
    // Get existing cached data
    const existingData = await getCachedShopData(userId);

    // Merge fresh data with existing data, with fresh data taking precedence
    const mergedData = existingData
      ? { ...existingData, ...freshData }
      : freshData;

    // Set the merged data
    await setCachedShopData(userId, mergedData);
    console.log(`Refreshed cache for shop data: ${userId}`);
  } catch (error) {
    console.error("Error refreshing cached shop data:", error);
  }
};
