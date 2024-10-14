import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export type todostatus = "undo" | "processing" | "finish";

export const todolist = sqliteTable("todolist", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text(),
  status: text().$type<todostatus>(),
});

export type insertTodo = typeof todolist.$inferInsert
export type selectTodo = typeof todolist.$inferSelect