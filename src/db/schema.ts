import { InferInsertModel } from 'drizzle-orm';
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
  userId: text('user_id').references(() => users.id).notNull()
});

export const locationsToLocations = sqliteTable('locationsToLocations', {
  parentId: text('parent_id').notNull().references(() => locations.id),
  childId: text('child_id').notNull().references(() => locations.id)
});

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').unique().notNull()
});

export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  image: text('image').notNull(),
  locationId: text('location_id').references(() => locations.id),
  userId: text('user_id').references(() => users.id)
});

export const tagsToItems = sqliteTable('tagsToItems', {
  tagId: text('tag_id').notNull().references(() => tags.id),
  itemId: text('item_id').notNull().references(() => items.id)
});

export type NewLocation = Omit<InferInsertModel<typeof locations> & { parentId?: string }, 'id'>;