import { redis as db, RedisClient } from "bun";
import { logger } from "@/app/lib/logger";

function client() {
  let redis: RedisClient = db;
  try {
    /** redis客户端 */
    redis = new RedisClient(process.env.REDIS_URL);
    redis.onconnect = () => logger.info("[redis] connected successfully");
    redis.onclose = (err) => logger.error(`[redis] disconnected:${err}`);
    if (process.env.REDIS_URL) redis.connect();
  } catch (error) {
    logger.error(`[redis]`, error as Error);
  }
  return redis;
}
export const redis = client();
export default redis;
