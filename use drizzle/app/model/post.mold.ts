import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-typebox";
import { table as user } from "./user.mold";

export const table = mysqlTable("post", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  published: boolean("published").notNull().default(false),
  authorId: int("author_id").notNull(),
});

export const tableRelations = relations(table, ({ one }) => ({
  author: one(user, {
    fields: [table.authorId],
    references: [user.id],
  }),
}));

export const schema = createInsertSchema(table);
