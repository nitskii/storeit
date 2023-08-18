import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  nickname: text('nickname').unique().notNull(),
  password: text('password').notNull(),
  salt: text('salt').notNull()
});

export const locations = sqliteTable('locations', {
  id: text('id').primaryKey(),
  name: text('name').unique().notNull(),
  parentId: text('parent_id').references(() => locations.id)
});

export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  image: text('image').notNull(),
  locationId: text('location_id').references(() => locations.id),
  userId: text('user_id').references(() => users.id)
});

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').unique().notNull(),
  itemId: text('item_id').references(() => items.id)
});