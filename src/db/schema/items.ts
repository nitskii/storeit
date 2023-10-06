import { randomUUID } from 'crypto';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { locations, tagsToItems, users } from '.';

export const items = sqliteTable('items', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  image: text('image').notNull(),
  locationId: text('location_id').references(() => locations.id),
  userId: text('user_id').references(() => users.id).notNull()
});

export const itemsRelations = relations(
  items,
  ({ one, many }) => ({
    user: one(users, {
      fields: [items.userId],
      references: [users.id]
    }),
    location: one(locations, {
      fields: [items.locationId],
      references: [locations.id]
    }),
    tags: many(tagsToItems)
  })
);
