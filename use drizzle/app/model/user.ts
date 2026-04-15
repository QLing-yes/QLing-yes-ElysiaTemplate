import { relations } from "drizzle-orm";
import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-typebox";
import { table as post } from "./post";

export const table = mysqlTable("user", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
});

export const tableRelations = relations(table, ({ many }) => ({
  posts: many(post),
}));

export const schema = createInsertSchema(table);
