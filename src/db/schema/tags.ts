import { randomUUID } from 'crypto';
import { relations } from 'drizzle-orm';
import { sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { tagsToItems, users } from '.';

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  userId: text('user_id').references(() => users.id).notNull()
}, (t) => ({
  uk: unique().on(t.name, t.userId)
}));

export const tagsRelations = relations(
  tags,
  ({ one, many }) => ({
    user: one(users, {
      fields: [tags.userId],
      references: [users.id]
    }),
    items: many(tagsToItems)
  })
);
