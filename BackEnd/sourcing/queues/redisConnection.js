import IORedis from "ioredis";

let redisClient = null;

export function getRedisConnection() {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

  redisClient = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,   // required by BullMQ
    enableReadyCheck:     false,
    lazyConnect:          true,
    retryStrategy: (times) => {
      if (times > 1) return null;
      return 1000;
    },
  });

  redisClient.on("connect",  () => console.log("✅ Redis connected"));
  redisClient.on("error", (e) => {
    if (e.code !== "ECONNREFUSED") {
      console.error("❌ Redis error:", e.message);
    }
  });
  redisClient.on("close",    () => {});

  return redisClient;
}

export async function isRedisAvailable() {
  try {
    const client = getRedisConnection();
    if (client.status === "ready") return true;
    if (client.status === "wait" || client.status === "close") {
      await client.connect().catch(() => {});
    }
    await client.ping();
    return true;
  } catch {
    try {
      if (redisClient) redisClient.disconnect();
    } catch {}
    return false;
  }
}
