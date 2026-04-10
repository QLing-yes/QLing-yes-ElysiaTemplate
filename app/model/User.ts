import { mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-typebox";

export const user = mysqlTable("user", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  salt: varchar("salt", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export default user;

export type type = typeof user;
export const schema = createInsertSchema(user);
