import { drizzle as orm } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { logger } from "@/app/lib/logger";
import { table as post, tableRelations as postRelations } from "../model/post.mold";
import { table as user, tableRelations as userRelations } from "../model/user.mold";

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL!,
  waitForConnections: true,
  connectionLimit: 10,
});
registerEvent();
export const drizzle = orm(pool, {
  schema: { post, postRelations, user, userRelations },
  mode: "default",
});
export default drizzle;

function registerEvent() {
  pool.pool.on("error", (err: Error) => {
    logger.error("[drizzle] error", err);
  });
  pool.on("enqueue", () => {
    logger.warn("[drizzle] connection pool is full");
  });
  // 启动时验证连接是否正常
  pool
    .getConnection()
    .then((conn) => {
      logger.info("[drizzle] connected successfully");
      conn.release();
    })
    .catch((err) => {
      logger.error(`[drizzle] connection failed:${err}`);
    });
}
