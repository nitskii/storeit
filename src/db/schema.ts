import { randomUUID } from 'crypto';
import { InferInsertModel } from 'drizzle-orm';
import { sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  nickname: text('nickname').unique().notNull(),
  password: text('password').notNull(),
  salt: text('salt').notNull()
});

export const locations = sqliteTable('locations', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  name: text('name').unique().notNull(),
  userId: text('user_id').references(() => users.id).notNull()
});

export const locationsToLocations = sqliteTable('locationsToLocations', {
  parentId: text('parent_id').references(() => locations.id).notNull(),
  childId: text('child_id').references(() => locations.id).notNull()
});

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  userId: text('user_id').references(() => users.id).notNull()
}, (tags) => ({
  unq: unique().on(tags.name, tags.userId)
}));

export const items = sqliteTable('items', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  image: text('image').notNull(),
  locationId: text('location_id').references(() => locations.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull()
});

export const tagsToItems = sqliteTable('tagsToItems', {
  tagId: text('tag_id').references(() => tags.id).notNull(),
  itemId: text('item_id').references(() => items.id).notNull()
});

export type UserCredentials = Omit<InferInsertModel<typeof users>, 'id' | 'salt'>;
export type NewLocation = Omit<InferInsertModel<typeof locations> & { parentId?: string }, 'id'>;
export type NewItem = {
  name: string,
  image: Blob,
  locationId: string,
  tags?: string[]
  userId: string,
}
export type ResponseItem = {
  id: string,
  name: string,
  image: string
  location: string,
  tags: string[]
};
