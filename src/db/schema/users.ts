import { randomUUID } from 'crypto';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { items, locations, tags } from '.';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  nickname: text('nickname').unique().notNull(),
  password: text('password').notNull(),
  salt: text('salt').notNull()
});

export const usersRelations = relations(
  users,
  ({ many }) => ({
    locations: many(locations),
    tags: many(tags),
    items: many(items)
  })
);
