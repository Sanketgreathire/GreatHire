import IORedis from "ioredis";

let redisClient = null;

export function getRedisConnection() {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

  redisClient = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,   // required by BullMQ
    enableReadyCheck:     false,
    lazyConnect:          true,
  });

  redisClient.on("connect",  () => console.log("✅ Redis connected"));
  redisClient.on("error",    (e) => console.error("❌ Redis error:", e.message));
  redisClient.on("close",    () => console.warn("⚠️  Redis connection closed"));

  return redisClient;
}

export async function isRedisAvailable() {
  try {
    const client = getRedisConnection();
    await client.connect().catch(() => {});
    const info = await client.info('server');
    const match = info.match(/redis_version:(\S+)/);
    if (match) {
      const [major] = match[1].split('.').map(Number);
      if (major < 5) {
        console.warn(`⚠️  Redis version ${match[1]} is too old for BullMQ (requires >= 5.0.0). Workers will be disabled.`);
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}
