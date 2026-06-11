import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null, // required by BullMQ
  enableReadyCheck: false,
  lazyConnect: true,
});

connection.on("connect", () => console.log("✅ Redis (src/config) connected"));
connection.on("error",   (e) => console.error("❌ Redis (src/config) error:", e.message));

export const getRedisConnection = () => connection;

export const isRedisAvailable = async () => {
  try {
    await connection.connect().catch(() => {});
    const info = await connection.info('server');
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
};
