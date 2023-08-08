import { InferModel } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    nickname: text("nickname").notNull(),
    password: text("password").notNull(),
    salt: text("salt").notNull()
})

export const items = sqliteTable("items", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    image: text("image").notNull(),
    location: text("location"),
    userId: text("user_id").references(() => users.id)
});

export const tags = sqliteTable("tags", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    itemId: text("item_id").references(() => items.id)
});

export type User = InferModel<typeof users>;

export type Item = InferModel<typeof items>;

export type Tag = InferModel<typeof tags>;