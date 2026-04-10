import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import user from "@/app/model/user";

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL!,
});

const db = drizzle(pool, { schema: { user }, mode: "default" });
// 有传 schema 才能这样写
// db.query.user.findFirst({ where: eq(user.id, 1) })
// 没传 schema 只能这样写
// db.select().from(user).where(eq(user.id, 1))

export default db;
